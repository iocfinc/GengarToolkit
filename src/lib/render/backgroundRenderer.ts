import { resolveColor } from '@/lib/theme/colors';
import { createRenderMotion, type RenderMotion } from '@/lib/render/motionEngine';
import type { BrandDocument, Point } from '@/lib/types/document';

function clamp(value: number, min = 0, max = 1) {
  return Math.max(min, Math.min(max, value));
}

function easeInOutSine(value: number) {
  return -(Math.cos(Math.PI * value) - 1) / 2;
}

function motionOffset(
  point: Point,
  intensity: number,
  angle: number,
  motion: RenderMotion
) {
  const eased = easeInOutSine(motion.phase);
  return {
    x:
      point.x +
      Math.cos(angle + motion.layerDrift) * intensity * eased +
      motion.pan * 0.06,
    y:
      point.y +
      Math.sin(angle + motion.layerDrift) * intensity * eased +
      motion.verticalDrift * 0.04
  };
}

function fillRadialGlow(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  position: Point,
  color: string,
  size: number,
  softness: number,
  intensity: number
) {
  const x = position.x * width;
  const y = position.y * height;
  const radius = Math.max(width, height) * size;
  const gradient = ctx.createRadialGradient(x, y, 0, x, y, radius);
  gradient.addColorStop(0, `${color}${Math.round(clamp(intensity) * 255)
    .toString(16)
    .padStart(2, '0')}`);
  gradient.addColorStop(clamp(softness * 0.72), `${color}55`);
  gradient.addColorStop(1, `${color}00`);

  ctx.save();
  ctx.fillStyle = gradient;
  ctx.filter = `blur(${Math.round(radius * softness * 0.16)}px)`;
  ctx.fillRect(0, 0, width, height);
  ctx.restore();
}

function drawMeshField(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  document: BrandDocument,
  motion: RenderMotion
) {
  const baseA = motionOffset(
    document.background.glowPositionA,
    document.motion.amplitude * 0.65,
    0.4,
    motion
  );
  const baseB = motionOffset(
    document.background.glowPositionB,
    document.motion.amplitude * 0.72,
    2.3,
    motion
  );
  const baseC = motionOffset(
    { x: 0.52, y: 0.48 },
    document.motion.amplitude * 0.42,
    4.6,
    motion
  );
  const baseD = motionOffset(
    { x: 0.86, y: 0.16 },
    document.motion.amplitude * 0.36,
    1.5,
    motion
  );

  fillRadialGlow(
    ctx,
    width,
    height,
    baseA,
    resolveColor(document.background.glowColorA),
    document.background.glowSize * (1 + motion.pulse * 0.08),
    document.background.softness,
    document.background.intensity * (1 + motion.pulse * 0.08)
  );
  fillRadialGlow(
    ctx,
    width,
    height,
    baseB,
    resolveColor(document.background.glowColorB),
    document.background.glowSize * 0.92 * (1 + motion.pulse * 0.06),
    document.background.softness,
    document.background.intensity * 0.92 * (1 + motion.pulse * 0.06)
  );
  fillRadialGlow(
    ctx,
    width,
    height,
    baseC,
    resolveColor(document.motif.color),
    document.background.glowSize * 0.78 * (1 + motion.pulse * 0.04),
    0.84,
    document.background.intensity * 0.58 * (1 + motion.pulse * 0.04)
  );
  fillRadialGlow(
    ctx,
    width,
    height,
    baseD,
    resolveColor(document.background.glowColorA),
    document.background.glowSize * 0.48,
    0.92,
    document.background.intensity * 0.32 * (1 + motion.pulse * 0.04)
  );
}

function drawLinearWash(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  document: BrandDocument,
  motion: RenderMotion
) {
  const gradient = ctx.createLinearGradient(
    0,
    0,
    width * (0.82 + motion.layerDrift * 0.08),
    height
  );
  gradient.addColorStop(0, resolveColor(document.background.baseColor));
  gradient.addColorStop(0.42, `${resolveColor(document.background.glowColorA)}99`);
  gradient.addColorStop(1, `${resolveColor(document.background.glowColorB)}22`);
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);

  fillRadialGlow(
    ctx,
    width,
    height,
    motionOffset(document.background.glowPositionA, document.motion.amplitude * 0.55, 1.4, motion),
    resolveColor(document.background.glowColorA),
    document.background.glowSize * 1.2 * (1 + motion.pulse * 0.06),
    document.background.softness,
    document.background.intensity * 0.88 * (1 + motion.pulse * 0.08)
  );
}

function drawDualOrb(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  document: BrandDocument,
  motion: RenderMotion
) {
  fillRadialGlow(
    ctx,
    width,
    height,
    motionOffset(document.background.glowPositionA, document.motion.amplitude * 0.75, 0.8, motion),
    resolveColor(document.background.glowColorA),
    document.background.glowSize * 1.1 * (1 + motion.pulse * 0.07),
    document.background.softness,
    document.background.intensity * (1 + motion.pulse * 0.08)
  );
  fillRadialGlow(
    ctx,
    width,
    height,
    motionOffset(document.background.glowPositionB, document.motion.amplitude * 0.68, 3.6, motion),
    resolveColor(document.background.glowColorB),
    document.background.glowSize * (1 + motion.pulse * 0.04),
    document.background.softness,
    document.background.intensity * 0.95 * (1 + motion.pulse * 0.08)
  );
}

function drawRadialGlow(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  document: BrandDocument,
  motion: RenderMotion
) {
  fillRadialGlow(
    ctx,
    width,
    height,
    motionOffset(document.background.glowPositionA, document.motion.amplitude * 0.44, 1.2, motion),
    resolveColor(document.background.glowColorA),
    document.background.glowSize * 1.18 * (1 + motion.pulse * 0.08),
    document.background.softness,
    document.background.intensity * (1 + motion.pulse * 0.1)
  );
}

function drawVignette(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  vignette: number
) {
  const gradient = ctx.createRadialGradient(
    width / 2,
    height / 2,
    Math.min(width, height) * 0.12,
    width / 2,
    height / 2,
    Math.max(width, height) * 0.7
  );
  gradient.addColorStop(0, 'rgba(0, 0, 0, 0)');
  gradient.addColorStop(1, `rgba(0, 0, 0, ${clamp(vignette, 0, 0.88)})`);
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);
}

export function drawBackground(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  document: BrandDocument,
  elapsedSeconds: number
) {
  const motion: RenderMotion = createRenderMotion(document, elapsedSeconds);

  ctx.save();
  ctx.fillStyle = resolveColor(document.background.baseColor);
  ctx.fillRect(0, 0, width, height);
  ctx.globalCompositeOperation = 'screen';

  switch (document.background.type) {
    case 'linear-wash':
      drawLinearWash(ctx, width, height, document, motion);
      break;
    case 'dual-orb':
      drawDualOrb(ctx, width, height, document, motion);
      break;
    case 'mesh-field':
      drawMeshField(ctx, width, height, document, motion);
      break;
    case 'radial-glow':
    default:
      drawRadialGlow(ctx, width, height, document, motion);
      break;
  }

  ctx.globalCompositeOperation = 'source-over';
  drawVignette(ctx, width, height, document.background.vignette);
  ctx.restore();
}
