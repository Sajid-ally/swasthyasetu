import { BarChart3 } from "lucide-react";
import SectionCard from "../common/SectionCard";
import InfoBadge from "../common/InfoBadge";

const WeeklyOverview = ({ weeklyData = [] }) => {
  return (
    <SectionCard
      title="Weekly Overview"
      subtitle="Daily routine consistency across the week"
      icon={BarChart3}
    >
      <div className="space-y-4">
        {weeklyData.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-white/10 bg-white/5 px-4 py-8 text-center text-sm text-slate-400">
            No weekly overview data available.
          </div>
        ) : (
          weeklyData.map((day, index) => {
            const progress =
              typeof day.progress === "number"
                ? Math.max(0, Math.min(day.progress, 100))
                : 0;

            const isStrong = progress >= 75;
            const isAverage = progress >= 40 && progress < 75;

            return (
              <div
                key={day.id || day.day || index}
                className="rounded-2xl border border-white/10 bg-white/5 p-4 transition hover:border-primary/30 hover:bg-white/10"
              >
                <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <h4 className="text-sm font-semibold text-white">
                      {day.day || "Day"}
                    </h4>
                    <p className="text-xs text-slate-400">
                      {day.label || "Routine progress"}
                    </p>
                  </div>

                  <InfoBadge
                    label={`${progress}%`}
                    variant={
                      isStrong ? "success" : isAverage ? "warning" : "danger"
                    }
                  />
                </div>

                <div className="h-3 overflow-hidden rounded-full bg-white/10">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      isStrong
                        ? "bg-emerald-400"
                        : isAverage
                        ? "bg-amber-400"
                        : "bg-rose-400"
                    }`}
                    style={{ width: `${progress}%` }}
                  />
                </div>

                <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-slate-400">
                  {day.completedTasks !== undefined && (
                    <span className="rounded-full bg-white/5 px-3 py-1">
                      Completed: {day.completedTasks}
                    </span>
                  )}

                  {day.totalTasks !== undefined && (
                    <span className="rounded-full bg-white/5 px-3 py-1">
                      Total: {day.totalTasks}
                    </span>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </SectionCard>
  );
};

export default WeeklyOverview;