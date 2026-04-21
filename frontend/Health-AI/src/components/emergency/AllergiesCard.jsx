import { ShieldAlert } from "lucide-react";
import SectionCard from "../common/SectionCard";
import InfoBadge from "../common/InfoBadge";

const AllergiesCard = ({ allergies = [] }) => {
  return (
    <SectionCard
      title="Allergies"
      subtitle="Known allergic triggers and emergency precautions"
      icon={ShieldAlert}
    >
      <div className="space-y-3">
        {allergies.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-white/10 bg-white/5 px-4 py-8 text-center text-sm text-slate-400">
            No allergies recorded.
          </div>
        ) : (
          allergies.map((item, index) => (
            <div
              key={item.id || index}
              className="rounded-2xl border border-white/10 bg-white/5 p-4 transition hover:border-rose-400/30 hover:bg-white/10"
            >
              <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
                <h4 className="text-sm font-semibold text-white">
                  {item.name || "Unknown Allergy"}
                </h4>
                <InfoBadge
                  label={item.severity || "Recorded"}
                  variant={
                    item.severity?.toLowerCase() === "high"
                      ? "danger"
                      : item.severity?.toLowerCase() === "medium"
                      ? "warning"
                      : "accent"
                  }
                />
              </div>

              {item.note && (
                <p className="text-sm leading-6 text-slate-400">{item.note}</p>
              )}
            </div>
          ))
        )}
      </div>
    </SectionCard>
  );
};

export default AllergiesCard;