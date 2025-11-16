# New Features: Stitch Lab & Spooky Title Generator

## Overview

Two new interactive features have been added to The Spectral Haven:

1. **🧬 Stitch Lab** - Combine two spectral species to create unique creatures
2. **📸 Spooky Title Generator** - Generate haunting titles from uploaded images

Both features are built in vanilla JavaScript matching the existing architecture.

## Features

### 🧬 Stitch Lab

**Location:** `/stitch` or press `7` key

**Functionality:**

1. **Species Selection**
   - Choose two species from 6 available options:
     - Wisp (cyan, ethereal)
     - Hollow (purple, skeletal)
     - Shade (dark, misty)
     - Ember (orange, fiery)
     - Frost (blue, icy)
     - Thorn (green, spiky)

2. **Instant Local Stitching** (No credits)
   - Portmanteau name generation
   - Spooky description
   - 4-6 merged traits
   - Fast SVG preview using CSS mix-blend-mode
   - Color palette swatches
   - Self-stitch detection (same species twice)

3. **Optional AI Cartoon Image** (Uses credits)
   - User must click "Generate Cartoon Image"
   - Confirmation modal with quality selector:
     - Low (512px) - ~1 credit
     - Medium (768px) - ~2 credits
     - High (1024px) - ~3 credits
   - Calls serverless endpoint `/api/generate-stitched`
   - Download and Regenerate options

**Files:**
- `scripts/components/stitch-lab.js` - Main component
- `api/generate-stitched.js` - Serverless endpoint (stub)
- Styles in `styles/components.css`

### 📸 Spooky Title Generator

**Location:** `/title-generator` or press `8` key

**Functionality:**

1. **Image Upload**
   - Drag & drop or file picker
   - Supports JPG, PNG, GIF
   - Shows preview thumbnail

2. **Client-Side Analysis**
   - Resizes to ≤256px for processing
   - Computes:
     - Average brightness (luminance)
     - Edge contrast (pixel differences)
     - Color bias (red vs blue)

3. **Title Generation**
   - 1 main title + 2 alternates
   - Based on image characteristics:
     - Dark + high contrast → eldritch theme
     - Bright + soft → moonlit theme
     - Red bias → ember/fiery theme
     - Blue bias → frost/spectral theme
   - Deterministic (seeded RNG)
   - Explanation of why template was chosen

4. **Features**
   - Copy to clipboard buttons
   - Regenerate with new seed
   - Built-in lexicon (16 adjectives, 16 nouns, 12 phrases)

**Files:**
- `scripts/components/spooky-title-generator.js` - Main component
- Styles in `styles/components.css`

## Navigation

Both features are accessible via:

1. **Home page mini-widgets** - Click the cards
2. **Navigation bar** - Icons in top nav
3. **Keyboard shortcuts**:
   - Press `7` for Stitch Lab
   - Press `8` for Title Generator
4. **Direct URLs**:
   - `http://localhost:8000/#/stitch`
   - `http://localhost:8000/#/title-generator`

## API Integration

### Current State (Stub)

The `/api/generate-stitched` endpoint currently returns a placeholder SVG image. This allows you to:
- Test the UI flow
- See how the modal works
- Test download/regenerate features
- Develop without spending credits

### Production Setup

To enable real AI image generation:

1. **Choose a provider** (see `api/README.md`):
   - Stability AI (Stable Diffusion)
   - OpenAI (DALL-E)
   - Replicate
   - Others

2. **Get API key** from your chosen provider

3. **Set environment variable**:
   ```bash
   # Vercel
   vercel env add STABILITY_API_KEY
   
   # Netlify
   netlify env:set STABILITY_API_KEY sk-...
   
   # Local .env file
   echo "STABILITY_API_KEY=sk-..." > .env
   ```

4. **Update `api/generate-stitched.js`**:
   - Uncomment the real implementation section
   - Replace placeholder code
   - Test with real generations

5. **Deploy**:
   ```bash
   # Vercel
   vercel --prod
   
   # Netlify
   netlify deploy --prod
   ```

### Security Notes

- ✅ API keys are NEVER in frontend code
- ✅ All AI calls go through serverless functions
- ✅ User must explicitly confirm before using credits
- ✅ Quality selector helps manage costs

## Styling

