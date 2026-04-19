import { Pill, Clock3, CheckCircle2, AlertCircle } from "lucide-react";
import SectionCard from "../common/SectionCard";
import InfoBadge from "../common/InfoBadge";
import ActionButton from "../common/ActionButton";

const statusConfig = {
  taken: {
    label: "Taken",
    variant: "success",
    icon: CheckCircle2,
  },
  pending: {
    label: "Pending",
    variant: "warning",
    icon: Clock3,
  },
  missed: {
    label: "Missed",
    variant: "danger",
    icon: AlertCircle,
  },
};

const MedicationSchedule = ({ medicines = [] }) => {
  return (
    <SectionCard
      title="Medication Schedule"
      subtitle="Track today’s medicines and doses"
      icon={Pill}
      action={
        <ActionButton variant="secondary" size="sm">
          View All
        </ActionButton>
      }
    >
      <div className="space-y-4">
        {medicines.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-white/10 bg-white/5 px-4 py-8 text-center text-sm text-slate-400">
            No medications scheduled for today.
          </div>
        ) : (
          medicines.map((medicine, index) => {
            const currentStatus =
              statusConfig[medicine.status] || statusConfig.pending;
            const StatusIcon = currentStatus.icon;

            return (
              <div
                key={medicine.id || index}
                className="group flex items-start gap-4 rounded-2xl border border-white/10 bg-white/5 p-4 transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/30 hover:bg-white/10"
              >
                {/* Left icon */}
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-white/10 text-primary shadow-soft">
                  <Pill size={18} />
                </div>

                {/* Main content */}
                <div className="min-w-0 flex-1">
                  <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
                    <div>
                      <h4 className="text-sm font-semibold text-white">
                        {medicine.name}
                      </h4>
                      {medicine.type && (
                        <p className="mt-1 text-xs text-slate-500">
                          {medicine.type}
                        </p>
                      )}
                    </div>

                    <InfoBadge
                      label={currentStatus.label}
                      variant={currentStatus.variant}
                    />
                  </div>

                  <div className="grid gap-2 text-sm text-slate-400 sm:grid-cols-2">
                    <div className="rounded-xl bg-white/5 px-3 py-2">
                      <span className="text-xs text-slate-500">Dosage</span>
                      <p className="mt-1 font-medium text-slate-200">
                        {medicine.dosage || "Not specified"}
                      </p>
                    </div>

                    <div className="rounded-xl bg-white/5 px-3 py-2">
                      <span className="text-xs text-slate-500">Timing</span>
                      <p className="mt-1 font-medium text-slate-200">
                        {medicine.time || "Not scheduled"}
                      </p>
                    </div>
                  </div>

                  <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-slate-500">
                    <div className="inline-flex items-center gap-1 rounded-full bg-white/5 px-2.5 py-1">
                      <StatusIcon size={14} />
                      <span>{currentStatus.label}</span>
                    </div>

                    {medicine.note && (
                      <div className="rounded-full bg-white/5 px-2.5 py-1">
                        {medicine.note}
                      </div>
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

export default MedicationSchedule;