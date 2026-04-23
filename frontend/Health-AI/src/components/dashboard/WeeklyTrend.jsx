import { BarChart3 } from "lucide-react";
import SectionCard from "../common/SectionCard";

const WeeklyTrend = ({ data }) => {
  return (
    <SectionCard
      title="Weekly Activity Trend"
      icon={BarChart3}
      rightContent={
        <div className="flex items-center gap-4 text-xs text-muted">
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-primary" />
            <span>Activity</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-accent" />
            <span>Recovery</span>
          </div>
        </div>
      }
    >
      <div className="flex h-64 items-end justify-between gap-3 px-2">
        {data.map((item) => (
          <div key={item.day} className="flex flex-1 flex-col items-center">
            <div className="flex h-48 items-end">
              <div
                className="w-10 rounded-t-xl bg-primary transition-all duration-200 hover:scale-105 hover:bg-primaryLight"
                style={{ height: `${item.value}%` }}
              />
            </div>
            <span className="mt-3 text-xs font-medium text-muted">
              {item.day}
            </span>
          </div>
        ))}
      </div>
    </SectionCard>
  );
};

export default WeeklyTrend;