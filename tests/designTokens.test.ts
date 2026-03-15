import { describe, expect, it } from 'vitest';
import {
  approvedPalettes,
  brandColors,
  brandThemes,
  resolveColor
} from '@packages/design-tokens/src/colors';
import { typographyScale as sharedTypographyScale } from '@packages/design-tokens/src/typography';

describe('design tokens package', () => {
  it('exports the approved brand color tokens', () => {
    expect(brandColors.royal).toBe('#6D5EF8');
    expect(resolveColor('fog')).toBe('#EDE9E1');
    expect(approvedPalettes.length).toBeGreaterThan(0);
  });

  it('ships named themes for shared toolkit use', () => {
    expect(brandThemes.map((theme) => theme.id)).toContain('dark-editorial');
  });

  it('exports the shared typography scale', () => {
    expect(sharedTypographyScale.display.size).toBe(78);
    expect(sharedTypographyScale.body.family).toContain('Avenir Next');
  });
});
