'use client';

import { create } from 'zustand';
import { brandDocumentSchema, savedPresetSchema } from '@/lib/types/document';
import type {
  AspectRatio,
  BackgroundConfig,
  BrandDocument,
  ExportConfig,
  LayoutPreset,
  MotionConfig,
  MotifConfig,
  SavedPreset,
  TextureConfig,
  TypographyConfig
} from '@/lib/types/document';
import { approvedPalettes } from '@/lib/theme/colors';
import { createDocument, defaultPresets } from '@/lib/presets/defaultPresets';

const PRESETS_KEY = 'dioscuri-motion-presets-v1';

function nowIso() {
  return new Date().toISOString();
}

type PatchableKey =
  | 'background'
  | 'motif'
  | 'texture'
  | 'typography'
  | 'motion'
  | 'export';

function patchDocument<T extends PatchableKey>(
  document: BrandDocument,
  key: T,
  patch: Partial<BrandDocument[T]>
) {
  return {
    ...document,
    [key]: {
      ...document[key],
      ...patch
    },
    updatedAt: nowIso()
  };
}

function createId(prefix: string) {
  return `${prefix}-${Math.random().toString(36).slice(2, 10)}`;
}

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}

function applyLayoutPreset(
  document: BrandDocument,
  layoutPreset: LayoutPreset
): BrandDocument {
  const next = structuredClone(document);
  next.layoutPreset = layoutPreset;

  switch (layoutPreset) {
    case 'hero-title-left':
      next.typography.anchor = 'center-left';
      next.typography.alignment = 'left';
      next.typography.maxWidth = 0.4;
      next.motif.position = { x: 0.8, y: 0.3 };
      break;
    case 'centered-poster':
      next.typography.anchor = 'center';
      next.typography.alignment = 'center';
      next.typography.maxWidth = 0.66;
      next.motif.position = { x: 0.5, y: 0.24 };
      break;
    case 'lower-third-caption':
      next.typography.anchor = 'bottom-left';
      next.typography.alignment = 'left';
      next.typography.maxWidth = 0.54;
      next.motif.position = { x: 0.72, y: 0.22 };
      break;
    case 'background-only':
      break;
    case 'editorial-top-left':
    default:
      next.typography.anchor = 'top-left';
      next.typography.alignment = 'left';
      next.typography.maxWidth = 0.42;
      next.motif.position = { x: 0.82, y: 0.24 };
      break;
  }

  next.updatedAt = nowIso();
  return next;
}

function randomPalette() {
  return approvedPalettes[Math.floor(Math.random() * approvedPalettes.length)];
}

function softRandomized(document: BrandDocument): BrandDocument {
  const palette = randomPalette();
  return {
    ...document,
    background: {
      ...document.background,
      glowColorA: palette[0],
      glowColorB: palette[1],
      glowSize: clamp(document.background.glowSize + (Math.random() - 0.5) * 0.1, 0.2, 0.58),
      intensity: clamp(document.background.intensity + (Math.random() - 0.5) * 0.14, 0.48, 0.92),
      vignette: clamp(document.background.vignette + (Math.random() - 0.5) * 0.1, 0.24, 0.62)
    },
    motif: {
      ...document.motif,
      opacity: clamp(document.motif.opacity + (Math.random() - 0.5) * 0.12, 0.18, 0.62),
      scale: clamp(document.motif.scale + (Math.random() - 0.5) * 0.06, 0.12, 0.36)
    },
    texture: {
      ...document.texture,
      opacity: clamp(document.texture.opacity + (Math.random() - 0.5) * 0.04, 0.06, 0.18)
    },
    motion: {
      ...document.motion,
      speed: clamp(document.motion.speed + (Math.random() - 0.5) * 0.14, 0.2, 0.8),
      amplitude: clamp(document.motion.amplitude + (Math.random() - 0.5) * 0.02, 0.02, 0.08)
    },
    updatedAt: nowIso()
  };
}

