# Skill: manage_chrome_mcp

## Purpose

Use this skill when Chrome DevTools MCP is needed for browser QA and when the MCP profile may be locked, stale, or should be shut down after use.

## Invoke When

- frontend work needs browser-native QA, screenshots, DOM inspection, or console/network checks
- Chrome DevTools MCP reports that the browser is already running for the shared profile
- a run should avoid leaving the shared MCP Chrome profile alive after validation

## Required Inputs

- target local URL or page flow
- whether the task needs browser QA now or only cleanup
- any current MCP error text if launch already failed

## Inspect First

- `agent/memory/tools/chrome-devtools-mcp.md`
- `skills.md`
- the local dev server state if a repo page must be opened

## Steps

1. Start the local app only when browser QA is actually needed.
2. Try Chrome DevTools MCP first.
3. If MCP says the shared profile is already running, verify whether the lock is real:
   - inspect `~/.cache/chrome-devtools-mcp/chrome-profile`
   - check for `Singleton*` artifacts
   - run `lsof +D ~/.cache/chrome-devtools-mcp/chrome-profile`
4. If a live Chrome process is holding the profile, terminate that holder before retrying MCP. Do not delete lock files while the process is still alive.
5. If no process is holding the profile but `Singleton*` artifacts remain, treat them as stale and remove only those artifacts.
6. Retry Chrome DevTools MCP and confirm it can open a page before continuing with QA.
7. After QA:
   - close MCP pages when practical
   - stop the local dev server if it was started only for this validation
   - verify the MCP profile is no longer held when cleanup is required

## Output Contract

- `## MCP Need`
- `## Lock Diagnosis`
- `## Recovery Action`
- `## Validation Result`
- `## Cleanup Status`

## Done Criteria

- MCP launch status is explicit
- lock cause is identified as live holder, stale artifacts, or no lock
- cleanup status is recorded if a browser or dev server was started
