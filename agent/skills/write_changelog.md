# Skill: write_changelog

## Purpose

Use this skill to maintain `CHANGELOG.md` after merged work or release-prep changes.

## Invoke When

- a pull request is merged
- a feature, fix, or workflow change needs release notes
- documentation requires a changelog entry

## Required Inputs

- merged change summary
- affected modules
- version information from `package.json`

## Inspect First

- `CHANGELOG.md`
- `package.json`
- merged PR description or diff summary
- `agent/templates/changelog_entry_template.md`

## Steps

1. Read the topmost version section in `CHANGELOG.md`.
2. If `package.json` version changed, add or update the matching version heading.
3. Otherwise update the current topmost version section.
4. Sort each entry into `Added`, `Changed`, `Fixed`, or `Removed`.
5. Keep entries concise and user-readable.

## Output Contract

- updated changelog section with categorized entries

## Done Criteria

- changelog is updated in the correct version section
- entries reflect the actual merged behavior
- unrelated categories are not modified
