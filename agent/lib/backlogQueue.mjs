const BUG_LABELS = new Set(['bug', 'type: bug', 'type/bug']);
const FEATURE_LABELS = new Set([
  'feature',
  'feature request',
  'enhancement',
  'type: feature',
  'type/feature'
]);
const DOC_LABELS = new Set(['documentation', 'docs', 'type: docs']);
const REFACTOR_LABELS = new Set(['refactor', 'chore', 'maintenance']);
const ROADMAP_LABELS = new Set(['roadmap', 'needs discussion', 'discussion', 'idea']);
const HIGH_PRIORITY_LABELS = new Set([
  'p0',
  'p1',
  'priority: high',
  'priority/high',
  'high priority',
  'critical',
  'sev1',
  'severity: critical'
]);
const MEDIUM_PRIORITY_LABELS = new Set([
  'p2',
  'priority: medium',
  'priority/medium',
  'medium priority',
  'sev2'
]);

function normalizeText(value) {
  return (value ?? '').toString().trim();
}

export function normalizeLabels(labels = []) {
  return labels
    .map((label) => {
      if (typeof label === 'string') {
        return label.toLowerCase().trim();
      }

      return normalizeText(label?.name).toLowerCase();
    })
    .filter(Boolean);
}

function includesAny(values, candidates) {
  return values.some((value) => candidates.has(value));
}

function detectBodySignals(body) {
  const normalizedBody = normalizeText(body).toLowerCase();

  return {
    hasSummary: normalizedBody.includes('summary'),
    hasSteps:
      normalizedBody.includes('reproduction steps') ||
      normalizedBody.includes('steps to reproduce') ||
      normalizedBody.includes('\n1.'),
    hasExpected: normalizedBody.includes('expected behavior'),
    hasActual: normalizedBody.includes('actual behavior'),
    hasProblem:
      normalizedBody.includes('problem or opportunity') || normalizedBody.includes('problem statement'),
    hasProposal:
      normalizedBody.includes('proposed change') || normalizedBody.includes('proposal'),
    hasSuccess:
      normalizedBody.includes('success criteria') || normalizedBody.includes('acceptance criteria'),
    hasScope:
      normalizedBody.includes('constraints or scope notes') || normalizedBody.includes('scope')
  };
}

export function detectIssueType(issue) {
  const labels = normalizeLabels(issue?.labels);
  const title = normalizeText(issue?.title).toLowerCase();
  const signals = detectBodySignals(issue?.body);

  if (includesAny(labels, BUG_LABELS) || title.startsWith('[bug]') || title.startsWith('[bug]:')) {
    return 'bug';
  }

  if (
    includesAny(labels, FEATURE_LABELS) ||
    title.startsWith('[feature]') ||
    title.startsWith('[feature]:') ||
    (signals.hasProblem && signals.hasProposal)
  ) {
    return 'feature';
  }

  if (includesAny(labels, DOC_LABELS)) {
    return 'documentation';
  }

  if (includesAny(labels, REFACTOR_LABELS)) {
    return 'refactor';
  }

  if (signals.hasSteps && signals.hasExpected && signals.hasActual) {
    return 'bug';
  }

  return 'unknown';
}

export function determinePriority(issue, issueType = detectIssueType(issue)) {
  const labels = normalizeLabels(issue?.labels);

  if (includesAny(labels, HIGH_PRIORITY_LABELS)) {
    return 'high';
  }

  if (includesAny(labels, MEDIUM_PRIORITY_LABELS)) {
    return 'medium';
  }

  if (issueType === 'bug') {
    const signals = detectBodySignals(issue?.body);

    if (signals.hasSteps && signals.hasExpected && signals.hasActual) {
      return 'medium';
    }
  }

  if (issueType === 'feature') {
    const signals = detectBodySignals(issue?.body);

    if (signals.hasProblem && signals.hasProposal && signals.hasSuccess) {
      return 'medium';
    }
  }

  return 'low';
}

export function assessIssue(issue) {
  const type = detectIssueType(issue);
  const priority = determinePriority(issue, type);
  const labels = normalizeLabels(issue?.labels);
  const signals = detectBodySignals(issue?.body);
  const summary = {
    number: issue?.number ?? null,
    title: normalizeText(issue?.title),
    url: normalizeText(issue?.url),
    type,
    priority,
    labels
  };

  if (type === 'bug') {
    const isValid = signals.hasSteps && signals.hasExpected && signals.hasActual;

    return {
      ...summary,
      isValid,
      decision: isValid ? 'implement' : 'needs-info',
      reason: isValid
        ? 'Bug report has enough reproduction detail to validate and fix.'
        : 'Bug report is missing reproducible steps or expected/actual behavior.'
    };
  }

  if (type === 'feature') {
    const isRoadmapCandidate = includesAny(labels, ROADMAP_LABELS);
    const isValid = signals.hasProblem && signals.hasProposal && signals.hasSuccess;

    if (isRoadmapCandidate) {
      return {
        ...summary,
        isValid: false,
        decision: 'roadmap',
        reason: 'Feature is explicitly marked for discussion or roadmap review.'
      };
    }

    return {
      ...summary,
      isValid,
      decision: isValid ? 'implement' : 'roadmap',
      reason: isValid
        ? 'Feature request includes problem, proposal, and success criteria.'
        : 'Feature request needs product discussion or clearer acceptance criteria.'
    };
  }

  return {
    ...summary,
    isValid: false,
    decision: 'ignore',
    reason: 'Issue is not a backlog candidate for the autonomous bug/feature loop.'
  };
}

