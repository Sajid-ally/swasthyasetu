import { X, User, Users, ShieldCheck, HeartPulse } from "lucide-react";

const inputClass =
  "w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none transition-all duration-200 placeholder:text-slate-500 focus:border-primary/40 focus:bg-white/10 focus:ring-2 focus:ring-primary/20";

const labelClass = "mb-2 block text-sm font-medium text-slate-300";

const AddFamilyMemberModal = ({
  isOpen = false,
  onClose,
  onSubmit,
  formData = {},
  onChange,
}) => {
  if (!isOpen) return null;

  const handleChange = (e) => {
    if (!onChange) return;
    onChange(e);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSubmit) onSubmit(e);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 px-4 backdrop-blur-sm">
      <div className="w-full max-w-2xl rounded-3xl border border-white/10 bg-[#071127] p-6 shadow-2xl">
        <div className="mb-6 flex items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-primary/10 text-primary">
              <Users size={20} />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-white">
                Add Family Member
              </h2>
              <p className="mt-1 text-sm text-slate-400">
                Add a connected member and define health access details.
              </p>
            </div>
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
              <label className={labelClass}>Full Name</label>
              <div className="relative">
                <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-500">
                  <User size={16} />
                </span>
                <input
                  type="text"
                  name="name"
                  value={formData.name || ""}
                  onChange={handleChange}
                  placeholder="Enter member name"
                  className={`${inputClass} pl-11`}
                />
              </div>
            </div>

            <div>
              <label className={labelClass}>Relation</label>
              <div className="relative">
                <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-500">
                  <Users size={16} />
                </span>
                <input
                  type="text"
                  name="relation"
                  value={formData.relation || ""}
                  onChange={handleChange}
                  placeholder="e.g. Mother, Father, Sister"
                  className={`${inputClass} pl-11`}
                />
              </div>
            </div>

            <div>
              <label className={labelClass}>Age</label>
              <input
                type="number"
                name="age"
                value={formData.age || ""}
                onChange={handleChange}
                placeholder="Enter age"
                className={inputClass}
              />
            </div>

            <div>
              <label className={labelClass}>Gender</label>
              <select
                name="gender"
                value={formData.gender || ""}
                onChange={handleChange}
                className={inputClass}
              >
                <option value="" className="bg-slate-900 text-white">
                  Select gender
                </option>
                <option value="Female" className="bg-slate-900 text-white">
                  Female
                </option>
                <option value="Male" className="bg-slate-900 text-white">
                  Male
                </option>
                <option value="Other" className="bg-slate-900 text-white">
                  Other
                </option>
              </select>
            </div>

            <div>
              <label className={labelClass}>Access Level</label>
              <div className="relative">
                <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-500">
                  <ShieldCheck size={16} />
                </span>
                <select
                  name="accessLevel"
                  value={formData.accessLevel || ""}
                  onChange={handleChange}
                  className={`${inputClass} pl-11`}
                >
                  <option value="" className="bg-slate-900 text-white">
                    Select access level
                  </option>
                  <option value="full" className="bg-slate-900 text-white">
                    Full Access
                  </option>
                  <option value="limited" className="bg-slate-900 text-white">
                    Limited Access
                  </option>
                  <option value="emergency" className="bg-slate-900 text-white">
                    Emergency Only
                  </option>
                </select>
              </div>
            </div>

            <div>
              <label className={labelClass}>Health Conditions</label>
              <div className="relative">
                <span className="pointer-events-none absolute left-4 top-4 text-slate-500">
                  <HeartPulse size={16} />
                </span>
                <textarea
                  name="conditions"
                  value={formData.conditions || ""}
                  onChange={handleChange}
                  placeholder="Enter conditions separated by commas"
                  rows={1}
                  className={`${inputClass} min-h-[48px] pl-11 pt-3`}
                />
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-primary/20 bg-primary/10 p-4">
            <p className="text-sm leading-6 text-slate-300">
              Tip: Use comma-separated values for conditions, like
              <span className="ml-1 font-medium text-white">
                Diabetes, Hypertension
              </span>
              .
            </p>
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
              Save Member
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddFamilyMemberModal;