import { approvedPalettes } from '@/lib/theme/colors';
import type {
  AspectRatio,
  BrandDocument,
  LayoutPreset,
  SavedPreset
} from '@/lib/types/document';

function createId(prefix: string) {
  return `${prefix}-${Math.random().toString(36).slice(2, 10)}`;
}

function nowIso() {
  return new Date().toISOString();
}

export function createDocument(
  name = 'Editorial Hero',
  aspectRatio: AspectRatio = '16:9',
  layoutPreset: LayoutPreset = 'editorial-top-left'
): BrandDocument {
  const timestamp = nowIso();

  return {
    id: createId('doc'),
    name,
    aspectRatio,
    layoutPreset,
    background: {
      type: 'mesh-field',
      paletteName: 'Royal Volt',
      baseColor: 'ink',
      glowColorA: approvedPalettes[0][0],
      glowColorB: approvedPalettes[0][1],
      glowSize: 0.42,
      glowPositionA: { x: 0.28, y: 0.22 },
      glowPositionB: { x: 0.76, y: 0.62 },
      softness: 0.72,
      intensity: 0.84,
      vignette: 0.46
    },
    motif: {
      enabled: true,
      type: 'orb',
      count: 1,
      scale: 0.24,
      opacity: 0.48,
      blur: 0.72,
      position: { x: 0.82, y: 0.24 },
      rotation: -12,
      color: 'violetMist'
    },
    texture: {
      enabled: true,
      type: 'film-grain',
      opacity: 0.14,
      scale: 0.6,
      contrast: 0.68,
      animated: true
    },
    typography: {
      eyebrow: 'Brand Motion Toolkit',
      headline: 'Dark, cinematic visuals with restrained motion.',
      body:
        'Procedural backgrounds, typography structure, grain, motifs, and export-ready loops in one constrained editor.',
      fontFamily: 'display',
      headlineSize: 82,
      bodySize: 20,
      weight: 600,
      lineHeight: 1,
      tracking: -0.03,
      alignment: 'left',
      maxWidth: 0.42,
      textColor: 'fog',
      anchor: 'top-left',
      paddingPreset: 'lg'
    },
    motion: {
      enabled: true,
      behavior: 'drift',
      playing: false,
      speed: 0.48,
      amplitude: 0.06,
      loopDuration: 6,
      easingProfile: 'ease-in-out',
      independentLayerMotion: true
    },
    export: {
      format: 'png',
      resolution: 'full-hd',
      presetId: 'landscape-16x9',
      fps: 30,
      duration: 5,
      scale: 1,
      filename: 'dioscuri-editorial-hero'
    },
    createdAt: timestamp,
    updatedAt: timestamp
  };
}

function presetFromDoc(name: string, document: BrandDocument): SavedPreset {
  const timestamp = nowIso();

  return {
    id: createId('preset'),
    name,
    document: {
      ...document,
      id: createId('doc'),
      name,
      createdAt: timestamp,
      updatedAt: timestamp
    },
    createdAt: timestamp,
    updatedAt: timestamp
  };
}

export const defaultPresets: SavedPreset[] = [
  presetFromDoc('Editorial Hero', createDocument('Editorial Hero')),
  presetFromDoc('Dark Orb Deck', {
    ...createDocument('Dark Orb Deck', '16:9', 'hero-title-left'),
    background: {
      ...createDocument().background,
      type: 'dual-orb',
      glowColorA: 'orange',
      glowColorB: 'blush',
      glowPositionA: { x: 0.18, y: 0.24 },
      glowPositionB: { x: 0.84, y: 0.78 }
    },
    motif: {
      ...createDocument().motif,
      type: 'halo',
      color: 'orange',
      position: { x: 0.76, y: 0.28 }
    }
  }),
  presetFromDoc('Violet Poster', {
    ...createDocument('Violet Poster', '4:5', 'centered-poster'),
    typography: {
      ...createDocument().typography,
      headline: 'Editorial frames for launches, covers, and title cards.',
      body: '',
      alignment: 'center',
      anchor: 'center',
      maxWidth: 0.68
    },
    motif: {
      ...createDocument().motif,
      type: 'ring',
      scale: 0.32,
      position: { x: 0.5, y: 0.28 }
    }
  }),
  presetFromDoc('Chartreuse Motion Loop', {
    ...createDocument('Chartreuse Motion Loop', '9:16', 'lower-third-caption'),
    background: {
      ...createDocument().background,
      type: 'linear-wash',
      glowColorA: 'chartreuse',
      glowColorB: 'emerald'
    },
    motion: {
      ...createDocument().motion,
      behavior: 'breathe',
      loopDuration: 8
    }
  })
];
