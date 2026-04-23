import { CalendarCheck, Moon, Droplets, Activity, Dumbbell } from "lucide-react";

const statsConfig = [
  {
    key: "completed",
    label: "Tasks Completed",
    icon: CalendarCheck,
    suffix: "%",
  },
  {
    key: "sleepHours",
    label: "Sleep",
    icon: Moon,
    suffix: " hrs",
  },
  {
    key: "waterIntake",
    label: "Water",
    icon: Droplets,
    suffix: " L",
  },
  {
    key: "steps",
    label: "Steps",
    icon: Activity,
    suffix: "",
  },
  {
    key: "workout",
    label: "Workout",
    icon: Dumbbell,
    suffix: " min",
  },
];

const RoutineStats = ({ data = {} }) => {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5">
      {statsConfig.map((item) => {
        const Icon = item.icon;
        const value =
          data && data[item.key] !== undefined && data[item.key] !== null && data[item.key] !== ""
            ? data[item.key]
            : "--";

        return (
          <div
            key={item.key}
            className="rounded-3xl border border-white/10 bg-white/5 p-5"
          >
            <div className="mb-4 flex items-center justify-between">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/10 text-primary">
                <Icon size={18} />
              </div>
              <span className="text-xs text-slate-400">Today</span>
            </div>

            <p className="text-sm text-slate-400">{item.label}</p>

            <h3 className="mt-2 text-2xl font-bold text-white">
              {value}
              <span className="ml-1 text-sm font-medium text-slate-400">
                {item.suffix}
              </span>
            </h3>
          </div>
        );
      })}
    </div>
  );
};

export default RoutineStats;