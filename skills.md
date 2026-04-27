# Codex Multi-Agent Skills

This repository uses two related layers:

- `agent/` contains the repo-native workflow skills, templates, memory, and GitHub operating notes.
- `agents/` contains tracked Codex runtime profiles for bounded sub-agent delegation during non-trivial work.

Use the lead product engineer flow in the main thread to keep planning, sequencing, and final integration in one place. Delegate bounded work to the sub-agents below instead of mixing repo exploration, implementation, QA, and docs in a single pass.

## Delegation Order

### Shared foundation or package extraction

1. `slardar`
2. relevant implementation agent such as `tinker` or `gyrocopter`
3. `omniknight` when tokens, palettes, or shared shell conventions move
4. `clinkz`

### New feature

1. `slardar`
2. `omniknight` when UI, token usage, templates, grids, materials, palettes, typography, or product cohesion changes
3. `tinker` or `kunkka`
4. `gyrocopter` when render or export behavior changes
5. `bounty_hunter`
6. `sniper` for frontend-affecting validation artifacts
7. `oracle` when the feature depends on current OpenAI, Codex, or MCP documentation
8. `clinkz`

### Bug fix

1. `slardar`
2. `omniknight` when the fix is driven by visual QA, spacing, palette, typography, or layout review notes
3. `bounty_hunter` when the flow is UI-facing
4. `arc_warden` when the fix touches a shared toolkit pattern that may have drifted elsewhere
5. relevant implementation agent
6. `sniper` when the fix changes visible behavior
7. `oracle` when the fix depends on current OpenAI, Codex, or MCP documentation
8. `clinkz` only when workflow or contributor guidance changes

## Role Contracts

Note on role rename (DOTA motif):

- explorer → slardar
- design_guardian → omniknight
- frontend_architect → tinker
- chart_engine → kunkka
- export_engine → gyrocopter
- browser_debugger → bounty_hunter
- browser_screenshot → sniper
- consistency_verifier → arc_warden
- openai_docs_researcher → oracle
- docs_writer → clinkz

### `slardar`

Read-only repo explorer. Inspect architecture seams, reusable modules, and the smallest safe change set before any edits.

### `omniknight`

Protect the Designer framework for shared templates, grids, materials, tokens, typography, spacing, palette behavior, and reusable styling patterns. Flag one-off visual decisions early, and require toolkit pages to reuse or extend shared shell/UI primitives before accepting local variants.

Expected review shape:

- confirm the work serves data-story publishing, cover/poster generation, chart-led communication, or reusable brand/template infrastructure
- identify which shared template, shell, control, palette, typography, and output-preset modules are reused or extended
- reject toolkit-local hamburgers, dropdown systems, text inputs, color controls, cards, or export selectors when a shared primitive exists
- return the narrowest shared package update needed when visual cohesion is blocked by missing primitives
- record explicit exceptions with owner, reason, affected routes, and follow-up cleanup path

### `tinker`

Implement shell, routing, shared UI, and feature architecture changes without widening scope or blurring module boundaries.

### `kunkka`

Handle chart templates, data contracts, responsive scene behavior, and template-slot constraints for supported aspect ratios.

### `gyrocopter`

Own deterministic export behavior, render parity, and motion-capable scene contracts without introducing unnecessary animation work.

### `bounty_hunter`

Run the app, reproduce frontend bugs, inspect console and layout failures, and report the smallest likely fix.

Preferred debug backend:

- Use Chrome DevTools MCP first when it is configured and reachable.
- Fall back to browser-native tooling only when Chrome MCP is unavailable, and return a concrete skip reason if neither path works.

### `sniper`

Use browser-native tooling first, including Chrome MCP when available. Start the app when needed, open the changed flows, capture screenshots for the relevant feature states, flag obvious layout, overflow, styling, console, or interaction regressions, and return artifact paths plus a short visual QA summary for PR-ready validation evidence.

Fallback behavior:

- Prefer Chrome MCP or another browser-native capture path.
- Fall back to the existing screenshot skill only when browser-native capture is unavailable.
- Treat screenshot capture as soft-required for frontend-affecting work. If the environment cannot access browser tooling, record the skip reason in the PR notes instead of blocking the branch.
- If capture is blocked, interrupted, or times out, return a concrete skip reason immediately instead of waiting indefinitely.
- For terminal, desktop-app, or agent-workflow fixes, capture equivalent terminal/app evidence with the screenshot skill and reference the artifact path in the PR notes.
- Store captures in temp or other local artifacts; do not commit screenshots to the repo by default unless the task explicitly asks for a durable docs asset.

### `arc_warden`

Run cross-toolkit parity checks when a shared shell, editor control pattern, or reusable interaction contract changes in one toolkit.

Expected review shape:

- identify sibling toolkits that should share the behavior
- compare the touched pattern against those siblings
- return mismatches, risks, and the narrowest fix surface
- point to tests or workflow checks that should lock parity in place

### Template and Portfolio Gate

Before implementation, feature plans must answer:

- Which target user workflow does this serve: data finding poster, article cover, chart-led card, presentation cover page, or reusable template infrastructure?
- Which named template, grid, material, palette, typography, and output preset contract does it use or extend?
- Which shared modules in `packages/studio-shell`, `packages/ui`, `packages/design-tokens`, `packages/config-schema`, or `packages/export-engine` are touched?
- Which launcher and toolkit routes need visual comparison for cohesion?
- Which attractive but off-direction requests should move to `agent/memory/roadmap.md` instead of entering the implementation branch?

### `oracle`

Use this agent when a change depends on current OpenAI, Codex, or MCP behavior and the repo should rely on official developer docs rather than memory.

Preferred docs backend:

- Use the OpenAI developer docs MCP server first.
- Return concrete doc URLs and call out when the docs do not fully answer the question.

### `clinkz`

Update only the contributor-facing docs that changed. Keep extension notes concise, practical, and aligned with the current workflow.

## Working Agreement

- Keep the main thread focused on orchestration and decisions.
- Use `AGENTS.md` and `agent/skills/*.md` for repo workflow rules.
- Use `.codex/config.toml` and `agents/*.toml` for Codex runtime delegation.
- When a sub-agent is used, invoke the tracked profile explicitly and record which profile ran plus what bounded task it covered.
- Prefer `codex exec -p <profile>` over ad-hoc prompts like “act as the slardar sub-agent” so delegation is auditable in the session trail.
- Record delegation evidence for non-trivial work: profile used, expected output, returned output, and any skip reason.
- Ask each tracked profile to return changed files or inspected files, key risks, suggested tests, and artifact paths when UI evidence is expected.
- If a tracked sub-agent is skipped for a non-trivial task, note the skip reason in the main thread instead of silently collapsing everything into one pass.
- When a maintainer supplies manual UI review notes, treat them as explicit QA input, route them through `omniknight` before implementation, and convert the accepted fixes into regression tests where feasible.
- When a shared UX pattern changes in one toolkit, route a parity pass through `arc_warden` before final review so sibling toolkits are checked deliberately instead of by memory.
- For backlog or issue-driven work in a dirty tree, compare the candidate issue against `HEAD` before assuming local WIP counts as issue progress.
- Treat committed `HEAD` as the delivery baseline; do not count uncommitted local work as shipped progress.
- Default to Issue Mode for branching. Only use Cycle Mode when the maintainer explicitly requests a shared branch with checkpoint commits per issue.
- If a maintainer explicitly requests one combined PR, keep commit boundaries explicit by domain and document the exception in the PR notes.
- For frontend-affecting work, include a visual validation pass and mention artifact paths, capture method, what the screenshot proves, or skip reasons in the PR notes.
