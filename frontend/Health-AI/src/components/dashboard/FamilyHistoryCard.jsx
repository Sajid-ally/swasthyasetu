import { Users, HeartPulse, ShieldAlert, ActivitySquare } from "lucide-react";
import SectionCard from "../common/SectionCard";
import InfoBadge from "../common/InfoBadge";
import ActionButton from "../common/ActionButton";

const riskConfig = {
  low: {
    label: "Low Risk",
    variant: "success",
    icon: ActivitySquare,
  },
  medium: {
    label: "Moderate Risk",
    variant: "warning",
    icon: HeartPulse,
  },
  high: {
    label: "High Risk",
    variant: "danger",
    icon: ShieldAlert,
  },
};

const FamilyHistoryCard = ({ history = [] }) => {
  return (
    <SectionCard
      title="Family History"
      subtitle="Inherited conditions and family-linked health patterns"
      icon={Users}
      action={
        <ActionButton variant="secondary" size="sm">
          View Family
        </ActionButton>
      }
    >
      <div className="space-y-4">
        {history.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-white/10 bg-white/5 px-4 py-8 text-center text-sm text-slate-400">
            No family history records available.
          </div>
        ) : (
          history.map((item, index) => {
            const currentRisk = riskConfig[item.risk] || riskConfig.medium;
            const RiskIcon = currentRisk.icon;

            return (
              <div
                key={item.id || index}
                className="group flex items-start gap-4 rounded-2xl border border-white/10 bg-white/5 p-4 transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/30 hover:bg-white/10"
              >
                {/* Left icon */}
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-white/10 text-primary shadow-soft">
                  <RiskIcon size={18} />
                </div>

                {/* Main content */}
                <div className="min-w-0 flex-1">
                  <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
                    <div>
                      <h4 className="text-sm font-semibold text-white">
                        {item.condition}
                      </h4>
                      {item.notes && (
                        <p className="mt-1 text-sm text-slate-400">
                          {item.notes}
                        </p>
                      )}
                    </div>

                    <InfoBadge
                      label={currentRisk.label}
                      variant={currentRisk.variant}
                    />
                  </div>

                  <div className="mt-3 flex flex-wrap items-center gap-2">
                    {item.relation && (
                      <span className="rounded-full bg-white/5 px-3 py-1 text-xs text-slate-300">
                        {item.relation}
                      </span>
                    )}

                    {item.ageOfOnset && (
                      <span className="rounded-full bg-white/5 px-3 py-1 text-xs text-slate-400">
                        Onset: {item.ageOfOnset}
                      </span>
                    )}

                    {item.status && (
                      <span className="rounded-full bg-white/5 px-3 py-1 text-xs text-slate-400">
                        {item.status}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </SectionCard>
  );
};

export default FamilyHistoryCard;