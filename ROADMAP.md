# Roadmap

Last updated: 2026-03-21

This roadmap turns open feature issues into a reviewable delivery plan. Use it to sequence feature work, track dependencies, and record the multi-agent execution path for each issue.

`ROADMAP.md` is the shipping plan. `agent/memory/roadmap.md` remains the holding area for valid but deferred or under-specified ideas.

## Sources Of Truth

- Open GitHub issues reviewed on `2026-03-21`: `#6`, `#13`-`#18`, `#20`, `#28`-`#31`, `#33`, `#34`, `#37`
- Closed implementation baseline reviewed on `2026-03-21`: `#21`, `#23`-`#27`, `#32`, `#35`, `#38`
- Previous handover plan: `/tmp/gengartoolkit-next-feature-workplan.md`
- Multi-agent delegation guidance: `skills.md`
- Backlog automation and roadmap routing: `agent/skills/run_backlog_cycle.md`
- Deferred idea intake rules: `agent/memory/roadmap.md`

## Status Legend

- `Planned`: ready to schedule in the current sequence
- `In Progress`: actively being implemented on a branch
- `Blocked`: depends on unfinished upstream work
- `Review`: implementation is ready for PR review
- `Shipped`: merged to the main delivery line
- `Deferred`: valid work, intentionally not scheduled yet
- `Needs Discussion`: keep in issue review or `agent/memory/roadmap.md` until clarified

## Working Rules

- Default to one issue per branch and one issue per pull request.
- Maintainer-directed combined PRs are allowed as narrow exceptions when commit boundaries stay explicit and the PR notes document the exception.
- Use Cycle Mode only when a maintainer explicitly requests one shared delivery branch with checkpoint commits per issue.
- Compare roadmap decisions against committed `HEAD`, not uncommitted local WIP.
- For maintainer-directed cycle prep, record `Input`, `Reason`, `Expected Outputs`, tracked agent handoffs, and `CODEX` label status before implementation starts.
- Apply the `CODEX` label to every open issue reviewed during a Codex-run cycle planning pass, even when the issue stays out of scope for the active branch.
- Update `CHANGELOG.md` for shipped work.
- For frontend-affecting work, capture browser QA artifacts or record a concrete skip reason.
- When work is too broad or unclear, defer it to `agent/memory/roadmap.md` instead of guessing.

## Multi-Agent Delivery Mode

### Default Sequence

1. `slardar`
2. `omniknight` when UI, tokens, or shell behavior changes
3. `tinker`, `kunkka`, or `gyrocopter` depending on the issue
4. `bounty_hunter` for interactive validation
5. `sniper` for PR-ready visual evidence
6. `clinkz` for contributor-facing documentation changes

### Evidence Required Per Feature

- Focused tests for the changed contract or flow
- `bounty_hunter` review notes for regressions, console/layout issues, and checkpoint readiness before a slice is treated as reviewable
- Screenshot artifact paths for frontend-visible changes when browser tooling is available
- Changelog entry
- Issue comment with summary, validation notes, and PR link when work is review-ready

## Active Cycle Prep

### Publishing Team Cycle — 2026-03-21

Goal: turn the shipped preset, shell, and dataviz groundwork on `main` into a reviewable social-publishing cycle, while fixing Motion Toolkit typography sizing through the shared output contract instead of another px-bound one-off.

- `Branch`: `codex/GENGARVIS-016-cycle-social-publishing`
- `Mode`: `Cycle Mode`
- `Baseline`: local `main` matched `origin/main` at `10d7ae1` when this cycle was prepared; uncommitted local workflow-doc edits do not count as shipped progress
- `Reviewer Gate`: `bounty_hunter` is the mandatory checkpoint reviewer for this cycle and must validate regressions before `sniper` capture and review-ready close-out
- `Reality Check`:
  1. Dataviz child issues `#23`-`#27` are already closed and their route is live on `main`
  2. Social Card Toolkit already has a prototype route on `main`, but it still uses toolkit-local sizing and a custom shell instead of the shared launcher/shell contract
  3. Motion typography still renders from raw `headlineSize` and `bodySize` px values instead of a format-relative sizing rule
