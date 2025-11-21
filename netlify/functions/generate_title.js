// netlify/functions/generate_title.js
import fetch from "node-fetch";

/**
 * Expects POST body: { imageBase64?: string, imageUrl?: string, extraPrompt?: string }
 * Returns: { mainTitle, alt1, alt2, explanation }
 */

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

    // Build instruction for Gemini Vision
    const userInstruction = `
You are given a single image. Analyze the mood, colors, objects, and atmosphere.
Return exactly one JSON object (no other prose) with this format:

{
  "mainTitle": "<short cinematic spooky title>",
  "alt1": "<alternate title 1>",
  "alt2": "<alternate title 2>",
  "explanation": "<one-sentence reason these match>"
}

Keep titles 2–5 words, original, atmospheric, and non-offensive.
Extra instruction: ${extraPrompt}
`;

    // Build payload for Gemini Vision API (multimodal)
    const payload = {
      contents: [
        {
          role: "user",
          parts: [
            { text: userInstruction },
            // include image as bytes or uri depending on client
            imageBase64 ? { image: { imageBytes: imageBase64 } } : { image: { uri: imageUrl } }
          ]
        }
      ]
    };

    // Use Gemini Vision endpoint (model that supports images)
    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-vision-1:generateContent?key=${process.env.GEMINI_API_KEY}`;

    const res = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      // no credentials needed; key is appended to URL per Netlify env var
    });

    if (!res.ok) {
      const text = await res.text();
      console.error("Gemini responded", res.status, text);
      return {
        statusCode: 502,
        body: JSON.stringify({ error: "Upstream Gemini error", status: res.status, details: text.slice(0, 1000) })
      };
    }

    const data = await res.json();

    // Extract generated text (Gemini's candidate location can vary)
    const rawText =
      data?.candidates?.[0]?.content?.parts?.find(p => p.text)?.text
      || data?.candidates?.[0]?.content?.parts?.[0]?.text
      || (typeof data === "string" ? data : "{}");

    // Try to parse JSON out of rawText (robust)
    let parsed = null;
    try {
      parsed = JSON.parse(rawText);
    } catch (err) {
      // Attempt to extract JSON substring
      const match = rawText && rawText.match(/\{[\s\S]*\}/);
      if (match) {
        try {
          parsed = JSON.parse(match[0]);
        } catch (e) {
          parsed = null;
        }
      }
    }

    // Final fallback if parsing failed
    if (!parsed || !parsed.mainTitle) {
      parsed = {
        mainTitle: "Spectral Echoes",
        alt1: "Lanterns in the Mist",
        alt2: "Whispers of the Hollow",
        explanation: "Fallback titles (Gemini response parsing failed)."
      };
    }

    // Trim and sanitize minimally (keep as plain strings)
    const safe = {
      mainTitle: String(parsed.mainTitle).trim().slice(0, 120),
      alt1: String(parsed.alt1 || "").trim().slice(0, 120),
      alt2: String(parsed.alt2 || "").trim().slice(0, 120),
      explanation: String(parsed.explanation || "").trim().slice(0, 300)
    };

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
