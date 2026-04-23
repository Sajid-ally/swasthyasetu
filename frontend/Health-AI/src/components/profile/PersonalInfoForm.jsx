import {
  User,
  Mail,
  Phone,
  CalendarDays,
  MapPin,
  Droplets,
} from "lucide-react";
import SectionCard from "../common/SectionCard";

const fields = [
  { key: "fullName", label: "Full Name", icon: User },
  { key: "email", label: "Email Address", icon: Mail },
  { key: "phone", label: "Phone Number", icon: Phone },
  { key: "dob", label: "Date of Birth", icon: CalendarDays },
  { key: "bloodGroup", label: "Blood Group", icon: Droplets },
  { key: "address", label: "Address", icon: MapPin, fullWidth: true },
];

const PersonalInfoForm = ({ profile = {} }) => {
  return (
    <SectionCard
      title="Personal Information"
      subtitle="Basic profile details for healthcare records"
      icon={User}
    >
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {fields.map((field) => {
          const Icon = field.icon;
          const value = profile?.[field.key] ?? "Not available";

          return (
            <div
              key={field.key}
              className={field.fullWidth ? "md:col-span-2" : ""}
            >
              <label className="mb-2 block text-sm font-medium text-slate-300">
                {field.label}
              </label>

              <div className="relative">
                <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-500">
                  <Icon size={16} />
                </span>

                <div className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 pl-11 text-sm text-slate-200">
                  {value}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </SectionCard>
  );
};

export default PersonalInfoForm;