import { TriangleAlert, ShieldCheck, Activity, AlertCircle } from "lucide-react";
import SectionCard from "../common/SectionCard";
import InfoBadge from "../common/InfoBadge";

const getAlertStyles = (level) => {
  const safeLevel = level ? level.toLowerCase() : "default";

  switch (safeLevel) {
    case "high":
      return {
        dot: "bg-red-400",
        badge: "danger",
        card: "border-red-500/20 bg-red-500/10",
        iconBox: "bg-red-500/15 text-red-300",
        Icon: AlertCircle,
      };

    case "medium":
      return {
        dot: "bg-yellow-400",
        badge: "warning",
        card: "border-yellow-500/20 bg-yellow-500/10",
        iconBox: "bg-yellow-500/15 text-yellow-300",
        Icon: TriangleAlert,
      };

    case "low":
    case "normal":
      return {
        dot: "bg-emerald-400",
        badge: "success",
        card: "border-emerald-500/20 bg-emerald-500/10",
        iconBox: "bg-emerald-500/15 text-emerald-300",
        Icon: ShieldCheck,
      };

    default:
      return {
        dot: "bg-slate-400",
        badge: "default",
        card: "border-white/10 bg-white/[0.04]",
        iconBox: "bg-white/10 text-slate-300",
        Icon: Activity,
      };
  }
};

const RiskAlertsCard = ({ alerts = [] }) => {
  const highCount = alerts.filter(
    (item) => item?.level?.toLowerCase() === "high"
  ).length;

  return (
    <SectionCard
      title="Risk Alerts"
      subtitle="Important health signals"
      icon={TriangleAlert}
      rightContent={
        <InfoBadge variant={highCount > 0 ? "danger" : "success"}>
          {highCount > 0 ? `${highCount} High` : "Stable"}
        </InfoBadge>
      }
    >
      <div className="max-h-[310px] space-y-3 overflow-y-auto pr-2">
        {alerts.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-emerald-500/20 bg-emerald-500/10 px-4 py-8 text-center">
            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500/15 text-emerald-300">
              <ShieldCheck size={22} />
            </div>
            <p className="text-sm font-semibold text-emerald-100">
              No critical alerts
            </p>
            <p className="mt-1 text-xs text-emerald-200/70">
              Your dashboard has no active risk alert right now.
            </p>
          </div>
        ) : (
          alerts.map((alert, index) => {
            const styles = getAlertStyles(alert.level);
            const Icon = styles.Icon;

            return (
              <div
                key={index}
                className={`group relative overflow-hidden rounded-3xl border p-4 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-black/20 ${styles.card}`}
              >
                <div className="flex items-center justify-between gap-4">
                  <div className="flex min-w-0 items-center gap-3">
                    <div
                      className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-white/10 ${styles.iconBox}`}
                    >
                      <Icon size={18} />
                    </div>

                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-white">
                        {alert.label || "Unknown Alert"}
                      </p>

                      <div className="mt-1 flex items-center gap-2">
                        <span
                          className={`h-2 w-2 rounded-full ${styles.dot}`}
                        />
                        <span className="text-xs capitalize text-slate-400">
                          {alert.level || "normal"} priority
                        </span>
                      </div>
                    </div>
                  </div>

                  <InfoBadge variant={styles.badge}>
                    {alert.level || "normal"}
                  </InfoBadge>
                </div>
              </div>
            );
          })
        )}
      </div>
    </SectionCard>
  );
};

export default RiskAlertsCard;