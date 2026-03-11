import { describe, expect, it } from 'vitest';
import {
  createDocument,
  defaultPresets
} from '@/lib/presets/defaultPresets';
import {
  brandDocumentSchema,
  savedPresetSchema
} from '@/lib/types/document';

describe('preset system', () => {
  it('creates a valid default document', () => {
    const document = createDocument();

    expect(brandDocumentSchema.safeParse(document).success).toBe(true);
    expect(document.aspectRatio).toBe('16:9');
    expect(document.layoutPreset).toBe('editorial-top-left');
  });

  it('ships valid default presets', () => {
    for (const preset of defaultPresets) {
      expect(savedPresetSchema.safeParse(preset).success).toBe(true);
    }
  });

  it('includes layout-specific preset variants', () => {
    const violetPoster = defaultPresets.find((preset) => preset.name === 'Violet Poster');
    const chartreuseLoop = defaultPresets.find(
      (preset) => preset.name === 'Chartreuse Motion Loop'
    );

    expect(violetPoster?.document.aspectRatio).toBe('4:5');
    expect(violetPoster?.document.layoutPreset).toBe('centered-poster');
    expect(chartreuseLoop?.document.aspectRatio).toBe('9:16');
    expect(chartreuseLoop?.document.layoutPreset).toBe('lower-third-caption');
  });
});
