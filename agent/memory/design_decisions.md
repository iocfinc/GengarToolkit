# Design Decisions

## Rendering Stack

- The editor uses a canvas-first rendering pipeline instead of Three.js to keep export behavior predictable and the runtime simpler.

## State Management

- The editor state is managed through a single Zustand store in `src/lib/store/editorStore.ts`.

## Export Strategy

- PNG and WEBM exports are performed in-browser to avoid backend rendering infrastructure.

## Editor Interaction Model

- Shared editor shells keep the preview pane fixed to the viewport while the controls pane owns overflow and scrolling.
- Motion Toolkit opens with a static fitted preview; animation only starts after an explicit Play action.
- Long control groups in the Motion Toolkit use a single-active accordion model so one section can fill the controls pane without leaving collapsed-pill artifacts behind.

## Suite Architecture

- The repository now exposes a Brand Toolkit Suite with toolkit-specific entry points rather than a single top-level editor landing page.
- Shared contracts are introduced through `apps/` and `packages/` boundaries first, while the existing motion editor remains behaviorally stable at `/motion-toolkit/editor`.
- New toolkits use shared package contracts for themes, schema, chart/export logic, and shell UI before any deeper package manager or multi-runtime workspace split.

## Agent Layer

- The agent operating layer is repository-native, GitHub-integrated, and documented in-tree rather than delegated to an external AI orchestration service.
- Codex runtime delegation is tracked separately from repo workflow skills: `.codex/` and `agents/` define sub-agent runtime profiles, while `agent/` retains workflow instructions, templates, and memory.
- Frontend-affecting work should include a soft-required browser screenshot pass for PR preparation when browser tooling is available.
- Chrome DevTools MCP is the preferred browser-debug and screenshot backend when it is configured.
- Under-specified but promising features are recorded in `agent/memory/roadmap.md` instead of being implemented speculatively.
- The default delivery model remains one issue per branch and per PR, but maintainers may opt into a shared Cycle Mode branch with one checkpoint commit per issue when the delivery stream is tightly related.
- Maintainer-approved combined PRs are allowed as narrow exceptions when product and workflow domains are separated into distinct commits and the exception is documented in the PR notes.
