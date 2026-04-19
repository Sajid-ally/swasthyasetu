import { History } from "lucide-react";
import SectionCard from "../common/SectionCard";
import TimelineEventCard from "./TimelineEventCard";

const TimelineList = ({ events = [] }) => {
  return (
    <SectionCard
      title="Timeline Events"
      subtitle="Health records and events arranged chronologically"
      icon={History}
    >
      <div className="space-y-4">
        {events.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-white/10 bg-white/5 px-4 py-10 text-center">
            <h4 className="text-sm font-semibold text-white">
              No timeline events found
            </h4>
            <p className="mt-2 text-sm text-slate-400">
              Try changing filters or add a new health event.
            </p>
          </div>
        ) : (
          events.map((event, index) => (
            <TimelineEventCard
              key={event.id || `${event.title || "event"}-${index}`}
              event={event}
            />
          ))
        )}
      </div>
    </SectionCard>
  );
};

export default TimelineList;