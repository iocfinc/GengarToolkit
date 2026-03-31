#!/usr/bin/env node

import { execFileSync } from 'node:child_process';
import { mkdirSync } from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import {
  normalizeSession,
  selectSession,
  describeSession
} from '../lib/itermSessionTargeting.mjs';

const ITERM_SESSIONS_JXA = `
const app = Application('iTerm');
const sessions = [];
for (const window of app.windows()) {
  const windowId = Number(window.id());
  for (const tab of window.tabs()) {
    for (const session of tab.sessions()) {
      const fullText = String(session.contents() || '');
      sessions.push({
        windowId,
        sessionId: String(session.id()),
        title: String(session.name() || ''),
        tty: String(session.tty() || ''),
        textPreview: fullText.slice(-600)
      });
    }
  }
}
JSON.stringify(sessions);
`;

function parseArgs(argv) {
  const options = {
    list: false,
    output: '',
    sessionId: null,
    windowId: null,
    titleContains: null,
    textContains: null,
    tty: null
  };

  for (let index = 0; index < argv.length; index += 1) {
    const argument = argv[index];

    switch (argument) {
      case '--list':
        options.list = true;
        break;
      case '--output':
        options.output = argv[index + 1] ?? '';
        index += 1;
        break;
      case '--session-id':
        options.sessionId = argv[index + 1] ?? null;
        index += 1;
        break;
      case '--window-id':
        options.windowId = argv[index + 1] ?? null;
        index += 1;
        break;
      case '--title-contains':
        options.titleContains = argv[index + 1] ?? null;
        index += 1;
        break;
      case '--text-contains':
        options.textContains = argv[index + 1] ?? null;
        index += 1;
        break;
      case '--tty':
        options.tty = argv[index + 1] ?? null;
        index += 1;
        break;
      case '--help':
      case '-h':
        options.help = true;
        break;
      default:
        break;
    }
  }

  return options;
}

function printUsage() {
  process.stdout.write(`Usage:\n`);
  process.stdout.write(`  node agent/scripts/capture_iterm_proof.mjs --list\n`);
  process.stdout.write(
    `  node agent/scripts/capture_iterm_proof.mjs --output <path> [--session-id <id> | --window-id <id>] [--title-contains <text>] [--text-contains <text>] [--tty <tty>]\n`
  );
}

function fetchSessions() {
  const output = execFileSync('osascript', ['-l', 'JavaScript', '-e', ITERM_SESSIONS_JXA], {
    encoding: 'utf8'
  });

  const parsed = JSON.parse(output);
  if (!Array.isArray(parsed)) return [];
  return parsed.map(normalizeSession);
}

function ensureParentDirectory(filePath) {
  const absolutePath = path.resolve(filePath);
  mkdirSync(path.dirname(absolutePath), { recursive: true });
  return absolutePath;
}

function captureWindow(windowId, outputPath) {
  execFileSync('screencapture', ['-x', '-l', String(windowId), outputPath], { stdio: 'inherit' });
}

function main() {
  const options = parseArgs(process.argv.slice(2));
  if (options.help) {
    printUsage();
    return;
  }

  try {
    const sessions = fetchSessions();

    if (options.list) {
      process.stdout.write(`${JSON.stringify(sessions, null, 2)}\n`);
      return;
    }

    if (!options.output) {
      throw new Error('Missing required --output <path>.');
    }

    const target = selectSession(sessions, options);
    const absoluteOutputPath = ensureParentDirectory(options.output);
    captureWindow(target.windowId, absoluteOutputPath);

    process.stdout.write(
      `${JSON.stringify(
        {
          outputPath: absoluteOutputPath,
          selectedSession: target,
          selectedSummary: describeSession(target)
        },
        null,
        2
      )}\n`
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    process.stderr.write(`capture_iterm_proof failed: ${message}\n`);
    process.exitCode = 1;
  }
}

main();
