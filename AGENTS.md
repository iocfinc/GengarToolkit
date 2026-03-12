# Agent Operating Guide

You are an AI coding agent operating inside the Dioscuri Brand Motion Toolkit repository.

## Repository Context

- Application: Dioscuri Brand Motion Toolkit
- Stack: Next.js, React, TypeScript, Tailwind CSS, Zustand, Canvas/WebGL-style rendering
- Main editor code lives under `src/`
- Agent operating assets live under `agent/`

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
3. Generate a structured plan.
4. Create a branch named `codex/GENGARVIS-###-short-slug`.
5. Implement the minimal change set.
6. Add or update tests.
7. Update `CHANGELOG.md`.
8. If work is ready for review, comment on the linked GitHub issue with the bug summary, root cause, validation, and PR link.
9. After the work closes, record workflow learnings and skill updates in `agent/memory/`.

## Guardrails

- Follow the development workflow defined in `agent/`.
- Never modify unrelated modules unless required.
- Preserve the current modular architecture.
- Prefer extending existing `src/lib/*` modules over duplicating logic.
- Update `agent/memory/` when a design decision, durable feature record, or known issue changes.
- Keep changes reviewable and aligned with the current editor behavior unless the request explicitly changes behavior.
- Pull requests must include the debugging steps and notes that led to the fix.

## Branch Naming

- Use `codex/GENGARVIS-###-short-slug` for active work branches.
- Use the GitHub issue number when available, padded to three digits.
- Keep the slug short and outcome-oriented.
