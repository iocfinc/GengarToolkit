#!/usr/bin/env node
// export_session_transcript.mjs
// Locate a Codex session JSONL by thread ID and copy it to a destination

import fs from 'node:fs';
import fsp from 'node:fs/promises';
import path from 'node:path';
import os from 'node:os';

function die(msg, code = 1) {
  console.error(`ERROR: ${msg}`);
  process.exit(code);
}

function expandTilde(p) {
  if (!p) return p;
  if (p === '~') return os.homedir();
  if (p.startsWith('~/')) return path.join(os.homedir(), p.slice(2));
  return p;
}

function parseArgs(argv) {
  const args = { thread: null, dest: process.cwd(), codexHome: path.join(os.homedir(), '.codex'), overwrite: false };
  for (let i = 2; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--thread' && i + 1 < argv.length) { args.thread = argv[++i]; continue; }
    if (a === '--dest' && i + 1 < argv.length) { args.dest = argv[++i]; continue; }
    if (a === '--codex-home' && i + 1 < argv.length) { args.codexHome = argv[++i]; continue; }
    if (a === '--overwrite') { args.overwrite = true; continue; }
    if (a === '-h' || a === '--help') {
      console.log(`Usage: node agent/scripts/export_session_transcript.mjs --thread <id> [--dest <dir|file>] [--codex-home <path>] [--overwrite]\n`);
      process.exit(0);
    }
  }
  if (!args.thread) die('Missing required --thread <id>');
  args.dest = expandTilde(args.dest);
  args.codexHome = expandTilde(args.codexHome);
  return args;
}

async function statOrNull(p) {
  try { return await fsp.stat(p); } catch { return null; }
}

async function* walk(dir) {
  const entries = await fsp.readdir(dir, { withFileTypes: true });
  for (const e of entries) {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) {
      yield* walk(full);
    } else if (e.isFile()) {
      yield full;
    }
  }
}

async function findSessionFiles(codexHome, thread) {
  const hits = [];
  const sessionsRoot = path.join(codexHome, 'sessions');
  const archivedRoot = path.join(codexHome, 'archived_sessions');

  if (fs.existsSync(sessionsRoot)) {
    for await (const f of walk(sessionsRoot)) {
      if (f.endsWith('.jsonl') && f.includes(thread)) {
        const st = await fsp.stat(f);
        hits.push({ file: f, mtime: st.mtimeMs });
      }
    }
  }
  if (fs.existsSync(archivedRoot)) {
    for await (const f of walk(archivedRoot)) {
      if (f.endsWith('.jsonl') && f.includes(thread)) {
        const st = await fsp.stat(f);
        hits.push({ file: f, mtime: st.mtimeMs });
      }
    }
  }
  hits.sort((a, b) => b.mtime - a.mtime);
  return hits.map(h => h.file);
}

function toSlug(name) {
  return String(name).trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
}

async function main() {
  const args = parseArgs(process.argv);
  const { thread } = args;

  const matches = await findSessionFiles(args.codexHome, thread);
  if (!matches.length) die(`No session JSONL found for thread ${thread} under ${args.codexHome}`);
  const src = matches[0];

  // Determine destination path
  const destStat = await statOrNull(args.dest);
  let destFile = args.dest;
  if (!destStat || destStat.isDirectory()) {
    const repoSlug = toSlug(path.basename(process.cwd()));
    const base = `${repoSlug ? repoSlug + '-' : ''}thread-${thread}.jsonl`;
    const targetDir = destStat && destStat.isDirectory() ? args.dest : process.cwd();
    destFile = path.join(targetDir, base);
  }

  if (!args.overwrite) {
    const existing = await statOrNull(destFile);
    if (existing) die(`Destination exists: ${destFile}. Use --overwrite to replace.`);
  }

  // Ensure parent dir exists
  await fsp.mkdir(path.dirname(destFile), { recursive: true });
  await fsp.copyFile(src, destFile);
  const abs = path.resolve(destFile);
  console.log(`EXPORTED: ${abs}`);
}

main().catch(err => die(err?.message || String(err)));

