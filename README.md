# Dioscuri Brand Toolkit Suite

Browser-based internal platform for creating branded motion scenes, editorial data visualizations, and constrained social card assets from shared brand primitives.

## Suite Apps

- `/` platform launcher
- `/motion-toolkit/editor` motion scene editor
- `/dataviz-toolkit` structured chart generator
- `/social-card-toolkit` constrained social card generator

## Stack

- Next.js App Router
- React + TypeScript
- Tailwind CSS
- Zustand
- Canvas 2D rendering pipeline for motion scenes
- SVG-first rendering for dataviz and social card exports

## Repository layout

```text
apps/
  motion-toolkit/
  dataviz-toolkit/
  social-card-toolkit/
packages/
  chart-core/
  config-schema/
  design-tokens/
  export-engine/
  motion-core/
  studio-shell/
  ui/
```

## Getting started

1. Install dependencies:

```bash
npm install
```

2. Start the app:

```bash
npm run dev
```

3. Open `http://localhost:3000/`
4. Use `http://localhost:3000/motion-toolkit/editor` for the dedicated motion app entry.

## Notes

- Motion presets, dataviz presets, and social card presets are stored locally in `localStorage`.
- Motion export supports PNG and WEBM through the existing canvas-first pipeline.
- Dataviz and social card exports support SVG and PNG in-browser.
- Shared theme, schema, and export contracts live under `packages/`.
- The legacy `/editor` route remains as a compatibility redirect to `/motion-toolkit/editor`.

## Codex Multi-Agent Workflow

- Repo workflow skills, templates, and memory live under `agent/`.
- Tracked Codex runtime delegation lives in `.codex/config.toml` and `agents/`.
- Role definitions and delegation order live in `skills.md`.
- For frontend-affecting work, run a browser visual-validation pass before PR prep when browser tooling is available.
- Screenshot artifacts should stay in temp or other local paths and be summarized in PR notes rather than committed by default.
