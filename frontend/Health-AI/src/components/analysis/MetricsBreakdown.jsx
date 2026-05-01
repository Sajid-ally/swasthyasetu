import {
  Moon,
  Footprints,
  Dumbbell,
  HeartPulse,
} from "lucide-react";

const getMetricConfig = (label, rawValue) => {
  const value = String(rawValue || "").trim();

  if (label === "Sleep") {
    const numeric = parseFloat(value) || 0;
    const progress = Math.max(0, Math.min((numeric / 8) * 100, 100));

    return {
      icon: Moon,
      displayValue: value || "0 hrs",
      progress,
    };
  }

  if (label === "Steps") {
    const numeric = parseFloat(value) || 0;
    const progress = Math.max(0, Math.min((numeric / 10000) * 100, 100));

    return {
      icon: Footprints,
      displayValue: value || "0",
      progress,
    };
  }

  if (label === "Workout") {
    const numeric = parseFloat(value) || 0;
    const progress = Math.max(0, Math.min((numeric / 120) * 100, 100));

    return {
      icon: Dumbbell,
      displayValue: value || "0 min",
      progress,
    };
  }

  if (label === "Blood Pressure") {
    const parts = value.split("/");
    const systolic = parseInt(parts[0], 10) || 0;
    const diastolic = parseInt(parts[1], 10) || 0;

    let progress = 0;

    if (systolic > 0 && diastolic > 0) {
      const systolicScore = Math.min((systolic / 140) * 100, 100);
      const diastolicScore = Math.min((diastolic / 90) * 100, 100);
      progress = (systolicScore + diastolicScore) / 2;
    }

    return {
      icon: HeartPulse,
      displayValue: value || "0/0",
      progress,
    };
  }

  return {
    icon: HeartPulse,
    displayValue: value || "N/A",
    progress: 0,
  };
};

const MetricsBreakdown = ({ metrics = [], scoreValue = 0 }) => {
  return (
    <div className="rounded-[28px] border border-cyan-500/10 bg-[#0b1020]/95 p-6 shadow-[0_0_40px_rgba(0,180,255,0.08)]">
      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <span className="inline-flex rounded-full border border-cyan-400/20 bg-cyan-500/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-cyan-300">
            Performance
          </span>
          <h3 className="mt-4 text-4xl font-bold tracking-tight text-white">
            Metrics Breakdown
          </h3>
          <p className="mt-2 text-base text-slate-400">
            Backend-driven health metrics for current user.
          </p>
        </div>

        <div className="rounded-full border border-cyan-400/20 bg-cyan-500/10 px-5 py-3 text-lg font-semibold text-cyan-300">
          Score: {scoreValue}
        </div>
      </div>

      <div className="space-y-5">
        {metrics.map((item, index) => {
          const { icon: Icon, displayValue, progress } = getMetricConfig(
            item.label,
            item.value
          );

          return (
            <div
              key={index}
              className="rounded-3xl border border-slate-700/60 bg-[#0a1328] p-5"
            >
              <div className="mb-4 flex items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-500/10 text-cyan-300">
                    <Icon size={22} />
                  </div>

                  <div>
                    <h4 className="text-xl font-semibold text-white">
                      {item.label}
                    </h4>
                    <p className="text-sm text-slate-400">
                      Current recorded value
                    </p>
                  </div>
                </div>

                <div className="text-right text-2xl font-bold text-cyan-300">
                  {displayValue}
                </div>
              </div>

              <div className="h-3 w-full overflow-hidden rounded-full bg-slate-700/40">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-500 transition-all duration-500"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MetricsBreakdown;