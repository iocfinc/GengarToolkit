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
- delegation plan with tracked profiles, bounded tasks, and required evidence per profile
- foundation check for shared packages such as `design-tokens`, `config-schema`, `export-engine`, and `studio-shell` when applicable
- portfolio fit for data-story publishing, cover/poster generation, chart-led communication, or reusable template infrastructure
- template-system fit for named templates, grids, materials, palettes, typography, and output presets

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
3. Compare the feature request against committed `HEAD` before relying on any local uncommitted work, especially when the current tree already contains broader in-progress changes.
4. Note any local WIP that must not be credited to the selected issue and identify the smallest checkpoint slice that can land cleanly.
5. Decide whether the work should use Issue Mode or a maintainer-approved Cycle Mode branch plan.
6. Locate impacted state, UI, rendering, export, preset, shared-package, and documentation modules.
7. Identify whether the feature changes the editor, the repo operating layer, or both.
8. Validate portfolio fit against the suite direction: data finding posters, article covers, chart-led cards, presentation cover pages, or reusable template infrastructure.
9. Validate template-system fit: named template or template family, grid/layout contract, material and palette contract, typography contract, and output preset contract.
10. Name the shared primitive being reused or extended in `packages/studio-shell`, `packages/ui`, `packages/design-tokens`, `packages/config-schema`, or `packages/export-engine` before adding toolkit-local UI.
11. Route broad or off-direction product ideas into `agent/memory/roadmap.md` instead of implementing them speculatively.
12. Note required state changes in `editorStore` or related types.
13. Note required rendering or export changes in `src/lib/render/*` or shared package equivalents.
14. Identify tests needed for store logic, UI interactions, render behavior, export behavior, shared package contracts, compatibility re-exports, and repo-operating changes.
15. For frontend-affecting work, require a visual-validation path: `bounty_hunter` for interactive or stateful flows, `sniper` for artifact capture, or a documented skip reason when browser tooling is unavailable.
16. For visual cohesion work, require `omniknight` review before implementation and `arc_warden` when a shared toolkit interaction pattern changes.
17. Identify documentation and changelog updates.
18. Record the intended sub-agent evidence in the plan: which profile will run, what it owns, what output it must return, and what artifact or proof is expected.
19. Assess complexity, dependencies, rollout risks, and merge order.
20. Produce the plan using the template sections below.

## Output Contract

- `## Feature Summary`
- `## User Impact`
- `## Portfolio Fit`
- `## Template System Fit`
- `## Technical Design`
- `## Modules Impacted`
- `## Shared Primitive Reuse`
- `## UI Changes`
- `## State Changes`
- `## Rendering Changes`
- `## Tests Required`
- `## Visual Cohesion Evidence`
- `## Delegation Plan`
- `## Evidence Plan`
- `## Risks`
- `## Implementation Plan`

## Done Criteria

- impacted modules are explicitly named
- portfolio fit and template-system fit are explicitly accepted or deferred
- shared primitive reuse is named before toolkit-local UI is added
- tests and changelog work are included
- delegation and visual-validation expectations are explicit
- the branch mode and smallest checkpoint slice are explicit
- the implementation plan is sequenced and decision-complete
