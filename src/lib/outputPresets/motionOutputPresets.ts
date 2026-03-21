import type { AspectRatio, BrandDocument, ResolutionPreset } from '@/lib/types/document';
import {
  getOutputPreset,
  type OutputPreset
} from '@packages/studio-shell/src/outputPresets';

const MOTION_OUTPUT_PRESET_IDS = [
  'landscape-16x9',
  'portrait-4x5',
  'square-1080',
  'stories-9x16',
  'linkedin-video-landscape',
  'linkedin-video-square'
] as const;

type MotionOutputPresetId = (typeof MOTION_OUTPUT_PRESET_IDS)[number];

type MotionOutputFallback = {
  aspectRatio: AspectRatio;
  resolution: ResolutionPreset;
};

const MOTION_OUTPUT_FALLBACKS: Record<MotionOutputPresetId, MotionOutputFallback> = {
  'landscape-16x9': {
    aspectRatio: '16:9',
    resolution: 'full-hd'
  },
  'portrait-4x5': {
    aspectRatio: '4:5',
    resolution: 'square'
  },
  'square-1080': {
    aspectRatio: '1:1',
    resolution: 'square'
  },
  'stories-9x16': {
    aspectRatio: '9:16',
    resolution: 'square'
  },
  'linkedin-video-landscape': {
    aspectRatio: '16:9',
    resolution: 'full-hd'
  },
  'linkedin-video-square': {
    aspectRatio: '1:1',
    resolution: 'square'
  }
};

const GENERIC_PRESET_BY_ASPECT_RATIO: Record<AspectRatio, MotionOutputPresetId> = {
  '16:9': 'landscape-16x9',
  '4:5': 'portrait-4x5',
  '1:1': 'square-1080',
  '9:16': 'stories-9x16',
  'a4-portrait': 'portrait-4x5',
  'a4-landscape': 'landscape-16x9'
};

function isMotionOutputPresetId(value: string): value is MotionOutputPresetId {
  return MOTION_OUTPUT_PRESET_IDS.includes(value as MotionOutputPresetId);
}

export function listMotionOutputPresets(): OutputPreset[] {
  return MOTION_OUTPUT_PRESET_IDS
    .map((presetId) => getOutputPreset(presetId))
    .filter((preset): preset is OutputPreset => Boolean(preset));
}

export function getFallbackForMotionOutputPreset(
  presetId: string | undefined
): MotionOutputFallback {
  if (presetId && isMotionOutputPresetId(presetId)) {
    return MOTION_OUTPUT_FALLBACKS[presetId];
  }

  return MOTION_OUTPUT_FALLBACKS['landscape-16x9'];
}

export function inferMotionOutputPresetId(
  document: Pick<BrandDocument, 'aspectRatio' | 'export'>
): MotionOutputPresetId {
  if (document.export.presetId && isMotionOutputPresetId(document.export.presetId)) {
    return document.export.presetId;
  }

  return GENERIC_PRESET_BY_ASPECT_RATIO[document.aspectRatio] ?? 'landscape-16x9';
}

export function getGenericMotionOutputPresetId(
  aspectRatio: AspectRatio
): MotionOutputPresetId {
  return GENERIC_PRESET_BY_ASPECT_RATIO[aspectRatio] ?? 'landscape-16x9';
}

export function applyMotionOutputPreset(
  document: BrandDocument,
  presetId: string
): BrandDocument {
  const resolvedPresetId = isMotionOutputPresetId(presetId)
    ? presetId
    : inferMotionOutputPresetId(document);
  const fallback = getFallbackForMotionOutputPreset(resolvedPresetId);

  return {
    ...document,
    aspectRatio: fallback.aspectRatio,
    export: {
      ...document.export,
      presetId: resolvedPresetId,
      resolution: fallback.resolution
    }
  };
}
