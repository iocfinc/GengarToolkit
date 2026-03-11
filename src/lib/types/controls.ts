import type {
  AnchorPosition,
  AspectRatio,
  BackgroundType,
  LayoutPreset,
  MotionBehavior,
  ResolutionPreset,
  TextureType
} from '@/lib/types/document';

export const aspectRatioLabels: Record<AspectRatio, string> = {
  '16:9': '16:9 Presentation',
  '4:5': '4:5 Portrait',
  '1:1': '1:1 Square',
  '9:16': '9:16 Story',
  'a4-portrait': 'A4 Portrait',
  'a4-landscape': 'A4 Landscape'
};

export const aspectRatioDimensions: Record<AspectRatio, number> = {
  '16:9': 16 / 9,
  '4:5': 4 / 5,
  '1:1': 1,
  '9:16': 9 / 16,
  'a4-portrait': 210 / 297,
  'a4-landscape': 297 / 210
};

export const backgroundTypeLabels: Record<BackgroundType, string> = {
  'radial-glow': 'Radial Glow',
  'linear-wash': 'Linear Wash',
  'dual-orb': 'Dual Orb',
  'mesh-field': 'Mesh Field'
};

export const layoutPresetLabels: Record<LayoutPreset, string> = {
  'hero-title-left': 'Hero Title Left',
  'centered-poster': 'Centered Poster',
  'lower-third-caption': 'Lower Third',
  'editorial-top-left': 'Editorial Top Left',
  'background-only': 'Background Only'
};

export const textureTypeLabels: Record<TextureType, string> = {
  'film-grain': 'Film Grain',
  'mono-noise': 'Mono Noise',
  scanline: 'Scanline',
  'paper-grain': 'Paper Grain'
};

export const motionBehaviorLabels: Record<MotionBehavior, string> = {
  drift: 'Drift',
  pulse: 'Pulse',
  float: 'Float',
  pan: 'Slow Pan',
  breathe: 'Glow Breathing'
};

export const anchorLabels: Record<AnchorPosition, string> = {
  'top-left': 'Top Left',
  'top-center': 'Top Center',
  'top-right': 'Top Right',
  'center-left': 'Center Left',
  center: 'Center',
  'center-right': 'Center Right',
  'bottom-left': 'Bottom Left',
  'bottom-center': 'Bottom Center',
  'bottom-right': 'Bottom Right'
};

export const exportResolutionSizes: Record<
  ResolutionPreset,
  { width: number; height: number }
> = {
  preview: { width: 1280, height: 720 },
  hd: { width: 1280, height: 720 },
  'full-hd': { width: 1920, height: 1080 },
  square: { width: 1080, height: 1080 }
};
