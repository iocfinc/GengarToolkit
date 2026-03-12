# Skill: triage_bug

## Purpose

Use this skill when a bug report, regression, or production issue needs diagnosis and a fix strategy.

## Invoke When

- a GitHub issue is labeled `bug`
- a user reports broken behavior
- a PR review finds a reproducible regression

## Required Inputs

- bug summary and reproduction steps
- expected behavior
- actual behavior
- environment details if available

## Inspect First

- `src/lib/store/editorStore.ts`
- `src/lib/render/backgroundRenderer.ts`
- `src/lib/render/sceneRenderer.ts`
- `src/lib/render/textureRenderer.ts`
- `src/lib/render/captureFrame.ts`
- `src/lib/render/exportVideo.ts`
- `src/lib/presets/defaultPresets.ts`
- `src/components/editor/*`
- `agent/templates/bug_triage_template.md`

## Steps

1. Classify the affected subsystem: state, UI, rendering, presets, export, or workflow automation.
2. Identify likely root causes from the current architecture.
3. Inspect the closest modules first and map the bug to a concrete code path.
4. When preview and export diverge, compare them in the same logical coordinate space before changing control semantics.
5. For canvas and typography bugs, inspect measured text metrics, wrapping, anchor placement, and font-loading state.
6. Use temporary diagnostics only when needed, hide them behind a query flag or dev-only path, and remove the UI once the fix is confirmed.
7. Propose the minimal code fix.
8. Specify regression tests.

## Output Contract

- `## Bug Summary`
- `## Possible Root Causes`
- `## Code Areas To Inspect`
- `## Proposed Fix`
- `## Tests Required`

## Done Criteria

- likely root cause is tied to named files or functions
- fix proposal is narrow and testable
- regression tests are identified
