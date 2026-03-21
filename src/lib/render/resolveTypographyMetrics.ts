import { typographyScale } from '@/lib/theme/typography';
import type { BrandDocument } from '@/lib/types/document';

const BASELINE_TALLNESS = 1080 / 1920;
const MIN_TYPOGRAPHY_MULTIPLIER = 0.95;
const MAX_TYPOGRAPHY_MULTIPLIER = 1.5;
const TYPOGRAPHY_CURVE_EXPONENT = 0.35;

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}

export type ResolvedTypographyMetrics = {
  multiplier: number;
  eyebrowSize: number;
  headlineSize: number;
  bodySize: number;
  bodyGap: number;
};

export function getFormatRelativeTypographyMultiplier(
  width: number,
  height: number
) {
  const tallness = height / width;
  const ratio = tallness / BASELINE_TALLNESS;

  return clamp(
    Math.pow(ratio, TYPOGRAPHY_CURVE_EXPONENT),
    MIN_TYPOGRAPHY_MULTIPLIER,
    MAX_TYPOGRAPHY_MULTIPLIER
  );
}

export function resolveTypographyMetrics(
  document: BrandDocument,
  width: number,
  height: number
): ResolvedTypographyMetrics {
  const multiplier = getFormatRelativeTypographyMultiplier(width, height);

  return {
    multiplier,
    eyebrowSize: typographyScale.eyebrow.size * multiplier,
    headlineSize: document.typography.headlineSize * multiplier,
    bodySize: document.typography.bodySize * multiplier,
    bodyGap: Math.max(16, 20 * multiplier)
  };
}
