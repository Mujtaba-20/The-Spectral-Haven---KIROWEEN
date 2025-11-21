// Spooky Title Generator - Generate spooky titles from uploaded images

export class SpookyTitleGenerator {
    constructor() {
        this.container = null;
        this.uploadedImage = null;
        this.imageData = null;
        
        // Lexicon
        this.adjectives = [
            'Crooked', 'Whispering', 'Moonlit', 'Shadowy', 
            'Gloomy', 'Eerie', 'Flickering', 'Ghostly',
            'Silent', 'Veiled', 'Nightborne', 'Eldritch',
            'Forsaken', 'Hollow', 'Twisted', 'Spectral'
        ];
        
        this.nouns = [
            'Totem', 'Sprite', 'Wisp', 'Hollow',
            'Grove', 'Lullaby', 'Lantern', 'Specter',
            'Manor', 'Echo', 'Reliquary', 'Procession',
            'Requiem', 'Shadow', 'Veil', 'Wraith'
        ];
        
        this.phrases = [
            'of the Night', 'in the Fog', 'Under the Lantern',
            'of the Deep Woods', 'at Midnight', 'beneath the Moon',
            'of the Hollow', 'in the Mist', 'Beyond the Veil',
            'at Dusk', 'in Twilight', 'of the Abyss'
        ];
    }

    render() {
        this.container = document.getElementById('page-container');
        if (!this.container) return;

        this.container.innerHTML = `
            <div class="title-generator-page">
                <h1>📸 Spooky Title Generator</h1>
                <p class="subtitle">Upload an image and get a hauntingly perfect title...</p>

                <div class="upload-section">
                    <div class="upload-box" id="upload-box">
                        <input type="file" id="file-input" accept="image/*" style="display: none;">
                        <div class="upload-prompt">
                            <span class="upload-icon">📤</span>
                            <p>Click or drag an image here</p>
                            <p class="upload-hint">Supports JPG, PNG, GIF</p>
                        </div>
                    </div>

                    <div id="preview-section" style="display: none;">
                        <img id="image-preview" alt="Uploaded image preview" />
                        <button class="btn btn-small" id="change-image">Change Image</button>
                    </div>
                </div>

                <div class="generate-section">
                    <button class="btn btn-primary" id="generate-title-btn" disabled>
                        <span class="icon">✨</span> Generate Spooky Title
                    </button>
                </div>

                <div id="title-results" style="display: none;">
                    <div class="title-card main-title">
                        <h2 id="main-title"></h2>
                        <p class="title-label">Main Title</p>
                    </div>

                    <div class="alternates">
                        <h3>Alternates</h3>
                        <div class="title-card alternate">
                            <p id="alt-title-1"></p>
                            <button class="btn-copy" data-target="alt-title-1">📋 Copy</button>
                        </div>
                        <div class="title-card alternate">
                            <p id="alt-title-2"></p>
                            <button class="btn-copy" data-target="alt-title-2">📋 Copy</button>
                        </div>
                    </div>

                    <div class="analysis-info">
                        <p id="analysis-explanation"></p>
                    </div>

                    <div class="title-actions">
                        <button class="btn btn-secondary" id="regenerate-title-btn">
                            🔄 Regenerate
                        </button>
                    </div>
                </div>
            </div>
        `;

        this.attachEventListeners();
    }

