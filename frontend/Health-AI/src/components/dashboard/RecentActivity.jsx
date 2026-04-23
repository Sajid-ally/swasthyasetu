import { Activity, FileText, UserCog } from "lucide-react";
import SectionCard from "../common/SectionCard";

const getActivityIcon = (type) => {
  switch (type) {
    case "activity":
      return {
        Icon: Activity,
        wrapper: "bg-accent/15 text-accent border border-accent/20",
      };
    case "report":
      return {
        Icon: FileText,
        wrapper: "bg-primary/15 text-primaryLight border border-primary/20",
      };
    case "profile":
      return {
        Icon: UserCog,
        wrapper: "bg-surfaceLight text-slate-300 border border-border",
      };
    default:
      return {
        Icon: Activity,
        wrapper: "bg-surfaceLight text-slate-300 border border-border",
      };
  }
};

const RecentActivity = ({ activities }) => {
  return (
    <SectionCard title="Recent Activity Timeline" icon={Activity}>
      <div className="space-y-5">
        {(activities || []).map((item, index) => {
          const { Icon, wrapper } = getActivityIcon(item.type);

          return (
            <div
              key={item.id}
              className={`flex items-start gap-4 ${
                index !== activities.length - 1
                  ? "border-b border-border pb-5"
                  : ""
              }`}
            >
              <div
                className={`mt-1 flex h-11 w-11 items-center justify-center rounded-full ${wrapper}`}
              >
                <Icon size={16} />
              </div>

              <div className="flex-1">
                <div className="mb-1 flex items-start justify-between gap-4">
                  <p className="text-sm font-semibold text-white">
                    {item.title}
                  </p>
                  <span className="text-xs text-muted whitespace-nowrap">
                    {item.time}
                  </span>
                </div>

                <p className="text-sm leading-6 text-muted">
                  {item.subtitle}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </SectionCard>
  );
};

export default RecentActivity;