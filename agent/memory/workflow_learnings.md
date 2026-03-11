# Workflow Learnings

## Issue 1: Preview vs Export Typography Parity

### What Worked

- Extracting pure sizing and typography layout helpers made the preview/export mismatch easier to isolate.
- Regression tests on the helper layer and preview component made the final fix safer.
- A temporary query-flag debug overlay was effective for validating wrapped lines, text block height, and anchor placement.

### What Slowed Us Down

- The first pass targeted shared sizing only; the typography anchor calculation also needed to move from fixed offsets to measured block height.
- Without an issue-comment step and explicit PR debugging notes, the reasoning trail was harder to preserve than the code diff itself.

### Skill Updates Needed

- `triage_bug` should call out preview/export parity checks, text metrics, and font-loading state for canvas typography bugs.
- `generate_tests` should recommend extracting pure layout helpers when direct canvas assertions are brittle.
- A dedicated issue-comment skill is useful once work is ready for review.

### Workflow Updates Needed

- Branches should use `codex/GENGARVIS-###-short-slug`.
- PRs should include root cause and debugging steps.
- Issue-linked work should add a GitHub issue comment before or at PR creation.
- After merge, add a short workflow reflection in `agent/memory/`.

### Reusable Debugging Pattern

1. Reproduce the mismatch with the smallest possible example.
2. Compare preview and export in the same logical render space.
3. Extract layout math into pure helpers.
4. Add temporary diagnostics behind a query flag if needed.
5. Convert the discovered invariants into tests.
6. Remove the temporary diagnostics UI and keep the tests.
