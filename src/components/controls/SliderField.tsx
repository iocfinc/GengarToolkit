'use client';

type SliderFieldProps = {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  onChange: (value: number) => void;
  formatValue?: (value: number) => string;
};

export function SliderField({
  label,
  value,
  min,
  max,
  step = 0.01,
  onChange,
  formatValue = (next) => next.toFixed(2)
}: SliderFieldProps) {
  return (
    <label className="block">
      <div className="mb-2 flex items-center justify-between text-xs uppercase tracking-[0.18em] text-white/48">
        <span>{label}</span>
        <span className="text-white/72">{formatValue(value)}</span>
      </div>
      <input
        className="h-2 w-full cursor-pointer appearance-none rounded-full bg-white/10 accent-white"
        max={max}
        min={min}
        onChange={(event) => onChange(Number(event.target.value))}
        step={step}
        type="range"
        value={value}
      />
    </label>
  );
}
