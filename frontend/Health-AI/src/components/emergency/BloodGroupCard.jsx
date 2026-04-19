import { Droplets } from "lucide-react";
import SectionCard from "../common/SectionCard";
import InfoBadge from "../common/InfoBadge";

const BloodGroupCard = ({ bloodGroup = "N/A", status = "Verified" }) => {
  return (
    <SectionCard
      title="Blood Group"
      subtitle="Critical blood type information"
      icon={Droplets}
    >
      <div className="rounded-3xl border border-red-500/20 bg-red-500/10 p-6">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-sm text-slate-400">Registered blood group</p>
            <h3 className="mt-2 text-4xl font-bold tracking-tight text-white">
              {bloodGroup}
            </h3>
          </div>

          <InfoBadge label={status} variant="danger" />
        </div>

        <p className="mt-4 text-sm leading-6 text-slate-300">
          Keep this information accurate for emergency treatment, transfusion,
          and rapid clinical decision-making.
        </p>
      </div>
    </SectionCard>
  );
};

export default BloodGroupCard;