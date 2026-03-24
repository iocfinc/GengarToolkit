# Workflow Learnings

## Issue 28/29/30/31 Follow-Through: Dogfooded Announcement Assets

### What Worked

- Shipping a seeded social-card announcement preset made the toolkit immediately usable for branch and cycle launch notes instead of requiring manual copy setup every time.
- Capturing the PR-ready announcement inside the product exposed preset-persistence details and UI polish needs earlier than a standalone screenshot pass would have.
- Pairing the seeded preset with a dedicated repo skill turned one successful launch card into a reusable workflow.

### What Slowed Us Down

- Browser-local saved presets alone were not durable enough for team-wide reuse, so the branch needed a shipped fallback preset instead of relying only on local storage.
- Saving the seeded preset without dedupe would have created duplicate preset names during dogfooding.

### Skill Updates Needed

- Add a dedicated announcement-asset skill that tells future runs how to turn a branch diff into a Social Card Toolkit preset, artifact, and PR note.

### Workflow Updates Needed

- Treat launch announcements as part of PR preparation for user-visible cycle work.
- Prefer seeded presets for canonical launch cards and use browser-saved presets as the working copy layer.

### Reusable Delivery Pattern

1. Convert the branch summary into announcement copy inside the Social Card Toolkit.
2. Save the asset as a named preset before export or screenshot capture.
3. Capture the announcement artifact and cite it in the PR notes.
4. Record the workflow as a repo skill if the team is likely to repeat it.

## Issue 37/38/33: Design Team Cycle Prep

### What Worked

- Syncing local `main` to `origin/main` before creating the cycle branch removed ambiguity about which groundwork was already merged.
- Converting the cycle review into explicit `Input`, `Reason`, and `Expected Outputs` fields made the in-scope versus out-of-scope decision easier to audit.
- Writing sub-agent ownership into the roadmap upfront reduced the chance of overlapping implementation, QA, and docs work once the cycle starts.

### What Slowed Us Down

- The roadmap still mixed already-merged groundwork with upcoming follow-through work, so the active cycle boundary had to be restated before execution could start.
- Several reviewed issues were still missing the `CODEX` label, which made cycle tracking inconsistent until the label pass was added to the prep checklist.

### Skill Updates Needed

- `run_backlog_cycle` should support a maintainer-directed mode where all reviewed issues, not just the in-scope ones, are marked for `CODEX` tracking.
- Roadmap templates should keep `Input`, `Reason`, `Expected Outputs`, and agent handoff fields available for future cycle-prep passes.

### Workflow Updates Needed

- Always fetch and fast-forward `main` before opening a new Cycle Mode branch.
- Record `CODEX` label coverage as a first-class cycle kickoff step.
- Keep checkpoint order and sub-agent ownership in the roadmap so the branch can be resumed without re-planning.

### Reusable Delivery Pattern

1. Sync `main` against the remote before deciding cycle scope.
2. Review the live open issue set instead of relying on the previous roadmap snapshot.
3. Lock in-scope items with `Input`, `Reason`, `Expected Outputs`, and handoff ownership before implementation starts.
4. Label every reviewed issue consistently so planning and delivery use the same tracker state.
5. Create the shared cycle branch only after the roadmap reflects the real baseline.

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

## Issue 5: Cycle 1 Foundation Sprint

### What Worked

- Extracting shared packages first created a stable foundation for later toolkit-specific work.
- Using one shared cycle branch with checkpoint commits made the sequence easier to review without losing issue-level traceability.
- Keeping compatibility re-export layers in place let the team move code into shared packages without breaking existing app imports.

### What Slowed Us Down

- Foundation work and later toolkit UI work were mixed together in the worktree, which made it harder to see the next clean checkpoint.
- The previous skill docs did not clearly separate package extraction, shell groundwork, and later feature adoption.
- Agent profile descriptions were too generic, so expected outputs had to be re-explained in the main thread.

### Skill Updates Needed

- `plan_feature` should explicitly call out shared-package reuse, checkpoint slicing, and branch mode.
- `run_backlog_cycle` should record implementation order, branch plan, and evidence plan before code changes start.
- `generate_tests` should recommend package-entry contract tests plus compatibility re-export coverage for shared extractions.

### Workflow Updates Needed

- Maintain an explicit implementation order for multi-issue cycle branches.
- Treat committed `HEAD` as the delivery baseline when deciding what belongs in the next checkpoint commit.
- Use shared shell and package groundwork commits before toolkit-specific adoption commits.

### Reusable Delivery Pattern

1. Extract the shared package or shell primitive first.
2. Preserve compatibility imports while the app surface catches up.
3. Validate the package entry point and the compatibility layer together.
4. Commit one clean checkpoint per issue inside the cycle branch.
5. Leave unrelated WIP parked until the PR sweep classifies it.

## Issue 15: Dataviz Review Polish

### What Worked

