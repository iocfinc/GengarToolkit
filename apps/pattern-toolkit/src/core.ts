export type RenderMode = 'filled' | 'arc';

export interface PatternState {
  size: number; // px, square edge
  modules: 1 | 2 | 3 | 4 | 5; // modules per side
  shapeColor: string; // hex
  bgColor: string; // hex
  mode: RenderMode;
  strokeWidth: number; // px (arc only)
  seed: string; // RNG seed
  orientations: number[]; // length N*N, values 0..3
  editEnabled: boolean; // UI affordance
  selectedIndex: number; // -1 if none
}

// --- Seeded PRNG (cyrb128 -> sfc32) ---
export function cyrb128(str: string) {
  let h1 = 1779033703,
    h2 = 3144134277,
    h3 = 1013904242,
    h4 = 2773480762;
  for (let i = 0, k: number; i < str.length; i++) {
    k = str.charCodeAt(i);
    h1 = h2 ^ Math.imul(h1 ^ k, 597399067);
    h2 = h3 ^ Math.imul(h2 ^ k, 2869860233);
    h3 = h4 ^ Math.imul(h3 ^ k, 951274213);
    h4 = h1 ^ Math.imul(h4 ^ k, 2716044179);
  }
  h1 = Math.imul(h3 ^ (h1 >>> 18), 597399067);
  h2 = Math.imul(h4 ^ (h2 >>> 22), 2869860233);
  h3 = Math.imul(h1 ^ (h3 >>> 17), 951274213);
  h4 = Math.imul(h2 ^ (h4 >>> 19), 2716044179);
  return [
    (h1 ^ h2 ^ h3 ^ h4) >>> 0,
    (h2 ^ h1) >>> 0,
    (h3 ^ h1) >>> 0,
    (h4 ^ h1) >>> 0
  ];
}

export function sfc32(a: number, b: number, c: number, d: number) {
  return function () {
    a >>>= 0;
    b >>>= 0;
    c >>>= 0;
    d >>>= 0;
    let t = (a + b) | 0;
    a = b ^ (b >>> 9);
    b = (c + (c << 3)) | 0;
    c = (c << 21) | (c >>> 11);
    d = (d + 1) | 0;
    t = (t + d) | 0;
    c = (c + t) | 0;
    return (t >>> 0) / 4294967296;
  };
}

export function makeRng(seedStr: string) {
  const s = cyrb128(String(seedStr));
  return sfc32(s[0], s[1], s[2], s[3]);
}

export function cellsPerSide(modules: number) {
  return modules * 2;
}

export function regenOrientations(modules: number, seed: string) {
  const n = cellsPerSide(modules);
  const total = n * n;
  const rng = makeRng(`${seed}::n=${n}`);
  const arr = new Array<number>(total);
  for (let i = 0; i < total; i++) arr[i] = Math.floor(rng() * 4);
  return arr;
}

// --- Geometry ---
// orient: 0=TL, 1=TR, 2=BR, 3=BL
export function quarterPath(x0: number, y0: number, s: number, orient: number, mode: RenderMode) {
  const TL = 0,
    TR = 1,
    BR = 2,
    BL = 3;
  if (mode === 'filled') {
    switch (orient) {
      case TL: {
        const cx = x0,
          cy = y0;
        const p1x = x0 + s,
          p1y = y0;
        const p2x = x0,
          p2y = y0 + s;
        return `M ${cx} ${cy} L ${p1x} ${p1y} A ${s} ${s} 0 0 1 ${p2x} ${p2y} Z`;
      }
      case TR: {
        const cx = x0 + s,
          cy = y0;
        const p1x = x0 + s,
          p1y = y0 + s;
        const p2x = x0,
          p2y = y0;
        return `M ${cx} ${cy} L ${p1x} ${p1y} A ${s} ${s} 0 0 1 ${p2x} ${p2y} Z`;
      }
      case BR: {
        const cx = x0 + s,
          cy = y0 + s;
        const p1x = x0,
          p1y = y0 + s;
        const p2x = x0 + s,
          p2y = y0;
        return `M ${cx} ${cy} L ${p1x} ${p1y} A ${s} ${s} 0 0 1 ${p2x} ${p2y} Z`;
      }
      case BL:
      default: {
        const cx = x0,
          cy = y0 + s;
        const p1x = x0,
          p1y = y0;
        const p2x = x0 + s,
          p2y = y0 + s;
        return `M ${cx} ${cy} L ${p1x} ${p1y} A ${s} ${s} 0 0 1 ${p2x} ${p2y} Z`;
      }
    }
  } else {
    switch (orient) {
      case TL: {
        const p1x = x0 + s,
          p1y = y0;
        const p2x = x0,
          p2y = y0 + s;
        return `M ${p1x} ${p1y} A ${s} ${s} 0 0 1 ${p2x} ${p2y}`;
      }
      case TR: {
        const p1x = x0 + s,
          p1y = y0 + s;
        const p2x = x0,
          p2y = y0;
        return `M ${p1x} ${p1y} A ${s} ${s} 0 0 1 ${p2x} ${p2y}`;
      }
      case BR: {
        const p1x = x0,
          p1y = y0 + s;
        const p2x = x0 + s,
          p2y = y0;
        return `M ${p1x} ${p1y} A ${s} ${s} 0 0 1 ${p2x} ${p2y}`;
      }
      case BL:
      default: {
        const p1x = x0,
          p1y = y0;
        const p2x = x0 + s,
          p2y = y0 + s;
        return `M ${p1x} ${p1y} A ${s} ${s} 0 0 1 ${p2x} ${p2y}`;
      }
    }
  }
}

export function buildSvgMarkup(state: Omit<PatternState, 'editEnabled' | 'selectedIndex'>) {
  const n = cellsPerSide(state.modules);
  const size = state.size;
  const cell = size / n;

  let svg = '';
  svg += `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">`;
  svg += `<rect x="0" y="0" width="${size}" height="${size}" fill="${state.bgColor}"/>`;
  svg += `<g fill="${state.mode === 'filled' ? state.shapeColor : 'none'}" stroke="${
    state.mode === 'arc' ? state.shapeColor : 'none'
  }" stroke-width="${state.strokeWidth}" stroke-linecap="round" vector-effect="non-scaling-stroke">`;
  for (let r = 0; r < n; r++) {
    for (let c = 0; c < n; c++) {
      const idx = r * n + c;
      const orient = state.orientations[idx] ?? 0;
      const x0 = c * cell;
      const y0 = r * cell;
      svg += `<path class="tile" data-idx="${idx}" d="${quarterPath(x0, y0, cell, orient, state.mode)}"/>`;
    }
  }
  svg += `</g>`;
  svg += `</svg>`;
  return svg;
}

