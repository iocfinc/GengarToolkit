export type OutputClass = 'image' | 'video' | 'pdf';

export type OutputPreset = {
  id: string;
  label: string;
  width: number;
  height: number;
  aspectRatio: string;
  dpi?: number;
  class: OutputClass;
};

const outputPresets = [
  {
    id: 'square-1080',
    label: 'Square',
    width: 1080,
    height: 1080,
    aspectRatio: '1:1',
    class: 'image'
  },
  {
    id: 'portrait-4x5',
    label: 'Portrait',
    width: 1080,
    height: 1350,
    aspectRatio: '4:5',
    class: 'image'
  },
  {
    id: 'stories-9x16',
    label: 'Stories / Reels / TikTok',
    width: 1080,
    height: 1920,
    aspectRatio: '9:16',
    class: 'image'
  },
  {
    id: 'linkedin-shared-image',
    label: 'LinkedIn Shared Image',
    width: 1200,
    height: 627,
    aspectRatio: '1.91:1',
    class: 'image'
  },
  {
    id: 'linkedin-video-landscape',
    label: 'LinkedIn Video Landscape',
    width: 1920,
    height: 1080,
    aspectRatio: '16:9',
    class: 'video'
  },
  {
    id: 'linkedin-video-square',
    label: 'LinkedIn Video Square',
    width: 1080,
    height: 1080,
    aspectRatio: '1:1',
    class: 'video'
  },
  {
    id: 'a4-portrait',
    label: 'A4 Portrait',
    width: 2480,
    height: 3508,
    aspectRatio: 'A4 Portrait',
    dpi: 300,
    class: 'pdf'
  },
  {
    id: 'linkedin-document-carousel',
    label: 'LinkedIn Document Carousel',
    width: 2480,
    height: 3508,
    aspectRatio: 'A4 Portrait',
    dpi: 300,
    class: 'pdf'
  }
] as const satisfies readonly OutputPreset[];

export const OUTPUT_PRESETS: readonly OutputPreset[] = outputPresets;

export function getOutputPreset(id: string) {
  return OUTPUT_PRESETS.find((preset) => preset.id === id);
}

export function listOutputPresetsByClass(outputClass: OutputClass) {
  return OUTPUT_PRESETS.filter((preset) => preset.class === outputClass);
}

export function listAllOutputPresets() {
  return [...OUTPUT_PRESETS];
}