function fullRandomized(document: BrandDocument): BrandDocument {
  const palette = randomPalette();
  return applyLayoutPreset(
    {
      ...document,
      background: {
        ...document.background,
        type: ['radial-glow', 'linear-wash', 'dual-orb', 'mesh-field'][
          Math.floor(Math.random() * 4)
        ] as BackgroundConfig['type'],
        glowColorA: palette[0],
        glowColorB: palette[1],
        glowPositionA: { x: 0.16 + Math.random() * 0.32, y: 0.14 + Math.random() * 0.28 },
        glowPositionB: { x: 0.56 + Math.random() * 0.26, y: 0.46 + Math.random() * 0.28 },
        glowSize: 0.28 + Math.random() * 0.24,
        softness: 0.56 + Math.random() * 0.26,
        intensity: 0.58 + Math.random() * 0.24,
        vignette: 0.28 + Math.random() * 0.24
      },
      motif: {
        ...document.motif,
        type: ['orb', 'halo', 'light-bar', 'blob', 'ring'][
          Math.floor(Math.random() * 5)
        ] as MotifConfig['type'],
        count: Math.floor(1 + Math.random() * 2),
        scale: 0.18 + Math.random() * 0.14,
        opacity: 0.28 + Math.random() * 0.2,
        position: { x: 0.58 + Math.random() * 0.26, y: 0.18 + Math.random() * 0.26 },
        color: palette[Math.floor(Math.random() * 2)]
      },
      texture: {
        ...document.texture,
        type: ['film-grain', 'mono-noise', 'scanline', 'paper-grain'][
          Math.floor(Math.random() * 4)
        ] as TextureConfig['type'],
        opacity: 0.08 + Math.random() * 0.08
      },
      motion: {
        ...document.motion,
        behavior: ['drift', 'pulse', 'float', 'pan', 'breathe'][
          Math.floor(Math.random() * 5)
        ] as MotionConfig['behavior'],
        speed: 0.22 + Math.random() * 0.44,
        amplitude: 0.02 + Math.random() * 0.04,
        loopDuration: [4, 5, 6, 8][Math.floor(Math.random() * 4)]
      },
      updatedAt: nowIso()
    },
    document.layoutPreset
  );
}

function persistPresets(presets: SavedPreset[]) {
  if (typeof window === 'undefined') {
    return;
  }
  window.localStorage.setItem(PRESETS_KEY, JSON.stringify(presets));
}

function readStoredPresets() {
  if (typeof window === 'undefined') {
    return defaultPresets;
  }

  const raw = window.localStorage.getItem(PRESETS_KEY);
  if (!raw) {
    return defaultPresets;
  }

  const parsed = JSON.parse(raw);
  const validated = savedPresetSchema.array().safeParse(parsed);
  return validated.success ? validated.data : defaultPresets;
}

type UIState = {
  showGrid: boolean;
  showSafeMargins: boolean;
  presetDrawerOpen: boolean;
  exportDialogOpen: boolean;
  zoom: number;
};

type EditorStore = {
  document: BrandDocument;
  presets: SavedPreset[];
  activePresetId: string | null;
  hydrated: boolean;
  ui: UIState;
  hydrate: () => void;
  setAspectRatio: (ratio: AspectRatio) => void;
  setLayoutPreset: (preset: LayoutPreset) => void;
  updateBackground: (patch: Partial<BackgroundConfig>) => void;
  updateMotif: (patch: Partial<MotifConfig>) => void;
  updateTexture: (patch: Partial<TextureConfig>) => void;
  updateTypography: (patch: Partial<TypographyConfig>) => void;
  updateMotion: (patch: Partial<MotionConfig>) => void;
  updateExport: (patch: Partial<ExportConfig>) => void;
  setDocumentName: (name: string) => void;
  randomizeDocument: (mode?: 'soft' | 'full') => void;
  resetDocument: () => void;
  savePreset: (name: string) => void;
  loadPreset: (id: string) => void;
  renamePreset: (id: string, name: string) => void;
  duplicatePreset: (id: string) => void;
  deletePreset: (id: string) => void;
  togglePlayback: () => void;
  setUi: (patch: Partial<UIState>) => void;
};

