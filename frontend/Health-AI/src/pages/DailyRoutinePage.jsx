import { useEffect, useMemo, useState } from "react";
import {
  CalendarCheck,
  Droplets,
  Moon,
  Activity,
  Dumbbell,
  Footprints,
  RefreshCcw,
  TrendingUp,
  Sparkles,
} from "lucide-react";

import PageContainer from "../components/layout/PageContainer";
import RoutineStats from "../components/routine/RoutineStats";
import TodayRoutineForm from "../components/routine/TodayRoutineForm";
import WeeklyOverview from "../components/routine/WeeklyOverview";
import InfoBadge from "../components/common/InfoBadge";
import Loader from "../components/common/Loader";
import EmptyState from "../components/common/EmptyState";
import ErrorState from "../components/common/ErrorState";

import { getRoutineData } from "../services/routineService";
import { useUser } from "../context/UserContext";

const RoutineMetric = ({ icon: Icon, label, value, helper, tone = "primary" }) => {
  const toneClass =
    tone === "cyan"
      ? "bg-cyan-500/10 text-cyan-300 border-cyan-500/20"
      : tone === "emerald"
      ? "bg-emerald-500/10 text-emerald-300 border-emerald-500/20"
      : tone === "orange"
      ? "bg-orange-500/10 text-orange-300 border-orange-500/20"
      : "bg-primary/10 text-primary border-primary/20";

  return (
    <div className={`rounded-3xl border p-4 ${toneClass}`}>
      <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-2xl bg-white/10">
        <Icon size={20} />
      </div>
      <p className="text-xs font-medium opacity-80">{label}</p>
      <p className="mt-1 text-2xl font-bold text-white">{value}</p>
      <p className="mt-1 text-xs opacity-70">{helper}</p>
    </div>
  );
};

