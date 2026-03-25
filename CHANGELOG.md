# Changelog

This changelog tracks notable repository changes. Add new entries to the topmost version section unless the package version is explicitly bumped.

## Unreleased

### Added

- Test coverage confirmations for editor sizing/preview parity, preset persistence/versioned storage, and export engine surface; minor test adjustments where needed.
- A shared social-card framework with reusable template metadata, normalized draft/preset contracts, and a `chart-core`-backed chart-caption renderer for constrained publishing cards.
- A repo-native `create_announcement_asset` skill for turning branch or cycle changes into saved Social Card Toolkit announcement presets plus PR-ready artifact notes.
- A tracked `arc_warden` consistency-verifier agent profile and review guidance for checking sibling toolkits when shared UX patterns change.

### Changed

- Motion Toolkit typography now scales relative to the active output preset dimensions, improving headline/body fill in square and portrait compositions while keeping 16:9 as the baseline reference.
- Social Card Toolkit is now a live suite route in the launcher and uses the shared `BrandedHeader` / `EditorShell` / `PreviewSurface` shell with grouped controls, named output presets, and the shipped MVP template pack.
- Social Card Toolkit now opens with a seeded Dioscuri Agent Team launch announcement preset, uses Gengar/Kirby-aligned palette defaults for that card, and keeps named preset saves deduped by preset title during dogfooding.
- Refreshed `ROADMAP.md` for the `2026-03-21` Social Publishing cycle, correcting committed-`main` status for shipped dataviz/docs issues and sequencing `#37`, `#6`, and `#28`-`#31` as the next Cycle Mode stream.
- Tightened cycle guidance so `bounty_hunter` acts as a required reviewer gate for checkpoint regression validation before screenshot capture and review-ready handoff.
- Updated deferred roadmap memory so issue `#6` is no longer parked as an indefinite next idea and instead keeps only the remaining typography-scaling policy question until the active cycle settles it.
- Refreshed `ROADMAP.md` for the `2026-03-19` Design Team cycle, including Cycle Mode branch/checkpoint planning for `#37`, `#38`, and `#33`, explicit `Input`/`Reason`/`Expected Outputs` review fields, and `CODEX` label expectations for reviewed issues.
- Updated roadmap memory and workflow learnings to keep issue `#6` deferred through the shared preset decision in `#37` and to record the new Design Team cycle kickoff pattern.
- Refreshed `README.md`, design decisions, and feature registry notes so the documented suite routes, shared package boundaries, shell contracts, and roadmap ownership match the current repo architecture.
- Tracked sub-agent invocations renamed to unique DOTA hero names: explorer→slardar, design_guardian→omniknight, frontend_architect→tinker, chart_engine→kunkka, export_engine→gyrocopter, browser_debugger→bounty_hunter, browser_screenshot→sniper, openai_docs_researcher→oracle, docs_writer→clinkz. Updated `.codex/config.toml`, skills, roadmap, and workflow docs accordingly.
- Updated contributor guidance and tests to reference `sniper` for screenshot evidence and `bounty_hunter` for interactive browser debugging.
- Review guidance now explicitly requires cross-toolkit parity checks when a shared suite interaction pattern changes in one tool.

### Fixed

- Social Card Toolkit now follows the shared single-active accordion behavior, keeping only one section in focus and routing long controls through active-pane scrolling.
- Data Visualization Toolkit now uses the same single-active accordion behavior as Motion Toolkit, keeping the active section open, removing sibling collapsed pills, and moving scrolling into the active section.

### Fixed

- Shared select controls and the Social Card Toolkit's local text inputs now emit stable `id` / `name` attributes, removing the browser QA form-field warning from the new publishing flow.

## Version 0.1.0

### Added

- Repo skill `export_session_transcript` with a supporting script to fetch Codex JSONL transcripts by thread ID and copy them to a destination (e.g., `~/Desktop/Dioscuri`) for audit/review
- A tracked `openai_docs_researcher` Codex agent that uses the OpenAI developer docs MCP server for authoritative OpenAI, Codex, and MCP guidance
- A shared-shell Data Visualization Toolkit route with guided data mapping, saveable dataviz presets, annotation fields, and output-preset-driven SVG/PNG export
- Dataviz validation helpers for multi-series and scatter-chart mapping requirements
- A shared collapsible control-section primitive for dropdown-style editor panes
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
- A shared `packages/config-schema` source of truth for toolkit and document schemas
- A shared `packages/export-engine` source of truth for export sizing and canvas/video export helpers
- A dedicated `apps/motion-toolkit` app entry with toolkit routing under `/motion-toolkit/editor`
- Shared preset storage helpers with version-aware motion preset persistence
- A shared output preset catalog for social, LinkedIn, video, and PDF deliverables
- Shared editor-shell primitives and palette-grid groundwork for toolkit layout standardization
- Refined workflow skills, cycle-branch guidance, and tracked agent definitions from Cycle 1 delivery learnings