- `Checkpoint Order`:
  1. `#37` finish named output preset adoption where Motion and Social still rely on toolkit-local size choices
  2. `#6` implement format-relative motion typography scaling on top of the shared preset sizing contract
  3. `#28` align Social Card Toolkit with the shared launcher and editor-shell baseline
  4. `#29` extract the shared social-card template framework
  5. `#30` complete the MVP social-card template pack
  6. `#31` integrate the chart + caption card with `chart-core`
- `Reviewed Issues`: open issues `#6`, `#15`, `#16`, `#28`-`#31`, `#34`, `#37`, plus closed issues `#23`-`#27` and `#38` as committed baseline inputs
- `CODEX Label Policy`: required on every reviewed open issue in this cycle-prep pass

#### In Scope

- `#37` Create shared output preset catalog for social, LinkedIn, and print formats — `In Progress`
  - `Input`: shipped `packages/studio-shell` preset catalog, live dataviz preset selector, Motion Toolkit aspect-ratio/export controls, Social Card Toolkit prototype sizing, and issue `#6`
  - `Reason`: the next social and typography slices need one shared sizing source of truth instead of separate motion/social mappings
  - `Expected Outputs`: Motion and Social consume shared preset IDs or compatibility mappings, preview/export sizing stays aligned, and PDF/image/video preset classes remain explicit
  - `Agents`: `slardar`, `omniknight`, `tinker`, `bounty_hunter`, `sniper`, `clinkz`
  - `Dependencies`: `#20`, `#21`, `#32`, `#38`
  - `Evidence`: preset-selection tests, export-dimension assertions, and screenshot proof of the updated selector states
  - `CODEX Label`: required and applied
  - `Next Step`: checkpoint 1 commit on the cycle branch
- `#6` Adjust Square and 4x5 Text to Size ratio — `Planned`
  - `Input`: current Motion Toolkit typography controls, issue screenshots showing 16:9 versus 4:5 imbalance, and the shared preset/output sizing contract from checkpoint 1
  - `Reason`: the user-facing typography problem is real, but it should land as a shared sizing rule derived from composition size instead of a motion-only cap increase
  - `Expected Outputs`: a format-relative typography-size resolver, preserved preview/export parity, and compatibility behavior for existing saved presets
  - `Agents`: `slardar`, `omniknight`, `tinker`, `bounty_hunter`, `sniper`, `clinkz`
  - `Dependencies`: `#37`, `#38`
  - `Evidence`: typography parity tests across aspect ratios plus screenshot proof comparing 16:9, 4:5, and 1:1 headline scale
  - `CODEX Label`: required and applied
  - `Next Step`: checkpoint 2 commit after preset adoption is stable
- `#28` Bootstrap `apps/social-card-toolkit` with shared shell — `Planned`
  - `Input`: existing Social Card Toolkit prototype route, shared launcher registry, `EditorShell`, `PreviewSurface`, and the closed shell baseline in `#38`
  - `Reason`: the prototype exists, but it still needs to become a first-class suite toolkit before template work widens
  - `Expected Outputs`: launcher-visible toolkit entry, shared shell adoption, preset-driven preview sizing, and preserved SVG/PNG export behavior
  - `Agents`: `slardar`, `omniknight`, `tinker`, `bounty_hunter`, `sniper`, `clinkz`
  - `Dependencies`: `#37`, `#38`
  - `Evidence`: route-level tests plus screenshot proof of the shared-shell Social Card Toolkit layout
  - `CODEX Label`: required and applied
  - `Next Step`: checkpoint 3 commit after the typography slice lands
