# 🏃‍♀️ BMI Calculator

A responsive Body Mass Index (BMI) calculator built with HTML, CSS, and JavaScript. This tool helps users calculate their BMI and provides health category feedback based on WHO standards.

![BMI Calculator Preview](preview.png)

## ✨ Features

- **📱 Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- **🔢 Real-time Calculation**: Instant BMI calculation with form submission
- **✅ Input Validation**: Comprehensive validation for height and weight inputs
- **📊 Health Categories**: Clear feedback on BMI categories (Underweight, Normal, Overweight)
- **🎨 Modern UI**: Clean, professional interface with smooth animations
- **♿ Accessible**: Proper form labels and keyboard navigation support

## 🚀 Demo

[Live Demo](https://your-demo-link.com) _(Add your demo link here)_

## 📋 BMI Categories

| BMI Range   | Category    | Health Status             |
| ----------- | ----------- | ------------------------- |
| < 18.6      | Underweight | May indicate malnutrition |
| 18.6 - 24.9 | Normal      | Healthy weight range      |
| > 24.9      | Overweight  | May increase health risks |

## 🛠️ Technologies Used

- **HTML5**: Semantic markup and form structure
- **CSS3**: Modern styling with Flexbox and responsive design
- **JavaScript (ES6+)**: Form validation and BMI calculation logic

## 📁 Project Structure

```
BMI-Calculator/
├── index.html          # Main HTML file
├── style.css           # Stylesheet
├── script.js           # JavaScript logic
├── README.md           # Project documentation
└── preview.png         # Preview image (optional)
```

## 🏁 Getting Started

### Prerequisites

- A modern web browser
- Basic understanding of HTML/CSS/JavaScript (for modifications)

### Installation

1. **Clone or download** the project files
2. **Open `index.html`** in your web browser
3. **Start calculating** your BMI!

### Local Development

```bash
# If you want to serve locally (optional)
cd BMI-Calculator
python -m http.server 8000
# Open http://localhost:8000 in your browser
```

## 💻 Usage

1. **Enter your height** in centimeters (CM)
2. **Enter your weight** in kilograms (KG)
3. **Click "Calculate"** to get your BMI result
4. **View your health category** and BMI value

### Input Guidelines

- **Height**: Enter value between 50-300 cm
- **Weight**: Enter value between 20-500 kg
- Only numeric values are accepted

## 🎨 Customization

### Colors

You can customize the color scheme by modifying the CSS variables:

```css
:root {
  --primary-color: #797978;
  --accent-color: #0772f5;
  --success-color: #06f26c;
  --text-light: #f1f1f1;
}
```

### Responsive Breakpoints

The calculator is responsive with breakpoints at:

- **Mobile**: < 768px
- **Tablet**: 768px - 1024px
- **Desktop**: > 1024px

## 🔧 Technical Details

### BMI Calculation Formula

```javascript
BMI = weight (kg) / (height (m))²
```

### Input Validation

- Checks for empty inputs
- Validates numeric values
- Ensures reasonable ranges for height and weight
- Provides real-time feedback

## 🤝 Contributing

Contributions are welcome! Here are some ways you can help:

1. **🐛 Report bugs** or suggest improvements
2. **✨ Add new features** (metric/imperial toggle, BMI history, etc.)
3. **🎨 Improve the UI/UX** design
4. **📚 Enhance documentation**

### Development Guidelines

- Follow semantic HTML practices
- Use consistent CSS naming conventions
- Comment your JavaScript code
- Test on multiple browsers and devices
- Ensure accessibility compliance

## 📄 License

This project is open source and available under the [MIT License](../LICENSE).

## 🙏 Acknowledgments

- BMI categories based on [WHO guidelines](https://www.who.int/health-topics/obesity)
- Responsive design inspired by modern health applications
- Built for [Hacktoberfest 2025](https://hacktoberfest.digitalocean.com/)

## 📞 Support

If you have any questions or need help:

- 🐛 [Open an issue](https://github.com/hamzawritescode/web-development/issues)
- 💬 [Start a discussion](https://github.com/hamzawritescode/web-development/discussions)

---

**Made with ❤️ for the open source community**
