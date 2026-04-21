import { CalendarCheck, Droplets, Moon, Activity } from "lucide-react";
import PageContainer from "../components/layout/PageContainer";
import RoutineStats from "../components/routine/RoutineStats";
import TodayRoutineForm from "../components/routine/TodayRoutineForm";
import WeeklyOverview from "../components/routine/WeeklyOverview";
import InfoBadge from "../components/common/InfoBadge";
import { routineData } from "../utils/mockData";

const DailyRoutinePage = () => {
  return (
    <PageContainer
      title="Daily Routine"
      subtitle="Track your daily health habits, consistency, and wellness goals"
    >
      <div className="space-y-6">
        {/* Top summary strip */}
        <div className="rounded-3xl border border-white/10 bg-white/5 p-5 shadow-soft">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-start gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-white/10 bg-primary/10 text-primary">
                <CalendarCheck size={24} />
              </div>

              <div>
                <h2 className="text-xl font-semibold text-white">
                  Today’s Wellness Routine
                </h2>
                <p className="mt-1 text-sm text-slate-400">
                  Monitor daily habits, task completion, and consistency trends.
                </p>

                <div className="mt-3 flex flex-wrap gap-2">
                  <InfoBadge
                    label={`${routineData?.completed ?? "--"}% Completed`}
                    variant="primary"
                  />
                  <InfoBadge label="Routine Tracking Active" variant="success" />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                <div className="mb-1 flex items-center gap-2 text-slate-400">
                  <Moon size={16} />
                  <span className="text-xs">Sleep</span>
                </div>
                <p className="text-sm font-medium text-white">
                  {routineData?.sleepHours ?? "--"} hrs
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                <div className="mb-1 flex items-center gap-2 text-slate-400">
                  <Droplets size={16} />
                  <span className="text-xs">Water Intake</span>
                </div>
                <p className="text-sm font-medium text-white">
                  {routineData?.waterIntake ?? "--"} L
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                <div className="mb-1 flex items-center gap-2 text-slate-400">
                  <Activity size={16} />
                  <span className="text-xs">Steps</span>
                </div>
                <p className="text-sm font-medium text-white">
                  {routineData?.steps ?? "--"}
                </p>
              </div>
            </div>
          </div>
        </div>

        <RoutineStats data={routineData || {}} />

        <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
          <TodayRoutineForm tasks={routineData?.todayRoutine || []} />
          <WeeklyOverview weeklyData={routineData?.weeklyOverview || []} />
        </div>
      </div>
    </PageContainer>
  );
};

export default DailyRoutinePage;