- `#29` Implement social card template framework — `Planned`
  - `Input`: Social Card Toolkit prototype render path, shared tokens, output presets, and the template types already defined in `config-schema`
  - `Reason`: MVP templates should extend a constrained framework, not keep growing inside one monolithic page component
  - `Expected Outputs`: reusable template metadata, shared render/config contracts, and constrained grouped controls that match the suite shell model
  - `Agents`: `slardar`, `omniknight`, `tinker`, `bounty_hunter`, `sniper`, `clinkz`
  - `Dependencies`: `#28`, `#37`
  - `Evidence`: component or contract tests plus screenshot proof of at least two template states using the shared framework
  - `CODEX Label`: required and applied
  - `Next Step`: checkpoint 4 commit after shared-shell bootstrap is stable
- `#30` Implement MVP social card template pack — `Planned`
  - `Input`: the new social-card framework, MVP template list from the issue body, and shared theme/token constraints
  - `Reason`: the cycle should finish with the promised social-card templates instead of stopping at scaffolding
  - `Expected Outputs`: quote, stat, announcement, and explainer cards ship through the shared framework with consistent spacing, typography, and export behavior
  - `Agents`: `slardar`, `omniknight`, `tinker`, `bounty_hunter`, `sniper`, `clinkz`
  - `Dependencies`: `#29`
  - `Evidence`: focused template coverage plus screenshot artifacts for each shipped MVP card state
  - `CODEX Label`: required and applied
  - `Next Step`: checkpoint 5 commit after the framework contract lands
- `#31` Integrate chart + caption card with `chart-core` — `Planned`
  - `Input`: shipped dataviz `chart-core` contracts, the social-card framework from `#29`, and the MVP pack work in `#30`
  - `Reason`: the chart card should finish the social-card stream by reusing approved dataviz outputs instead of inventing a separate chart renderer
  - `Expected Outputs`: chart-caption template wiring through `chart-core`, constrained chart embed controls, and visual consistency with the live dataviz toolkit
  - `Agents`: `slardar`, `omniknight`, `kunkka`, `tinker`, `bounty_hunter`, `sniper`, `clinkz`
  - `Dependencies`: `#29`, `#30`
  - `Evidence`: chart-embed contract coverage and screenshot proof of a chart-caption card matching the approved dataviz look
  - `CODEX Label`: required and applied
  - `Next Step`: checkpoint 6 commit after the non-chart social templates are stable

#### Out Of Scope For This Cycle

- `#23`-`#27` Dataviz child issues — already closed on GitHub and shipped on `main`; do not reopen the MVP stream unless a concrete regression appears
- `#33` Shared brand guardrail validation — keep separate from the social-publishing sequence so validation policy does not compete with active template work
- `#34` Regression coverage for preview/export parity — only direct regression tests needed by checkpoints `#6`, `#28`, `#29`, `#30`, or `#31` should land in this cycle
- `#35` Update changelog and agent memory for suite architecture — already closed on GitHub; only incremental changelog updates tied to actual cycle slices should land here
- `#13` Screenshot helper can target the wrong iTerm Codex session — keep separate because it is a workflow bug, not a product-cycle item

### Design Team Cycle — 2026-03-19

Goal: run one Design Team sprint that converts the already-merged shared preset and shell groundwork into a clear implementation stream for named output selection and shared brand guardrails while consuming the closed `#38` shell contract as the UI baseline.

- `Branch`: `codex/GENGARVIS-037-cycle-design-team`
- `Mode`: `Cycle Mode`
- `Baseline`: local `main` was synced to `origin/main` at `776786a` before the cycle branch was created
- `Checkpoint Order`:
  1. `#37` finalize named output preset adoption
  2. validate and extend the closed `#38` shell baseline only where `#37` or `#33` require it
  3. `#33` add shared brand guardrail warnings, then export gating for hard failures
- `Reviewed Issues`: open issues `#6`, `#13`-`#18`, `#20`, `#28`-`#31`, `#33`-`#35`, `#37`, plus closed issue `#38` as design baseline input
- `CODEX Label Policy`: required on every reviewed open issue in this cycle-prep pass

#### In Scope

