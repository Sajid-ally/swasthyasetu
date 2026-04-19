import { TriangleAlert } from "lucide-react";
import SectionCard from "../common/SectionCard";
import InfoBadge from "../common/InfoBadge";

const getAlertStyles = (level) => {
  switch (level?.toLowerCase()) {
    case "high":
      return {
        dot: "bg-red-400 shadow-[0_0_12px_rgba(248,113,113,0.7)]",
        badge: "high",
      };
    case "medium":
      return {
        dot: "bg-yellow-400 shadow-[0_0_12px_rgba(250,204,21,0.7)]",
        badge: "medium",
      };
    case "low":
      return {
        dot: "bg-green-400 shadow-[0_0_12px_rgba(74,222,128,0.7)]",
        badge: "low",
      };
    default:
      return {
        dot: "bg-slate-400",
        badge: "default",
      };
  }
};

const RiskAlertsCard = ({ alerts }) => {
  return (
    <SectionCard title="Risk Alerts" icon={TriangleAlert}>
      <div className="space-y-4">
        {alerts.map((alert) => {
          const styles = getAlertStyles(alert.level);

          return (
            <div
              key={alert.id}
              className="flex items-center justify-between rounded-xl border border-border bg-background px-4 py-4 transition-all duration-200 hover:bg-surfaceLight"
            >
              <div className="flex items-center gap-3">
                <span className={`h-2.5 w-2.5 rounded-full ${styles.dot}`} />
                <span className="text-sm font-semibold text-white">
                  {alert.label}
                </span>
              </div>

              <InfoBadge variant={styles.badge}>
                {alert.level}
              </InfoBadge>
            </div>
          );
        })}
      </div>
    </SectionCard>
  );
};

export default RiskAlertsCard;