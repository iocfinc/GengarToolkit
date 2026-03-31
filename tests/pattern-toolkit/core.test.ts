import { describe, expect, it } from 'vitest';
import { buildSvgMarkup, cyrb128, makeRng, quarterPath, regenOrientations } from '../../apps/pattern-toolkit/src/core';

describe('pattern-toolkit core', () => {
  it('cyrb128 is deterministic for a seed', () => {
    const a = cyrb128('seed-1');
    const b = cyrb128('seed-1');
    expect(a).toEqual(b);
  });

  it('makeRng generates repeatable sequence', () => {
    const rng1 = makeRng('alpha');
    const rng2 = makeRng('alpha');
    const seq1 = Array.from({ length: 5 }, () => rng1());
    const seq2 = Array.from({ length: 5 }, () => rng2());
    expect(seq1).toEqual(seq2);
  });

  it('regenOrientations returns correct length and range', () => {
    const mods = 3; // 6x6 cells
    const orientations = regenOrientations(mods, 'beta');
    expect(orientations).toHaveLength(36);
    expect(Math.min(...orientations)).toBeGreaterThanOrEqual(0);
    expect(Math.max(...orientations)).toBeLessThanOrEqual(3);
  });

  it('quarterPath returns valid path strings for orientations', () => {
    const s = 100;
    const path0 = quarterPath(0, 0, s, 0, 'filled');
    const path1 = quarterPath(0, 0, s, 1, 'filled');
    const path2 = quarterPath(0, 0, s, 2, 'filled');
    const path3 = quarterPath(0, 0, s, 3, 'filled');
    [path0, path1, path2, path3].forEach((p) => expect(p).toMatch(/^M\s/));
  });

  it('buildSvgMarkup produces an SVG root', () => {
    const orientations = Array.from({ length: 4 }, (_, i) => i % 4);
    const svg = buildSvgMarkup({
      size: 200,
      modules: 1,
      shapeColor: '#000000',
      bgColor: '#ffffff',
      mode: 'filled',
      strokeWidth: 8,
      seed: 's-1',
      orientations
    });
    expect(svg.startsWith('<svg')).toBe(true);
    expect(svg.includes('<rect')).toBe(true);
    expect(svg.includes('<path')).toBe(true);
  });
});