function priorityScore(priority) {
  if (priority === 'high') {
    return 300;
  }

  if (priority === 'medium') {
    return 200;
  }

  return 100;
}

function decisionScore(decision) {
  if (decision === 'implement') {
    return 40;
  }

  if (decision === 'roadmap') {
    return 10;
  }

  return -50;
}

function typeScore(type) {
  if (type === 'bug') {
    return 20;
  }

  if (type === 'feature') {
    return 10;
  }

  return 0;
}

function compareCandidates(left, right) {
  const leftScore = priorityScore(left.priority) + decisionScore(left.decision) + typeScore(left.type);
  const rightScore = priorityScore(right.priority) + decisionScore(right.decision) + typeScore(right.type);

  if (leftScore !== rightScore) {
    return rightScore - leftScore;
  }

  return (right.number ?? 0) - (left.number ?? 0);
}

export function buildBacklogPlan(issues = []) {
  const assessed = issues.map(assessIssue).sort(compareCandidates);
  const bugCandidates = assessed.filter((issue) => issue.type === 'bug' && issue.decision === 'implement');
  const featureCandidates = assessed.filter(
    (issue) => issue.type === 'feature' && issue.decision === 'implement'
  );

  return {
    summary: {
      totalOpen: issues.length,
      bugs: assessed.filter((issue) => issue.type === 'bug').length,
      features: assessed.filter((issue) => issue.type === 'feature').length,
      roadmap: assessed.filter((issue) => issue.decision === 'roadmap').length,
      needsInfo: assessed.filter((issue) => issue.decision === 'needs-info').length
    },
    selected: {
      bug: bugCandidates[0] ?? null,
      feature: featureCandidates[0] ?? null
    },
    roadmap: assessed.filter((issue) => issue.decision === 'roadmap'),
    needsInfo: assessed.filter((issue) => issue.decision === 'needs-info'),
    ignored: assessed.filter((issue) => issue.decision === 'ignore'),
    assessed
  };
}

function formatCandidate(issue) {
  const identifier = issue.number ? `#${issue.number}` : 'untracked';
  const urlSuffix = issue.url ? ` (${issue.url})` : '';
  return `- ${identifier} [${issue.priority}] ${issue.title}: ${issue.reason}${urlSuffix}`;
}

function formatSelectedCandidate(title, issue, fallback) {
  if (!issue) {
    return `${title}\n\n- ${fallback}\n`;
  }

  return `${title}\n\n${formatCandidate(issue)}\n`;
}

export function formatBacklogPlan(plan) {
  const lines = [
    '# Autonomous Backlog Plan',
    '',
    '## Queue Summary',
    '',
    `- Total open issues: ${plan.summary.totalOpen}`,
    `- Bug candidates: ${plan.summary.bugs}`,
    `- Feature candidates: ${plan.summary.features}`,
    `- Roadmap candidates: ${plan.summary.roadmap}`,
    `- Needs more input: ${plan.summary.needsInfo}`,
    '',
    formatSelectedCandidate(
      '## Selected Bug Fix',
      plan.selected.bug,
      'No validated bug is ready. Leave the issue open and request reproduction detail instead of guessing.'
    ),
    formatSelectedCandidate(
      '## Selected Feature',
      plan.selected.feature,
      'No validated feature is ready. Route ambiguous requests into the roadmap for discussion.'
    ),
    '## Roadmap Candidates',
    ''
  ];

  if (plan.roadmap.length === 0) {
    lines.push('- None');
  } else {
    lines.push(...plan.roadmap.map(formatCandidate));
  }

  lines.push('', '## Needs More Input', '');

  if (plan.needsInfo.length === 0) {
    lines.push('- None');
  } else {
    lines.push(...plan.needsInfo.map(formatCandidate));
  }

  lines.push(
    '',
    '## Next Actions',
    '',
    '- Run `agent/skills/read_issue.md` on each selected issue before implementation.',
    '- Use `agent/skills/triage_bug.md` for the bug and `agent/skills/plan_feature.md` for the feature.',
    '- Keep one issue per branch and one bug or feature per pull request.',
    '- Mark work complete only after validation passes and the pull request is pushed for review.',
    '- Record roadmap decisions in `agent/memory/roadmap.md` and post-task reflections in `agent/memory/workflow_learnings.md`.'
  );

  return lines.join('\n');
}
