import { Pill } from "lucide-react";
import SectionCard from "../common/SectionCard";

const CurrentMedicationSection = ({ profile = {} }) => {
  const meds = profile.medications || [];

  return (
    <SectionCard title="Medications" subtitle="Current medicines" icon={Pill}>
      {meds.length === 0 ? (
        <p className="text-slate-400 text-sm">No medications</p>
      ) : (
        <div className="space-y-2">
          {meds.map((m, i) => (
            <div key={i} className="p-3 bg-white/5 rounded-xl border border-white/10">
              {m}
            </div>
          ))}
        </div>
      )}
    </SectionCard>
  );
};

export default CurrentMedicationSection;