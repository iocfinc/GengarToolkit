import { resolveColor } from '@/lib/theme/colors';
import { typographyScale } from '@/lib/theme/typography';
import { createTypographyLayout } from '@/lib/render/typographyLayout';
import type { AnchorPosition, BrandDocument, TextAlignment } from '@/lib/types/document';
import { drawBackground } from '@/lib/render/backgroundRenderer';
import { drawTexture } from '@/lib/render/textureRenderer';

type DrawSceneOptions = {
  elapsedSeconds: number;
  showGrid?: boolean;
  showSafeMargins?: boolean;
};

function getAnchorColumn(anchor: AnchorPosition) {
  if (anchor === 'center') {
    return 'center';
  }

  return (anchor.split('-')[1] ?? 'center') as 'left' | 'center' | 'right';
}

function getHorizontalOrigin(
  alignment: TextAlignment,
  anchor: AnchorPosition,
  width: number,
  padding: number,
  blockWidth: number
) {
  const column = getAnchorColumn(anchor);

  if (alignment === 'center') {
    if (column === 'left') {
      return padding + blockWidth / 2;
    }

    if (column === 'right') {
      return width - padding - blockWidth / 2;
    }

    return width / 2;
  }

  if (alignment === 'right') {
    if (column === 'left') {
      return padding + blockWidth;
    }

    if (column === 'center') {
      return (width + blockWidth) / 2;
    }

    return width - padding;
  }

  if (column === 'center') {
    return (width - blockWidth) / 2;
  }

  if (column === 'right') {
    return width - padding - blockWidth;
  }

  return padding;
}

function drawGuides(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  showGrid?: boolean,
  showSafeMargins?: boolean
) {
  ctx.save();

  if (showGrid) {
    ctx.strokeStyle = 'rgba(255,255,255,0.08)';
    ctx.lineWidth = 1;
    for (let i = 1; i < 3; i += 1) {
      ctx.beginPath();
      ctx.moveTo((width / 3) * i, 0);
      ctx.lineTo((width / 3) * i, height);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(0, (height / 3) * i);
      ctx.lineTo(width, (height / 3) * i);
      ctx.stroke();
    }
  }

  if (showSafeMargins) {
    const margin = Math.min(width, height) * 0.08;
    ctx.strokeStyle = 'rgba(255,255,255,0.14)';
    ctx.setLineDash([10, 8]);
    ctx.strokeRect(margin, margin, width - margin * 2, height - margin * 2);
  }

  ctx.restore();
}

function drawMotif(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  document: BrandDocument,
  elapsedSeconds: number
) {
  if (!document.motif.enabled) {
    return;
  }

  const centerX = document.motif.position.x * width;
  const centerY = document.motif.position.y * height;
  const baseSize = Math.min(width, height) * document.motif.scale;
  const phase = document.motion.enabled
    ? (elapsedSeconds / document.motion.loopDuration) * Math.PI * 2
    : 0;
  const behaviorMultiplier =
    document.motion.behavior === 'float'
      ? 1
      : document.motion.behavior === 'pulse'
        ? 0.35
        : 0.6;
  const offset =
    Math.sin(phase) * document.motion.amplitude * Math.min(width, height) * behaviorMultiplier;
  const sizePulse =
    document.motion.behavior === 'pulse' || document.motion.behavior === 'breathe'
      ? 1 + Math.sin(phase) * document.motion.amplitude * 0.8
      : 1;

  ctx.save();
  ctx.translate(centerX, centerY + offset);
  ctx.rotate((document.motif.rotation * Math.PI) / 180);
  ctx.globalAlpha = document.motif.opacity;
  ctx.filter = `blur(${baseSize * document.motif.blur * 0.32}px)`;
  ctx.strokeStyle = resolveColor(document.motif.color);
  ctx.fillStyle = resolveColor(document.motif.color);

  for (let index = 0; index < document.motif.count; index += 1) {
    const motifSize = baseSize * sizePulse;
    const shift = index * motifSize * 0.22;
    switch (document.motif.type) {
      case 'halo':
      case 'ring':
        ctx.lineWidth = Math.max(2, motifSize * 0.08);
        ctx.beginPath();
        ctx.arc(shift, -shift * 0.3, motifSize, 0, Math.PI * 2);
        ctx.stroke();
        break;
      case 'light-bar':
        ctx.fillRect(
          -motifSize * 1.5 + shift,
          -motifSize * 0.18,
          motifSize * 3,
          motifSize * 0.36
        );
        break;
      case 'blob':
        ctx.beginPath();
        ctx.ellipse(
          shift,
          shift * 0.2,
          motifSize * 1.2,
          motifSize * 0.72,
          0.6,
          0,
          Math.PI * 2
        );
        ctx.fill();
        break;
      case 'orb':
      default:
        ctx.beginPath();
        ctx.arc(shift, 0, motifSize, 0, Math.PI * 2);
        ctx.fill();
        break;
    }
  }

  ctx.restore();
}

function applyTextAlign(ctx: CanvasRenderingContext2D, alignment: TextAlignment) {
  ctx.textAlign = alignment;
}

function drawTypography(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  document: BrandDocument
) {
  if (document.layoutPreset === 'background-only') {
    return;
  }

  const paddingMap = {
    sm: 52,
    md: 76,
    lg: 112
  };
  const padding = paddingMap[document.typography.paddingPreset];
  const layout = createTypographyLayout(ctx, width, height, document, padding);
  const originX = getHorizontalOrigin(
    document.typography.alignment,
    document.typography.anchor,
    width,
    padding,
    layout.blockWidth
  );

  ctx.save();
  ctx.fillStyle = resolveColor(document.typography.textColor);
  applyTextAlign(ctx, document.typography.alignment);
  ctx.textBaseline = 'top';

  let cursorY = layout.startY;

  if (layout.eyebrowText) {
    ctx.font = `600 ${typographyScale.eyebrow.size}px ${typographyScale.eyebrow.family}`;
    ctx.globalAlpha = 0.78;
    ctx.fillText(layout.eyebrowText, originX, cursorY);
    cursorY += typographyScale.eyebrow.size * 2.1;
  }

  if (layout.headlineLines.length > 0) {
    ctx.globalAlpha = 1;
    ctx.font = `${document.typography.weight} ${document.typography.headlineSize}px ${typographyScale.display.family}`;
    for (const line of layout.headlineLines) {
      ctx.fillText(line, originX, cursorY);
      cursorY += document.typography.headlineSize * document.typography.lineHeight;
    }
    if (layout.bodyLines.length > 0) {
      cursorY += 20;
    }
  }

  if (layout.bodyLines.length > 0) {
    ctx.globalAlpha = 0.82;
    ctx.font = `500 ${document.typography.bodySize}px ${typographyScale.body.family}`;
    for (const line of layout.bodyLines) {
      ctx.fillText(line, originX, cursorY);
      cursorY += document.typography.bodySize * 1.55;
    }
  }

  ctx.restore();
}

export function drawScene(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  document: BrandDocument,
  options: DrawSceneOptions
) {
  ctx.clearRect(0, 0, width, height);
  drawBackground(ctx, width, height, document, options.elapsedSeconds);
  drawMotif(ctx, width, height, document, options.elapsedSeconds);
  drawTexture(ctx, width, height, document, options.elapsedSeconds);
  drawTypography(ctx, width, height, document);
  drawGuides(ctx, width, height, options.showGrid, options.showSafeMargins);
}
