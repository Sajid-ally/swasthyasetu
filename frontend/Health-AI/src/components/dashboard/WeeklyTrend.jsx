import { useEffect, useMemo, useState } from "react";
import { BarChart3, TrendingUp } from "lucide-react";
import SectionCard from "../common/SectionCard";
import InfoBadge from "../common/InfoBadge";

const WeeklyTrend = ({ data = [] }) => {
  const [animateBars, setAnimateBars] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimateBars(true);
    }, 150);

    return () => clearTimeout(timer);
  }, [data]);

  const average = useMemo(() => {
    if (!data.length) return 0;

    const total = data.reduce((sum, item) => sum + Number(item.value || 0), 0);
    return Math.round(total / data.length);
  }, [data]);

  return (
    <SectionCard
      title="Weekly Activity Trend"
      subtitle="Your routine consistency across the week"
      icon={BarChart3}
      rightContent={
        <InfoBadge variant={average >= 70 ? "success" : "primary"}>
          Avg {average}%
        </InfoBadge>
      }
    >
      {data.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-white/10 bg-white/[0.04] px-4 py-10 text-center">
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/15 text-primary">
            <TrendingUp size={22} />
          </div>
          <p className="text-sm font-semibold text-white">
            No weekly trend available
          </p>
          <p className="mt-1 text-xs text-slate-400">
            Add routine data to generate weekly insights.
          </p>
        </div>
      ) : (
        <div className="rounded-3xl border border-white/10 bg-[#020617]/60 p-4">
          <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-sm font-semibold text-white">
                Activity performance
              </p>
              <p className="mt-1 text-xs text-slate-400">
                Higher bars indicate better daily completion.
              </p>
            </div>

            <div className="flex items-center gap-2 rounded-2xl border border-primary/20 bg-primary/10 px-3 py-2 text-xs text-primary">
              <span className="h-2.5 w-2.5 rounded-full bg-primary" />
              Activity
            </div>
          </div>

          <div className="flex h-64 items-end justify-between gap-3 px-1">
            {data.map((item, index) => {
              const value = Math.max(0, Math.min(Number(item.value || 0), 100));

              return (
                <div
                  key={item.day || index}
                  className="group flex flex-1 flex-col items-center"
                >
                  <div className="flex h-48 w-full items-end justify-center">
                    <div className="relative flex h-full w-full max-w-[78px] items-end justify-center rounded-3xl border border-white/10 bg-white/[0.03] px-2 pb-2">
                      <div className="absolute -top-8 scale-95 rounded-xl border border-white/10 bg-[#0f172a] px-2 py-1 text-[11px] font-semibold text-white opacity-0 shadow-xl transition-all duration-300 group-hover:scale-100 group-hover:opacity-100">
                        {value}%
                      </div>

                      <div
                        className="w-full rounded-2xl bg-gradient-to-t from-primary via-violet-400 to-cyan-300 shadow-[0_0_22px_rgba(139,92,246,0.35)] transition-all duration-700 ease-out group-hover:scale-105 group-hover:shadow-[0_0_35px_rgba(139,92,246,0.55)]"
                        style={{
                          height: animateBars ? `${value}%` : "0%",
                          transitionDelay: `${index * 100}ms`,
                        }}
                      />
                    </div>
                  </div>

                  <span className="mt-3 text-xs font-semibold capitalize text-slate-400">
                    {item.day || `Day ${index + 1}`}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </SectionCard>
  );
};

export default WeeklyTrend;