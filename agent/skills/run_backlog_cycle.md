# Skill: run_backlog_cycle

## Purpose

Use this skill to autonomously work the open GitHub backlog: validate issues, select one bug and one feature, implement them in separate pull requests, and capture the workflow reflection afterward.

## Invoke When

- a maintainer asks for an autonomous backlog sweep
- the agent is asked to pull open issues and feature requests from the repository
- a scheduled backlog review needs a decision on implement now versus roadmap later

## Required Inputs

- repository with GitHub CLI access
- open GitHub issues and feature requests
- current branch or permission to create `codex/GENGARVIS-###-short-slug` branches

## Inspect First

- `AGENTS.md`
- `agent/scripts/backlog_sweep.mjs`
- `agent/lib/backlogQueue.mjs`
- `agent/memory/roadmap.md`
- `agent/templates/backlog_cycle_template.md`
- `agent/workflows/github_events.md`

## Steps

1. Run `npm run backlog:scan -- --format markdown` to fetch and summarize open GitHub issues.
2. Treat the scan as the intake queue, then run `agent/skills/read_issue.md` on the selected candidates to confirm type and priority.
3. For the top validated bug, run `agent/skills/triage_bug.md` and confirm the issue is reproducible before writing code.
4. For the top validated feature, run `agent/skills/plan_feature.md` and confirm the request is feasible without extra product input.
5. If a feature is promising but under-specified, add it to `agent/memory/roadmap.md` instead of guessing at behavior.
6. Select at most one bug fix and one feature for active implementation per cycle, but move a valid feature to the roadmap if it would widen or block the bug-fix sequence.
7. If the repo workflow or automation needs changes to support the cycle, merge that workflow PR first before creating dependent issue branches.
8. Create separate branches and separate pull requests. Never combine multiple fixes or a fix and a feature in the same merge request.
9. Implement the minimal change set for each item, add tests with `agent/skills/generate_tests.md`, and update `CHANGELOG.md`.
10. For frontend-affecting work, run `browser_debugger` and `browser_screenshot` before PR preparation when browser tooling is available.
11. Before opening or updating a PR, run `agent/skills/comment_issue_update.md` so the linked issue records summary, root cause or rationale, validation, PR link, and any visual-validation artifact notes.
12. Mark the work complete only when validation confirms the bug fix or feature behavior and the PR has been pushed for review.
13. After the delivery step, record what worked, what slowed the task down, and any needed skill or workflow updates in `agent/memory/workflow_learnings.md`.

## Output Contract

- `## Queue Summary`
- `## Validation Decisions`
- `## Selected Bug Fix`
- `## Selected Feature`
- `## Roadmap Decisions`
- `## Delivery Plan`
- `## Completion Check`

## Done Criteria

- open issues were pulled from GitHub rather than assumed
- invalid or ambiguous work is either left for more input or moved into the roadmap
- exactly one issue or feature is shipped per pull request, with workflow infrastructure merged first when needed
- completion is tied to validation plus a pushed PR
- workflow reflection is logged after delivery
