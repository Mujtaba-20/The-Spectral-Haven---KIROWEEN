// Stitch Lab - AI-generated stitched species

export class StitchLab {
    constructor() {
        this.container = null;
        this.species = [
            { id: 'wisp', name: 'Wisp', visualHints: ['translucent wings', 'cyan glow', 'ethereal form'], colors: ['#9BE7FF', '#5DD9C1'], svg: 'M50,20 Q30,40 50,60 Q70,40 50,20 M40,35 L60,35' },
            { id: 'hollow', name: 'Hollow', visualHints: ['hollow eyes', 'ceramic skull', 'bone structure'], colors: ['#8844FF', '#9D7BD8'], svg: 'M50,15 Q35,15 30,30 L30,50 Q30,60 50,60 Q70,60 70,50 L70,30 Q65,15 50,15 M40,30 L40,35 M60,30 L60,35' },
            { id: 'shade', name: 'Shade', visualHints: ['dark mist', 'flowing tendrils', 'shadow form'], colors: ['#2A2A2A', '#4A4A4A'], svg: 'M50,10 Q20,30 30,60 Q40,70 50,70 Q60,70 70,60 Q80,30 50,10' },
            { id: 'ember', name: 'Ember', visualHints: ['flickering flames', 'warm glow', 'fire essence'], colors: ['#FF8C42', '#FF6B35'], svg: 'M50,15 L45,35 L40,25 L35,45 L40,55 L50,65 L60,55 L65,45 L60,25 L55,35 Z' },
            { id: 'frost', name: 'Frost', visualHints: ['ice crystals', 'cold aura', 'frozen form'], colors: ['#A8E6FF', '#E0F7FF'], svg: 'M50,10 L55,25 L70,25 L58,35 L63,50 L50,40 L37,50 L42,35 L30,25 L45,25 Z' },
            { id: 'thorn', name: 'Thorn', visualHints: ['sharp spikes', 'twisted vines', 'barbed edges'], colors: ['#4A7C59', '#2D5F3F'], svg: 'M50,10 L52,30 L60,25 L54,40 L65,45 L50,50 L35,45 L46,40 L40,25 L48,30 Z' }
        ];
        this.selectedA = null;
        this.selectedB = null;
        this.currentResult = null;
        this.currentSeed = Date.now();
    }

    render() {
        this.container = document.getElementById('page-container');
        if (!this.container) return;

        this.container.innerHTML = `
            <div class="stitch-lab-page">
                <h1>🧬 Stitch Lab</h1>
                <p class="subtitle">Combine two spectral species to create something new...</p>

                <div class="stitch-selector-container">
                    <div class="species-selector">
                        <h3>Species A</h3>
                        <div class="species-grid" id="species-a-grid">
                            ${this.renderSpeciesOptions('a')}
                        </div>
                    </div>

                    <div class="stitch-operator">
                        <span class="stitch-icon">⚗️</span>
                    </div>

                    <div class="species-selector">
                        <h3>Species B</h3>
                        <div class="species-grid" id="species-b-grid">
                            ${this.renderSpeciesOptions('b')}
                        </div>
                    </div>
                </div>

                <div class="stitch-actions">
                    <button class="btn btn-primary" id="stitch-btn" disabled>
                        <span class="icon">🧬</span> Stitch Species
                    </button>
                </div>

                <div class="stitch-result" id="stitch-result" style="display: none;">
                    <div class="result-header">
                        <h2 id="result-name"></h2>
                        <p id="result-description"></p>
                        <div id="self-stitch-notice" style="display: none;" class="notice">
                            ⚠️ Self-stitched (evolutionary variant)
                        </div>
                    </div>

                    <div class="result-content">
                        <div class="result-preview">
                            <div id="preview-container" class="preview-svg"></div>
                            <div class="color-swatches" id="color-swatches"></div>
                        </div>

                        <div class="result-traits">
                            <h3>Merged Traits</h3>
                            <ul id="traits-list"></ul>
                        </div>
                    </div>

                    <div class="ai-generation">
                        <button class="btn btn-secondary" id="generate-ai-btn">
                            <span class="icon">🎨</span> Generate Cartoon Image
                        </button>
                        <p class="ai-notice">Optional: Generate an AI cartoon image (may use credits)</p>
                    </div>

                    <div id="ai-result" style="display: none;">
                        <img id="ai-image" alt="Generated creature" />
                        <div class="ai-actions">
                            <button class="btn btn-small" id="download-btn">⬇️ Download</button>
                            <button class="btn btn-small" id="regenerate-btn">🔄 Regenerate</button>
                        </div>
                    </div>
                </div>

                <!-- Confirmation Modal -->
                <div id="confirm-modal" class="modal" style="display: none;">
                    <div class="modal-content">
                        <h3>⚠️ Generate AI Image</h3>
                        <p>This will use credits to generate a cartoon image.</p>
                        
                        <div class="quality-selector">
                            <label>Quality:</label>
                            <select id="quality-select">
                                <option value="low">Low (512px) - ~1 credit</option>
                                <option value="med" selected>Medium (768px) - ~2 credits</option>
                                <option value="high">High (1024px) - ~3 credits</option>
                            </select>
                        </div>

                        <div class="modal-actions">
                            <button class="btn btn-primary" id="confirm-generate">Continue</button>
                            <button class="btn btn-secondary" id="cancel-generate">Cancel</button>
                        </div>
                    </div>
                </div>
            </div>
        `;

        this.attachEventListeners();
    }

