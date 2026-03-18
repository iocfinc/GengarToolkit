# GitHub Event Workflow Map

This repository uses GitHub events to drive a structured agentic development cycle.

## Lifecycle

Scheduled backlog sweep -> `run_backlog_cycle` -> `read_issue` -> `plan_feature` or `triage_bug` -> implementation -> `generate_tests` -> browser debug and screenshot validation for frontend work -> Pull Request -> `analyze_pr` -> merge -> `write_changelog`

Before PR creation for issue-linked work, run `comment_issue_update`.
After merge, record learnings in `agent/memory/`.

## Event: Scheduled Or Manual Backlog Sweep

- Trigger source: GitHub `workflow_dispatch` or `schedule`
- Skill: `run_backlog_cycle`
- Expected inputs: open GitHub issues, feature requests, and GitHub CLI access
- Required output: one validated bug candidate, one validated feature candidate, roadmap deferrals, implementation order, branch mode, evidence plan, and completion criteria
- Human or agent follow-up: create separate branches and separate PRs, or route ambiguous features into `agent/memory/roadmap.md`
- Matching GitHub workflow file: `.github/workflows/backlog-scan.yml`

## Event: Issue Opened Or Edited

- Trigger source: GitHub `issues` event on `opened` and `edited`
- Skill: `read_issue`
- Expected inputs: issue title, body, labels, linked screenshots or reproduction notes
- Required output: issue type, priority, affected components, recommended next skill
- Human or agent follow-up: route the issue to `plan_feature`, `triage_bug`, documentation work, or refactor work, then choose the relevant sub-agents from `skills.md`
- Matching GitHub workflow file: `.github/workflows/issue-intake.yml`

## Event: Issue Labeled `bug`

- Trigger source: GitHub `issues` event on `labeled`
- Skill: `triage_bug`
- Expected inputs: bug label, issue details, reproduction steps, environment notes
- Required output: bug summary, possible root causes, code areas to inspect, proposed fix, tests required
- Human or agent follow-up: confirm repro, use `bounty_hunter` for UI-facing issues, and implement the narrowest fix
- Matching GitHub workflow file: `.github/workflows/bug-triage.yml`

## Event: Issue Classified As Feature

- Trigger source: output from `read_issue` or manual maintainer routing
- Skill: `plan_feature`
- Expected inputs: accepted feature request, desired outcome, acceptance criteria
- Required output: structured feature plan with module, test, and changelog impact
- Human or agent follow-up: implement the planned change with the bounded sub-agents from `skills.md`, or route the request to `agent/memory/roadmap.md` if it is valid but under-specified
- Matching GitHub workflow file: repository process, referenced by `.github/ISSUE_TEMPLATE/feature_request.yml`

## Event: Implementation Complete

- Trigger source: implementation branch ready for review
- Skill: `generate_tests`
- Expected inputs: changed files, feature or fix summary, expected behavior
- Required output: test coverage plan and runnable tests
- Human or agent follow-up: run `sniper` for frontend-affecting work when browser tooling is available, then open or update a pull request
- Matching GitHub workflow file: `.github/workflows/pr-review.yml`

## Event: PR Ready For Review

- Trigger source: branch is committed and PR is about to be opened
- Skill: `comment_issue_update`
- Expected inputs: issue number, root cause, fix summary, validation, PR URL
- Required output: a short issue comment linking the work back to the issue, including evidence notes, screenshot artifact paths, or a documented skip reason when relevant, or a post-ready draft when live posting is deferred
- Human or agent follow-up: open or refresh the pull request
- Matching GitHub workflow file: repository process before PR review

## Event: Pull Request Opened Or Updated

- Trigger source: GitHub `pull_request` event on `opened`, `synchronize`, and `reopened`
- Skill: `analyze_pr`
- Expected inputs: PR body, diff, workflow results, linked issues
- Required output: PR summary, architecture impact, code quality review, risks, test coverage analysis, visual-validation review, and suggested improvements
- Human or agent follow-up: address findings and keep `CHANGELOG.md` current
- Matching GitHub workflow file: `.github/workflows/pr-review.yml`

## Event: Pull Request Merged

- Trigger source: GitHub `pull_request` event on `closed` when merged
- Skill: `write_changelog`
- Expected inputs: merged PR details, changed files, version context
- Required output: changelog update or follow-up issue if a changelog entry is missing
- Human or agent follow-up: confirm release notes quality and log workflow learnings in `agent/memory/`
- Matching GitHub workflow file: `.github/workflows/post-merge-changelog.yml`
