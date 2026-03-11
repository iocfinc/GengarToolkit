import { typographyScale } from '@/lib/theme/typography';
import type { AnchorPosition, BrandDocument } from '@/lib/types/document';

type TypographyLayout = {
  eyebrowText: string | null;
  headlineLines: string[];
  bodyLines: string[];
  startY: number;
};

function wrapLines(
  ctx: CanvasRenderingContext2D,
  text: string,
  maxWidth: number
) {
  const words = text.split(/\s+/).filter(Boolean);
  const lines: string[] = [];
  let current = '';

  for (const word of words) {
    const candidate = current ? `${current} ${word}` : word;
    if (ctx.measureText(candidate).width <= maxWidth || !current) {
      current = candidate;
    } else {
      lines.push(current);
      current = word;
    }
  }

  if (current) {
    lines.push(current);
  }

  return lines;
}

function measureTypographyBlockHeight(
  document: BrandDocument,
  eyebrowText: string | null,
  headlineLines: string[],
  bodyLines: string[]
) {
  let height = 0;

  if (eyebrowText) {
    height += typographyScale.eyebrow.size * 2.1;
  }

  if (headlineLines.length > 0) {
    height +=
      headlineLines.length *
      document.typography.headlineSize *
      document.typography.lineHeight;

    if (bodyLines.length > 0) {
      height += 20;
    }
  }

  if (bodyLines.length > 0) {
    height += bodyLines.length * document.typography.bodySize * 1.55;
  }

  return height;
}

function getVerticalStart(
  anchor: AnchorPosition,
  height: number,
  padding: number,
  blockHeight: number
) {
  if (anchor === 'center' || anchor.startsWith('center')) {
    return (height - blockHeight) / 2;
  }

  if (anchor.startsWith('bottom')) {
    return height - padding - blockHeight;
  }

  return padding;
}

export function createTypographyLayout(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  document: BrandDocument,
  padding: number
): TypographyLayout {
  const maxWidth = width * document.typography.maxWidth;
  const eyebrowText = document.typography.eyebrow
    ? document.typography.eyebrow.toUpperCase()
    : null;

  let headlineLines: string[] = [];
  let bodyLines: string[] = [];

  if (document.typography.headline) {
    ctx.font = `${document.typography.weight} ${document.typography.headlineSize}px ${typographyScale.display.family}`;
    headlineLines = wrapLines(ctx, document.typography.headline, maxWidth);
  }

  if (document.typography.body) {
    ctx.font = `500 ${document.typography.bodySize}px ${typographyScale.body.family}`;
    bodyLines = wrapLines(ctx, document.typography.body, maxWidth * 0.92);
  }

  const blockHeight = measureTypographyBlockHeight(
    document,
    eyebrowText,
    headlineLines,
    bodyLines
  );

  return {
    eyebrowText,
    headlineLines,
    bodyLines,
    startY: getVerticalStart(document.typography.anchor, height, padding, blockHeight)
  };
}
