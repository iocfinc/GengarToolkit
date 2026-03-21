import { describe, expect, it } from 'vitest';
import { createDocument } from '@/lib/presets/defaultPresets';
import {
  getFormatRelativeTypographyMultiplier,
  resolveTypographyMetrics
} from '@/lib/render/resolveTypographyMetrics';

describe('resolveTypographyMetrics', () => {
  it('keeps 16:9 as the baseline typography scale', () => {
    expect(getFormatRelativeTypographyMultiplier(1920, 1080)).toBe(1);
  });

  it('scales typography upward for taller formats', () => {
    expect(getFormatRelativeTypographyMultiplier(1080, 1350)).toBeGreaterThan(1);
    expect(getFormatRelativeTypographyMultiplier(1080, 1080)).toBeGreaterThan(1);
  });

  it('resolves larger effective text sizes for portrait presets than 16:9', () => {
    const document = createDocument();
    const landscapeMetrics = resolveTypographyMetrics(document, 1920, 1080);
    const portraitMetrics = resolveTypographyMetrics(document, 1080, 1350);

    expect(portraitMetrics.headlineSize).toBeGreaterThan(landscapeMetrics.headlineSize);
    expect(portraitMetrics.bodySize).toBeGreaterThan(landscapeMetrics.bodySize);
  });
});
