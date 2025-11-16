// Serverless API endpoint for generating stitched creature images
// This is a stub that returns a placeholder. Replace with real AI provider.

export default async function handler(req, res) {
    // Only allow POST
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { a, b, quality, seed } = req.body;

        // Validate input
        if (!a || !b || !a.name || !b.name) {
            return res.status(400).json({ error: 'Missing species data' });
        }

        // Build prompt for AI image generation
        const prompt = buildPrompt(a, b);
        const negativePrompt = buildNegativePrompt();
        const dimensions = getQualityDimensions(quality);

        console.log('Generating stitched creature:', {
            species: `${a.name} + ${b.name}`,
            quality,
            dimensions,
            seed
        });

        // STUB: Return placeholder image
        // In production, replace this with actual AI provider call:
        // - Stability AI
        // - DALL-E
        // - Midjourney API
        // - Replicate
        // etc.

        const placeholderImage = generatePlaceholderImage(a, b, dimensions);

        return res.status(200).json({
            imageUrl: placeholderImage,
            seed: seed,
            prompt: prompt, // For debugging
            dimensions: dimensions
        });

        /* EXAMPLE: Real implementation with Stability AI
        const response = await fetch('https://api.stability.ai/v1/generation/stable-diffusion-xl-1024-v1-0/text-to-image', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${process.env.STABILITY_API_KEY}`
            },
            body: JSON.stringify({
                text_prompts: [
                    { text: prompt, weight: 1 },
                    { text: negativePrompt, weight: -1 }
                ],
                cfg_scale: 7,
                height: dimensions.height,
                width: dimensions.width,
                samples: 1,
                steps: 30,
                seed: seed
            })
        });

        const data = await response.json();
        const imageBase64 = data.artifacts[0].base64;
        const imageUrl = `data:image/png;base64,${imageBase64}`;

        return res.status(200).json({
            imageUrl: imageUrl,
            seed: seed
        });
        */

    } catch (error) {
        console.error('Error generating image:', error);
        return res.status(500).json({ 
            error: 'Failed to generate image',
            message: error.message 
        });
    }
}

function buildPrompt(speciesA, speciesB) {
    const aHints = speciesA.visualHints.join(', ');
    const bHints = speciesB.visualHints.join(', ');
    const colors = [...speciesA.colors, ...speciesB.colors].join(', ');

    return `Create a cute-spooky cartoon creature blending ${speciesA.name} and ${speciesB.name}. ` +
           `Flat-color, clean outlines, minimal shading, simple shapes, slightly eerie but friendly. ` +
           `Combine features: ${aHints} + ${bHints}. ` +
           `Color palette: ${colors}. ` +
           `Centered character on a simple flat or subtle textured background. No realism.`;
}

function buildNegativePrompt() {
    return 'photorealistic, hyper-detailed, gore, NSFW, watermark, text, 3D render, shiny metallic, extra unexplained limbs, distorted anatomy';
}

function getQualityDimensions(quality) {
    const dimensions = {
        low: { width: 512, height: 512 },
        med: { width: 768, height: 768 },
        high: { width: 1024, height: 1024 }
    };
    return dimensions[quality] || dimensions.med;
}

function generatePlaceholderImage(speciesA, speciesB, dimensions) {
    // Generate a simple SVG placeholder as data URL
    const { width, height } = dimensions;
    const colorA = speciesA.colors[0];
    const colorB = speciesB.colors[0];

    const svg = `
        <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
            <defs>
                <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" style="stop-color:${colorA};stop-opacity:1" />
                    <stop offset="100%" style="stop-color:${colorB};stop-opacity:1" />
                </linearGradient>
            </defs>
            <rect width="${width}" height="${height}" fill="url(#grad)" />
            <text x="50%" y="40%" text-anchor="middle" font-size="48" fill="white" font-family="Arial">
                ${speciesA.name}
            </text>
            <text x="50%" y="50%" text-anchor="middle" font-size="64" fill="white" font-family="Arial">
                +
            </text>
            <text x="50%" y="60%" text-anchor="middle" font-size="48" fill="white" font-family="Arial">
                ${speciesB.name}
            </text>
            <text x="50%" y="75%" text-anchor="middle" font-size="24" fill="rgba(255,255,255,0.7)" font-family="Arial">
                Placeholder Image
            </text>
            <text x="50%" y="82%" text-anchor="middle" font-size="18" fill="rgba(255,255,255,0.5)" font-family="Arial">
                Replace with real AI provider
            </text>
        </svg>
    `;

    // Convert SVG to data URL
    const base64 = Buffer.from(svg).toString('base64');
    return `data:image/svg+xml;base64,${base64}`;
}
