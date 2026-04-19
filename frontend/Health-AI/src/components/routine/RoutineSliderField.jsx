const RoutineSliderField = ({
  label,
  name,
  value,
  onChange,
  min = 0,
  max = 10,
  step = 1,
}) => {
  return (
    <div className="rounded-card border border-border bg-background p-4">
      <div className="mb-3 flex items-center justify-between">
        <label className="text-sm font-medium text-white">{label}</label>
        <span className="text-sm text-primary">{value}</span>
      </div>

      <input
        type="range"
        name={name}
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={onChange}
        className="w-full accent-violet-500"
      />
    </div>
  );
};

export default RoutineSliderField;