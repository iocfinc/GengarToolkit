# Chrome DevTools MCP for Browser Debugging and Screenshot Capture

This repo’s `browser_debugger` and `browser_screenshot` sub-agents can use the Chrome DevTools MCP server for deterministic browser debugging and screenshot capture.

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

- The `browser_debugger` agent should prefer Chrome MCP when available so console inspection, DOM state checks, and deterministic reproduction stay in the browser tooling path.
- The `browser_screenshot` agent prefers Chrome MCP when available. If it cannot connect, it records a skip reason and falls back to OS-level capture.
- The tracked repo agents now include project-scoped Chrome DevTools MCP wiring so browser debugging and screenshot capture can use the same server config without relying only on global user setup.
- Recommended viewport for editor proofs: `{ width: 1600, height: 900, deviceScaleFactor: 2 }`.

## PR notes

- Include: artifact path(s), capture method (`chrome-mcp`), and a one‑line note describing what each screenshot proves.
