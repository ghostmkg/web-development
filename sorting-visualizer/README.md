**Contributor:** Munazir151
# 🔢 Sorting Algorithm Visualizer

An interactive, beautiful web-based tool to visualize how different sorting algorithms work in real-time. Built with pure HTML, CSS, and JavaScript in a single file!

![Sorting Visualizer](https://img.shields.io/badge/HTML-CSS-JS-blue)
![Algorithms](https://img.shields.io/badge/Algorithms-5-green)
![License](https://img.shields.io/badge/License-MIT-yellow)

## ✨ Features

- 🎨 **Beautiful Dark Theme UI** with gradient animations
- 🔄 **5 Sorting Algorithms**:
  - Bubble Sort
  - Selection Sort
  - Insertion Sort
  - Quick Sort
  - Merge Sort
- 📊 **Real-time Statistics**:
  - Number of comparisons
  - Number of swaps
  - Time elapsed
  - Current status
- 🎮 **Interactive Controls**:
  - Adjustable array size (10-100 elements)
  - Variable animation speed (1-200ms)
  - Generate random arrays
  - Start/Stop sorting anytime
- 🌈 **Visual Feedback**:
  - Comparing elements (orange)
  - Swapping elements (red)
  - Sorted elements (green)
  - Smooth animations and transitions
- 📱 **Fully Responsive** - works on desktop, tablet, and mobile

## 🚀 How to Use

### Option 1: Open Directly
Simply double-click `index.html` to open it in your default browser.

### Option 2: Local Server
Run a local server for better performance:

**Windows PowerShell:**
```powershell
cd "path\to\sorting-visualizer"
python -m http.server 8080
```

Then open: http://localhost:8080

**Node.js (http-server):**
```powershell
npm install -g http-server
http-server -p 8080
```

## 🎯 Usage Guide

1. **Select Algorithm**: Choose from 5 sorting algorithms using the dropdown
2. **Adjust Array Size**: Use the slider to set array size (10-100)
3. **Set Speed**: Control animation speed with the speed slider
4. **Generate Array**: Click "Generate New Array" for a random unsorted array
5. **Start Sorting**: Click "Start Sorting" to begin visualization
6. **Stop Anytime**: Click "Stop" to halt the sorting process

## 📖 Sorting Algorithms Explained

### Bubble Sort
- **Time Complexity**: O(n²)
- **Description**: Repeatedly swaps adjacent elements if they're in wrong order
- **Best For**: Teaching/understanding sorting basics

### Selection Sort
- **Time Complexity**: O(n²)
- **Description**: Finds minimum element and places it at the beginning
- **Best For**: Small datasets with simple implementation

### Insertion Sort
- **Time Complexity**: O(n²)
- **Description**: Builds final array one item at a time
- **Best For**: Small or nearly sorted datasets

### Quick Sort
- **Time Complexity**: O(n log n) average
- **Description**: Divide-and-conquer algorithm using pivot
- **Best For**: Large datasets, general-purpose sorting

### Merge Sort
- **Time Complexity**: O(n log n)
- **Description**: Divide-and-conquer algorithm with merging
- **Best For**: Large datasets requiring stable sorting

## 🎨 Color Coding

| Color | Meaning |
|-------|---------|
| 🟣 Purple/Blue | Normal unsorted elements |
| 🟠 Orange | Elements being compared |
| 🔴 Red | Elements being swapped |
| 🟢 Green | Sorted elements |

## 🛠️ Technical Details

- **Single File**: Everything in one HTML file (no dependencies!)
- **Pure JavaScript**: No frameworks or libraries needed
- **CSS Animations**: Smooth transitions and visual effects
- **Async/Await**: Non-blocking animations using promises
- **Responsive Design**: Works on all screen sizes

## 📊 Statistics Tracked

- **Comparisons**: Number of times elements are compared
- **Swaps**: Number of element swaps/moves
- **Time Elapsed**: Real-time execution duration
- **Status**: Current state (Ready, Sorting, Sorted, Stopped)

## 🎓 Educational Value

Perfect for:
- 📚 Learning data structures and algorithms
- 👨‍🎓 Teaching sorting concepts visually
- 💻 Understanding algorithm efficiency
- 🎯 Comparing algorithm performance
- 📈 Visualizing Big O notation in action

## 🌟 Features Breakdown

### User Interface
- Modern dark theme with gradient effects
- Smooth fade-in animations
- Hover effects on interactive elements
- Clear visual hierarchy

### Controls
- Intuitive dropdown for algorithm selection
- Range sliders with real-time value display
- Disabled state management during sorting
- Responsive button layout

### Visualization
- Bars scale proportionally to array values
- Visual distinction between different states
- Smooth color transitions
- Final "sorted" animation wave

## 🔧 Customization

You can easily customize the visualizer by editing the CSS variables:

```css
:root {
    --primary: #667eea;      /* Main gradient color */
    --secondary: #764ba2;    /* Secondary gradient color */
    --success: #10b981;      /* Sorted elements color */
    --danger: #ef4444;       /* Swapping elements color */
    --warning: #f59e0b;      /* Comparing elements color */
    --bg: #0f172a;          /* Background color */
    --card: #1e293b;        /* Card background */
}
```

## 💡 Tips

- **Start Small**: Begin with smaller arrays to see algorithms clearly
- **Adjust Speed**: Use slower speeds to understand each step
- **Compare**: Run different algorithms on the same array size
- **Stop & Restart**: Stop mid-sort and generate a new array
- **Mobile Friendly**: Works great on smartphones and tablets

## 🐛 Known Limitations

- Very large arrays (>100) may slow down on older devices
- Animation smoothness depends on browser performance
- Stop button halts but doesn't reverse the sort

## 📱 Browser Compatibility

Works on all modern browsers:
- ✅ Chrome/Edge (recommended)
- ✅ Firefox
- ✅ Safari
- ✅ Opera

## 📄 File Structure

```
sorting-visualizer/
├── index.html          # Single-file application
└── README.md          # This file
```

## 🤝 Contributing

Feel free to:
- Report bugs
- Suggest new algorithms
- Improve UI/UX
- Add new features
- Optimize code

## 📝 License

MIT License - Free to use for learning and teaching!

## 🙏 Acknowledgments

Built with ❤️ for learners and educators worldwide.

---

**Happy Sorting! 🎉**

Start visualizing algorithms and understand how sorting works under the hood!
