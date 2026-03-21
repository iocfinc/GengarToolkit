import { describe, expect, it } from 'vitest';
import { createDocument } from '@/lib/presets/defaultPresets';
import {
  getLogicalCanvasSize,
  getOutputCanvasSize,
  getPreviewDisplaySize
} from '@/lib/render/renderSizing';

describe('render sizing', () => {
  it('uses export resolution as the logical composition size', () => {
    const document = createDocument();

    expect(getLogicalCanvasSize(document)).toEqual({
      width: 1920,
      height: 1080
    });
  });

  it('applies export scale only to output pixel dimensions', () => {
    const document = createDocument();
    document.export.scale = 2;

    expect(getLogicalCanvasSize(document)).toEqual({
      width: 1920,
      height: 1080
    });
    expect(getOutputCanvasSize(document)).toEqual({
      width: 3840,
      height: 2160
    });
  });

  it('prefers shared output preset dimensions when a preset id is present', () => {
    const document = createDocument();
    document.aspectRatio = '4:5';
    document.export.presetId = 'portrait-4x5';
    document.export.resolution = 'full-hd';

    expect(getLogicalCanvasSize(document)).toEqual({
      width: 1080,
      height: 1350
    });
  });

  it('fits the preview canvas into the stage while preserving aspect ratio', () => {
    expect(getPreviewDisplaySize(900, 700, '16:9', 1)).toEqual({
      width: 900,
      height: 506.25
    });
  });
});
