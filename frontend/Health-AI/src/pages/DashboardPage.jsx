import { useEffect, useMemo, useState } from "react";
import {
  Activity,
  Brain,
  CalendarClock,
  HeartPulse,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

import { getDashboard } from "../services/dashboardApi";
import { useUser } from "../context/UserContext";

import HealthScoreCard from "../components/dashboard/HealthScoreCard";
import DailyRoutineCard from "../components/dashboard/DailyRoutineCard";
import RiskAlertsCard from "../components/dashboard/RiskAlertsCard";
import WeeklyTrend from "../components/dashboard/WeeklyTrend";
import RecentActivity from "../components/dashboard/RecentActivity";
import MedicationSchedule from "../components/dashboard/MedicationSchedule";
import AIHealthSummary from "../components/dashboard/AIHealthSummary";

import Loader from "../components/common/Loader";
import EmptyState from "../components/common/EmptyState";
import ErrorState from "../components/common/ErrorState";

const getGreeting = () => {
  const hour = new Date().getHours();

  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
};

const DashboardPage = () => {
  const { userId } = useUser();

  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  const fetchDashboard = async () => {
    if (!userId) return;

    setIsLoading(true);
    setHasError(false);

    try {
      const res = await getDashboard(userId);
      setData(res);
    } catch (err) {
      console.error("Dashboard load error:", err);
      setHasError(true);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();

    const refreshHandler = () => fetchDashboard();

    window.addEventListener("smart-add-updated", refreshHandler);
    window.addEventListener("assistant-command-updated", refreshHandler);

    return () => {
      window.removeEventListener("smart-add-updated", refreshHandler);
      window.removeEventListener("assistant-command-updated", refreshHandler);
    };
  }, [userId]);

  const dashboardStats = useMemo(() => {
    return [
      {
        label: "Health Engine",
        value: "Active",
        icon: Brain,
        tone: "text-cyan-200 bg-cyan-500/10 border-cyan-500/20",
      },
      {
        label: "Emergency Profile",
        value: "Ready",
        icon: ShieldCheck,
        tone: "text-emerald-200 bg-emerald-500/10 border-emerald-500/20",
      },
      {
        label: "Daily Monitoring",
        value: "Live",
        icon: Activity,
        tone: "text-primary bg-primary/10 border-primary/20",
      },
    ];
  }, []);

  if (isLoading) return <Loader text="Loading dashboard..." />;

  if (hasError) {
    return (
      <ErrorState
        title="Failed to load dashboard"
        message="Dashboard data could not be loaded. Please check backend server."
      />
    );
  }

  if (!data) {
    return (
      <EmptyState
        title="No dashboard data"
        message="There is no dashboard information available yet."
      />
    );
  }

  return (
    <div className="space-y-6">
      <section className="overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.04] shadow-2xl shadow-black/20">
        <div className="relative p-5 sm:p-6 lg:p-7">
          <div className="pointer-events-none absolute right-0 top-0 h-40 w-40 rounded-full bg-primary/20 blur-[90px]" />
          <div className="pointer-events-none absolute bottom-0 left-1/3 h-40 w-40 rounded-full bg-cyan-500/10 blur-[100px]" />

          <div className="relative flex flex-col gap-6 xl:flex-row xl:items-center xl:justify-between">
            <div className="max-w-2xl">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1.5 text-xs font-semibold text-primary">
                <Sparkles size={14} />
                AI-powered health dashboard
              </div>

              <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
                {getGreeting()}, {data.name || "User"} 👋
              </h1>

              <p className="mt-2 max-w-xl text-sm leading-6 text-slate-400">
                Your routine, medicines, reports, vitals, and AI insights are
                connected in one smart dashboard.
              </p>

              <div className="mt-5 flex flex-wrap gap-3">
                <div className="flex items-center gap-2 rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-2.5 text-sm font-medium text-red-200">
                  <HeartPulse size={17} />
                  Emergency Profile Active
                </div>

                <div className="flex items-center gap-2 rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-2.5 text-sm font-medium text-slate-300">
                  <CalendarClock size={17} className="text-primary" />
                  Live health timeline enabled
                </div>
              </div>
            </div>

            <div className="grid min-w-0 grid-cols-1 gap-3 sm:grid-cols-3 xl:min-w-[520px]">
              {dashboardStats.map((item) => {
                const Icon = item.icon;

                return (
                  <div
                    key={item.label}
                    className={`rounded-3xl border p-4 ${item.tone}`}
                  >
                    <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-2xl bg-white/10">
                      <Icon size={20} />
                    </div>

                    <p className="text-xs opacity-80">{item.label}</p>
                    <p className="mt-1 text-lg font-bold">{item.value}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <HealthScoreCard data={data.healthScore} />
        <DailyRoutineCard data={data.dailyRoutine} />
        <RiskAlertsCard alerts={data.riskAlerts} />
      </section>

      <section>
        <WeeklyTrend data={data.weeklyActivity} />
      </section>

      <section className="grid grid-cols-1 gap-6 xl:grid-cols-5">
        <div className="xl:col-span-3">
          <RecentActivity activities={data.recentActivity} />
        </div>

        <div className="xl:col-span-2">
          <MedicationSchedule medicines={data.medications} />
        </div>
      </section>

      <section>
        <AIHealthSummary summary={data.aiSummary} />
      </section>
    </div>
  );
};

export default DashboardPage;