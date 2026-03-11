import type { BrandDocument, MotionBehavior } from '@/lib/types/document';

export type RenderMotion = {
  phase: number;
  layerDrift: number;
  pulse: number;
  verticalDrift: number;
  pan: number;
};

export function getMotionPhase(
  enabled: boolean,
  elapsedSeconds: number,
  loopDuration: number
) {
  if (!enabled || loopDuration <= 0) {
    return 0;
  }

  return (elapsedSeconds % loopDuration) / loopDuration;
}

export function getBehaviorStrengths(behavior: MotionBehavior) {
  return {
    pulseStrength: behavior === 'pulse' || behavior === 'breathe' ? 1 : 0.42,
    panStrength: behavior === 'pan' ? 1 : 0.16,
    floatStrength: behavior === 'float' ? 1 : 0.28,
    driftStrength: behavior === 'drift' ? 1 : 0.52
  };
}

export function createRenderMotion(
  document: Pick<BrandDocument, 'motion'>,
  elapsedSeconds: number
): RenderMotion {
  const phase = getMotionPhase(
    document.motion.enabled,
    elapsedSeconds,
    document.motion.loopDuration
  );
  const cycle = Math.sin(phase * Math.PI * 2);
  const strengths = getBehaviorStrengths(document.motion.behavior);

  return {
    phase,
    layerDrift: cycle * document.motion.speed * strengths.driftStrength,
    pulse: cycle * document.motion.amplitude * 4 * strengths.pulseStrength,
    verticalDrift:
      Math.cos(phase * Math.PI * 2) * document.motion.speed * strengths.floatStrength,
    pan: cycle * document.motion.speed * strengths.panStrength
  };
}