### Changed

- Codex now prefers the global `chrome-devtools` MCP server for both `browser_debugger` and `browser_screenshot` when it is configured, keeping browser QA on a deterministic DevTools path
- The tracked `browser_debugger` and `browser_screenshot` agents now carry project-scoped Chrome DevTools MCP wiring so browser tooling is available directly through the agent configs
- The Data Visualization Toolkit now uses dropdown edit panes, standard 4:5/16:9/1:1 output presets, editable palette overrides, always-on cartesian axes, legend placement under the subheadline, fitted header copy, and a centered Big Number layout
- Skill guidance and tracked agent profiles now treat maintainer review notes as structured QA input and require immediate screenshot skip reasons when capture tooling is blocked
- The root landing page now renders a suite launcher from shared registry data instead of redirecting directly into the motion editor
- Added package path aliases and Next.js tracing support needed for the shared launcher contract
- Introduced test-oriented motion helpers without changing editor behavior
- Branch naming, PR templates, and skills now capture debugging steps, issue updates, and workflow reflection requirements
- Frontend workflow guidance now treats browser screenshots as soft-required PR-prep artifacts when tooling is available
- Build and lint validation now run non-interactively through repo-owned config
- PR workflow guidance now asks for screenshot artifact paths, capture method, and what each screenshot proves for both browser-facing and terminal/app workflow fixes
- `agent/memory/roadmap.md` now stays focused on deferred or unresolved ideas while the root roadmap tracks scheduled delivery work
- `src/lib/theme/colors.ts` and `src/lib/theme/typography.ts` now act as compatibility re-exports over the shared design-token package
- `src/lib/types/document.ts` now acts as a compatibility re-export over the shared config-schema package
- `src/lib/render/renderSizing.ts`, `src/lib/render/captureFrame.ts`, and `src/lib/render/exportVideo.ts` now act as compatibility re-exports over the shared export-engine package
- The launcher now points Motion Toolkit to `/motion-toolkit/editor` while `/editor` remains a compatibility redirect
- Motion preset persistence now runs through shared version-aware storage helpers in `packages/studio-shell`
- Shared named output presets now live in `packages/studio-shell` as the foundation for later selector adoption
- Motion Toolkit now adopts shared editor-shell primitives while palette-grid groundwork is available for later palette-first control adoption
- Live preview now renders into a fixed viewport (left pane) with internal scale/centering; 100% zoom no longer resizes the pane
- Skill contracts, workflow memory, and tracked agent descriptions now spell out branch modes, delegation evidence, and checkpoint-slice expectations more explicitly

### Fixed

- Motion Toolkit now focuses one accordion section at a time so long control groups use the full controls pane with internal scrolling instead of squeezing the preview pane or wasting space on inactive section pills
- Motion Toolkit preview now opens in a static fitted state, starts playback only after an explicit Play action, and no longer uses misleading zoom controls that imply startup re-fitting behavior
- Editor shell grid columns now compile by scanning `apps/` and `packages/` in Tailwind, preventing the controls pane from dropping below the preview and eliminating the initial growing/snap effect on load
- Motion Toolkit shell now keeps preview and controls in a side-by-side split from `md` upward instead of dropping the controls pane below the preview until `lg`
- Codex startup now resolves tracked sub-agent profiles relative to `.codex/config.toml`, so launching from the repo correctly finds the top-level `agents/` files
- Preview rendering now uses the same logical composition dimensions as export, eliminating layout mismatches like overflowing preview text that exported correctly
- Centered and bottom-anchored typography is now positioned from measured text-block height instead of fixed offsets, keeping live preview placement representative for large headlines
- Center-left and center-right anchors now respect their horizontal safe margins instead of centering text off the working area
- Switching through the Background Only layout preset no longer deletes typography content, while still hiding text output for that preset

### Removed

- N/A
