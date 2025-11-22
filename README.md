# TimersOnly

A clean, ad-free collection of minimalist online timers and Pomodoro tools.

## Tech Stack

- **Next.js 16** (App Router)
- **TypeScript**
- **Tailwind CSS**
- **React 19**

## Getting Started

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build

```bash
npm run build
```

### Production

```bash
npm start
```

## Features

- 🎨 Pastel theme system with 5 color options (Peach, Mint, Lavender, Sky, Sand)
- 🔄 Theme persistence via localStorage
- 📱 Responsive design
- ✨ Clean, minimal UI

## Project Structure

```
├── app/
│   ├── layout.tsx      # Root layout with theme provider
│   ├── page.tsx        # Home page
│   └── globals.css     # Global styles
├── components/
│   ├── ThemeProvider.tsx  # Theme context provider
│   └── ThemedBody.tsx     # Client component for themed body
├── lib/
│   └── themes.ts       # Theme definitions
└── ...
```

## Theme System

The app includes a pastel theme system that can be cycled through using the "Switch colour" button in the header. Themes are persisted in localStorage and include:

- **Peach** (default)
- **Mint**
- **Lavender**
- **Sky**
- **Sand**

