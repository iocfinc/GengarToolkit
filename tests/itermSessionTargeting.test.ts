import { describe, expect, it } from 'vitest';
import {
  filterSessions,
  normalizeSession,
  selectSession
} from '../agent/lib/itermSessionTargeting.mjs';

const sessions = [
  normalizeSession({
    windowId: 101,
    sessionId: 's-main',
    title: 'Codex - Active Thread',
    tty: '/dev/ttys001',
    textPreview: '...working tree...'
  }),
  normalizeSession({
    windowId: 102,
    sessionId: 's-proof',
    title: 'Codex Proof',
    tty: '/dev/ttys002',
    textPreview: 'codex exec "Summarize the configured agents in one sentence."'
  }),
  normalizeSession({
    windowId: 103,
    sessionId: 's-proof-2',
    title: 'Codex Proof',
    tty: '/dev/ttys003',
    textPreview: 'codex exec "Another command"'
  })
];

describe('iTerm session targeting', () => {
  it('requires at least one selector instead of falling back to active session', () => {
    expect(() => selectSession(sessions, {})).toThrow(/Refusing to guess a target session/);
  });

  it('picks an exact session id when provided', () => {
    expect(selectSession(sessions, { sessionId: 's-proof' }).sessionId).toBe('s-proof');
  });

  it('supports window id selection', () => {
    expect(selectSession(sessions, { windowId: 101 }).sessionId).toBe('s-main');
  });

  it('supports title and text filtering together', () => {
    const matches = filterSessions(sessions, {
      sessionId: null,
      windowId: null,
      titleContains: 'proof',
      textContains: 'configured agents',
      tty: null
    });

    expect(matches).toHaveLength(1);
    expect(matches[0].sessionId).toBe('s-proof');
  });

  it('throws an explicit ambiguity error when selectors match multiple sessions', () => {
    expect(() => selectSession(sessions, { titleContains: 'Codex Proof' })).toThrow(
      /Ambiguous iTerm session selection/
    );
  });
});
