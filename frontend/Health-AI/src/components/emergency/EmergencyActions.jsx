import { Ambulance, Download, Share2, Lock } from "lucide-react";
import SectionCard from "../common/SectionCard";
import ActionButton from "../common/ActionButton";

const EmergencyActions = () => {
  return (
    <SectionCard
      title="Emergency Actions"
      subtitle="Quick actions for urgent situations and rapid sharing"
      icon={Ambulance}
    >
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
          <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/10 text-primary">
            <Share2 size={18} />
          </div>
          <h4 className="text-sm font-semibold text-white">Share Emergency Profile</h4>
          <p className="mt-2 text-sm leading-6 text-slate-400">
            Share critical health information instantly with a trusted person or responder.
          </p>
          <div className="mt-4">
            <ActionButton variant="secondary">
              <Share2 size={16} />
              Share Now
            </ActionButton>
          </div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
          <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/10 text-primary">
            <Download size={18} />
          </div>
          <h4 className="text-sm font-semibold text-white">Download Emergency PDF</h4>
          <p className="mt-2 text-sm leading-6 text-slate-400">
            Save a printable emergency summary for offline use and quick access.
          </p>
          <div className="mt-4">
            <ActionButton variant="secondary">
              <Download size={16} />
              Download
            </ActionButton>
          </div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
          <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/10 text-primary">
            <Ambulance size={18} />
          </div>
          <h4 className="text-sm font-semibold text-white">View Emergency Access Mode</h4>
          <p className="mt-2 text-sm leading-6 text-slate-400">
            Review what information is shown in high-priority or emergency-only mode.
          </p>
          <div className="mt-4">
            <ActionButton variant="secondary">
              <Ambulance size={16} />
              Open View
            </ActionButton>
          </div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
          <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/10 text-primary">
            <Lock size={18} />
          </div>
          <h4 className="text-sm font-semibold text-white">Manage Emergency Permissions</h4>
          <p className="mt-2 text-sm leading-6 text-slate-400">
            Control who can access emergency details and how they are shared.
          </p>
          <div className="mt-4">
            <ActionButton variant="secondary">
              <Lock size={16} />
              Manage
            </ActionButton>
          </div>
        </div>
      </div>
    </SectionCard>
  );
};

export default EmergencyActions;