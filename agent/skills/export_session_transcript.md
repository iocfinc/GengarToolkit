# Skill: export_session_transcript

## Purpose

Fetch the full Codex session transcript (JSONL with messages, tool calls, and events) by thread ID and copy it to a review/audit location (e.g., `~/Desktop/Dioscuri`).

## Invoke When

- A maintainer asks to copy/export a session/thread transcript for audit or review.
- A PR needs an attached artifact showing the interactive development trail.

## Required Inputs

- `thread_id` (e.g., `019cf437-c52d-78b0-b5ea-c294c9107579`).
- Destination file path or directory (defaults to CWD when omitted).  
  Example: `~/Desktop/Dioscuri`.

## Uses

- Script: `agent/scripts/export_session_transcript.mjs`
- Codex session store: `$CODEX_HOME/sessions` and `$CODEX_HOME/archived_sessions`  
  (`$CODEX_HOME` defaults to `~/.codex`)

## Steps

1. Locate transcript
   - The script searches `$CODEX_HOME/sessions/**/rollout-*-<thread_id>.jsonl`.
   - If not found, it searches `$CODEX_HOME/archived_sessions/*<thread_id>*.jsonl`.
   - If multiple matches exist, the most recent by mtime is selected.
2. Choose destination
   - If `--dest` is a directory, the script writes a file named `<repo-slug>-thread-<thread_id>.jsonl`.
   - If `--dest` is a file path, that exact path is used.
3. Copy + report
   - The script copies the JSONL and prints the destination path.

## Command

- From repo root:
  - `node agent/scripts/export_session_transcript.mjs --thread 019cf437-c52d-78b0-b5ea-c294c9107579 --dest ~/Desktop/Dioscuri`

## Options

- `--thread <id>`: required thread ID.
- `--dest <dir|file>`: destination directory or full filename. Defaults to current directory.
- `--codex-home <path>`: override Codex home (default `~/.codex`).
- `--overwrite`: allow overwriting an existing destination file.

## Output Contract

- Prints a single line starting with `EXPORTED:` followed by the absolute destination path.
- Non-zero exit with a clear error message when the thread is not found or destination is not writable.

## Done Criteria

- The correct JSONL for the given `thread_id` exists at the requested destination.
- Filename is stable and includes the repo slug and thread ID when `--dest` is a directory.

