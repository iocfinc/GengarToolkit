# Skill: plan_feature

## Purpose

Use this skill when a request adds or expands product behavior, workflow capability, or developer tooling.

## Invoke When

- a GitHub issue is classified as a feature
- a user requests new functionality
- a request changes editor workflows, agent workflows, or repository automation

## Required Inputs

- feature request summary
- acceptance criteria or success signals
- relevant issue, PR, or user context

## Inspect First

- `src/lib/store/editorStore.ts`
- `src/lib/render/backgroundRenderer.ts`
- `src/lib/render/sceneRenderer.ts`
- `src/lib/render/textureRenderer.ts`
- `src/lib/render/captureFrame.ts`
- `src/lib/render/exportVideo.ts`
- `src/lib/presets/defaultPresets.ts`
- `src/components/editor/*`
- `agent/templates/feature_plan_template.md`

## Steps

1. Identify the request type and restate the feature in one sentence.
2. For non-trivial work, map which tracked sub-agents from `skills.md` should be used and in what order.
3. Locate impacted state, UI, rendering, export, preset, and documentation modules.
4. Identify whether the feature changes the editor, the repo operating layer, or both.
5. Note required state changes in `editorStore` or related types.
6. Note required rendering or export changes in `src/lib/render/*`.
7. Identify tests needed for store logic, UI interactions, render behavior, export behavior, and repo-operating changes.
8. For frontend-affecting work, require `browser_debugger` findings plus a `browser_screenshot` artifact pass or a documented skip reason.
9. Identify documentation and changelog updates.
10. Assess complexity, dependencies, and rollout risks.
11. Produce the plan using the template sections below.

## Output Contract

- `## Feature Summary`
- `## User Impact`
- `## Technical Design`
- `## Modules Impacted`
- `## UI Changes`
- `## State Changes`
- `## Rendering Changes`
- `## Tests Required`
- `## Risks`
- `## Implementation Plan`

## Done Criteria

- impacted modules are explicitly named
- tests and changelog work are included
- the implementation plan is sequenced and decision-complete
