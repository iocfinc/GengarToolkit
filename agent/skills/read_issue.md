# Skill: read_issue

## Purpose

Use this skill to classify GitHub issues before planning or implementation starts.

## Invoke When

- a GitHub issue is opened or edited
- a user provides an issue-like problem statement without classification

## Required Inputs

- issue title
- issue body
- labels or metadata if available

## Inspect First

- issue content
- `README.md`
- `AGENTS.md`
- relevant `src/components/editor/*` or `src/lib/*` modules if the issue names a subsystem

## Steps

1. Determine whether the issue is a feature, bug, documentation task, or refactor.
2. Assess priority: low, medium, or high.
3. Identify affected components or subsystems.
4. Choose the next skill.

## Output Contract

- `Issue Type`
- `Priority`
- `Affected Components`
- `Recommended Next Skill`
- `Recommended Branch Name`

## Done Criteria

- issue type is unambiguous
- priority is justified by impact
- next skill is actionable
- branch name follows `codex/GENGARVIS-###-short-slug`
