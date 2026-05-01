import { Pill, Trash2, Loader2 } from "lucide-react";
import SectionCard from "../common/SectionCard";

const CurrentMedicationSection = ({
  profile = {},
  onDeleteMedication,
  deletingMedicationIndex = null,
}) => {
  const meds = profile.medications || [];

  return (
    <SectionCard title="Medications" subtitle="Current medicines" icon={Pill}>
      {meds.length === 0 ? (
        <p className="text-sm text-slate-400">No medications</p>
      ) : (
        <div className="space-y-3">
          {meds.map((med, i) => {
            const isDeleting = deletingMedicationIndex === i;

            return (
              <div
                key={`${med.name || "medicine"}-${i}`}
                className="rounded-xl border border-white/10 bg-white/5 p-3"
              >
                <div className="mb-2 flex items-start justify-between gap-3">
                  <div>
                    <p className="font-medium text-white">
                      {med.name || "Unknown medicine"}
                    </p>
                    <p className="text-xs text-slate-500">
                      {med.source || "manual"}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => onDeleteMedication?.(i, med)}
                    disabled={isDeleting}
                    className="flex items-center gap-1 rounded-xl border border-red-500/20 bg-red-500/10 px-2.5 py-1.5 text-xs font-semibold text-red-300 transition hover:bg-red-500/20 disabled:opacity-50"
                  >
                    {isDeleting ? (
                      <>
                        <Loader2 size={13} className="animate-spin" />
                        Removing
                      </>
                    ) : (
                      <>
                        <Trash2 size={13} />
                        Delete
                      </>
                    )}
                  </button>
                </div>

                <p className="text-sm text-slate-400">
                  Dosage: {med.dosage || "N/A"}
                </p>
                <p className="text-sm text-slate-400">
                  Time: {med.time || "N/A"}
                </p>
                <p className="text-sm text-slate-400">
                  Status: {med.status || "N/A"}
                </p>
              </div>
            );
          })}
        </div>
      )}
    </SectionCard>
  );
};

export default CurrentMedicationSection;