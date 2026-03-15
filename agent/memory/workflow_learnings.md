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

## Issue 2: Autonomous Backlog Cycle

### What Worked

- A repository-native backlog scan keeps issue selection deterministic and reviewable before code changes start.
- Separating roadmap decisions from implementation decisions reduces speculative feature work.
- Encoding the one-bug and one-feature-per-PR rule in the workflow documents makes the delivery boundary clearer.

### What Slowed Us Down

- Existing workflows covered intake, triage, and PR review, but not the selection logic between them.
- Without a durable roadmap file, under-specified feature requests had no clear home.

### Skill Updates Needed

- `run_backlog_cycle` should stay aligned with any future label taxonomy changes.
- `read_issue` and `plan_feature` should continue to treat roadmap routing as a valid output when requirements are incomplete.

### Workflow Updates Needed

- Scheduled backlog review should start with `npm run backlog:scan`.
- Autonomous implementation should open separate PRs for the selected bug and feature.
- Completion should require both validation evidence and a pushed PR.

### Reusable Debugging Pattern

1. Pull the open issue queue instead of relying on memory.
2. Validate problem statements before committing implementation time.
3. Ship the narrowest bug fix and feature in separate PRs.
4. Route unclear features into the roadmap rather than guessing.
5. Reflect on the cycle so the next run has less ambiguity.

## Issue 3: Branch Sequencing For Backlog Work

### What Worked

- Pulling the live backlog first exposed that the real queue priority was two bug fixes before the open feature.
- Splitting the bug fixes back into issue-specific branches restored the intended one-fix-per-PR workflow.

### What Slowed Us Down

- The workflow-update branch was not merged before issue branches were created, which widened the coordination surface.
- A combined bug-fix branch briefly violated the repo rule of one fix per merge request.
- Feature issue #6 was valid, but it should have been deferred to the roadmap immediately so it did not compete with the bug-fix sequence.

### Skill Updates Needed

- `run_backlog_cycle` should require an implementation order before any issue branch is created.
- `run_backlog_cycle` should explicitly route valid-but-blocking features to the roadmap.

### Workflow Updates Needed

- Merge workflow/process PRs before opening dependent issue PRs.
- Keep one issue per branch and one issue per pull request.
- When backlog review finds a feature that widens the active fix stream, keep it open and record it in the roadmap instead of implementing it in parallel.
- State the intended PR merge order before starting code changes.

### Reusable Debugging Pattern

1. Pull and prioritize the open queue.
2. Decide which items are shipping now and which items move to the roadmap.
3. Land workflow prerequisites first.
4. Create one branch per issue.
5. Keep the merge sequence explicit until each PR is closed.

## Issue 4: Multi-Agent Trial For Suite Launcher

### What Worked

- Reducing the epic to issue `#22` produced a small, testable product slice with visible behavior and a clean PR boundary.
- Comparing the selected issue to committed `HEAD` exposed that the local tree already contained broader suite WIP, which prevented over-crediting unrelated in-progress work.
- A focused launcher test plus browser screenshot evidence was enough to validate the first suite feature end to end.

### What Slowed Us Down

- The first candidate pass looked at the dirty worktree before checking committed repo state, which made later hardening/doc issues look more “buildable” than the real first product slice.
- We used an ad-hoc explorer-style `codex exec` prompt instead of a tracked profile invocation, so the delegation trail was weaker than intended.
- The current guidance said “run sub-agents” but did not require explicit evidence of which profile ran or why a profile was skipped.

### Skill Updates Needed

- `run_backlog_cycle` should require a committed-`HEAD` reality check before issue selection when the tree is already dirty.
- `plan_feature` should require the planned sub-agent list to include explicit profile names, bounded tasks, and expected outputs.
- `skills.md` should prefer real tracked-profile invocations over role-play prompts so the session trail proves whether delegation happened.

### Workflow Updates Needed

- Frontend issue work should record whether visual QA used `browser_debugger`, `browser_screenshot`, or a documented skip path.
- Delivery notes should distinguish “tracked profile used” from “main-thread manual work” so multi-agent trials can be scored honestly.
- Reflection should be added immediately after first-live feature delivery, not deferred until later backlog passes.

### Reusable Delivery Pattern

1. Pull the live issue queue.
2. Compare candidate issues against committed `HEAD`, not just the current worktree.
3. Pick the smallest visible slice with a narrow PR boundary.
4. State which tracked profiles will run and what each owns.
5. Validate with focused tests plus one concrete artifact for the changed flow.
