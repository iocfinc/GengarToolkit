# Dioscuri Brand Motion Toolkit

Browser-based MVP editor for creating branded stills and subtle looping motion backgrounds from a constrained visual system.

## Stack

- Next.js App Router
- React + TypeScript
- Tailwind CSS
- Zustand
- Canvas 2D rendering pipeline with PNG + WEBM export

## Getting started

1. Install dependencies:

```bash
npm install
```

2. Start the app:

```bash
npm run dev
```

3. Open `http://localhost:3000/editor`

## Notes

- Presets are stored in `localStorage`.
- Static export is PNG.
- Motion export uses in-browser WEBM recording via `MediaRecorder`.
- The render stack uses a canvas-first pipeline instead of Three.js so the MVP can ship faster with simpler export behavior.
