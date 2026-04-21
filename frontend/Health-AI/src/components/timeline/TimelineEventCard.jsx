import {
  CalendarDays,
  FileText,
  Pill,
  TriangleAlert,
  Activity,
} from "lucide-react";
import InfoBadge from "../common/InfoBadge";

const typeConfig = {
  checkup: {
    icon: Activity,
    variant: "success",
    label: "Checkup",
  },
  report: {
    icon: FileText,
    variant: "accent",
    label: "Report",
  },
  medication: {
    icon: Pill,
    variant: "primary",
    label: "Medication",
  },
  alert: {
    icon: TriangleAlert,
    variant: "danger",
    label: "Alert",
  },
  routine: {
    icon: CalendarDays,
    variant: "warning",
    label: "Routine",
  },
};

const TimelineEventCard = ({ event = {} }) => {
  const currentType = typeConfig[event.type] || typeConfig.routine;
  const Icon = currentType.icon;

  return (
    <div className="relative rounded-3xl border border-white/10 bg-white/5 p-5 transition hover:border-primary/30 hover:bg-white/10">
      <div className="absolute left-5 top-14 hidden h-[calc(100%-3rem)] w-px bg-white/10 sm:block" />

      <div className="flex items-start gap-4">
        <div className="relative z-10 flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-white/10 text-primary">
          <Icon size={18} />
        </div>

        <div className="min-w-0 flex-1">
          <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
            <div>
              <h3 className="text-base font-semibold text-white">
                {event.title || "Untitled Event"}
              </h3>
              <p className="mt-1 text-sm text-slate-400">
                {event.date || "Date not available"}
              </p>
            </div>

            <InfoBadge
              label={currentType.label}
              variant={currentType.variant}
            />
          </div>

          {event.description && (
            <p className="text-sm leading-6 text-slate-400">
              {event.description}
            </p>
          )}

          <div className="mt-3 flex flex-wrap items-center gap-2">
            {event.time && (
              <span className="rounded-full bg-white/5 px-3 py-1 text-xs text-slate-300">
                {event.time}
              </span>
            )}

            {event.doctor && (
              <span className="rounded-full bg-white/5 px-3 py-1 text-xs text-slate-300">
                Doctor: {event.doctor}
              </span>
            )}

            {event.location && (
              <span className="rounded-full bg-white/5 px-3 py-1 text-xs text-slate-300">
                {event.location}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TimelineEventCard;