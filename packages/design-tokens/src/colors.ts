export const brandColors = {
  ink: '#050505',
  charcoal: '#111111',
  fog: '#EDE9E1',
  steel: '#6E6E73',
  sunflower: '#F8D34D',
  coral: '#F25F5C',
  sky: '#66DDE8',
  meadow: '#63D26C',
  grape: '#5B3AE6',
  royal: '#6D5EF8',
  orange: '#FF7A00',
  chartreuse: '#C6FF3B',
  emerald: '#00A86B',
  blush: '#F3B6D9',
  violetMist: '#B8A7FF'
} as const;

export type BrandColorToken = keyof typeof brandColors;

export type ApprovedPaletteDefinition = {
  id: string;
  name: string;
  background: BrandColorToken;
  foreground: BrandColorToken;
  colors: readonly BrandColorToken[];
};

export const approvedPaletteDefinitions = [
  {
    id: 'coral-orbit',
    name: 'Coral Orbit',
    background: 'coral',
    foreground: 'fog',
    colors: ['coral', 'grape', 'sky', 'fog', 'steel', 'ink']
  },
  {
    id: 'sunburst-recovery',
    name: 'Sunburst Recovery',
    background: 'sunflower',
    foreground: 'ink',
    colors: ['sunflower', 'grape', 'sky', 'fog', 'steel', 'ink']
  },
  {
    id: 'aqua-recovery',
    name: 'Aqua Recovery',
    background: 'sky',
    foreground: 'ink',
    colors: ['sky', 'meadow', 'sunflower', 'fog', 'steel', 'ink']
  },
  {
    id: 'meadow-recovery',
    name: 'Meadow Recovery',
    background: 'meadow',
    foreground: 'ink',
    colors: ['meadow', 'coral', 'grape', 'fog', 'steel', 'ink']
  },
  {
    id: 'grape-recovery',
    name: 'Grape Recovery',
    background: 'grape',
    foreground: 'fog',
    colors: ['grape', 'sunflower', 'meadow', 'fog', 'steel', 'ink']
  }
] as const satisfies readonly ApprovedPaletteDefinition[];

export const approvedPalettes = approvedPaletteDefinitions.map((palette) => palette.colors);

export type ThemeDefinition = {
  id: string;
  name: string;
  mode: 'light' | 'dark';
  canvas: {
    background: BrandColorToken;
    foreground: BrandColorToken;
    accent: BrandColorToken;
    accentMuted: BrandColorToken;
  };
  chartPalette: readonly BrandColorToken[];
};

export const brandThemes = [
  {
    id: 'dark-editorial',
    name: 'Dark Editorial',
    mode: 'dark',
    canvas: {
      background: 'ink',
      foreground: 'fog',
      accent: 'royal',
      accentMuted: 'chartreuse'
    },
    chartPalette: ['royal', 'chartreuse', 'blush', 'violetMist']
  },
  {
    id: 'signal-warm',
    name: 'Signal Warm',
    mode: 'dark',
    canvas: {
      background: 'charcoal',
      foreground: 'fog',
      accent: 'orange',
      accentMuted: 'blush'
    },
    chartPalette: ['orange', 'blush', 'chartreuse', 'steel']
  },
  {
    id: 'briefing-light',
    name: 'Briefing Light',
    mode: 'light',
    canvas: {
      background: 'fog',
      foreground: 'ink',
      accent: 'royal',
      accentMuted: 'emerald'
    },
    chartPalette: ['royal', 'emerald', 'orange', 'steel']
  }
] as const satisfies readonly ThemeDefinition[];

function luminance(hex: string) {
  const normalized = hex.replace('#', '');
  const pairs =
    normalized.length === 3
      ? normalized.split('').map((value) => value + value)
      : normalized.match(/.{2}/g) ?? ['00', '00', '00'];
  const [r, g, b] = pairs.map((pair) => Number.parseInt(pair, 16) / 255);
  const channels = [r, g, b].map((value) =>
    value <= 0.03928 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4
  );
  return channels[0] * 0.2126 + channels[1] * 0.7152 + channels[2] * 0.0722;
}

export function resolveColor(token: BrandColorToken | string): string {
  return token in brandColors ? brandColors[token as BrandColorToken] : token;
}

export function getContrastRatio(foreground: BrandColorToken | string, background: BrandColorToken | string) {
  const fg = luminance(resolveColor(foreground));
  const bg = luminance(resolveColor(background));
  const lighter = Math.max(fg, bg);
  const darker = Math.min(fg, bg);
  return (lighter + 0.05) / (darker + 0.05);
}

export function themePassesContrastGuidance(theme: ThemeDefinition, minimumRatio = 4.5) {
  return getContrastRatio(theme.canvas.foreground, theme.canvas.background) >= minimumRatio;
}