    renderSpeciesOptions(group) {
        return this.species.map(s => `
            <div class="species-card" data-species="${s.id}" data-group="${group}">
                <svg viewBox="0 0 100 80" class="species-icon">
                    <path d="${s.svg}" fill="${s.colors[0]}" stroke="${s.colors[1]}" stroke-width="2"/>
                </svg>
                <span class="species-name">${s.name}</span>
            </div>
        `).join('');
    }

    attachEventListeners() {
        // Species selection
        document.querySelectorAll('.species-card').forEach(card => {
            card.addEventListener('click', (e) => this.selectSpecies(e));
        });

        // Stitch button
        const stitchBtn = document.getElementById('stitch-btn');
        if (stitchBtn) {
            stitchBtn.addEventListener('click', () => this.performStitch());
        }

        // AI generation
        const generateAiBtn = document.getElementById('generate-ai-btn');
        if (generateAiBtn) {
            generateAiBtn.addEventListener('click', () => this.showConfirmModal());
        }

        // Modal actions
        const confirmBtn = document.getElementById('confirm-generate');
        const cancelBtn = document.getElementById('cancel-generate');
        if (confirmBtn) confirmBtn.addEventListener('click', () => this.generateAIImage());
        if (cancelBtn) cancelBtn.addEventListener('click', () => this.hideConfirmModal());

        // Download and regenerate
        const downloadBtn = document.getElementById('download-btn');
        const regenerateBtn = document.getElementById('regenerate-btn');
        if (downloadBtn) downloadBtn.addEventListener('click', () => this.downloadImage());
        if (regenerateBtn) regenerateBtn.addEventListener('click', () => this.regenerateImage());
    }

    selectSpecies(e) {
        const card = e.currentTarget;
        const speciesId = card.dataset.species;
        const group = card.dataset.group;

        // Remove previous selection in this group
        document.querySelectorAll(`.species-card[data-group="${group}"]`).forEach(c => {
            c.classList.remove('selected');
        });

        // Add selection
        card.classList.add('selected');

        // Store selection
        const species = this.species.find(s => s.id === speciesId);
        if (group === 'a') {
            this.selectedA = species;
        } else {
            this.selectedB = species;
        }

        // Enable stitch button if both selected
        const stitchBtn = document.getElementById('stitch-btn');
        if (this.selectedA && this.selectedB && stitchBtn) {
            stitchBtn.disabled = false;
        }
    }

    performStitch() {
        if (!this.selectedA || !this.selectedB) return;

        // Generate portmanteau name
        const nameA = this.selectedA.name;
        const nameB = this.selectedB.name;
        const portmanteau = this.createPortmanteau(nameA, nameB);

        // Generate description
        const description = this.generateDescription(this.selectedA, this.selectedB);

        // Merge traits
        const traits = this.mergeTraits(this.selectedA, this.selectedB);

        // Merge colors
        const colors = [...this.selectedA.colors, ...this.selectedB.colors];

        // Store result
        this.currentResult = {
            name: portmanteau,
            description,
            traits,
            colors,
            speciesA: this.selectedA,
            speciesB: this.selectedB
        };

        // Display result
        this.displayResult();
    }

    createPortmanteau(nameA, nameB) {
        // Simple portmanteau: first half of A + second half of B
        const midA = Math.ceil(nameA.length / 2);
        const midB = Math.floor(nameB.length / 2);
        return nameA.slice(0, midA) + nameB.slice(midB);
    }

    generateDescription(speciesA, speciesB) {
        const templates = [
            `A haunting fusion of ${speciesA.name} and ${speciesB.name}, lurking in the shadows.`,
            `Born from the essence of ${speciesA.name} and ${speciesB.name}, this creature defies nature.`,
            `The unholy union of ${speciesA.name} and ${speciesB.name} manifests in spectral form.`,
            `Where ${speciesA.name} meets ${speciesB.name}, something eerie emerges.`
        ];
        return templates[Math.floor(Math.random() * templates.length)];
    }

    mergeTraits(speciesA, speciesB) {
        const allHints = [...speciesA.visualHints, ...speciesB.visualHints];
        // Pick 4-6 random traits
        const count = 4 + Math.floor(Math.random() * 3);
        const shuffled = allHints.sort(() => Math.random() - 0.5);
        return shuffled.slice(0, count);
    }

