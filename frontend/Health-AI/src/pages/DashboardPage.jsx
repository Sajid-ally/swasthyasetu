import { useEffect, useState } from "react";
import { getDashboard } from "../services/dashboardApi";
import { useUser } from "../context/UserContext"; 
import HealthScoreCard from "../components/dashboard/HealthScoreCard";
import DailyRoutineCard from "../components/dashboard/DailyRoutineCard";
import RiskAlertsCard from "../components/dashboard/RiskAlertsCard";
import WeeklyTrend from "../components/dashboard/WeeklyTrend";
import RecentActivity from "../components/dashboard/RecentActivity";
import MedicationSchedule from "../components/dashboard/MedicationSchedule";
import AIHealthSummary from "../components/dashboard/AIHealthSummary";
import FamilyHistoryCard from "../components/dashboard/FamilyHistoryCard";

import Loader from "../components/common/Loader";
import EmptyState from "../components/common/EmptyState";
import ErrorState from "../components/common/ErrorState";

const DashboardPage = () => {
  const { userId } = useUser(); // ✅ inside component

  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    if (!userId) return;

    setIsLoading(true);

    getDashboard(userId)
      .then((res) => {
        console.log("API DATA 👉", res);
        setData(res);
      })
      .catch((err) => {
        console.error(err);
        setHasError(true);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [userId]);

  if (isLoading) return <Loader text="Loading dashboard..." />;

  if (hasError) {
    return (
      <ErrorState
        title="Failed to load dashboard"
        message="Dashboard data could not be loaded."
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

    <div className="text-sm text-slate-400">
      Welcome {data.name} 👋
    </div>

    <div className="rounded-card border border-red-500/20 bg-red-500/10 p-4 text-red-300">
      <p className="font-semibold">Emergency Profile Active</p>
    </div>

    <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
      <HealthScoreCard data={data.healthScore} />
      <DailyRoutineCard data={data.dailyRoutine} />
      <RiskAlertsCard alerts={data.riskAlerts} />
    </div>

    <WeeklyTrend data={data.weeklyActivity} />

    <div className="grid grid-cols-1 gap-6 xl:grid-cols-5">
      <div className="xl:col-span-3">
        <RecentActivity activities={data.recentActivity} />
      </div>
      <div className="xl:col-span-2">
        <MedicationSchedule medicines={data.medications} />
      </div>
    </div>

    <div className="grid grid-cols-1 gap-6 xl:grid-cols-5">
      <div className="xl:col-span-3">
        <AIHealthSummary summary={data.aiSummary} />
      </div>
      <div className="xl:col-span-2">
        <FamilyHistoryCard history={data.familyHistory} />
      </div>
    </div>

  </div>
);
};

export default DashboardPage;