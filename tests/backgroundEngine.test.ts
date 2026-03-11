import { describe, expect, it } from 'vitest';
import { createDocument } from '@/lib/presets/defaultPresets';
import { drawBackground } from '@/lib/render/backgroundRenderer';
import { asCanvasContext, createMockCanvasContext } from './testUtils';

describe('background renderer', () => {
  it.each(['radial-glow', 'linear-wash', 'dual-orb', 'mesh-field'] as const)(
    'renders %s without throwing',
    (type) => {
      const context = createMockCanvasContext();
      const document = createDocument();
      document.background.type = type;

      expect(() =>
        drawBackground(asCanvasContext(context), 1280, 720, document, 2.4)
      ).not.toThrow();

      expect(context.fillRect).toHaveBeenCalled();
    }
  );

  it('uses a linear gradient path for linear wash backgrounds', () => {
    const context = createMockCanvasContext();
    const document = createDocument();
    document.background.type = 'linear-wash';

    drawBackground(asCanvasContext(context), 1280, 720, document, 1);

    expect(context.createLinearGradient).toHaveBeenCalledTimes(1);
    expect(context.linearGradients).toHaveLength(1);
  });

  it('clamps vignette opacity in the vignette overlay', () => {
    const context = createMockCanvasContext();
    const document = createDocument();
    document.background.vignette = 2;

    drawBackground(asCanvasContext(context), 1280, 720, document, 1);

    const vignetteGradient = context.radialGradients.at(-1);
    expect(vignetteGradient?.addColorStop).toHaveBeenNthCalledWith(
      2,
      1,
      'rgba(0, 0, 0, 0.88)'
    );
  });
});
