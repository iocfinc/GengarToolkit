import { beforeEach, describe, expect, it, vi } from 'vitest';
import { defaultPresets } from '@/lib/presets/defaultPresets';
import { useEditorStore } from '@/lib/store/editorStore';
import { resetEditorStore } from './testUtils';

const PRESETS_KEY = 'dioscuri-motion-presets-v1';

describe('editorStore', () => {
  beforeEach(() => {
    resetEditorStore();
  });

  it('initializes with a valid document', () => {
    const state = useEditorStore.getState();

    expect(state.document.name).toBeTruthy();
    expect(state.document.background.type).toBe('mesh-field');
    expect(state.document.export.format).toBe('png');
  });

  it('updates background state and refreshes updatedAt', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2030-01-01T00:00:00.000Z'));

    useEditorStore.getState().updateBackground({ intensity: 0.5 });

    const state = useEditorStore.getState();
    expect(state.document.background.intensity).toBe(0.5);
    expect(state.document.updatedAt).toBe('2030-01-01T00:00:00.000Z');
  });

  it('applies layout preset document changes', () => {
    useEditorStore.getState().setLayoutPreset('hero-title-left');

    const state = useEditorStore.getState();
    expect(state.document.typography.anchor).toBe('center-left');
    expect(state.document.typography.alignment).toBe('left');
    expect(state.document.motif.position).toEqual({ x: 0.8, y: 0.3 });
  });

  it('preserves typography content when toggling through background-only', () => {
    const store = useEditorStore.getState();
    const originalTypography = { ...store.document.typography };

    store.setLayoutPreset('background-only');
    let state = useEditorStore.getState();
    expect(state.document.typography.eyebrow).toBe(originalTypography.eyebrow);
    expect(state.document.typography.headline).toBe(originalTypography.headline);
    expect(state.document.typography.body).toBe(originalTypography.body);

    store.setLayoutPreset('editorial-top-left');
    state = useEditorStore.getState();
    expect(state.document.typography.eyebrow).toBe(originalTypography.eyebrow);
    expect(state.document.typography.headline).toBe(originalTypography.headline);
    expect(state.document.typography.body).toBe(originalTypography.body);
  });

  it('supports save, duplicate, load, and delete preset flows', () => {
    const store = useEditorStore.getState();
    const initialCount = store.presets.length;

    store.savePreset('Test Preset');
    let nextState = useEditorStore.getState();
    expect(nextState.presets).toHaveLength(initialCount + 1);
    expect(nextState.presets[0]?.name).toBe('Test Preset');

    const savedId = nextState.presets[0]?.id;
    expect(savedId).toBeTruthy();

    nextState.duplicatePreset(savedId!);
    nextState = useEditorStore.getState();
    expect(nextState.presets).toHaveLength(initialCount + 2);
    expect(nextState.presets[0]?.name).toBe('Test Preset Copy');

    nextState.loadPreset(savedId!);
    nextState = useEditorStore.getState();
    expect(nextState.activePresetId).toBe(savedId);
    expect(nextState.document.name).toBe('Test Preset');

    nextState.deletePreset(savedId!);
    nextState = useEditorStore.getState();
    expect(nextState.presets.some((preset) => preset.id === savedId)).toBe(false);
  });

  it('hydrates from localStorage and falls back on invalid preset data', () => {
    window.localStorage.setItem(PRESETS_KEY, JSON.stringify([defaultPresets[1]]));
    useEditorStore.getState().hydrate();

    let state = useEditorStore.getState();
    expect(state.hydrated).toBe(true);
    expect(state.document.name).toBe(defaultPresets[1]?.document.name);

    resetEditorStore();
    window.localStorage.setItem(PRESETS_KEY, JSON.stringify([{ broken: true }]));
    useEditorStore.getState().hydrate();

    state = useEditorStore.getState();
    expect(state.presets[0]?.name).toBe(defaultPresets[0]?.name);
    expect(state.document.name).toBe(defaultPresets[0]?.document.name);
  });
});
