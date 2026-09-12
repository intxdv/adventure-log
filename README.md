# 🧭 Adventure Log. — Core Project

> **"A digital field journal where precision engineering meets organic exploration."**  
> Portfolio & Creative Log of **Taki (Selvagant)** — Creative Developer, UI/UX Designer & Mobile Architect.

---

## 🛠️ Tech Stack
- **Framework**: React 18+ & Vite (TypeScript)
- **Design Tokens & Styling**: Pure CSS Architecture (`src/styles/tokens.css`, `src/styles/global.css`, `src/styles/fonts.css`)
- **Typography**: `Lufga` (Editorial Display) & `JetBrains Mono` (Technical Telemetry)
- **Texture**: Custom SVG Paper Grain Noise Overlay (`public/noise.svg`)

---

## 📁 Project Structure
```
adventure-log/
├── public/
│   ├── fonts/           # Local font assets (Lufga & JetBrains Mono)
│   ├── noise.svg        # Tactile paper grain filter
│   └── favicon.svg      # Expedition mark
├── src/
│   ├── assets/          # Static assets & icons
│   ├── components/      # Modular section components
│   │   ├── Preloader.tsx
│   │   ├── Header.tsx
│   │   ├── Hero.tsx
│   │   ├── About.tsx
│   │   ├── SelectedExpeditions.tsx
│   │   ├── FieldArsenal.tsx
│   │   └── Footer.tsx
│   ├── data/            # Structured content (expeditions, arsenal)
│   ├── styles/          # Design tokens & global CSS
│   ├── types/           # TypeScript domain interfaces
│   ├── App.tsx          # Master layout integration
│   └── main.tsx         # Application entrypoint
```

---

## 🚀 Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Start Development Server
```bash
npm run dev
```
Open `http://localhost:5173` to explore the live field journal.

### 3. Production Build
```bash
npm run build
```

### 4. Preview Production Build
```bash
npm run preview
```
