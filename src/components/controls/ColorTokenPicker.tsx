'use client';

import { brandColors } from '@/lib/theme/colors';

type ColorTokenPickerProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
};

export function ColorTokenPicker({
  label,
  value,
  onChange
}: ColorTokenPickerProps) {
  return (
    <fieldset>
      <legend className="mb-2 text-xs uppercase tracking-[0.18em] text-white/48">{label}</legend>
      <div className="grid grid-cols-5 gap-2">
        {Object.entries(brandColors).map(([token, hex]) => (
          <button
            className={`group rounded-2xl border p-1.5 transition ${
              value === token ? 'border-white/70 bg-white/8' : 'border-white/8 bg-white/[0.03]'
            }`}
            key={token}
            onClick={() => onChange(token)}
            type="button"
          >
            <span
              className="block h-8 rounded-xl"
              style={{ backgroundColor: hex }}
              title={token}
            />
            <span className="mt-1 block text-[10px] uppercase tracking-[0.16em] text-white/50 group-hover:text-white/80">
              {token}
            </span>
          </button>
        ))}
      </div>
    </fieldset>
  );
}
