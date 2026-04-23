import { ShieldCheck, ShieldAlert, AlertTriangle } from "lucide-react";
import SectionCard from "../common/SectionCard";

const legendItems = [
  {
    label: "Full Access",
    description: "Can view and manage complete health records",
    icon: ShieldCheck,
    color: "text-emerald-400",
  },
  {
    label: "Limited Access",
    description: "Can view selected health information only",
    icon: ShieldAlert,
    color: "text-amber-400",
  },
  {
    label: "Emergency Only",
    description: "Accessible only during emergencies",
    icon: AlertTriangle,
    color: "text-rose-400",
  },
];

const AccessLegend = () => {
  return (
    <SectionCard
      title="Access Levels"
      subtitle="Understanding permission levels for family members"
    >
      <div className="grid gap-4 md:grid-cols-3">
        {legendItems.map((item, index) => {
          const Icon = item.icon;

          return (
            <div
              key={index}
              className="rounded-2xl border border-white/10 bg-white/5 p-4 transition hover:border-primary/30 hover:bg-white/10"
            >
              <div className="mb-3 flex items-center gap-2">
                <Icon size={18} className={item.color} />
                <h4 className="text-sm font-semibold text-white">
                  {item.label}
                </h4>
              </div>

              <p className="text-sm leading-6 text-slate-400">
                {item.description}
              </p>
            </div>
          );
        })}
      </div>
    </SectionCard>
  );
};

export default AccessLegend;