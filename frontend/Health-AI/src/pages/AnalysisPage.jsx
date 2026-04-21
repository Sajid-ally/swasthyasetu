import {
  TrendingUp,
  HeartPulse,
  Brain,
  Moon,
  Droplets,
  Activity,
  BarChart3,
  Sparkles,
  ChevronRight,
  FileText,
  Clock3,
  CheckCircle2,
  ShieldCheck,
  Inbox,
} from "lucide-react";

const analysisStats = [
  {
    title: "Health Trend",
    value: "+12%",
    subtitle: "Improved this month",
    icon: TrendingUp,
  },
  {
    title: "Heart Score",
    value: "84",
    subtitle: "Stable condition",
    icon: HeartPulse,
  },
  {
    title: "Mental Wellness",
    value: "Good",
    subtitle: "Stress under control",
    icon: Brain,
  },
];

const chartData = [
  {
    label: "Heart Health",
    value: 84,
    icon: HeartPulse,
    note: "Very good recovery trend",
  },
  {
    label: "Sleep Quality",
    value: 72,
    icon: Moon,
    note: "Needs slightly better consistency",
  },
  {
    label: "Hydration",
    value: 68,
    icon: Droplets,
    note: "Increase daily water intake",
  },
  {
    label: "Physical Activity",
    value: 91,
    icon: Activity,
    note: "Excellent performance level",
  },
];

const recentReports = [
  {
    title: "Weekly Wellness Report",
    date: "15 Apr 2026",
    status: "Completed",
    summary: "Overall health indicators improved compared to last week.",
  },
  {
    title: "Sleep Pattern Analysis",
    date: "12 Apr 2026",
    status: "Reviewed",
    summary: "Sleep duration is healthy, but consistency can be improved.",
  },
  {
    title: "Cardiac Activity Report",
    date: "09 Apr 2026",
    status: "Stable",
    summary: "Heart rate and physical activity trends remain balanced.",
  },
];

const healthTimeline = [
  {
    day: "Mon",
    update: "Routine completed with strong hydration and sleep score.",
  },
  {
    day: "Wed",
    update: "Physical activity improved by 8% from previous session.",
  },
  {
    day: "Fri",
    update: "AI analysis suggested improving bedtime consistency.",
  },
  {
    day: "Sun",
    update: "Overall weekly wellness score increased significantly.",
  },
];

const recommendations = [
  "Maintain at least 7–8 hours of sleep daily",
  "Drink 2.5L to 3L water regularly",
  "Continue daily light workout or walking",
  "Track stress and mental wellness weekly",
];

const glassCard =
  "rounded-[32px] border border-white/10 bg-white/5 p-6 shadow-2xl backdrop-blur-xl transition-all duration-300";

const hoverCard =
  "rounded-2xl border border-white/10 bg-slate-900/40 p-4 transition-all duration-300 hover:-translate-y-1 hover:border-cyan-400/30 hover:bg-slate-900/60";

const primaryButton =
  "rounded-2xl bg-gradient-to-r from-cyan-400 to-blue-500 px-5 py-3 text-sm font-semibold text-slate-950 shadow-lg transition duration-300 hover:-translate-y-0.5 hover:shadow-cyan-500/20";

const secondaryButton =
  "rounded-2xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-semibold text-white transition duration-300 hover:border-cyan-400/30 hover:bg-white/10";

const sectionBadgeClass =
  "inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-cyan-300";

const getProgressWidth = (value) => `${value}%`;

const ShimmerBlock = ({ className = "" }) => {
  return <div className={`animate-pulse rounded-2xl bg-white/10 ${className}`} />;
};

const EmptyState = ({
  title = "No data available",
  description = "There is currently no information to display here.",
}) => {
  return (
    <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-white/10 bg-white/5 px-6 py-12 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-cyan-400/10 text-cyan-300">
        <Inbox size={24} />
      </div>
      <h3 className="mt-4 text-lg font-semibold text-white">{title}</h3>
      <p className="mt-2 max-w-md text-sm leading-6 text-slate-400">
        {description}
      </p>
    </div>
  );
};

