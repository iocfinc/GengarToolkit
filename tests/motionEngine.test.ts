import { describe, expect, it } from 'vitest';
import { createDocument } from '@/lib/presets/defaultPresets';
import {
  createRenderMotion,
  getBehaviorStrengths,
  getMotionPhase
} from '@/lib/render/motionEngine';

describe('motionEngine', () => {
  it('wraps motion phase across loop boundaries', () => {
    expect(getMotionPhase(true, 13, 6)).toBeCloseTo(1 / 6);
  });

  it('returns a zero phase when motion is disabled', () => {
    expect(getMotionPhase(false, 13, 6)).toBe(0);
  });

  it.each([
    ['drift', { pulseStrength: 0.42, panStrength: 0.16, floatStrength: 0.28, driftStrength: 1 }],
    ['pulse', { pulseStrength: 1, panStrength: 0.16, floatStrength: 0.28, driftStrength: 0.52 }],
    ['float', { pulseStrength: 0.42, panStrength: 0.16, floatStrength: 1, driftStrength: 0.52 }],
    ['pan', { pulseStrength: 0.42, panStrength: 1, floatStrength: 0.28, driftStrength: 0.52 }],
    ['breathe', { pulseStrength: 1, panStrength: 0.16, floatStrength: 0.28, driftStrength: 0.52 }]
  ] as const)('returns expected strengths for %s', (behavior, expected) => {
    expect(getBehaviorStrengths(behavior)).toEqual(expected);
  });

  it('creates render motion values using the current document motion settings', () => {
    const document = createDocument();
    document.motion.behavior = 'drift';
    document.motion.speed = 0.48;
    document.motion.amplitude = 0.06;
    document.motion.loopDuration = 6;

    const motion = createRenderMotion(document, 1.5);

    expect(motion.phase).toBeCloseTo(0.25);
    expect(motion.layerDrift).toBeCloseTo(0.48);
    expect(motion.pulse).toBeCloseTo(0.1008);
    expect(motion.verticalDrift).toBeCloseTo(0);
    expect(motion.pan).toBeCloseTo(0.0768);
  });

  it('returns the idle baseline motion profile when motion is disabled', () => {
    const document = createDocument();
    document.motion.enabled = false;

    const motion = createRenderMotion(document, 12);

    expect(motion).toEqual({
      phase: 0,
      layerDrift: 0,
      pulse: 0,
      verticalDrift: 0.48 * 0.28,
      pan: 0
    });
  });
});
