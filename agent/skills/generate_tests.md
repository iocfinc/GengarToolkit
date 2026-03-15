# Skill: generate_tests

## Purpose

Use this skill to add or update automated tests for code changes in the editor or agent operating layer.

## Invoke When

- implementation is complete
- a PR changes behavior without sufficient tests
- a bug fix needs regression coverage

## Required Inputs

- summary of changed behavior
- impacted files
- desired test level: unit, component, integration

## Inspect First

- `src/lib/store/editorStore.ts`
- `src/lib/render/backgroundRenderer.ts`
- `src/lib/render/sceneRenderer.ts`
- `src/lib/render/textureRenderer.ts`
- `src/lib/render/captureFrame.ts`
- `src/lib/render/exportVideo.ts`
- `src/lib/presets/defaultPresets.ts`
- `src/components/editor/*`
- `tests/`
- `agent/templates/test_plan_template.md`

## Steps

1. Identify the behavior that changed.
2. Select the narrowest useful test level.
3. Prefer extracting pure sizing or layout helpers when canvas bugs are difficult to test directly.
4. Cover state store logic when state transitions changed.
5. Cover UI control interactions when editor controls or dialogs changed.
6. Cover rendering parameter changes when background, texture, motif, motion, or typography logic changed.
7. Cover export triggers when export behavior changed.
8. Add browser API mocks only where required.
9. For shared package extraction work, add contract tests for the new package entry point and compatibility re-export paths when both are expected to remain valid.
10. For repo-operating or workflow changes, add contract tests that verify new config, docs, and workflow guidance stay aligned when practical.
11. For frontend-affecting work, pair automated tests with a browser screenshot pass for PR preparation when browser tooling is available.

## Output Contract

- test file list
- scenarios covered
- required mocks
- verification command

## Done Criteria

- tests cover the intended behavior and edge cases
- mocks are stable and minimal
- the suite is runnable with Vitest
