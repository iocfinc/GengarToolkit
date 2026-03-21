# Skill: create_announcement_asset

## Purpose

Use this skill when a release, cycle checkpoint, or PR needs a launch announcement generated through the Social Card Toolkit instead of ad-hoc copy or external design tools.

## Invoke When

- a feature branch is ready for PR and needs a visual announcement asset
- a cycle checkpoint should be dogfooded through the Social Card Toolkit
- the team wants a saved launch preset for repeated announcement work

## Required Inputs

- launch summary
- audience or channel
- headline, subheadline, deeper body copy, and CTA
- preferred output preset
- preferred theme or palette direction

## Inspect First

- `apps/social-card-toolkit/src/framework/registry.ts`
- `apps/social-card-toolkit/src/SocialCardToolkitPage.tsx`
- `CHANGELOG.md`
- the branch diff or PR summary

## Steps

1. Start from the shipped announcement preset when it fits; otherwise clone the closest saved social-card preset.
2. Rewrite the title for the top-line launch message.
3. Use the subtitle and body to explain shipped features, workflow gains, and what changed for the team.
4. Keep the CTA short and imperative.
5. Prefer approved brand tokens and themes; for Dioscuri launch cards, default to the Gengar/Kirby direction by combining `dark-editorial` with `violetMist` or `blush` accents.
6. Save the updated card as a named preset so the asset can be reopened without rebuilding the copy.
7. Capture screenshot proof and, when needed, export SVG/PNG artifacts for PR notes.
8. Reference the announcement artifact path in the PR body or issue update.

## Output Contract

- announcement preset name
- final launch copy
- chosen output preset and palette direction
- screenshot or export artifact paths
- PR-note blurb for the asset

## Done Criteria

- the launch asset exists in the Social Card Toolkit flow
- the preset is saved and reusable
- artifact paths are captured
- the PR notes mention the announcement asset
