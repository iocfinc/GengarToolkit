'use client';

import {
  approvedPaletteDefinitions,
  brandColors,
  type ApprovedPaletteDefinition
} from '@packages/design-tokens/src/colors';

export function PaletteGrid({
  selectedPaletteId,
  onSelect
}: {
  selectedPaletteId?: string | null;
  onSelect: (palette: ApprovedPaletteDefinition) => void;
}) {
  return (
    <div className="grid grid-cols-1 gap-2 sm:grid-cols-2" data-testid="palette-grid">
      {approvedPaletteDefinitions.map((palette) => (
        <button
          aria-label={palette.name}
          aria-pressed={selectedPaletteId === palette.id}
          className={`rounded-2xl border p-2 text-left transition ${
            selectedPaletteId === palette.id
              ? 'border-white/60 bg-white/8'
              : 'border-white/10 bg-white/[0.03] hover:border-white/20'
          }`}
          key={palette.id}
          onClick={() => onSelect(palette)}
          type="button"
        >
          <span
            className="mb-3 block rounded-xl px-3 py-5"
            style={{ backgroundColor: brandColors[palette.background] }}
          >
            <span className="block text-[10px] uppercase tracking-[0.18em] text-black/55">
              Approved Palette
            </span>
            <span
              className="mt-1 block text-sm font-semibold"
              style={{ color: brandColors[palette.foreground] }}
            >
              {palette.name}
            </span>
          </span>
          <span className="flex gap-2">
            {palette.colors.map((token) => (
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
