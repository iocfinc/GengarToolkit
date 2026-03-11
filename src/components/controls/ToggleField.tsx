'use client';

type ToggleFieldProps = {
  label: string;
  checked: boolean;
  onChange: (value: boolean) => void;
};

export function ToggleField({ label, checked, onChange }: ToggleFieldProps) {
  return (
    <label className="flex items-center justify-between gap-3 rounded-2xl border border-white/8 bg-white/[0.03] px-3 py-2.5">
      <span className="text-sm text-white/80">{label}</span>
      <button
        aria-pressed={checked}
        className={`relative h-7 w-12 rounded-full transition ${
          checked ? 'bg-fog text-ink' : 'bg-white/10 text-white/40'
        }`}
        onClick={() => onChange(!checked)}
        type="button"
      >
        <span
          className={`absolute top-1 h-5 w-5 rounded-full bg-current transition ${
            checked ? 'left-6' : 'left-1'
          }`}
        />
      </button>
    </label>
  );
}
