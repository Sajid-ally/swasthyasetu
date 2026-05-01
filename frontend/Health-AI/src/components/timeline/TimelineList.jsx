import { useState } from "react";
import {
  History,
  FileText,
  Pill,
  Activity,
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  CalendarClock,
  MapPin,
  Stethoscope,
  ShieldAlert,
  Trash2,
  Loader2,
} from "lucide-react";
import SectionCard from "../common/SectionCard";
import InfoBadge from "../common/InfoBadge";

const getEventMeta = (type) => {
  switch (type) {
    case "medical_report":
    case "report":
      return {
        Icon: FileText,
        title: "Medical Report",
        iconBox: "bg-purple-500/15 text-purple-300",
      };

    case "medication":
    case "medicine":
      return {
        Icon: Pill,
        title: "Medication",
        iconBox: "bg-emerald-500/15 text-emerald-300",
      };

    case "routine":
      return {
        Icon: Activity,
        title: "Routine",
        iconBox: "bg-cyan-500/15 text-cyan-300",
      };

    case "alert":
      return {
        Icon: AlertTriangle,
        title: "Alert",
        iconBox: "bg-yellow-500/15 text-yellow-300",
      };

    default:
      return {
        Icon: History,
        title: "Health Event",
        iconBox: "bg-white/10 text-slate-300",
      };
  }
};

const getFindingBadgeVariant = (status = "") => {
  const safe = status.toLowerCase();

  if (safe.includes("high") || safe.includes("low") || safe.includes("attention")) {
    return "danger";
  }

  if (safe.includes("border") || safe.includes("warning")) {
    return "warning";
  }

  if (safe.includes("normal")) {
    return "success";
  }

  return "default";
};

const formatDate = (event) => {
  const value = event.created_at || event.date;

  if (!value) return "Date not available";

  try {
    return new Date(value).toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: event.created_at ? "2-digit" : undefined,
      minute: event.created_at ? "2-digit" : undefined,
    });
  } catch {
    return value;
  }
};

