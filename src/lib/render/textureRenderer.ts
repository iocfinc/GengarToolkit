import { resolveColor } from '@/lib/theme/colors';
import type { BrandDocument, TextureConfig } from '@/lib/types/document';

function textureSeed(time: number) {
  return Math.floor(time * 12);
}

function drawNoiseGrid(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  texture: TextureConfig,
  time: number
) {
  const step = Math.max(2, Math.round(8 - texture.scale * 5));
  const seed = textureSeed(time);
  const rows = Math.ceil(height / step);
  const cols = Math.ceil(width / step);

  for (let y = 0; y < rows; y += 1) {
    for (let x = 0; x < cols; x += 1) {
      const noise =
        (Math.sin((x + seed) * 12.9898 + (y + seed) * 78.233) * 43758.5453) % 1;
      const alpha = Math.abs(noise) * texture.opacity * texture.contrast;
      ctx.fillStyle = `rgba(255,255,255,${alpha * 0.18})`;
      ctx.fillRect(x * step, y * step, step, step);
    }
  }
}

function drawScanlines(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  texture: TextureConfig
) {
  ctx.fillStyle = `rgba(255,255,255,${texture.opacity * 0.16})`;
  const lineStep = Math.max(2, Math.round(8 - texture.scale * 4));
  for (let y = 0; y < height; y += lineStep) {
    ctx.fillRect(0, y, width, 1);
  }
}

export function drawTexture(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  document: BrandDocument,
  elapsedSeconds: number
) {
  if (!document.texture.enabled) {
    return;
  }

  ctx.save();

  switch (document.texture.type) {
    case 'scanline':
      drawScanlines(ctx, width, height, document.texture);
      break;
    case 'paper-grain':
      ctx.fillStyle = `${resolveColor(document.typography.textColor)}08`;
      ctx.fillRect(0, 0, width, height);
      drawNoiseGrid(ctx, width, height, document.texture, elapsedSeconds * 0.3);
      break;
    case 'mono-noise':
      drawNoiseGrid(ctx, width, height, document.texture, elapsedSeconds);
      break;
    case 'film-grain':
    default:
      ctx.globalCompositeOperation = 'overlay';
      drawNoiseGrid(
        ctx,
        width,
        height,
        document.texture,
        document.texture.animated ? elapsedSeconds * 1.8 : 1
      );
      break;
  }

  ctx.restore();
}