- `#37` Create shared output preset catalog for social, LinkedIn, and print formats — `Planned`
  - `Input`: existing `packages/studio-shell` output preset catalog, current Motion Toolkit export and selector flow, shared export-sizing helpers, issue `#6`, and the merged changelog notes that preset groundwork already exists on `main`
  - `Reason`: named output presets need to become the source of truth before shell adoption or guardrails can safely depend on them
  - `Expected Outputs`: named preset selection by output class, one sizing source of truth for preview and export, preserved `300 DPI` metadata for PDF-class presets, and compatibility mapping from legacy aspect-ratio paths during the migration window
  - `Agents`: `slardar`, `omniknight`, `tinker`, `bounty_hunter`, `sniper`, `clinkz`
  - `Dependencies`: `#19`, `#20`, `#21`, `#32`
  - `Evidence`: preset catalog tests, selector integration coverage, export-dimension assertions, and screenshot proof of the preset-selection flow
  - `CODEX Label`: required and applied
  - `Next Step`: checkpoint 1 commit on the cycle branch
- `#33` Shared brand guardrail validation — `Planned`
  - `Input`: approved design tokens, shared theme utilities, the finalized preset and shell decisions from `#37` and `#38`, and the existing validation patterns already used by dataviz
  - `Reason`: shared brand guardrails should attach to the settled design system, not compete with it while core shell and preset semantics are still moving
  - `Expected Outputs`: shared guardrail utilities, readable warning UI for non-designer users, export blocking only for hard failures, and compatibility with both token defaults and custom HEX fallback during the rollout window
  - `Agents`: `slardar`, `omniknight`, `tinker`, `bounty_hunter`, `sniper`, `clinkz`
  - `Dependencies`: `#19`, `#20`, `#37`, `#38`
  - `Evidence`: unit coverage for guardrail rules, one export-block integration test, and screenshot proof of warning and blocked-export states
  - `CODEX Label`: required and applied
  - `Next Step`: checkpoint 3 commit after the preset and shell slices are stable on the cycle branch

#### Closed Baseline Consumed By This Cycle

- `#38` Standardize toolkit editor shell with fitted preview and palette-first controls — `Closed on 2026-03-18`
  - `Input`: `packages/studio-shell` shell primitives, merged preview-stability work in `CHANGELOG.md`, palette-grid groundwork, and the existing control-density tests already on `main`
  - `Reason`: the Design Team cycle should consume the closed shell contract instead of reopening the issue or duplicating toolkit-local shell work
  - `Expected Outputs`: `#37` and `#33` must reuse the shipped two-pane shell, fitted preview behavior, branded header, and palette-first control model instead of inventing replacements
  - `Agents`: `slardar`, `omniknight`, `tinker`, `bounty_hunter`, `sniper`
  - `Evidence`: shell regression coverage and screenshot validation should prove the closed baseline still holds while the active cycle lands follow-through changes
  - `CODEX Label`: applied before close and retained for tracker continuity
  - `Next Step`: treat as required baseline during checkpoints 1 through 3

#### Out Of Scope For This Cycle

- `#6` Adjust Square and 4x5 Text to Size ratio — reviewed and intentionally deferred through `#37` so typography scaling does not fork into a motion-only rule set
- `#34` Regression coverage for preview/export parity — reviewed, but only direct regression tests required by `#37` or `#38` should land in this cycle; the broader hardening sweep stays for a later pass
- `#35` Update changelog and agent memory for suite architecture — reviewed and deferred as a full docs sweep until the Design Team cycle lands real behavior changes
- `#18` and `#20` — reviewed as upstream references already present on `main`; do not reopen package-boundary work inside this cycle branch
- `#14`, `#15`, `#16`, and `#17` — reviewed as planning epics only; they inform the cycle but are not active implementation slices
- `#28`, `#29`, `#30`, and `#31` — reviewed as downstream social-card work that should wait for the preset and shell contracts coming out of this cycle
- `#13` Screenshot helper can target the wrong iTerm Codex session — reviewed and left separate because it is a workflow bug, not part of the Design Team sprint

#### Sub-Agent Handoff

- `slardar`
  - Confirm the committed `main` baseline, identify the smallest safe change set for each checkpoint, and flag any sizing/schema/export compatibility traps before edits start
  - Return inspected files, reuse seams, and risk notes for `#37`, `#38`, and `#33`