export const useEditorStore = create<EditorStore>((set, get) => ({
  document: createDocument(),
  presets: defaultPresets,
  activePresetId: defaultPresets[0]?.id ?? null,
  hydrated: false,
  ui: {
    showGrid: true,
    showSafeMargins: true,
    presetDrawerOpen: false,
    exportDialogOpen: false,
    zoom: 1
  },
  hydrate: () => {
    if (get().hydrated) {
      return;
    }
    const presets = readStoredPresets();
    set({
      presets,
      activePresetId: presets[0]?.id ?? null,
      document: brandDocumentSchema.parse(
        presets[0]?.document ?? createDocument()
      ),
      hydrated: true
    });
  },
  setAspectRatio: (aspectRatio) =>
    set((state) => ({
      document: {
        ...state.document,
        aspectRatio,
        updatedAt: nowIso()
      }
    })),
  setLayoutPreset: (layoutPreset) =>
    set((state) => ({
      document: applyLayoutPreset(state.document, layoutPreset)
    })),
  updateBackground: (patch) =>
    set((state) => ({
      document: patchDocument(state.document, 'background', patch)
    })),
  updateMotif: (patch) =>
    set((state) => ({
      document: patchDocument(state.document, 'motif', patch)
    })),
  updateTexture: (patch) =>
    set((state) => ({
      document: patchDocument(state.document, 'texture', patch)
    })),
  updateTypography: (patch) =>
    set((state) => ({
      document: patchDocument(state.document, 'typography', patch)
    })),
  updateMotion: (patch) =>
    set((state) => ({
      document: patchDocument(state.document, 'motion', patch)
    })),
  updateExport: (patch) =>
    set((state) => ({
      document: patchDocument(state.document, 'export', patch)
    })),
  setDocumentName: (name) =>
    set((state) => ({
      document: {
        ...state.document,
        name,
        updatedAt: nowIso()
      }
    })),
  randomizeDocument: (mode = 'soft') =>
    set((state) => ({
      document: mode === 'soft' ? softRandomized(state.document) : fullRandomized(state.document)
    })),
  resetDocument: () =>
    set({
      document: createDocument(),
      activePresetId: null
    }),
  savePreset: (name) =>
    set((state) => {
      const timestamp = nowIso();
      const preset: SavedPreset = {
        id: createId('preset'),
        name,
        document: {
          ...state.document,
          id: createId('doc'),
          name,
          createdAt: timestamp,
          updatedAt: timestamp
        },
        createdAt: timestamp,
        updatedAt: timestamp
      };
      const presets = [preset, ...state.presets];
      persistPresets(presets);
      return {
        presets,
        activePresetId: preset.id
      };
    }),
  loadPreset: (id) =>
    set((state) => {
      const preset = state.presets.find((entry) => entry.id === id);
      if (!preset) {
        return state;
      }

      return {
        document: brandDocumentSchema.parse({
          ...preset.document,
          id: createId('doc'),
          updatedAt: nowIso()
        }),
        activePresetId: preset.id,
        ui: {
          ...state.ui,
          presetDrawerOpen: false
        }
      };
    }),
  renamePreset: (id, name) =>
    set((state) => {
      const presets = state.presets.map((preset) =>
        preset.id === id
          ? {
              ...preset,
              name,
              document: {
                ...preset.document,
                name
              },
              updatedAt: nowIso()
            }
          : preset
      );
      persistPresets(presets);
      return { presets };
    }),
  duplicatePreset: (id) =>
    set((state) => {
      const preset = state.presets.find((entry) => entry.id === id);
      if (!preset) {
        return state;
      }
      const timestamp = nowIso();
      const duplicate: SavedPreset = {
        ...preset,
        id: createId('preset'),
        name: `${preset.name} Copy`,
        document: {
          ...preset.document,
          id: createId('doc'),
          name: `${preset.name} Copy`,
          createdAt: timestamp,
          updatedAt: timestamp
        },
        createdAt: timestamp,
        updatedAt: timestamp
      };
      const presets = [duplicate, ...state.presets];
      persistPresets(presets);
      return { presets };
    }),
  deletePreset: (id) =>
    set((state) => {
      const presets = state.presets.filter((preset) => preset.id !== id);
      persistPresets(presets);
      return {
        presets,
        activePresetId: state.activePresetId === id ? null : state.activePresetId
      };
    }),
  togglePlayback: () =>
    set((state) => ({
      document: {
        ...state.document,
        motion: {
          ...state.document.motion,
          playing: !state.document.motion.playing
        },
        updatedAt: nowIso()
      }
    })),
  setUi: (patch) =>
    set((state) => ({
      ui: {
        ...state.ui,
        ...patch
      }
    }))
}));
