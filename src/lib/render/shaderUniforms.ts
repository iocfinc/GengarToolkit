import type { BrandDocument } from '@/lib/types/document';

export function documentToUniformSummary(document: BrandDocument) {
  return {
    backgroundType: document.background.type,
    glowSize: document.background.glowSize,
    glowIntensity: document.background.intensity,
    motifScale: document.motif.scale,
    textureOpacity: document.texture.opacity,
    motionAmplitude: document.motion.amplitude,
    motionSpeed: document.motion.speed
  };
}
