import { X, CalendarDays, FileText, MapPin } from "lucide-react";

const inputClass =
  "w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none transition-all duration-200 placeholder:text-slate-500 focus:border-primary/40 focus:bg-white/10 focus:ring-2 focus:ring-primary/20";

const AddEventModal = ({
  isOpen = false,
  onClose,
  onSubmit,
  formData = {},
  onChange,
}) => {
  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSubmit) onSubmit(e);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 px-4 backdrop-blur-sm">
      <div className="w-full max-w-2xl rounded-3xl border border-white/10 bg-[#071127] p-6 shadow-2xl">
        <div className="mb-6 flex items-start justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold text-white">Add Timeline Event</h2>
            <p className="mt-1 text-sm text-slate-400">
              Add a health event, report, routine note, or alert.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-2xl border border-white/10 bg-white/5 p-2 text-slate-400 transition hover:bg-white/10 hover:text-white"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-300">
                Title
              </label>
              <input
                type="text"
                name="title"
                value={formData.title || ""}
                onChange={onChange}
                placeholder="Enter event title"
                className={inputClass}
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-300">
                Type
              </label>
              <select
                name="type"
                value={formData.type || ""}
                onChange={onChange}
                className={inputClass}
              >
                <option value="" className="bg-slate-900 text-white">Select type</option>
                <option value="checkup" className="bg-slate-900 text-white">Checkup</option>
                <option value="report" className="bg-slate-900 text-white">Report</option>
                <option value="medication" className="bg-slate-900 text-white">Medication</option>
                <option value="alert" className="bg-slate-900 text-white">Alert</option>
                <option value="routine" className="bg-slate-900 text-white">Routine</option>
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-300">
                Date
              </label>
              <div className="relative">
                <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-500">
                  <CalendarDays size={16} />
                </span>
                <input
                  type="text"
                  name="date"
                  value={formData.date || ""}
                  onChange={onChange}
                  placeholder="e.g. 18 Apr 2026"
                  className={`${inputClass} pl-11`}
                />
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-300">
                Time
              </label>
              <input
                type="text"
                name="time"
                value={formData.time || ""}
                onChange={onChange}
                placeholder="e.g. 10:30 AM"
                className={inputClass}
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-300">
                Doctor / Source
              </label>
              <input
                type="text"
                name="doctor"
                value={formData.doctor || ""}
                onChange={onChange}
                placeholder="Enter doctor or source"
                className={inputClass}
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-300">
                Location
              </label>
              <div className="relative">
                <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-500">
                  <MapPin size={16} />
                </span>
                <input
                  type="text"
                  name="location"
                  value={formData.location || ""}
                  onChange={onChange}
                  placeholder="Enter location"
                  className={`${inputClass} pl-11`}
                />
              </div>
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-300">
              Description
            </label>
            <div className="relative">
              <span className="pointer-events-none absolute left-4 top-4 text-slate-500">
                <FileText size={16} />
              </span>
              <textarea
                name="description"
                value={formData.description || ""}
                onChange={onChange}
                rows={4}
                placeholder="Write event details..."
                className={`${inputClass} min-h-[120px] pl-11 pt-3`}
              />
            </div>
          </div>

          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={onClose}
              className="rounded-2xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-medium text-slate-300 transition hover:bg-white/10 hover:text-white"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="rounded-2xl bg-primary px-5 py-3 text-sm font-semibold text-white transition hover:opacity-90"
            >
              Save Event
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddEventModal;