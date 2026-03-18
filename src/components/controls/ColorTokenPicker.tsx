'use client';

import { useEffect, useMemo, useState } from 'react';
import { brandColors, resolveColor } from '@/lib/theme/colors';

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
  const isTokenValue = value in brandColors;
  const resolvedValue = useMemo(() => resolveColor(value), [value]);
  const [customValue, setCustomValue] = useState(resolvedValue);

  useEffect(() => {
    setCustomValue(resolvedValue);
  }, [resolvedValue]);

  function normalizeHex(nextValue: string) {
    const trimmed = nextValue.trim();
    const withHash = trimmed.startsWith('#') ? trimmed : `#${trimmed}`;
    return /^#[0-9a-fA-F]{6}$/.test(withHash) ? withHash.toUpperCase() : null;
  }

  function handleCustomValue(nextValue: string) {
    setCustomValue(nextValue);
    const normalized = normalizeHex(nextValue);
    if (normalized) {
      onChange(normalized);
    }
  }

  return (
    <fieldset>
      <legend className="mb-2 text-xs uppercase tracking-[0.18em] text-white/48">{label}</legend>
      <div className="grid grid-cols-4 gap-2">
        {Object.entries(brandColors).map(([token, hex]) => (
          <button
            aria-pressed={value === token}
            className={`group rounded-2xl border p-1.5 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60 ${
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
        <button
          aria-pressed={!isTokenValue}
          className={`rounded-2xl border p-1.5 text-left transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60 ${
            !isTokenValue ? 'border-white/70 bg-white/8' : 'border-white/8 bg-white/[0.03]'
          }`}
          onClick={() => onChange(customValue)}
          type="button"
        >
          <span
            className="block h-8 rounded-xl border border-dashed border-white/14"
            style={{ backgroundColor: customValue }}
          />
          <span className="mt-1 block text-[10px] uppercase tracking-[0.16em] text-white/70">
            Custom
          </span>
        </button>
      </div>
      {!isTokenValue ? (
        <div className="mt-3 flex items-center gap-3 rounded-2xl border border-white/8 bg-white/[0.03] px-3 py-3">
          <input
            aria-label={`${label} custom color picker`}
            className="h-10 w-14 cursor-pointer rounded-xl border border-white/10 bg-transparent p-1"
            onChange={(event) => handleCustomValue(event.target.value)}
            type="color"
            value={normalizeHex(customValue) ?? '#000000'}
          />
          <input
            aria-label={`${label} hex color`}
            className="w-full rounded-2xl border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-fog"
            onBlur={() => setCustomValue(resolveColor(value))}
            onChange={(event) => handleCustomValue(event.target.value)}
            value={customValue}
          />
        </div>
      ) : null}
    </fieldset>
  );
}
