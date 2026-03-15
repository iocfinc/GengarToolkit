# Codex Multi-Agent Skills

This repository uses two related layers:

- `agent/` contains the repo-native workflow skills, templates, memory, and GitHub operating notes.
- `agents/` contains tracked Codex runtime profiles for bounded sub-agent delegation during non-trivial work.

Use the lead product engineer flow in the main thread to keep planning, sequencing, and final integration in one place. Delegate bounded work to the sub-agents below instead of mixing repo exploration, implementation, QA, and docs in a single pass.

## Delegation Order

### New feature

1. `explorer`
2. `design_guardian` when UI or token usage changes
3. `frontend_architect` or `chart_engine`
4. `export_engine` when render or export behavior changes
5. `browser_debugger`
6. `browser_screenshot` for frontend-affecting validation artifacts
7. `docs_writer`

### Bug fix

1. `explorer`
2. `browser_debugger` when the flow is UI-facing
3. relevant implementation agent
4. `browser_screenshot` when the fix changes visible behavior
5. `docs_writer` only when workflow or contributor guidance changes

## Role Contracts

### `explorer`

Read-only repo explorer. Inspect architecture seams, reusable modules, and the smallest safe change set before any edits.

### `design_guardian`

Protect shared tokens, typography, spacing, and reusable styling patterns. Flag one-off visual decisions early.

### `frontend_architect`

Implement shell, routing, shared UI, and feature architecture changes without widening scope or blurring module boundaries.

### `chart_engine`

Handle chart templates, data contracts, and responsive scene behavior for supported aspect ratios.

### `export_engine`

Own deterministic export behavior, render parity, and motion-capable scene contracts without introducing unnecessary animation work.

### `browser_debugger`

Run the app, reproduce frontend bugs, inspect console and layout failures, and report the smallest likely fix.

### `browser_screenshot`

Use browser-native tooling first, including Chrome MCP when available. Start the app when needed, open the changed flows, capture screenshots for the relevant feature states, flag obvious layout, overflow, styling, console, or interaction regressions, and return artifact paths plus a short visual QA summary for PR-ready validation evidence.

Fallback behavior:

- Prefer Chrome MCP or another browser-native capture path.
- Fall back to the existing screenshot skill only when browser-native capture is unavailable.
- Treat screenshot capture as soft-required for frontend-affecting work. If the environment cannot access browser tooling, record the skip reason in the PR notes instead of blocking the branch.
- For terminal, desktop-app, or agent-workflow fixes, capture equivalent terminal/app evidence with the screenshot skill and reference the artifact path in the PR notes.
- Store captures in temp or other local artifacts; do not commit screenshots to the repo by default unless the task explicitly asks for a durable docs asset.

### `docs_writer`

Update only the contributor-facing docs that changed. Keep extension notes concise, practical, and aligned with the current workflow.

## Working Agreement

- Keep the main thread focused on orchestration and decisions.
- Use `AGENTS.md` and `agent/skills/*.md` for repo workflow rules.
- Use `.codex/config.toml` and `agents/*.toml` for Codex runtime delegation.
- For frontend-affecting work, include a visual validation pass and mention artifact paths, capture method, what the screenshot proves, or skip reasons in the PR notes.
