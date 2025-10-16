class ColorPaletteGenerator {
    constructor() {
        this.currentPalette = [];
        this.selectedColor = null;
        this.savedPalettes = JSON.parse(localStorage.getItem('savedPalettes')) || [];
        
        this.initializeElements();
        this.bindEvents();
        this.generateRandomPalette();
        this.loadSavedPalettes();
    }

    initializeElements() {
        this.colorCountSlider = document.getElementById('colorCount');
        this.colorCountValue = document.getElementById('colorCountValue');
        this.paletteType = document.getElementById('paletteType');
        this.generateBtn = document.getElementById('generateBtn');
        this.saveBtn = document.getElementById('saveBtn');
        this.exportBtn = document.getElementById('exportBtn');
        this.colorPalette = document.getElementById('colorPalette');
        this.colorInfo = document.getElementById('colorInfo');
        this.savedPalettesList = document.getElementById('savedPalettesList');
        this.previewHeader = document.getElementById('previewHeader');
        this.previewContent = document.getElementById('previewContent');
        this.previewBtn = document.getElementById('previewBtn');
        this.toast = document.getElementById('toast');
        this.toastMessage = document.getElementById('toastMessage');
    }

    bindEvents() {
        this.colorCountSlider.addEventListener('input', (e) => {
            this.colorCountValue.textContent = e.target.value;
            this.generatePalette();
        });

        this.paletteType.addEventListener('change', () => {
            this.generatePalette();
        });

        this.generateBtn.addEventListener('click', () => {
            this.generatePalette();
        });

        this.saveBtn.addEventListener('click', () => {
            this.saveCurrentPalette();
        });

        this.exportBtn.addEventListener('click', () => {
            this.exportToCSS();
        });
    }

    generatePalette() {
        const colorCount = parseInt(this.colorCountSlider.value);
        const paletteType = this.paletteType.value;

        switch (paletteType) {
            case 'random':
                this.currentPalette = this.generateRandomColors(colorCount);
                break;
            case 'monochromatic':
                this.currentPalette = this.generateMonochromaticPalette(colorCount);
                break;
            case 'complementary':
                this.currentPalette = this.generateComplementaryPalette(colorCount);
                break;
            case 'triadic':
                this.currentPalette = this.generateTriadicPalette(colorCount);
                break;
            case 'analogous':
                this.currentPalette = this.generateAnalogousPalette(colorCount);
                break;
        }

        this.renderPalette();
        this.updatePreview();
    }

    generateRandomPalette() {
        this.generatePalette();
    }

    generateRandomColors(count) {
        const colors = [];
        for (let i = 0; i < count; i++) {
            colors.push(this.randomColor());
        }
        return colors;
    }

    generateMonochromaticPalette(count) {
        const baseHue = Math.random() * 360;
        const colors = [];
        
        for (let i = 0; i < count; i++) {
            const saturation = 30 + (i * 15);
            const lightness = 20 + (i * 15);
            colors.push(this.hslToHex(baseHue, saturation, lightness));
        }
        
        return colors;
    }

    generateComplementaryPalette(count) {
        const baseHue = Math.random() * 360;
        const complementaryHue = (baseHue + 180) % 360;
        const colors = [];
        
        const hues = [baseHue, complementaryHue];
        
        for (let i = 0; i < count; i++) {
            const hue = hues[i % 2];
            const saturation = 40 + (Math.random() * 40);
            const lightness = 30 + (Math.random() * 40);
            colors.push(this.hslToHex(hue, saturation, lightness));
        }
        
        return colors;
    }

    generateTriadicPalette(count) {
        const baseHue = Math.random() * 360;
        const colors = [];
        
        for (let i = 0; i < count; i++) {
            const hue = (baseHue + (i * 120)) % 360;
            const saturation = 50 + (Math.random() * 30);
            const lightness = 40 + (Math.random() * 30);
            colors.push(this.hslToHex(hue, saturation, lightness));
        }
        
        return colors;
    }

    generateAnalogousPalette(count) {
        const baseHue = Math.random() * 360;
        const colors = [];
        
        for (let i = 0; i < count; i++) {
            const hue = (baseHue + (i * 30)) % 360;
            const saturation = 60 + (Math.random() * 20);
            const lightness = 35 + (Math.random() * 30);
            colors.push(this.hslToHex(hue, saturation, lightness));
        }
        
        return colors;
    }

    randomColor() {
        const r = Math.floor(Math.random() * 256);
        const g = Math.floor(Math.random() * 256);
        const b = Math.floor(Math.random() * 256);
        return this.rgbToHex(r, g, b);
    }

    rgbToHex(r, g, b) {
        return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
    }

    hslToHex(h, s, l) {
        h = h / 360;
        s = s / 100;
        l = l / 100;

        const hue2rgb = (p, q, t) => {
            if (t < 0) t += 1;
            if (t > 1) t -= 1;
            if (t < 1/6) return p + (q - p) * 6 * t;
            if (t < 1/2) return q;
            if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
            return p;
        };

        let r, g, b;

        if (s === 0) {
            r = g = b = l;
        } else {
            const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
            const p = 2 * l - q;
            r = hue2rgb(p, q, h + 1/3);
            g = hue2rgb(p, q, h);
            b = hue2rgb(p, q, h - 1/3);
        }

        return this.rgbToHex(Math.round(r * 255), Math.round(g * 255), Math.round(b * 255));
    }

    hexToRgb(hex) {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
        } : null;
    }

    hexToHsl(hex) {
        const rgb = this.hexToRgb(hex);
        if (!rgb) return null;

        const r = rgb.r / 255;
        const g = rgb.g / 255;
        const b = rgb.b / 255;

        const max = Math.max(r, g, b);
        const min = Math.min(r, g, b);
        let h, s, l = (max + min) / 2;

        if (max === min) {
            h = s = 0;
        } else {
            const d = max - min;
            s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
            switch (max) {
                case r: h = (g - b) / d + (g < b ? 6 : 0); break;
                case g: h = (b - r) / d + 2; break;
                case b: h = (r - g) / d + 4; break;
            }
            h /= 6;
        }

        return {
            h: Math.round(h * 360),
            s: Math.round(s * 100),
            l: Math.round(l * 100)
        };
    }

    renderPalette() {
        this.colorPalette.innerHTML = '';
        
        this.currentPalette.forEach((color, index) => {
            const swatch = document.createElement('div');
            swatch.className = 'color-swatch';
            swatch.style.backgroundColor = color;
            swatch.dataset.color = color;
            swatch.dataset.index = index;
            
            const colorCode = document.createElement('div');
            colorCode.className = 'color-code';
            colorCode.textContent = color.toUpperCase();
            swatch.appendChild(colorCode);
            
            swatch.addEventListener('click', () => {
                this.selectColor(color, swatch);
            });
            
            this.colorPalette.appendChild(swatch);
        });

        if (this.currentPalette.length > 0) {
            this.selectColor(this.currentPalette[0], this.colorPalette.firstChild);
        }
    }

    selectColor(color, swatch) {
        document.querySelectorAll('.color-swatch').forEach(s => s.classList.remove('active'));
        swatch.classList.add('active');
        
        this.selectedColor = color;
        this.updateColorInfo(color);
    }

    updateColorInfo(color) {
        const rgb = this.hexToRgb(color);
        const hsl = this.hexToHsl(color);
        
        document.getElementById('hexValue').textContent = color.toUpperCase();
        document.getElementById('rgbValue').textContent = `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`;
        document.getElementById('hslValue').textContent = `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`;
    }

    updatePreview() {
        if (this.currentPalette.length === 0) return;
        
        const primaryColor = this.currentPalette[0];
        const secondaryColor = this.currentPalette[1] || this.currentPalette[0];
        const accentColor = this.currentPalette[2] || this.currentPalette[0];
        
        this.previewHeader.style.backgroundColor = primaryColor;
        this.previewBtn.style.backgroundColor = secondaryColor;
        this.previewBtn.style.borderColor = secondaryColor;
    }

    saveCurrentPalette() {
        const paletteName = prompt('Enter a name for this palette:');
        if (!paletteName) return;
        
        const palette = {
            id: Date.now(),
            name: paletteName,
            colors: [...this.currentPalette],
            createdAt: new Date().toISOString()
        };
        
        this.savedPalettes.push(palette);
        localStorage.setItem('savedPalettes', JSON.stringify(this.savedPalettes));
        this.loadSavedPalettes();
        this.showToast('Palette saved successfully!');
    }

    loadSavedPalettes() {
        this.savedPalettesList.innerHTML = '';
        
        if (this.savedPalettes.length === 0) {
            this.savedPalettesList.innerHTML = '<p style="text-align: center; color: #666; padding: 20px;">No saved palettes yet. Create and save your first palette!</p>';
            return;
        }
        
        this.savedPalettes.forEach(palette => {
            const paletteItem = document.createElement('div');
            paletteItem.className = 'saved-palette-item';
            
            const colorsDiv = document.createElement('div');
            colorsDiv.className = 'saved-palette-colors';
            
            palette.colors.forEach(color => {
                const colorDiv = document.createElement('div');
                colorDiv.className = 'saved-palette-color';
                colorDiv.style.backgroundColor = color;
                colorsDiv.appendChild(colorDiv);
            });
            
            const nameDiv = document.createElement('div');
            nameDiv.className = 'saved-palette-name';
            nameDiv.textContent = palette.name;
            
            paletteItem.appendChild(colorsDiv);
            paletteItem.appendChild(nameDiv);
            
            paletteItem.addEventListener('click', () => {
                this.loadPalette(palette);
            });
            
            this.savedPalettesList.appendChild(paletteItem);
        });
    }

    loadPalette(palette) {
        this.currentPalette = [...palette.colors];
        this.colorCountSlider.value = palette.colors.length;
        this.colorCountValue.textContent = palette.colors.length;
        this.renderPalette();
        this.updatePreview();
        this.showToast(`Loaded palette: ${palette.name}`);
    }

    exportToCSS() {
        if (this.currentPalette.length === 0) {
            this.showToast('No palette to export!');
            return;
        }
        
        let css = `/* Color Palette - Generated on ${new Date().toLocaleDateString()} */\n\n`;
        css += `:root {\n`;
        
        this.currentPalette.forEach((color, index) => {
            css += `  --color-${index + 1}: ${color};\n`;
        });
        
        css += `}\n\n`;
        css += `/* Usage Examples */\n`;
        css += `.primary-color { color: var(--color-1); }\n`;
        css += `.secondary-color { color: var(--color-2); }\n`;
        css += `.background-primary { background-color: var(--color-1); }\n`;
        css += `.background-secondary { background-color: var(--color-2); }\n`;
        
        const blob = new Blob([css], { type: 'text/css' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `color-palette-${Date.now()}.css`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        this.showToast('CSS file exported successfully!');
    }

    showToast(message) {
        this.toastMessage.textContent = message;
        this.toast.classList.add('show');
        
        setTimeout(() => {
            this.toast.classList.remove('show');
        }, 3000);
    }
}

// Global function for copy buttons
function copyToClipboard(type) {
    let text = '';
    
    switch (type) {
        case 'hex':
            text = document.getElementById('hexValue').textContent;
            break;
        case 'rgb':
            text = document.getElementById('rgbValue').textContent;
            break;
        case 'hsl':
            text = document.getElementById('hslValue').textContent;
            break;
    }
    
    navigator.clipboard.writeText(text).then(() => {
        const generator = window.colorPaletteGenerator;
        generator.showToast(`${type.toUpperCase()} copied to clipboard!`);
    }).catch(err => {
        console.error('Failed to copy: ', err);
    });
}

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    window.colorPaletteGenerator = new ColorPaletteGenerator();
});
