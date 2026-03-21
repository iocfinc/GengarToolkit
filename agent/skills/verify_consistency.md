# Skill: verify_consistency

## Purpose

Use this skill when a shared toolkit interaction, shell behavior, or reusable UX pattern changes in one place and sibling toolkits may need the same treatment.

## Invoke When

- a frontend bug fix changes a shared toolkit pattern
- a PR updates shared shell, control, or layout behavior
- a maintainer reports that one toolkit drifted from another

## Required Inputs

- changed files or changed behavior summary
- the source toolkit where the intended behavior is known-good
- the sibling toolkit surfaces that may need parity
- test results and visual-validation evidence when available

## Inspect First

- touched toolkit pages or shared package primitives
- existing tests that define the interaction contract
- `agent/memory/design_decisions.md`
- `agent/skills/analyze_pr.md`

## Steps

1. Identify the shared UX contract that changed.
2. Name the source-of-truth toolkit or shared primitive for that contract.
3. Inspect sibling toolkits that use the same shell or interaction model.
4. Record any parity drift in behavior, structure, or validation coverage.
5. Recommend the narrowest fix surface: shared layer, toolkit-local layer, tests, or workflow guidance.
6. Confirm whether browser evidence or deterministic tests already prove parity.
7. Return concrete follow-up actions or an explicit no-action result.

## Output Contract

- `## Shared Contract`
- `## Toolkits Checked`
- `## Mismatches`
- `## Recommended Fix Surface`
- `## Tests Or Evidence`

## Done Criteria

- sibling toolkit coverage is explicit
- parity findings are concrete and file-based
- the recommended fix surface is narrow and defensible
