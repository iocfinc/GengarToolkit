#!/usr/bin/env node

import { execFileSync } from 'node:child_process';
import { buildBacklogPlan, formatBacklogPlan } from '../lib/backlogQueue.mjs';

function parseArgs(argv) {
  const options = {
    format: 'markdown',
    limit: 50
  };

  for (let index = 0; index < argv.length; index += 1) {
    const argument = argv[index];

    if (argument === '--format') {
      options.format = argv[index + 1] ?? options.format;
      index += 1;
    } else if (argument === '--limit') {
      const parsed = Number.parseInt(argv[index + 1] ?? '', 10);
      if (Number.isFinite(parsed) && parsed > 0) {
        options.limit = parsed;
      }
      index += 1;
    }
  }

  return options;
}

function fetchOpenIssues(limit) {
  const output = execFileSync(
    'gh',
    [
      'issue',
      'list',
      '--state',
      'open',
      '--limit',
      String(limit),
      '--json',
      'number,title,body,labels,url'
    ],
    {
      encoding: 'utf8'
    }
  );

  return JSON.parse(output);
}

function main() {
  const options = parseArgs(process.argv.slice(2));

  try {
    const issues = fetchOpenIssues(options.limit);
    const plan = buildBacklogPlan(issues);

    if (options.format === 'json') {
      process.stdout.write(`${JSON.stringify(plan, null, 2)}\n`);
      return;
    }

    process.stdout.write(`${formatBacklogPlan(plan)}\n`);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    process.stderr.write(
      `Failed to scan the backlog with GitHub CLI. Confirm \`gh auth status\` and repository access.\n${message}\n`
    );
    process.exitCode = 1;
  }
}

main();