- A maintainer-provided visual bug list was enough to drive a focused polish pass without reopening discovery from scratch.
- Converting review notes into renderer-level regression tests kept typography fitting, legend placement, axes, and big-number layout from drifting again.
- Reusing the shared shell while adding a reusable collapsible section kept the app-specific fix from becoming a one-off UI pattern.

### What Slowed Us Down

- The screenshot pass stalled when capture could not complete cleanly, which delayed handoff despite the rest of the validation already being green.
- Visual review fixes touched both editor controls and SVG layout, so the implementation map had to be restated before coding resumed.

### Skill Updates Needed

- `skills.md` should route review-driven polish passes through `design_guardian` before implementation.
- `browser_screenshot` guidance should explicitly require an immediate skip reason when capture is blocked or interrupted.

### Workflow Updates Needed

- Treat maintainer review notes as first-class QA evidence, not just as ad-hoc comments.
- Convert accepted review findings into focused regression tests during the same pass whenever feasible.
- Record screenshot skips quickly so PR prep is not blocked on tooling timeouts.

### Reusable Delivery Pattern

1. Turn reviewed bugs into a concrete implementation checklist.
2. Map each note to the current shell, renderer, or contract layer before editing.
3. Fix shared geometry or UI primitives before patching template-specific symptoms.
4. Add regression tests for each review finding that can be expressed deterministically.
5. Capture browser evidence or record an explicit skip reason immediately.

## Issue 38: Motion Preview Stability And Editor Shell Behavior

### What Worked

- Treating the maintainer repro steps as the source of truth made the preview-motion bug and the accordion overflow bug easy to reproduce without reopening discovery.
- Separating the preview bug into playback-state, render-loop, and shell-height causes prevented a superficial CSS-only fix.
- Converting the final behavior into store, shell, and component tests locked in the static-startup and fixed-pane contracts.
- Preferring Chrome DevTools MCP as the target browser tooling gives the workflow a deterministic path away from OS-level screenshot flakiness.

### What Slowed Us Down

- The initial preview fix solved autoplay churn, but the shell still resized because the controls pane owned too much height. The bug was only fully resolved after treating layout sizing and render scheduling as two separate causes.
- Shared UI primitives can hide regressions when their defaults drift. The accordion default-open contract had to be corrected after the higher-level control-panel behavior was already in place.
- Screenshot capture remained the weakest validation step when browser-native tooling was unavailable or blocked by macOS permissions.

### Skill Updates Needed

- `triage_bug` should explicitly inspect shell height contracts, overflow ownership, and render-loop lifecycles for preview movement bugs.
- `generate_tests` should keep converting maintainer review findings into deterministic regression tests in the same pass.
- `comment_issue_update` should support post-ready draft comments when maintainers want issue text prepared but not posted immediately.

### Workflow Updates Needed

- Maintainer-directed combined PRs are acceptable as explicit exceptions when the commits are separated by domain and the PR notes call out the exception.
- Frontend debugging and screenshot capture should prefer Chrome DevTools MCP whenever it is configured.
- When browser capture is blocked, record the skip reason immediately and keep the PR moving.
- Workflow reflection should capture both product learnings and process/tooling refinements from the same branch close-out.

### Reusable Delivery Pattern

1. Reproduce the bug from the maintainer’s concrete steps.
2. Separate behavior bugs into state, render-loop, and layout-contract causes before patching.
3. Lock the preview pane to the viewport and give long control sections an explicit internal scroll owner.
4. Check shared component defaults so controlled and uncontrolled paths match the intended UX.
5. Keep browser evidence deterministic with Chrome DevTools MCP when available, or record the skip reason immediately.

## Weekly Sweep 2026-03-24: Issue 46 Delivery Retry

### What Worked

- Reusing the previously prepared #46 fix commit kept this run limited to one validated bug and avoided widening scope.
- Re-running only the targeted Social Card and Data Viz regression tests confirmed parity behavior quickly.
- Creating a new issue branch from `origin/main` and cherry-picking the single fix commit preserved the one-issue-per-branch contract.

### What Slowed Us Down

- The prior fix branch name was already attached to a different local worktree, so this run needed a replacement branch suffix.
- Chrome DevTools MCP visual capture was blocked by a locked shared profile path.
- GitHub API connectivity remained intermittent: branch push succeeded, but PR creation and issue commenting failed.

### Workflow Updates Needed

- Keep PR/issue body text in temp files to avoid shell interpolation failures from markdown backticks in automation commands.
- If API calls fail but `git push` succeeds, always return the direct PR-create URL in the run summary to minimize handoff friction.

### Reusable Delivery Pattern

1. Pull backlog and select one validated bug.
2. Check committed `HEAD` and existing issue branches before coding.
3. Reapply only the minimal fix commit on a fresh issue branch when needed.
4. Run targeted regression tests first, then broader checks only if scope expands.
5. Attempt PR/comment publication, then record concrete manual follow-up links when API connectivity blocks completion.
