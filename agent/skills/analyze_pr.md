# Skill: analyze_pr

## Purpose

Use this skill to review pull requests for correctness, architectural fit, and testing coverage.

## Invoke When

- a pull request is opened, synchronized, or reopened
- a review summary is needed after implementation

## Required Inputs

- PR description
- changed files
- test results
- linked issue context if available

## Inspect First

- changed files in the PR
- `src/lib/store/editorStore.ts` when state changes exist
- `src/lib/render/*` when render/export changes exist
- `src/components/editor/*` when UI changes exist
- `agent/templates/pr_review_template.md`

## Steps

1. Summarize the PR intent.
2. Identify architecture impact and whether the change fits current module boundaries.
3. Review the documented root cause and debugging steps, not just the final patch.
4. Review code quality, correctness risks, and maintainability.
5. Check that tests cover the changed behavior.
6. Confirm browser visual-validation evidence for frontend-affecting work, or verify that the PR documents why the screenshot pass was skipped.
7. Confirm changelog, issue comment, and documentation updates when applicable.
8. Recommend improvements or follow-up work.

## Output Contract

- `PR Summary`
- `Architecture impact`
- `Code quality review`
- `Debugging review`
- `Potential risks`
- `Test coverage analysis`
- `Suggested improvements`

## Done Criteria

- findings are prioritized by severity
- testing gaps are explicit
- architecture concerns are concrete
