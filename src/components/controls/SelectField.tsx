'use client';

import { useId } from 'react';

type SelectFieldProps<T extends string> = {
  label: string;
  value: T;
  options: Array<{ label: string; value: T }>;
  onChange: (value: T) => void;
};

export function SelectField<T extends string>({
  label,
  value,
  options,
  onChange
}: SelectFieldProps<T>) {
  const inputId = useId();

  return (
    <label className="block" htmlFor={inputId}>
      <div className="mb-2 text-xs uppercase tracking-[0.18em] text-white/48">{label}</div>
      <select
        className="w-full rounded-2xl border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-fog"
        id={inputId}
        name={inputId}
        onChange={(event) => onChange(event.target.value as T)}
        value={value}
      >
        {options.map((option) => (
          <option className="bg-[#111111] text-fog" key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}