- `omniknight`
  - Lock preset naming, shell composition, palette-first interaction rules, warning copy, and guardrail thresholds before implementation
  - Return acceptance bullets, token usage notes, and any visual constraints that must stay shared
- `tinker`
  - Own the cycle branch implementation in checkpoint order, reusing shared shell and preset primitives instead of introducing toolkit-local patterns
  - Return changed files, test impact, and any follow-up slices that should stay out of scope
- `bounty_hunter`
  - Validate md/lg breakpoints, preview/export parity, console cleanliness, and visible regressions after each checkpoint
  - Return repro notes, findings, and the smallest-fix suggestions when QA fails
- `sniper`
  - Capture PR-ready artifacts for preset selection, standardized shell layout, palette-first flow, and guardrail warning/export-block states
  - Return artifact paths, what each artifact proves, and an immediate skip reason if browser capture is blocked
- `clinkz`
  - Keep `CHANGELOG.md`, issue updates, and any contributor-facing notes aligned with the actual cycle slices that land
  - Return changed files plus the short issue-summary text that should accompany review-ready work
- `oracle`, `kunkka`, `gyrocopter`
  - Skip by default for this cycle
  - Activate only if the scope expands into current OpenAI/MCP behavior, chart-template work, or export-engine changes beyond preset adoption

## Delivery Sequence

### Cycle 1 — Suite Foundations

Goal: finish the shared package and shell layer needed by every toolkit.

- `#22` Create shared studio shell and toolkit registry contract — `Shipped`
  - Closed and already landed as the suite entry-point foundation.
- `#18` Migrate current editor into `apps/motion-toolkit` — `Review`
  - Needed to finish the suite app split without regressing motion behavior.
- `#19` Extract design tokens into shared package — `Review`
  - Unblocks shared palette and guardrail work across toolkits.
- `#20` Extract shared config-schema package — `Review`
  - Unblocks shared document, preset, and validation contracts.
- `#21` Extract `export-engine` package — `Review`
  - Current branch includes shared sizing helpers, canvas export helpers, SVG helpers, and export capability contracts.
- `#32` Shared preset persistence and document versioning — `Review`
  - Should land before or alongside the shared preset catalog.
- `#37` Create shared output preset catalog for social, LinkedIn, and print formats — `Review`
  - Current branch lands the shared metadata catalog first; selector adoption follows in later toolkit work.
- `#38` Standardize toolkit editor shell with fitted preview and palette-first controls — `Review`
  - Current branch lands shared shell primitives plus Motion Toolkit adoption, static preview startup, fixed preview-pane sizing, and single-active long-form controls; broader toolkit adoption remains a follow-through item for later cycles.

### Cycle 2 — Data Visualization Toolkit MVP

Goal: ship the shared-shell dataviz route and constrained chart workflows that now act as the chart baseline for downstream social-card work.

- `#15` Epic: Data Visualization Toolkit MVP — `Review`
  - Child implementation issues are closed on GitHub and the toolkit route is live on `main`; keep the epic open only for follow-through review if needed.
- `#23` Bootstrap `apps/dataviz-toolkit` with shared shell — `Shipped`
  - Closed on GitHub and present on `main`.
- `#24` Implement structured data ingestion and column mapping — `Shipped`
  - Closed on GitHub and present on `main`.
- `#25` Implement dataviz template set A — `Shipped`
  - Closed on GitHub and present on `main`.
- `#26` Implement dataviz template set B — `Shipped`
  - Closed on GitHub and present on `main`.
- `#27` Add dataviz validation, story copy, presets, and export — `Shipped`
  - Closed on GitHub and present on `main`.

### Cycle 3 — Social Card Toolkit MVP

Goal: turn the current Social Card Toolkit prototype into a first-class suite toolkit that reuses shared presets, shell behavior, and chart contracts.

- `#16` Epic: Social Card Toolkit MVP — `Planned`
- `#28` Bootstrap `apps/social-card-toolkit` with shared shell — `Planned`
  - Prototype route exists on `main`, but launcher visibility and shared-shell adoption are still missing.
