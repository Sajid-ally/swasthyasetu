import {
  Activity,
  FileText,
  UserCog,
  Pill,
  HeartPulse,
  CalendarClock,
} from "lucide-react";
import SectionCard from "../common/SectionCard";
import InfoBadge from "../common/InfoBadge";

const getActivityIcon = (type) => {
  switch (type) {
    case "activity":
    case "routine":
      return {
        Icon: Activity,
        wrapper: "bg-cyan-500/15 text-cyan-300 border-cyan-500/20",
      };

    case "report":
    case "medical_report":
      return {
        Icon: FileText,
        wrapper: "bg-primary/15 text-primary border-primary/20",
      };

    case "medicine":
    case "medication":
      return {
        Icon: Pill,
        wrapper: "bg-emerald-500/15 text-emerald-300 border-emerald-500/20",
      };

    case "vital":
    case "vitals":
      return {
        Icon: HeartPulse,
        wrapper: "bg-red-500/15 text-red-300 border-red-500/20",
      };

    case "profile":
      return {
        Icon: UserCog,
        wrapper: "bg-white/10 text-slate-300 border-white/10",
      };

    default:
      return {
        Icon: CalendarClock,
        wrapper: "bg-white/10 text-slate-300 border-white/10",
      };
  }
};

const RecentActivity = ({ activities = [] }) => {
  return (
    <SectionCard
      title="Recent Activity Timeline"
      subtitle="Latest updates from your health records"
      icon={Activity}
      rightContent={
        <InfoBadge variant="primary">
          {activities.length} Updates
        </InfoBadge>
      }
    >
      <div className="max-h-[390px] space-y-4 overflow-y-auto pr-2">
        {activities.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-white/10 bg-white/[0.04] px-4 py-10 text-center">
            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/15 text-primary">
              <Activity size={22} />
            </div>
            <p className="text-sm font-semibold text-white">
              No recent activity
            </p>
            <p className="mt-1 text-xs text-slate-400">
              Your latest medicines, reports and routine updates will appear here.
            </p>
          </div>
        ) : (
          activities.map((item, index) => {
            const { Icon, wrapper } = getActivityIcon(item.type);

            return (
              <div
                key={item.id || index}
                className="group relative rounded-3xl border border-white/10 bg-[#020617]/70 p-4 transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/30 hover:bg-white/[0.06]"
              >
                <div className="flex items-start gap-4">
                  <div
                    className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border ${wrapper}`}
                  >
                    <Icon size={18} />
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="mb-1 flex items-start justify-between gap-4">
                      <p className="text-sm font-semibold text-white">
                        {item.title || "Activity"}
                      </p>

                      {item.time ? (
                        <span className="whitespace-nowrap rounded-full bg-white/5 px-2.5 py-1 text-[11px] text-slate-400">
                          {item.time}
                        </span>
                      ) : null}
                    </div>

                    <p className="text-sm leading-6 text-slate-400">
                      {item.subtitle || item.description || "No details available."}
                    </p>

                    {item.type ? (
                      <div className="mt-3">
                        <span className="rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-1 text-[11px] capitalize text-slate-400">
                          {item.type}
                        </span>
                      </div>
                    ) : null}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </SectionCard>
  );
};

export default RecentActivity;