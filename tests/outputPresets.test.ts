import { describe, expect, it } from 'vitest';
import {
  getOutputPreset,
  listAllOutputPresets,
  listOutputPresetsByClass,
  OUTPUT_PRESETS
} from '@packages/studio-shell/src/outputPresets';

describe('output preset catalog', () => {
  it('ships unique preset ids with positive dimensions', () => {
    const ids = OUTPUT_PRESETS.map((preset) => preset.id);

    expect(new Set(ids).size).toBe(ids.length);
    for (const preset of OUTPUT_PRESETS) {
      expect(preset.width).toBeGreaterThan(0);
      expect(preset.height).toBeGreaterThan(0);
    }
  });

  it('includes the requested social, video, and pdf targets', () => {
    expect(getOutputPreset('square-1080')).toMatchObject({
      width: 1080,
      height: 1080,
      class: 'image'
    });
    expect(getOutputPreset('portrait-4x5')).toMatchObject({
      width: 1080,
      height: 1350,
      class: 'image'
    });
    expect(getOutputPreset('landscape-16x9')).toMatchObject({
      width: 1920,
      height: 1080,
      class: 'image'
    });
    expect(getOutputPreset('linkedin-shared-image')).toMatchObject({
      width: 1200,
      height: 627,
      class: 'image'
    });
    expect(getOutputPreset('linkedin-video-landscape')).toMatchObject({
      width: 1920,
      height: 1080,
      class: 'video'
    });
    expect(getOutputPreset('a4-portrait')).toMatchObject({
      width: 2480,
      height: 3508,
      dpi: 300,
      class: 'pdf'
    });
  });

  it('groups presets by class and preserves pdf dpi metadata', () => {
    expect(listOutputPresetsByClass('pdf')).toHaveLength(2);
    expect(listOutputPresetsByClass('video')).toHaveLength(2);

    for (const preset of listOutputPresetsByClass('pdf')) {
      expect(preset.dpi).toBe(300);
    }
  });

  it('keeps the LinkedIn shared image close to a 1.91:1 ratio', () => {
    const linkedinPreset = getOutputPreset('linkedin-shared-image');
    expect(linkedinPreset).toBeTruthy();

    const ratio = (linkedinPreset!.width / linkedinPreset!.height).toFixed(2);
    expect(Number(ratio)).toBe(1.91);
    expect(listAllOutputPresets()).toHaveLength(9);
  });
});
