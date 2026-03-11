export const brandColors = {
  ink: '#050505',
  charcoal: '#111111',
  fog: '#EDE9E1',
  steel: '#6E6E73',
  royal: '#6D5EF8',
  orange: '#FF7A00',
  chartreuse: '#C6FF3B',
  emerald: '#00A86B',
  blush: '#F3B6D9',
  violetMist: '#B8A7FF'
} as const;

export type BrandColorToken = keyof typeof brandColors;

export const approvedPalettes = [
  ['royal', 'chartreuse', 'ink'],
  ['orange', 'blush', 'charcoal'],
  ['emerald', 'violetMist', 'ink'],
  ['royal', 'blush', 'charcoal'],
  ['chartreuse', 'steel', 'ink']
] as const satisfies readonly BrandColorToken[][];

export function resolveColor(token: BrandColorToken | string): string {
  return token in brandColors
    ? brandColors[token as BrandColorToken]
    : token;
}