Both features use The Spectral Haven's existing design system:

- **Colors**: Purple, teal, orange accents
- **Fonts**: Creepster for headings, sans-serif for body
- **Animations**: Smooth transitions, hover effects
- **Theme**: Matches night/day mode
- **Responsive**: Mobile-friendly layouts

## Testing

### Test Stitch Lab

1. Open `http://localhost:8000/#/stitch`
2. Select two species (e.g., Wisp + Hollow)
3. Click "Stitch Species"
4. See instant local result
5. Click "Generate Cartoon Image"
6. Confirm in modal
7. See placeholder image appear
8. Test Download and Regenerate

### Test Title Generator

1. Open `http://localhost:8000/#/title-generator`
2. Upload an image (drag or click)
3. Click "Generate Spooky Title"
4. See 3 titles + explanation
5. Click copy buttons
6. Click "Regenerate" for new titles

## File Structure

```
the-spectral-haven/
├── scripts/
│   └── components/
│       ├── stitch-lab.js           # New: Stitch Lab component
│       └── spooky-title-generator.js # New: Title Generator component
├── api/
│   ├── generate-stitched.js        # New: Serverless endpoint (stub)
│   └── README.md                   # New: API documentation
├── styles/
│   └── components.css              # Updated: New component styles
├── scripts/
│   ├── main.js                     # Updated: Register new routes
│   └── components/
│       └── home-page.js            # Updated: Add new mini-widgets
├── index.html                      # Updated: Add nav buttons
└── NEW-FEATURES.md                 # This file
```

## Performance

### Stitch Lab
- **Local stitching**: Instant (< 50ms)
- **SVG preview**: No network calls
- **AI generation**: 10-30s (depends on provider)

### Title Generator
- **Image upload**: Instant
- **Analysis**: < 100ms (client-side)
- **Title generation**: < 10ms (client-side)
- **No network calls**: Everything runs locally

## Browser Compatibility

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Requires ES6 module support
- Canvas API for image analysis
- FileReader API for uploads

## Future Enhancements

### Stitch Lab
- [ ] Save favorite stitches to localStorage
- [ ] Share stitches via URL
- [ ] More species options
- [ ] Animation preview
- [ ] Trait rarity system

### Title Generator
- [ ] More template variations
- [ ] Custom lexicon upload
- [ ] Batch processing
- [ ] Title history
- [ ] Export as image with title overlay

## Troubleshooting

### Stitch Lab Issues

**Problem**: "Generate Cartoon Image" button doesn't work
- **Solution**: Check browser console for errors
- **Solution**: Verify `/api/generate-stitched` endpoint is accessible
- **Solution**: Check CORS configuration if using external API

**Problem**: Modal doesn't appear
- **Solution**: Check z-index in CSS
- **Solution**: Verify modal element exists in DOM

### Title Generator Issues

**Problem**: Image won't upload
- **Solution**: Check file size (< 10MB recommended)
- **Solution**: Verify file type (JPG, PNG, GIF only)
- **Solution**: Check browser console for FileReader errors

**Problem**: Titles are always the same
- **Solution**: Click "Regenerate" to change seed
- **Solution**: Try different images for different characteristics

### API Issues

**Problem**: 405 Method Not Allowed
- **Solution**: Ensure POST request is being sent
- **Solution**: Check serverless function configuration

**Problem**: 500 Internal Server Error
- **Solution**: Check serverless function logs
- **Solution**: Verify environment variables are set
- **Solution**: Test API key with provider directly

## Credits & Costs

### Estimated Costs per Generation

| Provider | Low (512px) | Med (768px) | High (1024px) |
|----------|-------------|-------------|---------------|
| Stability AI | $0.002 | $0.004 | $0.008 |
| DALL-E 3 | $0.040 | $0.060 | $0.080 |
| Replicate | $0.001 | $0.003 | $0.006 |

### Cost Management Tips

1. Use placeholder mode during development
2. Set up billing alerts
3. Implement rate limiting
4. Cache generated images
5. Use lower quality for testing

## Support

For issues or questions:
1. Check browser console for errors
2. Review `api/README.md` for API setup
3. Test with placeholder mode first
4. Verify all files are in correct locations

## License

These features are part of The Spectral Haven project and follow the same license.
