import { User, HeartPulse, ShieldCheck, ShieldAlert } from "lucide-react";
import InfoBadge from "../common/InfoBadge";

const accessConfig = {
  full: {
    label: "Full Access",
    variant: "success",
    icon: ShieldCheck,
  },
  limited: {
    label: "Limited Access",
    variant: "warning",
    icon: ShieldAlert,
  },
  emergency: {
    label: "Emergency Only",
    variant: "danger",
    icon: ShieldAlert,
  },
};

const FamilyMemberCard = ({ member = {} }) => {
  // ✅ SAFE FALLBACK (VERY IMPORTANT)
  const currentAccess =
    accessConfig[member?.accessLevel] || accessConfig["limited"];

  const AccessIcon = currentAccess.icon || ShieldAlert;

  return (
    <div className="group rounded-3xl border border-white/10 bg-white/5 p-5 transition-all duration-300 hover:-translate-y-1 hover:border-primary/30 hover:bg-white/10">
      <div className="mb-4 flex items-start justify-between gap-3">
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-primary/10 text-primary">
            <User size={20} />
          </div>

          <div>
            <h3 className="text-base font-semibold text-white">
              {member.name || "Unknown Member"}
            </h3>
            <p className="mt-1 text-sm text-slate-400">
              {member.relation || "Relation not available"}
            </p>
          </div>
        </div>

        <InfoBadge
          label={currentAccess.label}
          variant={currentAccess.variant}
        />
      </div>

      <div className="space-y-3">
        <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
          <div className="mb-1 flex items-center gap-2 text-slate-400">
            <HeartPulse size={16} />
            <span className="text-xs">Health Conditions</span>
          </div>

          <p className="text-sm leading-6 text-slate-200">
            {Array.isArray(member.conditions) && member.conditions.length
              ? member.conditions.join(", ")
              : "No known conditions recorded"}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {member.age && (
            <span className="rounded-full bg-white/5 px-3 py-1 text-xs text-slate-300">
              Age: {member.age}
            </span>
          )}

          {member.gender && (
            <span className="rounded-full bg-white/5 px-3 py-1 text-xs text-slate-300">
              {member.gender}
            </span>
          )}

          <span className="inline-flex items-center gap-1 rounded-full bg-white/5 px-3 py-1 text-xs text-slate-300">
            <AccessIcon size={13} />
            {currentAccess.label}
          </span>
        </div>
      </div>
    </div>
  );
};

export default FamilyMemberCard;