const TimelineCard = ({ event, index, onDelete, deletingEventId }) => {
  const [expanded, setExpanded] = useState(index === 0);

  const meta = getEventMeta(event.type);
  const Icon = meta.Icon;

  const eventId = event.id || `legacy_event_${event._timeline_index}`;
  const isDeleting = deletingEventId === eventId;

  const isReport = event.type === "medical_report" || event.type === "report";
  const findings = event.key_findings || [];
  const attentionPoints = event.possible_attention_points || [];

  const title =
    event.title ||
    event.report_type?.replaceAll("_", " ") ||
    meta.title ||
    "Timeline Event";

  const summary =
    event.summary ||
    event.notes ||
    event.description ||
    "No summary available for this event.";

  return (
    <div className="group relative overflow-hidden rounded-[1.75rem] border border-white/10 bg-[#020617]/70 p-4 transition-all duration-300 hover:border-primary/30 hover:bg-white/[0.05]">
      <div className="pointer-events-none absolute -right-10 -top-10 h-28 w-28 rounded-full bg-primary/10 blur-3xl" />

      <div className="relative flex items-start gap-4">
        <div
          className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-white/10 ${meta.iconBox}`}
        >
          <Icon size={20} />
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <div className="mb-2 flex flex-wrap items-center gap-2">
                <InfoBadge label={meta.title} variant="primary" />

                {event.source ? (
                  <span className="rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-1 text-[11px] font-semibold text-slate-300">
                    {event.source}
                  </span>
                ) : null}
              </div>

              <h3 className="text-base font-bold capitalize text-white">
                {title}
              </h3>

              <p className="mt-1 text-sm leading-6 text-slate-400">
                {summary}
              </p>
            </div>

            <div className="flex shrink-0 flex-col gap-2 text-xs text-slate-400 lg:items-end">
              <span className="flex items-center gap-1.5">
                <CalendarClock size={14} />
                {formatDate(event)}
              </span>

              {event.location ? (
                <span className="flex items-center gap-1.5">
                  <MapPin size={14} />
                  {event.location}
                </span>
              ) : null}

              {event.doctor ? (
                <span className="flex items-center gap-1.5">
                  <Stethoscope size={14} />
                  {event.doctor}
                </span>
              ) : null}

              <button
                type="button"
                onClick={() => onDelete(event)}
                disabled={isDeleting}
                className="mt-1 flex items-center gap-1.5 rounded-xl border border-red-500/20 bg-red-500/10 px-3 py-2 text-xs font-semibold text-red-300 transition hover:bg-red-500/20 disabled:opacity-50"
              >
                {isDeleting ? (
                  <>
                    <Loader2 size={14} className="animate-spin" />
                    Deleting
                  </>
                ) : (
                  <>
                    <Trash2 size={14} />
                    Delete
                  </>
                )}
              </button>
            </div>
          </div>

          {attentionPoints.length > 0 ? (
            <div className="mt-4 rounded-2xl border border-yellow-500/20 bg-yellow-500/10 p-3">
              <div className="mb-2 flex items-center gap-2 text-xs font-bold text-yellow-100">
                <ShieldAlert size={15} />
                Attention Points
              </div>

              <div className="flex flex-wrap gap-2">
                {attentionPoints.map((point, idx) => (
                  <span
                    key={`${point}-${idx}`}
                    className="rounded-full bg-yellow-500/15 px-2.5 py-1 text-[11px] font-semibold text-yellow-100"
                  >
                    {point}
                  </span>
                ))}
              </div>
            </div>
          ) : null}

          {isReport && findings.length > 0 ? (
            <div className="mt-4">
              <button
                type="button"
                onClick={() => setExpanded((prev) => !prev)}
                className="flex items-center gap-2 rounded-2xl border border-white/10 bg-white/[0.04] px-3 py-2 text-xs font-semibold text-slate-300 transition hover:bg-white/10 hover:text-white"
              >
                {expanded ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
                {expanded ? "Hide findings" : "Show findings"}
              </button>

              {expanded ? (
                <div className="mt-3 grid gap-3 md:grid-cols-2">
                  {findings.map((item, idx) => (
                    <div
                      key={`${item.name || "finding"}-${idx}`}
                      className="rounded-2xl border border-white/10 bg-black/20 p-3"
                    >
                      <div className="mb-2 flex items-center justify-between gap-2">
                        <p className="text-sm font-bold text-white">
                          {item.name || "Finding"}
                        </p>

                        <InfoBadge
                          label={item.status || "unknown"}
                          variant={getFindingBadgeVariant(item.status)}
                        />
                      </div>

                      <p className="text-sm font-semibold text-slate-200">
                        {item.value || "--"} {item.unit || ""}
                      </p>

                      {item.note ? (
                        <p className="mt-2 text-xs leading-5 text-slate-400">
                          {item.note}
                        </p>
                      ) : null}
                    </div>
                  ))}
                </div>
              ) : null}
            </div>
          ) : null}

          {event.disclaimer ? (
            <p className="mt-4 rounded-2xl border border-yellow-500/20 bg-yellow-500/10 p-3 text-[11px] leading-5 text-yellow-100">
              {event.disclaimer}
            </p>
          ) : null}
        </div>
      </div>
    </div>
  );
};

const TimelineList = ({ events = [], onDelete, deletingEventId }) => {
  return (
    <SectionCard
      title="Timeline Events"
      subtitle="Health records and events arranged chronologically"
      icon={History}
      rightContent={
        <InfoBadge variant="primary">
          {events.length} Showing
        </InfoBadge>
      }
    >
      <div className="space-y-4">
        {events.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-white/10 bg-white/[0.04] px-4 py-12 text-center">
            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/15 text-primary">
              <History size={22} />
            </div>

            <h4 className="text-sm font-bold text-white">
              No timeline events found
            </h4>
            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-400">
              Try changing filters, upload a report from the AI assistant, or add
              a new health event.
            </p>
          </div>
        ) : (
          events.map((event, index) => (
            <TimelineCard
              key={event.id || `${event.title || event.type || "event"}-${index}`}
              event={event}
              index={index}
              onDelete={onDelete}
              deletingEventId={deletingEventId}
            />
          ))
        )}
      </div>
    </SectionCard>
  );
};

export default TimelineList;