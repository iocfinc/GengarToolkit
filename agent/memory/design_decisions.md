# Design Decisions

## Product North Star

- Gengar Toolkit serves data scientists and data analysts who need fast, repeatable editorial assets for sharing data findings.
- The core jobs are data finding posters, article or report cover pages, chart-led social cards, and presentation-ready covers for research and executive storytelling.
- The product portfolio should stay anchored to data-story publishing and reusable brand/template infrastructure. Ideas outside that lane belong in `agent/memory/roadmap.md` until a maintainer approves a tighter fit.
- Template-driven procedural generation is the preferred creation model. New tools should pull from named templates with explicit slots, grid constraints, material rules, palette rules, typography rules, and output presets.
- Open-ended interpretive generation is treated as a risk unless it is constrained by reusable templates and deterministic validation.

## Visual Cohesion

- The launcher and every toolkit route must look like one suite, not separate prototypes.
- Shared shell, navigation, preview, form, palette, typography, output preset, and export controls should come from `packages/studio-shell`, `packages/ui`, `packages/design-tokens`, `packages/config-schema`, and `packages/export-engine`.
- Toolkit-local hamburgers, dropdown systems, text inputs, palette controls, cards, and export selectors are exceptions that need a recorded product reason and cleanup path.
- `omniknight` owns Designer review until a dedicated designer-authored template framework lands. That review covers templates, grids, materials, palettes, typography, spacing, and route-to-route visual cohesion.

## Rendering Stack

- The editor uses a canvas-first rendering pipeline instead of Three.js to keep export behavior predictable and the runtime simpler.

## State Management

- The editor state is managed through a single Zustand store in `src/lib/store/editorStore.ts`.

## Export Strategy

- PNG and WEBM exports are performed in-browser to avoid backend rendering infrastructure.

## Editor Interaction Model

- Shared editor shells keep the preview pane fixed to the viewport while the controls pane owns overflow and scrolling.
- Motion Toolkit opens with a static fitted preview; animation only starts after an explicit Play action.
- Long control groups in suite editor toolkits use a single-active accordion model so one section can fill the controls pane without leaving collapsed-pill artifacts behind.

## Suite Architecture

- The repository now exposes a Brand Toolkit Suite with toolkit-specific entry points rather than a single top-level editor landing page.
- Shared contracts are introduced through `apps/` and `packages/` boundaries first, while the existing motion editor remains behaviorally stable at `/motion-toolkit/editor`.
- New toolkits use shared package contracts for themes, schema, chart/export logic, and shell UI before any deeper package manager or multi-runtime workspace split.
- `packages/studio-shell` is the shared home for launcher, branded shell, preview behavior, preset storage, and named output preset contracts.
- `packages/ui` is the preferred reuse layer for controls and layout primitives; toolkit-local UI should be the exception rather than the default.
- Root `ROADMAP.md` is the source of truth for scheduled delivery sequencing, while `agent/memory/roadmap.md` remains the holding area for valid but unresolved feature ideas.

## Agent Layer

- The agent operating layer is repository-native, GitHub-integrated, and documented in-tree rather than delegated to an external AI orchestration service.
- Codex runtime delegation is tracked separately from repo workflow skills: `.codex/` and `agents/` define sub-agent runtime profiles, while `agent/` retains workflow instructions, templates, and memory.
- Frontend-affecting work should include a soft-required browser screenshot pass for PR preparation when browser tooling is available.
- Chrome DevTools MCP is the preferred browser-debug and screenshot backend when it is configured.
- Under-specified but promising features are recorded in `agent/memory/roadmap.md` instead of being implemented speculatively.
- The default delivery model remains one issue per branch and per PR, but maintainers may opt into a shared Cycle Mode branch with one checkpoint commit per issue when the delivery stream is tightly related.
- Maintainer-approved combined PRs are allowed as narrow exceptions when product and workflow domains are separated into distinct commits and the exception is documented in the PR notes.
