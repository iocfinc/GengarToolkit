# Agent Operating Guide

You are an AI coding agent operating inside the Dioscuri Brand Motion Toolkit repository.

## Repository Context

- Application: Dioscuri Brand Motion Toolkit
- Stack: Next.js, React, TypeScript, Tailwind CSS, Zustand, Canvas/WebGL-style rendering
- Main editor code lives under `src/`
- Agent operating assets live under `agent/`
- Codex runtime sub-agent profiles live under `agents/` and `.codex/`

## Responsibilities

- implement features
- fix bugs
- review pull requests
- write tests
- maintain documentation
- update changelogs

## Required Workflow

Before implementing code changes:

1. Identify request type: feature, bug, refactor, or documentation.
2. Invoke the appropriate skill from `agent/skills/`.
3. For non-trivial work, load the lead/sub-agent guidance in `skills.md` and delegate bounded exploration, implementation, QA, or docs tasks through the tracked profiles in `.codex/config.toml` and `agents/`.
4. Generate a structured plan.
5. Decide implementation order and whether any valid features should be deferred to `agent/memory/roadmap.md`.
6. For frontend-affecting work, include a browser visual-validation pass and capture screenshot artifacts when browser tooling is available. For terminal or desktop-app workflow fixes, capture equivalent screenshot evidence with the screenshot skill.
7. If the workflow itself needs changes to support the run, land those workflow updates before spawning dependent issue branches.
8. Create a branch named `codex/GENGARVIS-###-short-slug`.
9. Implement the minimal change set.
10. Add or update tests.
11. Update `CHANGELOG.md`.
12. If work is ready for review, comment on the linked GitHub issue with the bug summary, root cause, validation, and PR link.
13. After the work closes, record workflow learnings and skill updates in `agent/memory/`.

## Branching Modes

- Issue Mode is the default: one issue per branch and one issue per pull request.
- Cycle Mode is allowed only when a maintainer explicitly requests it for a shared delivery stream.
- In Cycle Mode, use one branch such as `codex/GENGARVIS-###-cycle-short-slug` and keep one checkpoint commit per issue or feature slice.
- In Cycle Mode, write the implementation order down before coding and keep unrelated WIP parked until the pre-PR sweep.
- Prefer commit subjects that include the issue reference and an outcome-oriented summary.

## Guardrails

- Follow the development workflow defined in `agent/`.
- Plan merge order before opening multiple issue branches.
- Never modify unrelated modules unless required.
- Preserve the current modular architecture.
- Prefer extending existing `src/lib/*` modules over duplicating logic.
- Update `agent/memory/` when a design decision, durable feature record, or known issue changes.
- Keep changes reviewable and aligned with the current editor behavior unless the request explicitly changes behavior.
- Keep one issue or feature per pull request. If a valid feature would widen or block bug-fix work, add it to `agent/memory/roadmap.md` and keep the issue open.
- Pull requests must include the debugging steps and notes that led to the fix.
- Frontend-affecting work should include visual QA artifacts or an explicit skip reason in the PR notes. Terminal or desktop-app workflow fixes should include equivalent screenshot evidence or a documented skip reason.

## Branch Naming

- Use `codex/GENGARVIS-###-short-slug` for active work branches.
- Use the GitHub issue number when available, padded to three digits.
- Keep the slug short and outcome-oriented.

## Verified Commands

- `npm run backlog:scan` to fetch and summarize open GitHub issues for autonomous backlog work.
- `npm install` to install dependencies.
- `npm run dev` to run the editor locally.
- `npm run test` for local test runs.
- `npm run test:watch` for iterative testing.
- `npm run test:ci` for CI-style test execution (used in PR workflow).
- `npm run lint` for lint checks.
- `npm run build` for production build validation.

## GitHub Workflow Hooks

- `.github/workflows/issue-intake.yml` posts issue intake guidance and routes to `agent/skills/read_issue.md`.
- `.github/workflows/bug-triage.yml` triggers on `bug` label and routes to `agent/skills/triage_bug.md`.
- `.github/workflows/backlog-scan.yml` summarizes open issues and routes autonomous backlog work to `agent/skills/run_backlog_cycle.md`.
- `.github/workflows/pr-review.yml` runs `npm ci`, executes `npm run test:ci`, and posts review guidance for `agent/skills/analyze_pr.md`.
- `.github/workflows/changelog-guard.yml` requires `CHANGELOG.md` updates when `src/`, `agent/`, or `.github/` changes are included without a `skip-changelog` label.
- `.github/workflows/post-merge-changelog.yml` opens a follow-up issue to run `agent/skills/write_changelog.md` when merged tracked changes missed `CHANGELOG.md`.
- Frontend review readiness should include `browser_debugger` plus `browser_screenshot` when browser tooling is available. Terminal/app workflow review readiness should include a screenshot artifact path and a short note on what the capture proves.