const AnalysisPage = () => {
  const isLoading = false;

  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-950 px-4 py-6 text-white sm:px-6 lg:px-8">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-[-120px] top-[-80px] h-72 w-72 rounded-full bg-cyan-500/10 blur-3xl" />
        <div className="absolute right-[-120px] top-[120px] h-80 w-80 rounded-full bg-blue-500/10 blur-3xl" />
        <div className="absolute bottom-[-100px] left-[20%] h-72 w-72 rounded-full bg-indigo-500/10 blur-3xl" />
      </div>

      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-[8%] top-[18%] h-3 w-3 animate-pulse rounded-full bg-cyan-400/40" />
        <div className="absolute right-[12%] top-[28%] h-2.5 w-2.5 animate-ping rounded-full bg-blue-400/30" />
        <div className="absolute bottom-[22%] left-[18%] h-4 w-4 animate-pulse rounded-full bg-indigo-400/30" />
        <div className="absolute bottom-[15%] right-[10%] h-3 w-3 animate-pulse rounded-full bg-emerald-400/30" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl space-y-8">
        <div
          className={`${glassCard} group relative overflow-hidden shadow-[0_20px_80px_rgba(0,0,0,0.35)] hover:border-cyan-400/20 sm:p-8`}
        >
          <div className="absolute -left-10 top-0 h-32 w-32 rounded-full bg-cyan-500/20 blur-3xl transition duration-500 group-hover:bg-cyan-500/30" />
          <div className="absolute right-0 top-0 h-40 w-40 rounded-full bg-blue-500/20 blur-3xl transition duration-500 group-hover:bg-blue-500/30" />

          <div className="relative z-10 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/10 px-4 py-1.5 text-sm font-medium text-cyan-300 shadow-lg">
                <Sparkles size={16} />
                Smart Health Insights
              </div>

              <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl lg:text-5xl">
                <span className="bg-gradient-to-r from-cyan-300 via-blue-400 to-indigo-400 bg-clip-text text-transparent">
                  Analysis Dashboard
                </span>
              </h1>

              <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-300 sm:text-base">
                View personalized insights, monitor improvement trends, and
                understand your health patterns through clean visual analysis.
              </p>

              <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                <button className={primaryButton}>Generate Report</button>
                <button className={secondaryButton}>View Trends</button>
              </div>
            </div>

            <div className="self-start rounded-3xl border border-emerald-400/20 bg-emerald-400/10 p-4 text-emerald-300 shadow-xl">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-400/15 ring-1 ring-emerald-300/10">
                  <BarChart3 size={22} />
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-emerald-200/70">
                    Status
                  </p>
                  <p className="mt-1 text-sm font-semibold">Analysis Updated</p>
                  <p className="text-xs text-emerald-200/70">
                    Based on latest data
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
          {analysisStats.map((item) => {
            const Icon = item.icon;

            return (
              <div
                key={item.title}
                className="group relative overflow-hidden rounded-[28px] border border-white/10 bg-white/5 p-5 shadow-xl backdrop-blur-xl transition-all duration-300 hover:-translate-y-1.5 hover:border-cyan-400/30 hover:bg-white/10"
              >
                <div className="absolute right-0 top-0 h-24 w-24 rounded-full bg-cyan-400/10 blur-2xl transition-all duration-300 group-hover:bg-cyan-400/20" />

                <div className="relative z-10 flex items-start justify-between">
                  <div className="space-y-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-400/20 to-blue-500/20 text-cyan-300 shadow-lg ring-1 ring-white/10 transition duration-300 group-hover:scale-105">
                      <Icon size={22} />
                    </div>

                    <div>
                      <p className="text-sm font-medium text-slate-300">
                        {item.title}
                      </p>
                      <h3 className="mt-1 text-2xl font-bold text-white">
                        {item.value}
                      </h3>
                      <p className="mt-1 text-sm text-slate-400">
                        {item.subtitle}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 text-sm font-medium text-cyan-300">
                    Details
                    <ChevronRight
                      size={16}
                      className="transition-transform duration-300 group-hover:translate-x-1"
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
          <div className={`${glassCard} xl:col-span-2`}>
            <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <div className={sectionBadgeClass}>Performance</div>
                <h2 className="mt-3 text-2xl font-bold text-white">
                  Health Performance Overview
                </h2>
                <p className="mt-1 text-sm text-slate-400">
                  Your latest health indicators and wellness performance.
                </p>
              </div>

              <div className="rounded-2xl border border-cyan-400/20 bg-cyan-400/10 px-4 py-2 text-sm font-medium text-cyan-300">
                Monthly Summary
              </div>
            </div>

            <div className="space-y-5">
              {chartData.map((item) => {
                const Icon = item.icon;

                return (
                  <div key={item.label} className={`group ${hoverCard}`}>
                    <div className="mb-3 flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-400/20 to-blue-500/20 text-cyan-300 ring-1 ring-white/10 transition duration-300 group-hover:scale-105">
                          <Icon size={20} />
                        </div>

                        <div>
                          <p className="text-sm font-semibold text-white">
                            {item.label}
                          </p>
                          <p className="text-xs text-slate-400">{item.note}</p>
                        </div>
                      </div>

                      <div className="text-right">
                        <p className="text-lg font-bold text-cyan-300">
                          {item.value}%
                        </p>
                      </div>
                    </div>

                    <div className="h-3 overflow-hidden rounded-full bg-slate-800">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-500 transition-all duration-700"
                        style={{ width: getProgressWidth(item.value) }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className={glassCard}>
            <div className="mb-5">
              <div className={sectionBadgeClass}>AI Insights</div>
              <h2 className="mt-3 text-xl font-bold text-white">
                Personalized Suggestions
              </h2>
              <p className="mt-1 text-sm text-slate-400">
                Recommendations based on your recent patterns.
              </p>
            </div>

            <div className="space-y-4">
              <div className="rounded-2xl border border-emerald-400/20 bg-emerald-400/10 p-4 transition duration-300 hover:bg-emerald-400/15">
                <p className="text-sm font-semibold text-emerald-300">
                  Strong recovery
                </p>
                <p className="mt-1 text-sm leading-6 text-slate-300">
                  Your heart health and physical activity are showing a steady
                  positive trend this month.
                </p>
              </div>

              <div className="rounded-2xl border border-yellow-400/20 bg-yellow-400/10 p-4 transition duration-300 hover:bg-yellow-400/15">
                <p className="text-sm font-semibold text-yellow-300">
                  Sleep improvement needed
                </p>
                <p className="mt-1 text-sm leading-6 text-slate-300">
                  Sleep quality is decent, but improving bedtime consistency can
                  boost your recovery.
                </p>
              </div>

              <div className="rounded-2xl border border-cyan-400/20 bg-cyan-400/10 p-4 transition duration-300 hover:bg-cyan-400/15">
                <p className="text-sm font-semibold text-cyan-300">
                  Hydration reminder
                </p>
                <p className="mt-1 text-sm leading-6 text-slate-300">
                  Increase water intake slightly to support metabolism and daily
                  energy levels.
                </p>
              </div>
            </div>

            <div className="mt-6 rounded-2xl border border-white/10 bg-slate-900/50 p-4">
              <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
                Recommendation score
              </p>
              <h3 className="mt-2 text-3xl font-bold text-white">8.7/10</h3>
              <p className="mt-2 text-sm text-slate-400">
                Your current habits are good. Small improvements in sleep and
                hydration can raise your overall wellness score.
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
          <div className={`${glassCard} xl:col-span-2`}>
            <div className="mb-6 flex items-center justify-between">
              <div>
                <div className={sectionBadgeClass}>Reports</div>
                <h2 className="mt-3 text-2xl font-bold text-white">
                  Recent Reports
                </h2>
                <p className="mt-1 text-sm text-slate-400">
                  Your latest generated analysis and health summaries.
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-slate-900/50 px-4 py-2 text-sm text-slate-300">
                {recentReports.length} Reports
              </div>
            </div>

            {isLoading ? (
              <div className="space-y-4">
                <ShimmerBlock className="h-24 w-full" />
                <ShimmerBlock className="h-24 w-full" />
                <ShimmerBlock className="h-24 w-full" />
              </div>
            ) : recentReports.length === 0 ? (
              <EmptyState
                title="No reports found"
                description="Generated reports will appear here once analysis is completed."
              />
            ) : (
              <div className="space-y-4">
                {recentReports.map((report, index) => (
                  <div
                    key={`${report.title}-${index}`}
                    className="group rounded-2xl border border-white/10 bg-slate-900/40 p-5 transition-all duration-300 hover:-translate-y-1 hover:border-cyan-400/30 hover:bg-slate-900/70"
                  >
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                      <div className="flex items-start gap-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-400/20 to-blue-500/20 text-cyan-300 ring-1 ring-white/10 transition duration-300 group-hover:scale-105">
                          <FileText size={22} />
                        </div>

                        <div>
                          <h3 className="text-base font-semibold text-white">
                            {report.title}
                          </h3>
                          <p className="mt-1 text-sm leading-6 text-slate-400">
                            {report.summary}
                          </p>

                          <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-slate-500">
                            <span className="inline-flex items-center gap-1">
                              <Clock3 size={14} />
                              {report.date}
                            </span>
                            <span className="rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-emerald-300">
                              {report.status}
                            </span>
                          </div>
                        </div>
                      </div>

                      <button className="inline-flex self-start rounded-xl border border-cyan-400/20 bg-cyan-400/10 px-4 py-2 text-sm font-medium text-cyan-300 transition hover:bg-cyan-400/20">
                        <span className="flex items-center gap-1">
                          View
                          <ChevronRight
                            size={16}
                            className="transition-transform duration-300 group-hover:translate-x-1"
                          />
                        </span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className={glassCard}>
            <div className="mb-5">
              <div className={sectionBadgeClass}>Care Plan</div>
              <h2 className="mt-3 text-xl font-bold text-white">
                Recommendations
              </h2>
              <p className="mt-1 text-sm text-slate-400">
                Suggested actions to improve overall wellness.
              </p>
            </div>

            <div className="space-y-4">
              {recommendations.map((item, index) => (
                <div
                  key={`${item}-${index}`}
                  className="flex items-start gap-3 rounded-2xl border border-white/10 bg-slate-900/40 p-4 transition duration-300 hover:border-emerald-400/20 hover:bg-slate-900/60"
                >
                  <div className="mt-0.5 text-emerald-300">
                    <CheckCircle2 size={18} />
                  </div>
                  <p className="text-sm leading-6 text-slate-300">{item}</p>
                </div>
              ))}
            </div>

            <div className="mt-6 rounded-2xl border border-blue-400/20 bg-blue-400/10 p-4">
              <div className="flex items-center gap-2 text-blue-300">
                <ShieldCheck size={18} />
                <p className="text-sm font-semibold">Wellness Protection</p>
              </div>
              <p className="mt-2 text-sm leading-6 text-slate-300">
                Following these recommendations regularly can help maintain
                stable health scores and reduce future risk factors.
              </p>
            </div>
          </div>
        </div>

        <div className={glassCard}>
          <div className="mb-6">
            <div className={sectionBadgeClass}>Timeline</div>
            <h2 className="mt-3 text-2xl font-bold text-white">
              Weekly Health Timeline
            </h2>
            <p className="mt-1 text-sm text-slate-400">
              A quick view of your key wellness milestones this week.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
            {healthTimeline.map((item, index) => (
              <div
                key={`${item.day}-${index}`}
                className="relative rounded-2xl border border-white/10 bg-slate-900/40 p-5 transition-all duration-300 hover:-translate-y-1 hover:border-cyan-400/30 hover:bg-slate-900/60"
              >
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-cyan-400/20 to-blue-500/20 text-cyan-300 ring-1 ring-white/10">
                  {index + 1}
                </div>
                <p className="text-sm font-semibold text-cyan-300">{item.day}</p>
                <p className="mt-2 text-sm leading-6 text-slate-400">
                  {item.update}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalysisPage;