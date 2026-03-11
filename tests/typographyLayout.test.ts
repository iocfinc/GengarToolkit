import { describe, expect, it } from 'vitest';
import { createDocument } from '@/lib/presets/defaultPresets';
import { createTypographyLayout } from '@/lib/render/typographyLayout';
import { asCanvasContext, createMockCanvasContext } from './testUtils';

describe('typographyLayout', () => {
  it('centers the full text block for center anchors', () => {
    const context = createMockCanvasContext();
    const document = createDocument();
    document.typography.anchor = 'center';
    document.typography.headlineSize = 120;
    document.typography.maxWidth = 0.2;

    const layout = createTypographyLayout(
      asCanvasContext(context),
      1920,
      1080,
      document,
      112
    );

    expect(layout.headlineLines.length).toBeGreaterThan(1);
    expect(layout.startY).toBeGreaterThan(0);
    expect(layout.startY).toBeLessThan(540);
  });

  it('keeps top-anchored text aligned to padding rather than recentering it', () => {
    const context = createMockCanvasContext();
    const document = createDocument();
    document.typography.anchor = 'top-left';

    const layout = createTypographyLayout(
      asCanvasContext(context),
      1920,
      1080,
      document,
      112
    );

    expect(layout.startY).toBe(112);
  });

  it('pushes bottom-anchored text upward by its measured block height', () => {
    const context = createMockCanvasContext();
    const document = createDocument();
    document.typography.anchor = 'bottom-left';
    document.typography.headlineSize = 120;

    const layout = createTypographyLayout(
      asCanvasContext(context),
      1920,
      1080,
      document,
      112
    );

    expect(layout.startY).toBeLessThan(1080 - 112);
  });
});
