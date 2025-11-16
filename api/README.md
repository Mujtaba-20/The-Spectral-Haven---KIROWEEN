# API Endpoints for The Spectral Haven

## Overview

This directory contains serverless API endpoints for AI-powered features.

## Endpoints

### POST /api/generate-stitched

Generates a cartoon image of a stitched creature combining two species.

**Request Body:**
```json
{
  "a": {
    "id": "wisp",
    "name": "Wisp",
    "visualHints": ["translucent wings", "cyan glow"],
    "colors": ["#9BE7FF"]
  },
  "b": {
    "id": "hollow",
    "name": "Hollow",
    "visualHints": ["hollow eyes", "ceramic skull"],
    "colors": ["#8844FF"]
  },
  "quality": "med",
  "seed": 12345
}
```

**Response:**
```json
{
  "imageUrl": "data:image/png;base64,..." or "https://cdn.example.com/image.png",
  "seed": 12345
}
```

## Setup

### Local Development

The current implementation returns a placeholder SVG image. To test locally:

1. Run the app with a local server (e.g., `python -m http.server 8000`)
2. The API endpoint will need to be proxied or mocked

### Deployment Options

#### Option 1: Vercel Serverless Functions

1. Install Vercel CLI: `npm i -g vercel`
2. Deploy: `vercel`
3. The `/api` directory will automatically become serverless functions
4. Set environment variables in Vercel dashboard

#### Option 2: Netlify Functions

1. Move `api/` to `netlify/functions/`
2. Update function exports to Netlify format
3. Deploy with Netlify CLI or Git integration

#### Option 3: AWS Lambda

1. Package each endpoint as a Lambda function
2. Set up API Gateway
3. Configure environment variables in AWS Console

## Integrating Real AI Providers

### Stability AI (Stable Diffusion)

```javascript
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
```

**Environment Variable:** `STABILITY_API_KEY`

### OpenAI DALL-E

```javascript
const response = await fetch('https://api.openai.com/v1/images/generations', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
    },
    body: JSON.stringify({
        prompt: prompt,
        n: 1,
        size: `${dimensions.width}x${dimensions.height}`,
        response_format: 'url'
    })
});
```

**Environment Variable:** `OPENAI_API_KEY`

### Replicate

```javascript
const response = await fetch('https://api.replicate.com/v1/predictions', {
    method: 'POST',
    headers: {
        'Authorization': `Token ${process.env.REPLICATE_API_TOKEN}`,
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({
        version: "stability-ai/sdxl:...",
        input: {
            prompt: prompt,
            negative_prompt: negativePrompt,
            width: dimensions.width,
            height: dimensions.height,
            seed: seed
        }
    })
});
```

**Environment Variable:** `REPLICATE_API_TOKEN`

## Security Best Practices

1. **Never expose API keys in frontend code**
   - All API calls to AI providers must go through your serverless functions
   - Store keys in environment variables

2. **Rate limiting**
   - Implement rate limiting to prevent abuse
   - Consider using a service like Upstash Redis

3. **Authentication**
   - Add user authentication if needed
   - Validate requests before making expensive AI calls

4. **Cost management**
   - Set up billing alerts
   - Cache results when possible
   - Implement credit/quota system for users

## Environment Variables

Create a `.env` file (never commit this):

```env
# Choose one AI provider
STABILITY_API_KEY=sk-...
OPENAI_API_KEY=sk-...
REPLICATE_API_TOKEN=r8_...

# Optional: for caching
REDIS_URL=redis://...
```

## Testing

Test the placeholder endpoint:

```bash
curl -X POST http://localhost:8000/api/generate-stitched \
  -H "Content-Type: application/json" \
  -d '{
    "a": {"name":"Wisp","visualHints":["glowing"],"colors":["#9BE7FF"]},
    "b": {"name":"Hollow","visualHints":["hollow"],"colors":["#8844FF"]},
    "quality":"med",
    "seed":12345
  }'
```

## Cost Estimates

Typical costs per image generation:

- **Stability AI**: $0.002 - $0.01 per image
- **DALL-E 3**: $0.04 - $0.08 per image
- **Replicate**: $0.001 - $0.01 per image (varies by model)

Quality settings affect cost:
- Low (512px): ~1 credit
- Medium (768px): ~2 credits  
- High (1024px): ~3 credits

## Troubleshooting

**Issue: CORS errors**
- Solution: Configure CORS headers in your serverless function

**Issue: Timeout errors**
- Solution: Increase function timeout (default is often 10s)
- Some AI providers may take 20-30s to generate images

**Issue: API key not found**
- Solution: Verify environment variables are set in deployment platform

## Next Steps

1. Choose an AI provider
2. Sign up and get API key
3. Add key to environment variables
4. Replace placeholder code in `generate-stitched.js`
5. Test with real generations
6. Deploy to production
