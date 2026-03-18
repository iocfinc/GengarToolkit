# Roadmap

Last updated: 2026-03-18

This roadmap turns open feature issues into a reviewable delivery plan. Use it to sequence feature work, track dependencies, and record the multi-agent execution path for each issue.

`ROADMAP.md` is the shipping plan. `agent/memory/roadmap.md` remains the holding area for valid but deferred or under-specified ideas.

## Sources Of Truth

- Open GitHub feature issues and epics: `#6`, `#14`-`#17`, `#18`-`#21`, `#23`-`#38`
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
- Update `CHANGELOG.md` for shipped work.
- For frontend-affecting work, capture browser QA artifacts or record a concrete skip reason.
- When work is too broad or unclear, defer it to `agent/memory/roadmap.md` instead of guessing.

## Multi-Agent Delivery Mode

### Default Sequence

1. `explorer`
2. `design_guardian` when UI, tokens, or shell behavior changes
3. `frontend_architect`, `chart_engine`, or `export_engine` depending on the issue
4. `browser_debugger` for interactive validation
5. `browser_screenshot` for PR-ready visual evidence
6. `docs_writer` for contributor-facing documentation changes

### Evidence Required Per Feature

- Focused tests for the changed contract or flow
- Screenshot artifact paths for frontend-visible changes when browser tooling is available
- Changelog entry
- Issue comment with summary, validation notes, and PR link when work is review-ready

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

Goal: bootstrap the dataviz app on top of the shared shell, then add constrained charting workflows.

- `#15` Epic: Data Visualization Toolkit MVP — `Planned`
- `#23` Bootstrap `apps/dataviz-toolkit` with shared shell — `Blocked`
  - Depends on `#38`.
- `#24` Implement structured data ingestion and column mapping — `Blocked`
  - Depends on `#23`.
- `#25` Implement dataviz template set A — `Blocked`
  - Depends on `#24`.
- `#26` Implement dataviz template set B — `Blocked`
  - Depends on `#25`.
- `#27` Add dataviz validation, story copy, presets, and export — `Blocked`
  - Depends on `#37` and the earlier dataviz slices.

### Cycle 3 — Social Card Toolkit MVP

Goal: bootstrap the social-card app, then add constrained template workflows that reuse shared systems.

- `#16` Epic: Social Card Toolkit MVP — `Planned`
- `#28` Bootstrap `apps/social-card-toolkit` with shared shell — `Blocked`
  - Depends on `#38`.
- `#29` Implement social card template framework — `Blocked`
  - Depends on `#37` and `#28`.
- `#30` Implement MVP social card template pack — `Blocked`
  - Depends on `#29`.
- `#31` Integrate chart + caption card with `chart-core` — `Blocked`
  - Depends on the shared dataviz/chart contracts and `#29`.

### Cross-Cutting Hardening

Goal: stabilize suite behavior once the shared foundations and toolkit slices are in place.

- `#17` Epic: Cross-cutting hardening — `Planned`
- `#33` Shared brand guardrail validation — `Blocked`
  - Best scheduled after `#19`, `#20`, and the shared shell controls are stable.
- `#34` Regression coverage for preview/export parity — `Planned`
  - Current branch adds preview-stability and shell-behavior regression coverage; broader preview/export parity hardening should continue alongside later slices.
- `#35` Update changelog and agent memory for suite architecture — `Planned`
  - Should track actual merged architecture changes, not speculative local WIP.

## Routed Through Shared Systems

- `#6` Adjust Square and 4x5 Text to Size ratio — `Blocked`
  - Keep this tied to `#37` instead of landing a motion-only one-off.
  - Use the shared preset system to define whether typography scaling is normalized, format-aware, or preset-specific.
  - If the scaling decision is still unresolved when `#37` starts, keep the open design question in `agent/memory/roadmap.md`.

## Issue Execution Templates

Use this structure when an item moves from roadmap review into active implementation:

- `Issue`: `#NN` title
- `Status`: one item from the status legend
- `Branch`: `codex/GENGARVIS-###-short-slug`
- `Agents`: tracked profiles used, in order
- `Dependencies`: upstream issues or packages
- `Acceptance`: 2-5 outcome bullets
- `Evidence`: tests, screenshot artifact paths, PR link
- `Next Step`: the immediate implementation action

## Dependency Notes

- `#37` should land before `#38` so shell controls target named presets instead of toolkit-local size assumptions.
- `#19`, `#20`, and `#21` form the shared package baseline for `#37`.
- `#23` and `#28` should adopt the shared shell behavior from `#38`, not create app-local layout patterns.
- `#27` and `#29` should consume the shared preset catalog from `#37`.
- `#31` should reuse approved chart contracts rather than inventing a parallel charting stack.
- `#34` should grow incrementally as each cycle lands so parity checks stay close to the change that introduced them.

## Revision History

- `2026-03-15`: Created the root roadmap from the open feature queue, the current agent workflow rules, and the handover plan at `/tmp/gengartoolkit-next-feature-workplan.md`.
- `2026-03-16`: Updated Cycle 1 items to review status after the shared package, motion-route, preset-catalog, and shell-groundwork commits were stacked on the cycle branch.
- `2026-03-18`: Recorded the current branch’s preview-stability, fixed-pane shell, and single-active controls behavior under `#38`, plus the supporting regression-hardening progress under `#34`.
