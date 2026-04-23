import {
  CalendarCheck,
  MoonStar,
  Droplets,
  Footprints,
  Dumbbell,
} from "lucide-react";
import SectionCard from "../common/SectionCard";
import InfoBadge from "../common/InfoBadge";

const MetricBox = ({ icon: Icon, label, value, progress, colorClasses }) => {
  return (
    <div className="rounded-xl border border-border bg-background p-4 transition-all duration-200 hover:bg-surfaceLight">
      <div className="mb-3 flex items-center justify-between">
        <div className={`rounded-lg p-2 ${colorClasses.iconBg}`}>
          <Icon size={16} className={colorClasses.iconText} />
        </div>
        <span className="text-sm font-semibold text-white">{value}</span>
      </div>

      <p className="mb-2 text-xs font-medium uppercase tracking-wide text-muted">
        {label}
      </p>

      <div className="h-2 w-full rounded-full bg-border">
        <div
          className={`h-2 rounded-full ${colorClasses.bar}`}
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
};

const DailyRoutineCard = ({ data }) => {
  const completion = data?.completion ?? 0;

  return (
    <SectionCard
      title="Daily Routine"
      icon={CalendarCheck}
      rightContent={<InfoBadge variant="primary">{completion}% Complete</InfoBadge>}
    >
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <MetricBox
          icon={MoonStar}
          label="Sleep"
          value={data?.sleep?.value ?? "--"}
          progress={data?.sleep?.progress ?? 0}
          colorClasses={{
            iconBg: "bg-primary/15",
            iconText: "text-primaryLight",
            bar: "bg-primary",
          }}
        />

        <MetricBox
          icon={Droplets}
          label="Water"
          value={data?.water?.value ?? "--"}
          progress={data?.water?.progress ?? 0}
          colorClasses={{
            iconBg: "bg-accent/15",
            iconText: "text-accent",
            bar: "bg-accent",
          }}
        />

        <MetricBox
          icon={Footprints}
          label="Steps"
          value={data?.steps?.value ?? "--"}
          progress={data?.steps?.progress ?? 0}
          colorClasses={{
            iconBg: "bg-green-500/15",
            iconText: "text-green-400",
            bar: "bg-green-400",
          }}
        />

        <MetricBox
          icon={Dumbbell}
          label="Workout"
          value={data?.workout?.value ?? "45m"}
          progress={data?.workout?.progress ?? 100}
          colorClasses={{
            iconBg: "bg-orange-500/15",
            iconText: "text-orange-400",
            bar: "bg-orange-400",
          }}
        />
      </div>
    </SectionCard>
  );
};

export default DailyRoutineCard;