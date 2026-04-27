# Dioscuri Brand Toolkit Suite

Browser-based internal platform for data scientists and analysts creating branded posters, article covers, editorial data visualizations, and constrained social card assets from shared brand primitives.

## Product Direction

- Build for fast data-story publishing: findings posters, article/report covers, chart-led social cards, and presentation-ready cover pages.
- Keep generation template-driven and procedural. New tools should start from named templates with explicit slots, grid constraints, material rules, palette rules, typography rules, and output presets.
- Reuse shared shell, navigation, preview, form, palette, typography, and export primitives across the launcher and every toolkit route.
- Route off-direction ideas into `agent/memory/roadmap.md` until their fit with the data-story publishing portfolio is clear.

## Suite Apps

- `/` platform launcher
- `/motion-toolkit/editor` motion scene editor
- `/dataviz-toolkit` structured chart generator
- `/social-card-toolkit` constrained social card generator

## Architecture Boundaries

- `apps/` holds toolkit-specific app entrypoints and page-level composition.
- `packages/design-tokens` defines shared color, typography, and brand-theme primitives.
- `packages/config-schema` defines shared toolkit and document contracts.
- `packages/export-engine` owns shared sizing and export helpers used by toolkit flows.
- `packages/studio-shell` owns shared launcher, branded header, preview shell, output presets, and preset-storage helpers.
- `packages/ui` holds reusable controls and layout primitives that toolkits should consume before inventing local variants.
- `src/` remains the compatibility and app-integration surface for the current Motion Toolkit while shared packages are adopted incrementally.

## Current Shared Contracts

- Named output presets live in `packages/studio-shell` and cover social, LinkedIn, video, and print/PDF targets.
- The Motion Toolkit remains the compatibility baseline for the suite and is routed through `/motion-toolkit/editor`, while `/editor` continues to redirect there.
- Shared shell behavior uses a fixed preview pane with control-pane-owned overflow and scrolling.
- Dataviz and Social Card Toolkit flows already consume shared package contracts for presets, export, theme, and shell behavior.
- Deferred or under-specified feature ideas belong in `agent/memory/roadmap.md`; scheduled delivery sequencing lives in `ROADMAP.md`.

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
- Active delivery sequencing lives in `ROADMAP.md`; `agent/memory/roadmap.md` is reserved for deferred or unresolved feature ideas.
- For frontend-affecting work, run a browser visual-validation pass before PR prep when browser tooling is available.
- Screenshot artifacts should stay in temp or other local paths and be summarized in PR notes rather than committed by default.
