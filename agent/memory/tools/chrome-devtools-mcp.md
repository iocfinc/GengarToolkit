# Chrome DevTools MCP for Screenshot Capture

This repo’s `browser_screenshot` sub‑agent can use the Chrome DevTools MCP server to capture deterministic screenshots for PR validation.

## Why

- Avoids OS-level `screencapture` flakiness and permits window/element targeting.
- Works in CI and locally with consistent viewport sizing and device scale.

## Setup (local)

1. Install Chrome (stable or Canary).
2. Install the Chrome DevTools MCP server following the project README.
3. Start the server pointing at a Chrome instance.

   Example:

   - `chrome --remote-debugging-port=9222`
   - `chrome-devtools-mcp --port 39222`

4. Confirm the MCP server exposes tools for:
   - `navigate(url)`
   - `setViewport({ width, height, deviceScaleFactor })`
   - `screenshot({ path, fullPage, selector? })`

## Agent usage

- The `browser_screenshot` agent prefers Chrome MCP when available. If it cannot connect, it records a skip reason and falls back to OS-level capture.
- Recommended viewport for editor proofs: `{ width: 1600, height: 900, deviceScaleFactor: 2 }`.

## PR notes

- Include: artifact path(s), capture method (`chrome-mcp`), and a one‑line note describing what each screenshot proves.