const DailyRoutinePage = () => {
  const { userId, user } = useUser();

  const [routineData, setRoutineData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [error, setError] = useState("");

  const loadRoutine = async () => {
    if (!userId) {
      setRoutineData(null);
      setError("No active user found.");
      return;
    }

    try {
      setLoading(true);
      setHasError(false);
      setError("");

      const data = await getRoutineData(userId);

      if (!data || data?.error) {
        setRoutineData(null);
        setError(data?.error || "Routine data not found.");
        return;
      }

      setRoutineData({
        completed: data.completed ?? 0,
        sleepHours: data.sleepHours ?? 0,
        waterIntake: data.waterIntake ?? 0,
        steps: data.steps ?? 0,
        workout: data.workout ?? 0,
        todayRoutine: data.todayRoutine ?? [],
        weeklyOverview: data.weeklyOverview ?? [],
      });
    } catch (err) {
      console.error("Routine fetch error:", err);
      setRoutineData(null);
      setHasError(true);
      setError("Failed to load routine data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRoutine();

    const refreshHandler = () => loadRoutine();

    window.addEventListener("smart-add-updated", refreshHandler);
    window.addEventListener("assistant-command-updated", refreshHandler);

    return () => {
      window.removeEventListener("smart-add-updated", refreshHandler);
      window.removeEventListener("assistant-command-updated", refreshHandler);
    };
  }, [userId]);

  const completionLevel = useMemo(() => {
    const completed = routineData?.completed ?? 0;

    if (completed >= 80) return "Excellent";
    if (completed >= 60) return "Good";
    if (completed >= 40) return "Improving";
    return "Needs Focus";
  }, [routineData]);

  if (loading && !routineData) {
    return (
      <PageContainer
        title="Daily Routine"
        subtitle="Track your daily health habits, consistency, and wellness goals"
      >
        <Loader text="Loading routine..." />
      </PageContainer>
    );
  }

  if (hasError) {
    return (
      <PageContainer
        title="Daily Routine"
        subtitle="Track your daily health habits, consistency, and wellness goals"
      >
        <ErrorState
          title="Routine Error"
          message={error || "Failed to load routine data."}
        />
      </PageContainer>
    );
  }

  return (
    <PageContainer
      title="Daily Routine"
      subtitle="Track your daily health habits, consistency, and wellness goals"
    >
      <div className="space-y-6">
        <section className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.04] p-5 shadow-2xl shadow-black/20">
          <div className="pointer-events-none absolute right-0 top-0 h-44 w-44 rounded-full bg-primary/20 blur-[100px]" />
          <div className="pointer-events-none absolute bottom-0 left-1/3 h-44 w-44 rounded-full bg-cyan-500/10 blur-[100px]" />

          <div className="relative flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-start gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-3xl border border-primary/20 bg-primary/10 text-primary shadow-lg shadow-primary/10">
                <CalendarCheck size={30} />
              </div>

              <div>
                <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-200">
                  <Sparkles size={13} />
                  Wellness tracking active
                </div>

                <h2 className="text-2xl font-bold text-white">
                  Today’s Wellness Routine
                </h2>

                <p className="mt-1 max-w-2xl text-sm leading-6 text-slate-400">
                  Monitor sleep, hydration, steps, workout consistency, and
                  daily wellness habits for {user?.name || "active user"}.
                </p>

                <div className="mt-4 flex flex-wrap gap-2">
                  <InfoBadge
                    label={`${routineData?.completed ?? 0}% Completed`}
                    variant="primary"
                  />
                  <InfoBadge
                    label={completionLevel}
                    variant={
                      completionLevel === "Excellent" || completionLevel === "Good"
                        ? "success"
                        : "warning"
                    }
                  />
                </div>
              </div>
            </div>

            <button
              onClick={loadRoutine}
              disabled={loading}
              className="flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/[0.04] px-5 py-3 text-sm font-semibold text-slate-300 transition hover:bg-white/10 hover:text-white disabled:opacity-50"
            >
              <RefreshCcw size={16} className={loading ? "animate-spin" : ""} />
              Refresh Routine
            </button>
          </div>

          {routineData ? (
            <div className="relative mt-6">
              <div className="mb-2 flex items-center justify-between text-xs text-slate-400">
                <span>Daily completion</span>
                <span>{routineData.completed ?? 0}%</span>
              </div>

              <div className="h-3 overflow-hidden rounded-full bg-white/10">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-primary to-cyan-400 transition-all duration-1000"
                  style={{
                    width: `${Math.max(
                      0,
                      Math.min(Number(routineData.completed ?? 0), 100)
                    )}%`,
                  }}
                />
              </div>
            </div>
          ) : null}
        </section>

        {!loading && error && (
          <EmptyState title="Routine Error" message={error} />
        )}

        {!loading && !error && !routineData && (
          <EmptyState
            title="No routine loaded"
            message="No routine data available for the active user."
          />
        )}

        {!loading && !error && routineData && (
          <>
            <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5">
              <RoutineMetric
                icon={Moon}
                label="Sleep"
                value={`${routineData.sleepHours} hrs`}
                helper="Target: 7–8 hrs"
                tone="primary"
              />
              <RoutineMetric
                icon={Droplets}
                label="Water Intake"
                value={`${routineData.waterIntake} L`}
                helper="Target: 3–4 L"
                tone="cyan"
              />
              <RoutineMetric
                icon={Footprints}
                label="Steps"
                value={routineData.steps}
                helper="Target: 8k–10k"
                tone="emerald"
              />
              <RoutineMetric
                icon={Dumbbell}
                label="Workout"
                value={`${routineData.workout} min`}
                helper="Daily movement"
                tone="orange"
              />
              <RoutineMetric
                icon={TrendingUp}
                label="Completion"
                value={`${routineData.completed}%`}
                helper={completionLevel}
                tone="primary"
              />
            </section>

            <RoutineStats data={routineData} />

            <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
              <TodayRoutineForm tasks={routineData.todayRoutine} />
              <WeeklyOverview weeklyData={routineData.weeklyOverview} />
            </div>
          </>
        )}
      </div>
    </PageContainer>
  );
};

export default DailyRoutinePage;