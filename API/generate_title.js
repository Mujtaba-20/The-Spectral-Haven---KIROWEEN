import fetch from "node-fetch";

export async function handler(event) {
    const { description } = JSON.parse(event.body);

    try {
        const geminiRes = await fetch(
            "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=" + process.env.GEMINI_API_KEY,
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    contents: [
                        {
                            role: "user",
                            parts: [
                                {
                                    text: `
Generate 3 spooky, cinematic, atmospheric titles based on this image description:

${description}

Return ONLY a JSON object in this format:
{
  "mainTitle": "...",
  "alt1": "...",
  "alt2": "...",
  "explanation": "..."
}
`
                                }
                            ]
                        }
                    ]
                })
            }
        );

        const data = await geminiRes.json();

        // Gemini sometimes returns nested text inside candidates[].content.parts[]
        const rawText =
            data?.candidates?.[0]?.content?.parts?.[0]?.text || "{}";

        let parsed;
        try {
            parsed = JSON.parse(rawText);
        } catch (err) {
            parsed = {
                mainTitle: "Whispers of the Shrouded Vale",
                alt1: "Twilight of the Hollow Echo",
                alt2: "Lanterns of the Forsaken Path",
                explanation: "Fallback result because JSON parsing failed."
            };
        }

        return {
            statusCode: 200,
            body: JSON.stringify(parsed)
        };

    } catch (err) {
        console.error(err);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: "Gemini API failed", details: err })
        };
    }
}
