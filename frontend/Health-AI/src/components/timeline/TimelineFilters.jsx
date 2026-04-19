import { Search, Filter, Calendar } from "lucide-react";
import SectionCard from "../common/SectionCard";

const inputClass =
  "w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none transition-all duration-200 placeholder:text-slate-500 focus:border-primary/40 focus:bg-white/10 focus:ring-2 focus:ring-primary/20";

const TimelineFilters = ({
  search = "",
  selectedType = "all",
  selectedRange = "all",
  onSearchChange,
  onTypeChange,
  onRangeChange,
}) => {
  return (
    <SectionCard
      title="Timeline Filters"
      subtitle="Search and refine health events across your timeline"
      icon={Filter}
    >
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        
        {/* 🔍 Search */}
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-300">
            Search events
          </label>
          <div className="relative">
            <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-500">
              <Search size={16} />
            </span>
            <input
              type="text"
              value={search}
              onChange={onSearchChange}
              placeholder="Search by title, condition, note..."
              className={`${inputClass} pl-11`}
            />
          </div>
        </div>

        {/* 🧩 Event Type */}
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-300">
            Event type
          </label>
          <div className="relative">
            <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-500">
              <Filter size={16} />
            </span>
            <select
              value={selectedType}
              onChange={onTypeChange}
              className={`${inputClass} pl-11`}
            >
              <option value="all" className="bg-slate-900 text-white">
                All events
              </option>
              <option value="checkup" className="bg-slate-900 text-white">
                Checkups
              </option>
              <option value="report" className="bg-slate-900 text-white">
                Reports
              </option>
              <option value="medication" className="bg-slate-900 text-white">
                Medication
              </option>
              <option value="alert" className="bg-slate-900 text-white">
                Alerts
              </option>
              <option value="routine" className="bg-slate-900 text-white">
                Routine
              </option>
            </select>
          </div>
        </div>

        {/* 📅 Time Range */}
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-300">
            Time range
          </label>
          <div className="relative">
            <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-500">
              <Calendar size={16} />
            </span>
            <select
              value={selectedRange}
              onChange={onRangeChange}
              className={`${inputClass} pl-11`}
            >
              <option value="all" className="bg-slate-900 text-white">
                All time
              </option>
              <option value="7days" className="bg-slate-900 text-white">
                Last 7 days
              </option>
              <option value="30days" className="bg-slate-900 text-white">
                Last 30 days
              </option>
              <option value="6months" className="bg-slate-900 text-white">
                Last 6 months
              </option>
              <option value="1year" className="bg-slate-900 text-white">
                Last 1 year
              </option>
            </select>
          </div>
        </div>

      </div>
    </SectionCard>
  );
};

export default TimelineFilters;