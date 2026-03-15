import { beforeEach, describe, expect, it } from 'vitest';
import {
  loadStoredValue,
  loadVersionedStoredValue,
  saveStoredValue,
  saveVersionedStoredValue
} from '@packages/studio-shell/src/presetStorage';

describe('preset storage helpers', () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it('round-trips raw stored values', () => {
    saveStoredValue('example', { count: 2 });

    expect(loadStoredValue('example', { count: 0 })).toEqual({ count: 2 });
  });

  it('round-trips versioned stored values', () => {
    saveVersionedStoredValue('versioned', 1, ['preset-a']);

    expect(loadVersionedStoredValue('versioned', 1, [])).toEqual(['preset-a']);
  });

  it('falls back when the stored version does not match', () => {
    saveVersionedStoredValue('versioned', 1, ['preset-a']);

    expect(loadVersionedStoredValue('versioned', 2, ['fallback'])).toEqual(['fallback']);
  });

  it('falls back when legacy unversioned data is found', () => {
    window.localStorage.setItem('legacy', JSON.stringify(['old-preset']));

    expect(loadVersionedStoredValue('legacy', 1, ['fallback'])).toEqual(['fallback']);
  });
});
