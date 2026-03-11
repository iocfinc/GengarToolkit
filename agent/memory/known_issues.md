# Known Issues

- No ESLint configuration is currently checked in, so `next lint` becomes interactive in this repository state.
- Browser APIs used by export flows require mocks in unit and component tests.
- Stale `.next` artifacts can pollute local type checks and should not be treated as source files.