- `#29` Implement social card template framework — `Planned`
  - Depends on `#37` and `#28`.
- `#30` Implement MVP social card template pack — `Planned`
  - Depends on `#29`.
- `#31` Integrate chart + caption card with `chart-core` — `Planned`
  - Depends on the shipped dataviz/chart contracts plus `#29` and `#30`.

### Cross-Cutting Hardening

Goal: stabilize suite behavior once the shared foundations and toolkit slices are in place.

- `#17` Epic: Cross-cutting hardening — `Planned`
- `#33` Shared brand guardrail validation — `Blocked`
  - Best scheduled after `#19`, `#20`, and the shared shell controls are stable.
- `#34` Regression coverage for preview/export parity — `Planned`
  - Current branch adds preview-stability and shell-behavior regression coverage; broader preview/export parity hardening should continue alongside later slices.
- `#35` Update changelog and agent memory for suite architecture — `Shipped`
  - Closed on GitHub and merged to `main`.

## Routed Through Shared Systems

- `#6` Adjust Square and 4x5 Text to Size ratio — `Planned`
  - Keep this tied to `#37` so typography sizing ships through the shared output contract instead of landing as a motion-only override.
  - Use a composition-relative sizing rule derived from the logical canvas or named preset metadata, then prove preview/export parity with targeted tests.
  - If the active cycle cannot settle the scaling rule cleanly, move only the unresolved policy question back to `agent/memory/roadmap.md`.

## Issue Execution Templates

Use this structure when an item moves from roadmap review into active implementation:

- `Issue`: `#NN` title
- `Scope`: `In Scope` or `Out Of Scope`
- `Status`: one item from the status legend
- `Branch`: `codex/GENGARVIS-###-short-slug`
- `Input`: repo state, issue body, prior roadmap/changelog notes, and upstream dependencies that the implementation must honor
- `Reason`: why the issue is shipping now or why it is explicitly deferred
- `Expected Outputs`: 2-5 outcome bullets that define the intended implementation boundary
- `Agents`: tracked profiles used, in order
- `Dependencies`: upstream issues or packages
- `Acceptance`: 2-5 outcome bullets
- `Evidence`: tests, screenshot artifact paths, PR link
- `CODEX Label`: required status plus whether the label is already applied
- `Next Step`: the immediate implementation action

## Dependency Notes

- `#38` is now the shipped shell baseline that `#28` must adopt rather than replace.
- `#19`, `#20`, and `#21` form the shared package baseline for `#37`.
- `#23` is shipped; `#28` should adopt the shared shell behavior from `#38` instead of creating app-local layout patterns.
- `#27` is shipped, and `#29` should consume the shared preset catalog from `#37`.
- `#31` should reuse approved chart contracts rather than inventing a parallel charting stack.
- `#6` should follow the first `#37` adoption checkpoint so typography scaling attaches to the same output-size contract used elsewhere.
- `#34` should grow incrementally as each cycle lands so parity checks stay close to the change that introduced them.

## Revision History

- `2026-03-15`: Created the root roadmap from the open feature queue, the current agent workflow rules, and the handover plan at `/tmp/gengartoolkit-next-feature-workplan.md`.
- `2026-03-16`: Updated Cycle 1 items to review status after the shared package, motion-route, preset-catalog, and shell-groundwork commits were stacked on the cycle branch.
- `2026-03-18`: Recorded the current branch’s preview-stability, fixed-pane shell, and single-active controls behavior under `#38`, plus the supporting regression-hardening progress under `#34`.
- `2026-03-19`: Synced local `main` to `origin/main`, created `codex/GENGARVIS-037-cycle-design-team`, and added an explicit Design Team cycle-prep section with in-scope/out-of-scope review fields, checkpoint order, and tracked sub-agent handoffs.
- `2026-03-21`: Refreshed the roadmap against committed `main`, marked the closed dataviz and docs issues as shipped, and added the Social Publishing cycle that sequences `#37`, `#6`, and `#28`-`#31` in Cycle Mode.
