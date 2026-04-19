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
import { dashboardData } from "../utils/mockData";

const DashboardPage = () => {
  const isLoading = false;
  const hasError = false;
  const isEmpty = false;

  if (isLoading) {
    return <Loader text="Loading dashboard..." />;
  }

  if (hasError) {
    return (
      <ErrorState
        title="Failed to load dashboard"
        message="Dashboard data could not be loaded."
      />
    );
  }

  if (isEmpty) {
    return (
      <EmptyState
        title="No dashboard data"
        message="There is no dashboard information available yet."
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="rounded-card border border-red-500/20 bg-red-500/10 p-4 text-red-300">
        <p className="font-semibold">Emergency Profile Active</p>
        <p className="mt-1 text-sm text-slate-300">
          First responders can access your blood type and allergy info from your
          lock screen.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <HealthScoreCard data={dashboardData.healthScore} />
        <DailyRoutineCard data={dashboardData.routine} />
        <RiskAlertsCard alerts={dashboardData.alerts} />
      </div>

      <WeeklyTrend data={dashboardData.weeklyTrend} />

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-5">
        <div className="xl:col-span-3">
          <RecentActivity activities={dashboardData.recentActivities} />
        </div>
        <div className="xl:col-span-2">
          <MedicationSchedule medicines={dashboardData.medicationSchedule} />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-5">
        <div className="xl:col-span-3">
         <AIHealthSummary summary={dashboardData.aiHealthSummary} />
        </div>
        <div className="xl:col-span-2">
          <FamilyHistoryCard history={dashboardData.familyHistory} />
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;