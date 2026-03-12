import { describe, expect, it } from 'vitest';
import {
  assessIssue,
  buildBacklogPlan,
  detectIssueType,
  formatBacklogPlan
} from '../agent/lib/backlogQueue.mjs';

describe('backlogQueue', () => {
  const issues = [
    {
      number: 12,
      title: '[Bug]: Export dialog closes too early',
      body: `
## Summary
The export dialog closes before the download starts.

## Reproduction steps
1. Open /editor
2. Choose WEBM export
3. Click Export

## Expected behavior
The dialog stays open until the export starts.

## Actual behavior
The dialog closes immediately.
      `,
      labels: [{ name: 'bug' }],
      url: 'https://example.com/issues/12'
    },
    {
      number: 14,
      title: '[Feature]: Save roadmap candidates from issue triage',
      body: `
## Problem or opportunity
Maintainers lose context on valid ideas that should wait for discussion.

## Proposed change
Add a repository roadmap file for deferred feature requests.

## Success criteria
Ambiguous but valid features are written into a roadmap instead of guessed into code.

## Constraints or scope notes
Do not block bug fixes on roadmap work.
      `,
      labels: [{ name: 'enhancement' }],
      url: 'https://example.com/issues/14'
    },
    {
      number: 18,
      title: '[Feature]: Rebuild the entire editor',
      body: `
## Problem or opportunity
We should make the toolkit better.

## Proposed change
Replace the editor with a new architecture.
      `,
      labels: [{ name: 'discussion' }],
      url: 'https://example.com/issues/18'
    },
    {
      number: 20,
      title: '[Bug]: Something is broken',
      body: `
## Summary
The editor broke.
      `,
      labels: [{ name: 'bug' }],
      url: 'https://example.com/issues/20'
    }
  ];

  it('detects issue type from labels and templates', () => {
    expect(detectIssueType(issues[0])).toBe('bug');
    expect(detectIssueType(issues[1])).toBe('feature');
  });

  it('routes incomplete bugs to needs-info and discussion features to roadmap', () => {
    expect(assessIssue(issues[2])).toMatchObject({
      type: 'feature',
      decision: 'roadmap'
    });

    expect(assessIssue(issues[3])).toMatchObject({
      type: 'bug',
      decision: 'needs-info'
    });
  });

  it('selects one validated bug and one validated feature for implementation', () => {
    const plan = buildBacklogPlan(issues);

    expect(plan.selected.bug).toMatchObject({
      number: 12,
      decision: 'implement'
    });
    expect(plan.selected.feature).toMatchObject({
      number: 14,
      decision: 'implement'
    });
    expect(plan.roadmap).toHaveLength(1);
    expect(plan.needsInfo).toHaveLength(1);
  });

  it('formats the plan with the workflow headings agents rely on', () => {
    const formatted = formatBacklogPlan(buildBacklogPlan(issues));

    expect(formatted).toContain('# Autonomous Backlog Plan');
    expect(formatted).toContain('## Selected Bug Fix');
    expect(formatted).toContain('## Selected Feature');
    expect(formatted).toContain('## Roadmap Candidates');
    expect(formatted).toContain('## Needs More Input');
    expect(formatted).toContain('one bug or feature per pull request');
  });
});
