'use client';

import { approvedPalettes, brandColors } from '@packages/design-tokens/src/colors';

export function PaletteGrid({
  onSelect
}: {
  onSelect: (palette: readonly (keyof typeof brandColors)[]) => void;
}) {
  return (
    <div className="grid grid-cols-2 gap-2" data-testid="palette-grid">
      {approvedPalettes.map((palette, index) => (
        <button
          className="rounded-2xl border border-white/10 bg-white/[0.03] p-2 transition hover:border-white/20"
          key={`${palette.join('-')}-${index}`}
          onClick={() => onSelect(palette)}
          type="button"
        >
          <span className="mb-2 block text-left text-[10px] uppercase tracking-[0.18em] text-white/42">
            Palette {index + 1}
          </span>
          <span className="flex gap-2">
            {palette.map((token) => (
              <span
                className="block h-8 flex-1 rounded-xl"
                key={token}
                style={{ backgroundColor: brandColors[token] }}
                title={token}
              />
            ))}
          </span>
        </button>
      ))}
    </div>
  );
}
