# Changelog

This changelog tracks notable repository changes. Add new entries to the topmost version section unless the package version is explicitly bumped.

## Version 0.1.0

### Added

- Shared studio-shell launcher and typed toolkit registry contract for suite entry-point routing
- Focused launcher coverage for the shared toolkit registry and planned-versus-live card behavior
- Agent operating layer scaffolding under `agent/`
- Codex multi-agent runtime scaffold under `.codex/`, `agents/`, and `skills.md`
- A dedicated `browser_screenshot` sub-agent contract for PR-ready frontend visual QA artifacts
- GitHub workflow and issue/PR templates for agentic development
- Autonomous backlog scan tooling, workflow guidance, and roadmap memory for selecting one validated bug and one validated feature per pull request cycle
- Vitest and React Testing Library scaffolding for store, render, preset, and export coverage
- A reusable issue-comment skill and workflow reflection memory for future issue work
- A root `ROADMAP.md` that sequences open feature issues, handover phases, and tracked multi-agent execution expectations for suite delivery
- A shared `packages/design-tokens` source of truth for brand colors, themes, and typography scales

### Changed

- The root landing page now renders a suite launcher from shared registry data instead of redirecting directly into the motion editor
- Added package path aliases and Next.js tracing support needed for the shared launcher contract
- Introduced test-oriented motion helpers without changing editor behavior
- Branch naming, PR templates, and skills now capture debugging steps, issue updates, and workflow reflection requirements
- Frontend workflow guidance now treats browser screenshots as soft-required PR-prep artifacts when tooling is available
- Build and lint validation now run non-interactively through repo-owned config
- PR workflow guidance now asks for screenshot artifact paths, capture method, and what each screenshot proves for both browser-facing and terminal/app workflow fixes
- `agent/memory/roadmap.md` now stays focused on deferred or unresolved ideas while the root roadmap tracks scheduled delivery work
- `src/lib/theme/colors.ts` and `src/lib/theme/typography.ts` now act as compatibility re-exports over the shared design-token package

### Fixed

- Codex startup now resolves tracked sub-agent profiles relative to `.codex/config.toml`, so launching from the repo correctly finds the top-level `agents/` files
- Preview rendering now uses the same logical composition dimensions as export, eliminating layout mismatches like overflowing preview text that exported correctly
- Centered and bottom-anchored typography is now positioned from measured text-block height instead of fixed offsets, keeping live preview placement representative for large headlines
- Center-left and center-right anchors now respect their horizontal safe margins instead of centering text off the working area
- Switching through the Background Only layout preset no longer deletes typography content, while still hiding text output for that preset

### Removed

- N/A