    displayResult() {
        const resultDiv = document.getElementById('stitch-result');
        const nameEl = document.getElementById('result-name');
        const descEl = document.getElementById('result-description');
        const traitsEl = document.getElementById('traits-list');
        const swatchesEl = document.getElementById('color-swatches');
        const previewEl = document.getElementById('preview-container');
        const selfNotice = document.getElementById('self-stitch-notice');

        if (!resultDiv || !this.currentResult) return;

        // Show result
        resultDiv.style.display = 'block';
        nameEl.textContent = this.currentResult.name;
        descEl.textContent = this.currentResult.description;

        // Show self-stitch notice
        if (this.selectedA.id === this.selectedB.id && selfNotice) {
            selfNotice.style.display = 'block';
        } else if (selfNotice) {
            selfNotice.style.display = 'none';
        }

        // Render traits
        traitsEl.innerHTML = this.currentResult.traits.map(t => `<li>${t}</li>`).join('');

        // Render color swatches
        swatchesEl.innerHTML = this.currentResult.colors.map(c => 
            `<div class="color-swatch" style="background: ${c};" title="${c}"></div>`
        ).join('');

        // Render SVG preview (overlay both species)
        previewEl.innerHTML = `
            <svg viewBox="0 0 100 80" class="stitched-preview">
                <defs>
                    <filter id="glow">
                        <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
                        <feMerge>
                            <feMergeNode in="coloredBlur"/>
                            <feMergeNode in="SourceGraphic"/>
                        </feMerge>
                    </filter>
                </defs>
                <g style="mix-blend-mode: screen; opacity: 0.8;">
                    <path d="${this.selectedA.svg}" fill="${this.selectedA.colors[0]}" stroke="${this.selectedA.colors[1]}" stroke-width="2" filter="url(#glow)"/>
                </g>
                <g style="mix-blend-mode: screen; opacity: 0.8;" transform="translate(5, 5)">
                    <path d="${this.selectedB.svg}" fill="${this.selectedB.colors[0]}" stroke="${this.selectedB.colors[1]}" stroke-width="2" filter="url(#glow)"/>
                </g>
            </svg>
        `;

        // Hide AI result
        const aiResult = document.getElementById('ai-result');
        if (aiResult) aiResult.style.display = 'none';

        // Scroll to result
        resultDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }

    showConfirmModal() {
        const modal = document.getElementById('confirm-modal');
        if (modal) modal.style.display = 'flex';
    }

    hideConfirmModal() {
        const modal = document.getElementById('confirm-modal');
        if (modal) modal.style.display = 'none';
    }

    async generateAIImage() {
        this.hideConfirmModal();

        const quality = document.getElementById('quality-select')?.value || 'med';
        const generateBtn = document.getElementById('generate-ai-btn');
        
        if (generateBtn) {
            generateBtn.disabled = true;
            generateBtn.innerHTML = '<span class="icon">⏳</span> Generating...';
        }

        try {
            const response = await fetch('http://localhost:8001/api/generate-stitched', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    a: {
                        id: this.selectedA.id,
                        name: this.selectedA.name,
                        visualHints: this.selectedA.visualHints,
                        colors: this.selectedA.colors
                    },
                    b: {
                        id: this.selectedB.id,
                        name: this.selectedB.name,
                        visualHints: this.selectedB.visualHints,
                        colors: this.selectedB.colors
                    },
                    quality,
                    seed: this.currentSeed
                })
            });

            const data = await response.json();
            
            if (data.imageUrl) {
                this.displayAIImage(data.imageUrl);
            } else {
                throw new Error('No image URL returned');
            }
        } catch (error) {
            console.error('AI generation failed:', error);
            alert('Failed to generate image. Please try again.');
        } finally {
            if (generateBtn) {
                generateBtn.disabled = false;
                generateBtn.innerHTML = '<span class="icon">🎨</span> Generate Cartoon Image';
            }
        }
    }

    displayAIImage(imageUrl) {
        const aiResult = document.getElementById('ai-result');
        const aiImage = document.getElementById('ai-image');
        
        if (aiResult && aiImage) {
            aiImage.src = imageUrl;
            aiResult.style.display = 'block';
            aiResult.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
    }

    downloadImage() {
        const aiImage = document.getElementById('ai-image');
        if (!aiImage || !aiImage.src) return;

        const link = document.createElement('a');
        link.href = aiImage.src;
        link.download = `${this.currentResult.name}-${this.currentSeed}.png`;
        link.click();
    }

    regenerateImage() {
        // Increment seed for variation
        this.currentSeed = Date.now();
        this.generateAIImage();
    }

    destroy() {
        // Cleanup
        if (this.container) {
            this.container.innerHTML = '';
        }
    }
}
