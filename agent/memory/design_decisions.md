# Design Decisions

## Rendering Stack

- The editor uses a canvas-first rendering pipeline instead of Three.js to keep export behavior predictable and the runtime simpler.

## State Management

- The editor state is managed through a single Zustand store in `src/lib/store/editorStore.ts`.

## Export Strategy

- PNG and WEBM exports are performed in-browser to avoid backend rendering infrastructure.

## Agent Layer

- The agent operating layer is repository-native, GitHub-integrated, and documented in-tree rather than delegated to an external AI orchestration service.
- Codex runtime delegation is tracked separately from repo workflow skills: `.codex/` and `agents/` define sub-agent runtime profiles, while `agent/` retains workflow instructions, templates, and memory.
- Frontend-affecting work should include a soft-required browser screenshot pass for PR preparation when browser tooling is available.
- Under-specified but promising features are recorded in `agent/memory/roadmap.md` instead of being implemented speculatively.
