import {
  Pill,
  Clock3,
  CheckCircle2,
  AlertCircle,
  CalendarClock,
} from "lucide-react";
import SectionCard from "../common/SectionCard";
import InfoBadge from "../common/InfoBadge";

const statusConfig = {
  taken: {
    label: "Taken",
    variant: "success",
    icon: CheckCircle2,
    card: "border-emerald-500/20 bg-emerald-500/10",
    iconBox: "bg-emerald-500/15 text-emerald-300",
  },
  pending: {
    label: "Pending",
    variant: "warning",
    icon: Clock3,
    card: "border-yellow-500/20 bg-yellow-500/10",
    iconBox: "bg-yellow-500/15 text-yellow-300",
  },
  missed: {
    label: "Missed",
    variant: "danger",
    icon: AlertCircle,
    card: "border-red-500/20 bg-red-500/10",
    iconBox: "bg-red-500/15 text-red-300",
  },
};

const MedicationSchedule = ({ medicines = [] }) => {
  const pendingCount = medicines.filter(
    (item) => (item.status || "pending").toLowerCase() === "pending"
  ).length;

  return (
    <SectionCard
      title="Medication Schedule"
      subtitle="Track today’s medicines and doses"
      icon={Pill}
      rightContent={
        <InfoBadge variant={pendingCount > 0 ? "warning" : "success"}>
          {pendingCount > 0 ? `${pendingCount} Pending` : "Done"}
        </InfoBadge>
      }
    >
      <div className="max-h-[390px] space-y-4 overflow-y-auto pr-2">
        {medicines.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-white/10 bg-white/[0.04] px-4 py-10 text-center">
            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500/15 text-emerald-300">
              <Pill size={22} />
            </div>
            <p className="text-sm font-semibold text-white">
              No medicines scheduled
            </p>
            <p className="mt-1 text-xs text-slate-400">
              Medicines added by text or image OCR will appear here.
            </p>
          </div>
        ) : (
          medicines.map((medicine, index) => {
            const statusKey = (medicine.status || "pending").toLowerCase();
            const currentStatus = statusConfig[statusKey] || statusConfig.pending;
            const StatusIcon = currentStatus.icon;

            return (
              <div
                key={medicine.id || index}
                className={`group rounded-3xl border p-4 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-black/20 ${currentStatus.card}`}
              >
                <div className="flex items-start gap-4">
                  <div
                    className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-white/10 ${currentStatus.iconBox}`}
                  >
                    <Pill size={19} />
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="mb-3 flex items-start justify-between gap-3">
                      <div>
                        <h4 className="text-sm font-bold capitalize text-white">
                          {medicine.name || "Unknown medicine"}
                        </h4>
                        <p className="mt-1 text-xs text-slate-400">
                          Medicine reminder
                        </p>
                      </div>

                      <InfoBadge variant={currentStatus.variant}>
                        {currentStatus.label}
                      </InfoBadge>
                    </div>

                    <div className="grid gap-2 text-sm text-slate-400 sm:grid-cols-2">
                      <div className="rounded-2xl border border-white/10 bg-black/20 px-3 py-2">
                        <span className="text-[11px] uppercase tracking-wide text-slate-500">
                          Dosage
                        </span>
                        <p className="mt-1 font-semibold text-slate-100">
                          {medicine.dosage || "Not specified"}
                        </p>
                      </div>

                      <div className="rounded-2xl border border-white/10 bg-black/20 px-3 py-2">
                        <span className="flex items-center gap-1 text-[11px] uppercase tracking-wide text-slate-500">
                          <CalendarClock size={12} />
                          Timing
                        </span>
                        <p className="mt-1 font-semibold text-slate-100">
                          {medicine.time || medicine.timing || "Not scheduled"}
                        </p>
                      </div>
                    </div>

                    <div className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-black/20 px-2.5 py-1 text-xs text-slate-300">
                      <StatusIcon size={14} />
                      <span>{currentStatus.label}</span>
                    </div>
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