    attachEventListeners() {
        const uploadBox = document.getElementById('upload-box');
        const fileInput = document.getElementById('file-input');
        const generateBtn = document.getElementById('generate-title-btn');
        const changeImageBtn = document.getElementById('change-image');
        const regenerateBtn = document.getElementById('regenerate-title-btn');

        // Upload box click
        if (uploadBox) {
            uploadBox.addEventListener('click', () => fileInput?.click());
            
            // Drag and drop
            uploadBox.addEventListener('dragover', (e) => {
                e.preventDefault();
                uploadBox.classList.add('drag-over');
            });
            
            uploadBox.addEventListener('dragleave', () => {
                uploadBox.classList.remove('drag-over');
            });
            
            uploadBox.addEventListener('drop', (e) => {
                e.preventDefault();
                uploadBox.classList.remove('drag-over');
                const file = e.dataTransfer?.files[0];
                if (file && file.type.startsWith('image/')) {
                    this.handleImageUpload(file);
                }
            });
        }

        // File input change
        if (fileInput) {
            fileInput.addEventListener('change', (e) => {
                const file = e.target.files?.[0];
                if (file) {
                    this.handleImageUpload(file);
                }
            });
        }

        // Generate button
        if (generateBtn) {
            generateBtn.addEventListener('click', () => this.generateTitle());
        }

        // Change image
        if (changeImageBtn) {
            changeImageBtn.addEventListener('click', () => {
                fileInput?.click();
            });
        }

        // Regenerate
        if (regenerateBtn) {
            regenerateBtn.addEventListener('click', () => this.generateTitle(true));
        }

        // Copy buttons
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('btn-copy')) {
                const targetId = e.target.dataset.target;
                const textEl = document.getElementById(targetId);
                if (textEl) {
                    navigator.clipboard.writeText(textEl.textContent);
                    e.target.textContent = '✓ Copied!';
                    setTimeout(() => {
                        e.target.textContent = '📋 Copy';
                    }, 2000);
                }
            }
        });
    }

    handleImageUpload(file) {
        const reader = new FileReader();
        
        reader.onload = (e) => {
            const img = new Image();
            img.onload = () => {
                this.uploadedImage = img;
                this.showPreview(e.target.result);
                this.analyzeImage(img);
                
                // Enable generate button
                const generateBtn = document.getElementById('generate-title-btn');
                if (generateBtn) generateBtn.disabled = false;
            };
            img.src = e.target.result;
        };
        
        reader.readAsDataURL(file);
    }

    showPreview(dataUrl) {
        const uploadBox = document.getElementById('upload-box');
        const previewSection = document.getElementById('preview-section');
        const previewImg = document.getElementById('image-preview');
        
        if (uploadBox) uploadBox.style.display = 'none';
        if (previewSection) previewSection.style.display = 'block';
        if (previewImg) previewImg.src = dataUrl;
    }

    analyzeImage(img) {
        // Create canvas and resize to 256px max
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        const maxSize = 256;
        let width = img.width;
        let height = img.height;
        
        if (width > height) {
            if (width > maxSize) {
                height = (height * maxSize) / width;
                width = maxSize;
            }
        } else {
            if (height > maxSize) {
                width = (width * maxSize) / height;
                height = maxSize;
            }
        }
        
        canvas.width = width;
        canvas.height = height;
        ctx.drawImage(img, 0, 0, width, height);
        
        // Get image data
        const imageData = ctx.getImageData(0, 0, width, height);
        const data = imageData.data;
        
        // Compute metrics
        let totalBrightness = 0;
        let totalRed = 0;
        let totalBlue = 0;
        let edgeScore = 0;
        
        for (let i = 0; i < data.length; i += 4) {
            const r = data[i];
            const g = data[i + 1];
            const b = data[i + 2];
            
            // Brightness (luminance)
            const brightness = 0.299 * r + 0.587 * g + 0.114 * b;
            totalBrightness += brightness;
            
            // Color bias
            totalRed += r;
            totalBlue += b;
            
            // Simple edge detection (compare with next pixel)
            if (i + 4 < data.length) {
                const nextR = data[i + 4];
                const diff = Math.abs(r - nextR);
                edgeScore += diff;
            }
        }
        
        const pixelCount = data.length / 4;
        const avgBrightness = totalBrightness / pixelCount;
        const avgRed = totalRed / pixelCount;
        const avgBlue = totalBlue / pixelCount;
        const avgEdge = edgeScore / pixelCount;
        
        // Store analysis
        this.imageData = {
            brightness: avgBrightness,
            contrast: avgEdge,
            colorBias: avgRed - avgBlue, // Positive = red bias, negative = blue bias
            isDark: avgBrightness < 100,
            isHighContrast: avgEdge > 20
        };
    }

