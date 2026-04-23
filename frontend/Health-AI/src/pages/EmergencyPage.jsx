import { ShieldAlert, HeartPulse, PhoneCall } from "lucide-react";
import PageContainer from "../components/layout/PageContainer";
import EmergencyBanner from "../components/emergency/EmergencyBanner";
import BloodGroupCard from "../components/emergency/BloodGroupCard";
import AllergiesCard from "../components/emergency/AllergiesCard";
import EmergencyContactsCard from "../components/emergency/EmergencyContactsCard";
import PrimaryDoctorCard from "../components/emergency/PrimaryDoctorCard";
import EmergencyActions from "../components/emergency/EmergencyActions";
import InfoBadge from "../components/common/InfoBadge";
import { emergencyData } from "../utils/mockData";

const EmergencyPage = () => {
  return (
    <PageContainer
      title="Emergency"
      subtitle="Access critical health details for urgent situations"
    >
      <div className="space-y-6">
        <div className="rounded-3xl border border-white/10 bg-white/5 p-5 shadow-lg">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-start gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-white/10 bg-rose-500/10 text-rose-300">
                <ShieldAlert size={24} />
              </div>

              <div>
                <h2 className="text-xl font-semibold text-white">
                  Emergency Health Access
                </h2>
                <p className="mt-1 text-sm text-slate-400">
                  Review life-saving details, emergency contacts, allergies, blood group,
                  and physician information.
                </p>

                <div className="mt-3 flex flex-wrap gap-2">
                  <InfoBadge
                    label={emergencyData?.bloodGroup || "Blood Group N/A"}
                    variant="danger"
                  />
                  <InfoBadge label="Emergency Mode Active" variant="success" />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                <div className="mb-1 flex items-center gap-2 text-slate-400">
                  <HeartPulse size={16} />
                  <span className="text-xs">Critical Records</span>
                </div>
                <p className="text-sm font-medium text-white">
                  Always available
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                <div className="mb-1 flex items-center gap-2 text-slate-400">
                  <PhoneCall size={16} />
                  <span className="text-xs">Emergency Contacts</span>
                </div>
                <p className="text-sm font-medium text-white">
                  Ready to access
                </p>
              </div>
            </div>
          </div>
        </div>

        <EmergencyBanner
          title="Emergency Profile Active"
          message="Critical health information is ready to support faster medical response during urgent situations."
        />

        <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
          <div className="space-y-6 xl:col-span-1">
            <BloodGroupCard
              bloodGroup={emergencyData?.bloodGroup || "N/A"}
              status="Verified"
            />
            <PrimaryDoctorCard doctor={emergencyData?.primaryDoctor || {}} />
          </div>

          <div className="space-y-6 xl:col-span-2">
            <AllergiesCard allergies={emergencyData?.allergies || []} />
            <EmergencyContactsCard contacts={emergencyData?.contacts || []} />
          </div>
        </div>

        <EmergencyActions />
      </div>
    </PageContainer>
  );
};

export default EmergencyPage;