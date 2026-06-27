import { useEffect, useState } from "react";
import {
  CalendarCheck,
  MoonStar,
  Droplets,
  Footprints,
  Dumbbell,
  TrendingUp,
} from "lucide-react";
import SectionCard from "../common/SectionCard";
import InfoBadge from "../common/InfoBadge";

const MetricBox = ({ icon: Icon, label, value, progress, colorClasses }) => {
  const safeProgress = Math.max(0, Math.min(Number(progress ?? 0), 100));
  const [animatedProgress, setAnimatedProgress] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedProgress(safeProgress);
    }, 120);

    return () => clearTimeout(timer);
  }, [safeProgress]);

  return (
    <div className="group relative overflow-hidden rounded-3xl border border-white/10 bg-[#020617]/70 p-4 transition-all duration-300 hover:-translate-y-1 hover:border-primary/30 hover:bg-white/[0.06] hover:shadow-2xl hover:shadow-black/20">
      <div className={`pointer-events-none absolute -right-8 -top-8 h-24 w-24 rounded-full blur-2xl ${colorClasses.glow}`} />

      <div className="relative mb-4 flex items-center justify-between">
        <div
          className={`flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 transition-transform duration-300 group-hover:scale-110 ${colorClasses.iconBg}`}
        >
          <Icon size={18} className={colorClasses.iconText} />
        </div>

        <div className="text-right">
          <p className="text-base font-bold text-white">{value}</p>
          <p className="text-[10px] uppercase tracking-wider text-slate-500">
            Today
          </p>
        </div>
      </div>

      <div className="relative">
        <div className="mb-2 flex items-center justify-between">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
            {label}
          </p>

          <span className="text-xs font-medium text-slate-400">
            {safeProgress}%
          </span>
        </div>

        <div className="h-2.5 w-full overflow-hidden rounded-full bg-white/10">
          <div
            className={`relative h-full rounded-full transition-all duration-1000 ease-out ${colorClasses.bar}`}
            style={{ width: `${animatedProgress}%` }}
          >
            <div className="absolute inset-y-0 right-0 w-8 bg-white/30 blur-sm" />
          </div>
        </div>
      </div>
    </div>
  );
};

const DailyRoutineCard = ({ data }) => {
  const completion = Math.max(0, Math.min(Number(data?.completion ?? 0), 100));

  return (
    <SectionCard
      title="Daily Routine"
      subtitle="Your habit completion for today"
      icon={CalendarCheck}
      rightContent={
        <InfoBadge variant="primary">
          {completion}% Complete
        </InfoBadge>
      }
    >
      <div className="mb-4 rounded-3xl border border-white/10 bg-white/[0.04] p-4">
        <div className="mb-3 flex items-center justify-between gap-3">
          <div>
            <p className="text-sm font-semibold text-white">
              Routine Progress
            </p>
            <p className="mt-1 text-xs text-slate-400">
              Sleep, water, steps and workout tracking
            </p>
          </div>

          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary/15 text-primary">
            <TrendingUp size={18} />
          </div>
        </div>

        <div className="h-2.5 overflow-hidden rounded-full bg-white/10">
          <div
            className="h-full rounded-full bg-gradient-to-r from-primary to-cyan-400 transition-all duration-1000"
            style={{ width: `${completion}%` }}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <MetricBox
          icon={MoonStar}
          label="Sleep"
          value={data?.sleep?.value ?? "--"}
          progress={data?.sleep?.progress ?? 0}
          colorClasses={{
            iconBg: "bg-primary/15",
            iconText: "text-primaryLight",
            bar: "bg-gradient-to-r from-primary to-primaryLight",
            glow: "bg-primary/20",
          }}
        />

        <MetricBox
          icon={Droplets}
          label="Water"
          value={data?.water?.value ?? "--"}
          progress={data?.water?.progress ?? 0}
          colorClasses={{
            iconBg: "bg-cyan-500/15",
            iconText: "text-cyan-300",
            bar: "bg-gradient-to-r from-cyan-500 to-sky-300",
            glow: "bg-cyan-500/20",
          }}
        />

        <MetricBox
          icon={Footprints}
          label="Steps"
          value={data?.steps?.value ?? "--"}
          progress={data?.steps?.progress ?? 0}
          colorClasses={{
            iconBg: "bg-emerald-500/15",
            iconText: "text-emerald-300",
            bar: "bg-gradient-to-r from-emerald-500 to-green-300",
            glow: "bg-emerald-500/20",
          }}
        />

        <MetricBox
          icon={Dumbbell}
          label="Workout"
          value={data?.workout?.value ?? "--"}
          progress={data?.workout?.progress ?? 0}
          colorClasses={{
            iconBg: "bg-orange-500/15",
            iconText: "text-orange-300",
            bar: "bg-gradient-to-r from-orange-500 to-amber-300",
            glow: "bg-orange-500/20",
          }}
        />
      </div>
    </SectionCard>
  );
};

export default DailyRoutineCard;