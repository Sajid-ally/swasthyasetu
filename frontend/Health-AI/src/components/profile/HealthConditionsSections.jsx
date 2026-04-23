import { Activity } from "lucide-react";
import SectionCard from "../common/SectionCard";

const HealthConditionsSection = ({ profile = {} }) => {
  const diseases = profile.diseases || [];

  return (
    <SectionCard
      title="Health Conditions"
      subtitle="Detected or reported conditions"
      icon={Activity}
    >
      {diseases.length === 0 ? (
        <p className="text-slate-400 text-sm">No conditions</p>
      ) : (
        <div className="flex flex-wrap gap-2">
          {diseases.map((d, i) => (
            <span
              key={i}
              className="px-3 py-1 text-xs rounded-full bg-red-500/10 text-red-400 border border-red-500/20"
            >
              {d}
            </span>
          ))}
        </div>
      )}
    </SectionCard>
  );
};

export default HealthConditionsSection;