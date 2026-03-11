'use client';

import type { AnchorPosition } from '@/lib/types/document';

const positions: AnchorPosition[] = [
  'top-left',
  'top-center',
  'top-right',
  'center-left',
  'center',
  'center-right',
  'bottom-left',
  'bottom-center',
  'bottom-right'
];

type AnchorGridFieldProps = {
  value: AnchorPosition;
  onChange: (value: AnchorPosition) => void;
};

export function AnchorGridField({
  value,
  onChange
}: AnchorGridFieldProps) {
  return (
    <fieldset>
      <legend className="mb-2 text-xs uppercase tracking-[0.18em] text-white/48">Anchor</legend>
      <div className="grid grid-cols-3 gap-2">
        {positions.map((position) => (
          <button
            aria-label={position}
            className={`aspect-square rounded-xl border transition ${
              value === position
                ? 'border-white/70 bg-white/12'
                : 'border-white/8 bg-white/[0.03]'
            }`}
            key={position}
            onClick={() => onChange(position)}
            type="button"
          >
            <span className="mx-auto block h-2.5 w-2.5 rounded-full bg-white/70" />
          </button>
        ))}
      </div>
    </fieldset>
  );
}
