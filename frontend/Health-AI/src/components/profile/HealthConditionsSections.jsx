import { Activity, Trash2, Loader2 } from "lucide-react";
import SectionCard from "../common/SectionCard";

const HealthConditionsSection = ({
  profile = {},
  onDeleteCondition,
  deletingConditionIndex = null,
}) => {
  const diseases = profile.diseases || [];

  return (
    <SectionCard
      title="Health Conditions"
      subtitle="Detected or reported conditions"
      icon={Activity}
    >
      {diseases.length === 0 ? (
        <p className="text-sm text-slate-400">No conditions</p>
      ) : (
        <div className="flex flex-wrap gap-2">
          {diseases.map((d, i) => {
            const isDeleting = deletingConditionIndex === i;

            return (
              <span
                key={`${d}-${i}`}
                className="inline-flex items-center gap-2 rounded-full border border-red-500/20 bg-red-500/10 px-3 py-1 text-xs text-red-300"
              >
                {d}

                <button
                  type="button"
                  onClick={() => onDeleteCondition?.(i, d)}
                  disabled={isDeleting}
                  className="rounded-full p-1 transition hover:bg-red-500/20 disabled:opacity-50"
                  title="Remove condition"
                >
                  {isDeleting ? (
                    <Loader2 size={12} className="animate-spin" />
                  ) : (
                    <Trash2 size={12} />
                  )}
                </button>
              </span>
            );
          })}
        </div>
      )}
    </SectionCard>
  );
};

export default HealthConditionsSection;