async generateTitle(regenerate = false) {
    // If no image or image analysis available, do nothing
    if (!this.uploadedImage && !this.imageData) return;

    // Helper: local fallback generator (your original logic, extracted)
    const localGenerate = () => {
        // Seeded random based on image data + timestamp
        const seed = regenerate ? Date.now() : Math.floor(this.imageData.brightness * this.imageData.contrast);
        const rng = this.seededRandom(seed);

        // Choose template based on image characteristics
        let template;
        let explanation;

        if (this.imageData.isDark && this.imageData.isHighContrast) {
            template = 'eldritch';
            explanation = 'Dark with high contrast → eldritch words used';
        } else if (!this.imageData.isDark && this.imageData.contrast < 15) {
            template = 'moonlit';
            explanation = 'Bright and soft → moonlit theme';
        } else if (this.imageData.colorBias > 30) {
            template = 'ember';
            explanation = 'Red color bias → warm, fiery theme';
        } else if (this.imageData.colorBias < -30) {
            template = 'frost';
            explanation = 'Blue color bias → cold, spectral theme';
        } else {
            template = 'default';
            explanation = 'Balanced tones → classic spooky theme';
        }

        const mainTitle = this.buildTitle(template, rng);
        const alt1 = this.buildTitle(template, rng);
        const alt2 = this.buildTitle(template, rng);

        this.displayTitles(mainTitle, alt1, alt2, explanation);
    };

    // Attempt to call the Gemini Vision serverless function.
    // Build image Base64 (preferred) — fall back to local test path if conversion fails.
    let imageBase64 = null;
    try {
        const canvas = document.createElement("canvas");
        const MAX = 800;
        let w = this.uploadedImage.width;
        let h = this.uploadedImage.height;
        if (w > h && w > MAX) { h = (h * MAX) / w; w = MAX; }
        else if (h > MAX) { w = (w * MAX) / h; h = MAX; }
        canvas.width = w; canvas.height = h;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(this.uploadedImage, 0, 0, w, h);
        const dataUrl = canvas.toDataURL("image/jpeg", 0.8);
        imageBase64 = dataUrl.split(",")[1]; // strip data prefix
    } catch (e) {
        console.warn("Base64 conversion failed; will use local test path fallback", e);
    }

    // Local test path (useful for local testing). When deployed, Base64 path is used.
    const localTestPath = "/mnt/data/d7c4641f-9343-4d91-a93a-2ed67467d5df.png";

    // If regenerate is true, we still try the API (not using cache)
    try {
        const body = imageBase64
            ? { imageBase64, extraPrompt: "" }
            : { imageUrl: localTestPath, extraPrompt: "" };

        const resp = await fetch("/.netlify/functions/generate_title", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body)
        });

        if (!resp.ok) throw new Error(`API returned ${resp.status}`);

        const data = await resp.json();

        // Validate returned fields
        if (data && data.mainTitle && (data.alt1 || data.alt2)) {
            this.displayTitles(data.mainTitle, data.alt1 || "", data.alt2 || "", data.explanation || "");
            return; // success — done
        } else {
            console.warn("API returned unexpected payload, falling back to local generator", data);
            localGenerate();
            return;
        }
    } catch (err) {
        console.warn("API call failed or parsing failed — using local generator as fallback.", err);
        localGenerate();
        return;
    }
}


    seededRandom(seed) {
        let value = seed;
        return () => {
            value = (value * 9301 + 49297) % 233280;
            return value / 233280;
        };
    }

    buildTitle(template, rng) {
        const adj = this.adjectives[Math.floor(rng() * this.adjectives.length)];
        const noun = this.nouns[Math.floor(rng() * this.nouns.length)];
        const phrase = this.phrases[Math.floor(rng() * this.phrases.length)];

        const patterns = [
            `${adj} ${noun}`,
            `The ${adj} ${noun}`,
            `${adj} ${noun} ${phrase}`,
            `${noun} ${phrase}`,
            `The ${noun} ${phrase}`
        ];

        return patterns[Math.floor(rng() * patterns.length)];
    }

    displayTitles(main, alt1, alt2, explanation) {
        const resultsDiv = document.getElementById('title-results');
        const mainTitleEl = document.getElementById('main-title');
        const alt1El = document.getElementById('alt-title-1');
        const alt2El = document.getElementById('alt-title-2');
        const explanationEl = document.getElementById('analysis-explanation');

        if (resultsDiv) resultsDiv.style.display = 'block';
        if (mainTitleEl) mainTitleEl.textContent = main;
        if (alt1El) alt1El.textContent = alt1;
        if (alt2El) alt2El.textContent = alt2;
        if (explanationEl) explanationEl.textContent = `📊 ${explanation}`;

        // Scroll to results
        resultsDiv?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }

    destroy() {
        if (this.container) {
            this.container.innerHTML = '';
        }
        this.uploadedImage = null;
        this.imageData = null;
    }
}
