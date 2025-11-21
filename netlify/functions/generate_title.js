// netlify/functions/generate_title.js
import fetch from "node-fetch";

/**
 * Expects POST body: { imageBase64?: string, imageUrl?: string, extraPrompt?: string }
 * Returns: { mainTitle, alt1, alt2, explanation }
 */

const FEW_SHOT = `
EXAMPLE 1 INPUT (caption): "foggy shoreline, empty pier, lanterns, seagulls"
OUTPUT (JSON only):
{
  "mainTitle": "Lanterns Along the Pier",
  "alt1": "The Pier That Listened",
  "alt2": "Fog Between the Posts",
  "explanation": "Empty pier + lanterns + fog → lonely maritime hush"
}

EXAMPLE 2 INPUT (caption): "abandoned nursery, cracked rocking chair, moonlight"
OUTPUT (JSON only):
{
  "mainTitle": "Moonlight in the Cradle",
  "alt1": "The Rocking That Didn't Stop",
  "alt2": "Shadows Behind the Mobile",
  "explanation": "Nursery + moonlight → eerie childlike imagery and slow motion dread"
}
`;

/** sanitize model output by extracting first JSON-looking substring */
function extractJsonFromText(text) {
  if (!text || typeof text !== "string") return null;
  // naive but generally robust: look for outermost curly braces block
  const first = text.indexOf("{");
  const last = text.lastIndexOf("}");
  if (first === -1 || last === -1 || last <= first) return null;
  const candidate = text.slice(first, last + 1);
  try {
    return JSON.parse(candidate);
  } catch (err) {
    // fallback: try to fix trailing commas or quotes - minimal effort
    try {
      const cleaned = candidate
        .replace(/,\s*}/g, "}")
        .replace(/,\s*]/g, "]");
      return JSON.parse(cleaned);
    } catch (_) {
      return null;
    }
  }
}

/** Ensure titles are 2-5 words and unique; if not, create small deterministic variants */
function postProcessTitles(parsed) {
  const normalize = (s) => String(s || "").trim();
  const wordsCount = (s) => (normalize(s).split(/\s+/).filter(Boolean).length);

  let main = normalize(parsed.mainTitle || "");
  let alt1 = normalize(parsed.alt1 || "");
  let alt2 = normalize(parsed.alt2 || "");

  const titles = [main, alt1, alt2].map(t => t.replace(/\s+/g, " ").trim());

  // trim extremely long titles
  for (let i = 0; i < titles.length; i++) {
    const t = titles[i];
    if (!t) continue;
    const tokens = t.split(/\s+/);
    if (tokens.length > 6) titles[i] = tokens.slice(0, 5).join(" ");
  }

  // ensure uniqueness (simple)
  for (let i = 0; i < titles.length; i++) {
    for (let j = i + 1; j < titles.length; j++) {
      if (!titles[i] || !titles[j]) continue;
      if (titles[i].toLowerCase() === titles[j].toLowerCase()) {
        titles[j] = titles[j] + " — Echo";
      }
    }
  }

  // final enforcement: 2-5 words. If fewer than 2, expand with "of the ..." fallback
  for (let i = 0; i < titles.length; i++) {
    const wc = wordsCount(titles[i]);
    if (!titles[i]) titles[i] = ["Spectral Echoes", "Lantern in Fog", "Whispers Beneath"][i] || "Unnamed";
    else if (wc < 2) titles[i] = titles[i] + " of Night";
  }

  return {
    mainTitle: titles[0],
    alt1: titles[1],
    alt2: titles[2],
    explanation: normalize(parsed.explanation || parsed.reason || "") || "Generated to match image mood."
  };
}

export async function handler(event) {
  try {
    const body = JSON.parse(event.body || "{}");
    const { imageBase64, imageUrl, extraPrompt = "" } = body;

    if (!imageBase64 && !imageUrl) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Provide imageBase64 or imageUrl in the request body." })
      };
    }

    const instruction = `
You are a compact, cinematic horror title writer. Given a short image caption, output EXACTLY ONE JSON object and NOTHING ELSE with keys:
"mainTitle", "alt1", "alt2", "explanation".
Titles must be original, atmospheric, 2-5 words, use concrete nouns and strong verbs, avoid cliches, and be non-offensive.
Do NOT include extra commentary or any surrounding text.
${extraPrompt ? "Extra instruction: " + extraPrompt : ""}
`;

    // We ask Gemini Vision to return an analysis caption + titles.
    const payload = {
      contents: [
        {
          role: "user",
          parts: [
            { text: `${FEW_SHOT}\n\n${instruction}\n\nInput image:` },
            imageBase64 ? { image: { imageBytes: imageBase64 } } : { image: { uri: imageUrl } }
          ]
        }
      ]
    };

    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-vision-1:generateContent?key=${process.env.GEMINI_API_KEY}`;

    const res = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const text = await res.text();
      console.error("Gemini responded", res.status, text.slice(0, 2000));
      return {
        statusCode: 502,
        body: JSON.stringify({ error: "Upstream Gemini error", status: res.status, details: text.slice(0, 1000) })
      };
    }

    const data = await res.json();

    // Candidate extraction (Gemini's response tree varies)
    const rawText =
      data?.candidates?.[0]?.content?.parts?.map(p => p.text || "").join("\n").trim()
      || data?.candidates?.[0]?.content?.parts?.[0]?.text
      || (typeof data === "string" ? data : "");

    let parsed = extractJsonFromText(rawText);

    // If parsing failed, try to locate JSON-like substring in the entire response
    if (!parsed && typeof rawText === "string") {
      const match = rawText.match(/\{[\s\S]*\}/);
      if (match) {
        try { parsed = JSON.parse(match[0]); } catch (e) { parsed = null; }
      }
    }

    // If still no parse, fallback to simpler heuristic: search for lines like "mainTitle: ...".
    if (!parsed && typeof rawText === "string") {
      const kv = {};
      rawText.split(/\r?\n/).forEach(line => {
        const m = line.match(/^(mainTitle|alt1|alt2|explanation)\s*[:=-]\s*(.+)$/i);
        if (m) kv[m[1]] = m[2].trim();
      });
      if (Object.keys(kv).length >= 2) parsed = kv;
    }

    // Final fallback default content
    if (!parsed) {
      parsed = {
        mainTitle: "Spectral Echoes",
        alt1: "Lanterns in the Mist",
        alt2: "Whispers of the Hollow",
        explanation: "Fallback titles (unable to parse model output)."
      };
    }

    const safe = postProcessTitles(parsed);

    return {
      statusCode: 200,
      body: JSON.stringify(safe)
    };

  } catch (err) {
    console.error("generate_title error:", err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Internal server error", details: String(err).slice(0, 1000) })
    };
  }
}
