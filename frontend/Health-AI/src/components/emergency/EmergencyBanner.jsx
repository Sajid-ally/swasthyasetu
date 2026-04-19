import { Siren, ShieldAlert, PhoneCall } from "lucide-react";
import ActionButton from "../common/ActionButton";

const EmergencyBanner = ({
  title = "Emergency Profile Active",
  message = "Critical health information is available for faster emergency response.",
  onCallEmergency,
}) => {
  return (
    <div className="relative overflow-hidden rounded-3xl border border-rose-500/20 bg-gradient-to-r from-rose-500/15 via-rose-500/10 to-orange-500/10 p-6 shadow-lg">
      <div className="absolute right-0 top-0 h-32 w-32 rounded-full bg-rose-400/10 blur-3xl" />
      <div className="absolute bottom-0 left-0 h-24 w-24 rounded-full bg-orange-400/10 blur-2xl" />

      <div className="relative flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-start gap-4">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-white/10 text-rose-300">
            <Siren size={24} />
          </div>

          <div>
            <div className="mb-2 flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-2 rounded-full bg-rose-500/15 px-3 py-1 text-xs font-medium text-rose-200">
                <ShieldAlert size={14} />
                High Priority Access
              </span>
            </div>

            <h2 className="text-2xl font-bold text-white">{title}</h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-300">
              {message}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-3">
          <ActionButton variant="danger" onClick={onCallEmergency}>
            <PhoneCall size={16} />
            Call Emergency
          </ActionButton>
        </div>
      </div>
    </div>
  );
};

export default EmergencyBanner;