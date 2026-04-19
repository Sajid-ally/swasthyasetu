import { Lock, Unlock } from "lucide-react";
import SectionCard from "../common/SectionCard";

const PermissionToggleCard = ({ permissions = [], onToggle }) => {
  return (
    <SectionCard
      title="Permissions"
      subtitle="Control who can access your health data"
      icon={Lock}
    >
      <div className="space-y-4">
        {permissions.map((item, index) => (
          <div
            key={item.id || index}
            className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 p-4"
          >
            <div>
              <h4 className="text-sm font-semibold text-white">
                {item.label}
              </h4>
              <p className="text-xs text-slate-400">{item.description}</p>
            </div>

            <button
              onClick={() => onToggle(item.id)}
              className={`flex items-center gap-2 rounded-full px-4 py-2 text-xs font-medium ${
                item.enabled
                  ? "bg-emerald-500/20 text-emerald-300"
                  : "bg-white/10 text-slate-300"
              }`}
            >
              {item.enabled ? <Unlock size={14} /> : <Lock size={14} />}
              {item.enabled ? "Enabled" : "Disabled"}
            </button>
          </div>
        ))}
      </div>
    </SectionCard>
  );
};

export default PermissionToggleCard;