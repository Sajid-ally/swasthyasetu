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
    if (!formData.title || !formData.type) return; // 🔥 basic validation
    if (onSubmit) onSubmit(e);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 px-4 backdrop-blur-sm">
      <div className="w-full max-w-2xl rounded-3xl border border-white/10 bg-[#071127] p-6 shadow-2xl">
        
        {/* HEADER */}
        <div className="mb-6 flex items-start justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold text-white">
              Add Timeline Event
            </h2>
            <p className="mt-1 text-sm text-slate-400">
              Add a health event, report, routine note, or alert.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-2xl border border-white/10 bg-white/5 p-2 text-slate-400 hover:bg-white/10 hover:text-white"
          >
            <X size={18} />
          </button>
        </div>

        {/* FORM */}
        <form onSubmit={handleSubmit} className="space-y-5">
          
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">

            {/* TITLE */}
            <div>
              <label className="mb-2 block text-sm text-slate-300">
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

            {/* TYPE */}
            <div>
              <label className="mb-2 block text-sm text-slate-300">
                Type
              </label>
              <select
                name="type"
                value={formData.type || ""}
                onChange={onChange}
                className={inputClass}
              >
                <option value="" className="bg-slate-900">Select type</option>
                <option value="checkup" className="bg-slate-900">Checkup</option>
                <option value="report" className="bg-slate-900">Report</option>
                <option value="medication" className="bg-slate-900">Medication</option>
                <option value="alert" className="bg-slate-900">Alert</option>
                <option value="routine" className="bg-slate-900">Routine</option>
              </select>
            </div>

            {/* DATE */}
            <div>
              <label className="mb-2 block text-sm text-slate-300">
                Date
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500">
                  <CalendarDays size={16} />
                </span>
                <input
                  type="date"   // 🔥 changed (better for backend)
                  name="date"
                  value={formData.date || ""}
                  onChange={onChange}
                  className={`${inputClass} pl-11`}
                />
              </div>
            </div>

            {/* TIME */}
            <div>
              <label className="mb-2 block text-sm text-slate-300">
                Time
              </label>
              <input
                type="time"   // 🔥 changed
                name="time"
                value={formData.time || ""}
                onChange={onChange}
                className={inputClass}
              />
            </div>

            {/* DOCTOR */}
            <div>
              <label className="mb-2 block text-sm text-slate-300">
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

            {/* LOCATION */}
            <div>
              <label className="mb-2 block text-sm text-slate-300">
                Location
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500">
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

          {/* DESCRIPTION */}
          <div>
            <label className="mb-2 block text-sm text-slate-300">
              Description
            </label>
            <div className="relative">
              <span className="absolute left-4 top-4 text-slate-500">
                <FileText size={16} />
              </span>
              <textarea
                name="description"
                value={formData.description || ""}
                onChange={onChange}
                rows={4}
                placeholder="Write event details..."
                className={`${inputClass} pl-11 pt-3`}
              />
            </div>
          </div>

          {/* BUTTONS */}
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="rounded-2xl border border-white/10 px-5 py-3 text-slate-300 hover:bg-white/10"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="rounded-2xl bg-primary px-5 py-3 text-white"
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