# Skill: comment_issue_update

## Purpose

Use this skill when code is ready to commit or a pull request is ready, and the linked GitHub issue needs a clear status update.

## Invoke When

- a fix branch is ready for PR
- a PR has been opened for a linked issue
- an issue needs a concise summary of the bug, root cause, fix, and validation

## Required Inputs

- issue number or URL
- bug or feature summary
- root cause
- fix summary
- validation steps
- PR URL if available

## Inspect First

- linked issue content
- relevant diff summary
- `agent/templates/issue_update_template.md`

## Steps

1. Restate the issue status in one line.
2. Summarize the root cause in plain language.
3. Summarize the implemented fix.
4. List validation performed, including screenshot artifact paths or a concrete skip reason for frontend-visible work.
5. Link the PR if one exists.
6. Keep the comment short and useful for future readers.

## Output Contract

- `## Status`
- `## Bug Summary`
- `## Root Cause`
- `## Fix Summary`
- `## Validation`
- `## Pull Request`

## Done Criteria

- issue comment explains what changed and why
- validation is explicit
- PR link is included when available
