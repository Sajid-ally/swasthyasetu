import { ShieldCheck } from "lucide-react";
import SectionCard from "../common/SectionCard";
import InfoBadge from "../common/InfoBadge";

const PrivacyOverviewCard = ({ status = "Protected" }) => {
  return (
    <SectionCard
      title="Privacy Overview"
      subtitle="Your health data security and protection status"
      icon={ShieldCheck}
    >
      <div className="rounded-3xl border border-emerald-500/20 bg-emerald-500/10 p-5">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-white">
              Data Protection Status
            </h3>
            <p className="mt-1 text-sm text-slate-400">
              Your health data is encrypted and securely stored.
            </p>
          </div>

          <InfoBadge label={status} variant="success" />
        </div>
      </div>
    </SectionCard>
  );
};

export default PrivacyOverviewCard;