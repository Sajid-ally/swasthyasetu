import { Stethoscope, MapPin, Phone } from "lucide-react";
import SectionCard from "../common/SectionCard";
import ActionButton from "../common/ActionButton";

const PrimaryDoctorCard = ({ doctor = {} }) => {
  return (
    <SectionCard
      title="Primary Doctor"
      subtitle="Primary physician and consultation details"
      icon={Stethoscope}
    >
      <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
        <div className="mb-4 flex items-start gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-primary/10 text-primary">
            <Stethoscope size={20} />
          </div>

          <div>
            <h3 className="text-base font-semibold text-white">
              {doctor.name || "Doctor not assigned"}
            </h3>
            <p className="mt-1 text-sm text-slate-400">
              {doctor.specialization || "Specialization not available"}
            </p>
          </div>
        </div>

        <div className="space-y-3">
          {doctor.phone && (
            <div className="flex items-center gap-2 text-sm text-slate-300">
              <Phone size={15} className="text-slate-400" />
              <span>{doctor.phone}</span>
            </div>
          )}

          {doctor.hospital && (
            <div className="flex items-center gap-2 text-sm text-slate-300">
              <MapPin size={15} className="text-slate-400" />
              <span>{doctor.hospital}</span>
            </div>
          )}
        </div>

        <div className="mt-5">
          <ActionButton variant="secondary">
            <Phone size={16} />
            Contact Doctor
          </ActionButton>
        </div>
      </div>
    </SectionCard>
  );
};

export default PrimaryDoctorCard;