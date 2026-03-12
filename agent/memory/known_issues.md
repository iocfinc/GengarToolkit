# Known Issues

- No ESLint configuration is currently checked in, so `next lint` becomes interactive in this repository state.
- Browser APIs used by export flows require mocks in unit and component tests.
- Stale `.next` artifacts can pollute local type checks and should not be treated as source files.
- Autonomous backlog execution depends on authenticated GitHub CLI access; without `gh` repository access, the queue can be planned from exported issue data but not pulled live.
