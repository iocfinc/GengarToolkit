# Known Issues

- Browser APIs used by export flows require mocks in unit and component tests.
- OS-level screenshot capture on macOS can fail without Screen Recording permission when Chrome DevTools MCP is unavailable.
- Stale `.next` artifacts can pollute local type checks and should not be treated as source files.
- Autonomous backlog execution depends on authenticated GitHub CLI access; without `gh` repository access, the queue can be planned from exported issue data but not pulled live.
