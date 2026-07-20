# AlgoJudge — Interactive DSA Studio & Algorithm Visualizer

A premium, fully client-side coding interview preparation platform with algorithm visualizers, multi-language code editing, and interactive learning tools.

## Features

- **20 DSA Problems** — Curated from top tech interview banks (Google, Meta, Amazon, Microsoft)
- **Algorithm Visualizer** — Step-through animations for sorting, trees, graphs, linked lists, and more
- **Multi-Language Editor** — Write and test code in Python, JavaScript, C++, and Java
- **Interactive Timeline** — Software engineering lifecycle walkthrough
- **Performance Analytics** — Track your progress, streaks, and category mastery
- **Read & Discuss** — DSA tutorials and community discussion forum
- **Dark & Light Themes** — Premium glassmorphism design with smooth transitions
- **Supreme King Haki Entrance** — Stunning animated intro with synthesized audio

## How to Run

This is a **static website** — no build step or server installation required.

### Option 1: Python (recommended)
```bash
cd AlgoJudge-Site
python -m http.server 8000
```
Then open [http://localhost:8000](http://localhost:8000)

### Option 2: Node.js
```bash
npx serve .
```

### Option 3: VS Code
Install the "Live Server" extension, right-click `index.html`, and select **Open with Live Server**.

### Option 4: Direct file open
Simply double-click `index.html` to open in your browser. (Some features like the matrix canvas may work differently due to CORS restrictions.)

## Demo Login

- **Username:** `demo`
- **Password:** `password123`

Or click **"Sign In as Demo User"** / **"Continue as Guest"** on the login screen.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Structure | HTML5 |
| Styling | Tailwind CSS (CDN) + Custom CSS |
| Logic | Vanilla JavaScript |
| Fonts | Inter + Fira Code (Google Fonts) |
| Icons | Font Awesome 6 |
| Audio | Web Audio API (synthesized) |

## File Structure

```
├── index.html              # Main HTML page (SPA shell)
├── styles.css              # Custom design system & animations
├── app.js                  # Core SPA router & application logic
├── entry.js                # Supreme King Haki entrance animation
├── problems.js             # DSA problem database (20 problems)
├── visualizer.js           # Algorithm visualization engine
├── visualizer_mappings.js  # Line highlight mappings for visualizer
├── read_content.js         # DSA tutorial content
└── README.md               # This file

```

## License

Made with ❤️ by the AlgoJudge Team
