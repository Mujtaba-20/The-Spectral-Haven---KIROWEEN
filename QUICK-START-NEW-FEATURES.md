# Quick Start: New Features

## 🚀 Immediate Testing (No Setup Required)

Both features work immediately with placeholder/local processing:

### Test Stitch Lab
```bash
# 1. Refresh your browser
# 2. Navigate to: http://localhost:8000/#/stitch
# 3. Or press keyboard shortcut: 7
# 4. Or click the 🧬 icon in navigation
# 5. Or click "Stitch Lab" widget on home page
```

**What works now:**
- ✅ Select two species
- ✅ Instant local stitching (portmanteau, traits, SVG preview)
- ✅ Color swatches
- ✅ "Generate Cartoon Image" button (returns placeholder)
- ✅ Download placeholder
- ✅ Regenerate with new seed

### Test Title Generator
```bash
# 1. Navigate to: http://localhost:8000/#/title-generator
# 2. Or press keyboard shortcut: 8
# 3. Or click the 📸 icon in navigation
# 4. Or click "Title Generator" widget on home page
```

**What works now:**
- ✅ Upload any image (drag & drop or click)
- ✅ Instant client-side analysis
- ✅ Generate 3 spooky titles
- ✅ Copy to clipboard
- ✅ Regenerate for variations
- ✅ See explanation of why template was chosen

## 🎨 Enable Real AI Image Generation

### Option 1: Stability AI (Recommended)

1. **Sign up**: https://platform.stability.ai/
2. **Get API key**: Dashboard → API Keys
3. **Set environment variable**:
   ```bash
   # For Vercel
   vercel env add STABILITY_API_KEY
   
   # For local .env
   echo "STABILITY_API_KEY=sk-your-key-here" > .env
   ```
4. **Update `api/generate-stitched.js`**:
   - Uncomment the Stability AI section (lines ~50-75)
   - Comment out the placeholder section
5. **Deploy or restart local server**

### Option 2: OpenAI DALL-E

1. **Sign up**: https://platform.openai.com/
2. **Get API key**: API Keys section
3. **Set environment variable**:
   ```bash
   OPENAI_API_KEY=sk-your-key-here
   ```
4. **Update `api/generate-stitched.js`**:
   - Use the DALL-E example in `api/README.md`
5. **Deploy**

### Option 3: Replicate

1. **Sign up**: https://replicate.com/
2. **Get token**: Account → API Tokens
3. **Set environment variable**:
   ```bash
   REPLICATE_API_TOKEN=r8_your-token-here
   ```
4. **Update `api/generate-stitched.js`**:
   - Use the Replicate example in `api/README.md`
5. **Deploy**

## 📦 Deployment

### Vercel (Easiest)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Set environment variables
vercel env add STABILITY_API_KEY

# Deploy to production
vercel --prod
```

### Netlify

```bash
# Install Netlify CLI
npm i -g netlify-cli

# Deploy
netlify deploy

# Set environment variables
netlify env:set STABILITY_API_KEY sk-...

# Deploy to production
netlify deploy --prod
```

## 🎯 Navigation

### Keyboard Shortcuts
- `1` - Home
- `2` - Haunted To-Do
- `3` - Focus Chamber
- `4` - Whisper Well
- `5` - Mood Tracker
- `6` - Nightfall Candle
- `7` - **Stitch Lab** (NEW)
- `8` - **Title Generator** (NEW)
- `9` - Settings

### Direct URLs
- Stitch Lab: `/#/stitch`
- Title Generator: `/#/title-generator`

## 💡 Tips

### Stitch Lab
- Try combining opposite species (Ember + Frost)
- Select same species twice for "evolutionary variant"
- Use low quality for testing to save credits
- Download images before regenerating

### Title Generator
- Dark images → eldritch/eerie titles
- Bright images → moonlit/gentle titles
- Red-tinted → fiery/ember themes
- Blue-tinted → frost/spectral themes
- Click "Regenerate" for variations

## 🐛 Troubleshooting

### "Generate Cartoon Image" shows placeholder
- **Expected**: This is the default behavior
- **To fix**: Set up real AI provider (see above)

### Navigation buttons don't work
- **Fix**: Refresh browser (Ctrl+R or Cmd+R)
- **Fix**: Check browser console for errors

### Image won't upload
- **Fix**: Use JPG, PNG, or GIF only
- **Fix**: Keep file size under 10MB
- **Fix**: Check browser console

### API errors
- **Fix**: Check environment variables are set
- **Fix**: Verify API key is valid
- **Fix**: Check serverless function logs

## 📊 Cost Estimates

### Per Image Generation

| Quality | Dimensions | Stability AI | DALL-E 3 | Replicate |
|---------|-----------|--------------|----------|-----------|
| Low     | 512x512   | $0.002       | $0.040   | $0.001    |
| Medium  | 768x768   | $0.004       | $0.060   | $0.003    |
| High    | 1024x1024 | $0.008       | $0.080   | $0.006    |

**Recommendation**: Use Stability AI or Replicate for cost-effective generation.

## 📚 Documentation

- **NEW-FEATURES.md** - Complete feature documentation
- **api/README.md** - API setup and provider examples
- **README.md** - Main project documentation

## ✅ Checklist

- [ ] Tested Stitch Lab with placeholder
- [ ] Tested Title Generator with image upload
- [ ] Chose AI provider
- [ ] Got API key
- [ ] Set environment variable
- [ ] Updated `api/generate-stitched.js`
- [ ] Deployed to production
- [ ] Tested real AI generation
- [ ] Set up billing alerts

## 🎉 You're Ready!

Both features are now live and working. Start with the placeholder mode to test the UI, then enable real AI generation when ready.

**Enjoy creating stitched creatures and spooky titles!** 👻🧬📸
