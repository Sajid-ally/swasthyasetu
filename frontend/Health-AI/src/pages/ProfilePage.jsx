import { useState, useEffect } from "react";
import { UserRound, ShieldCheck, Activity } from "lucide-react";

import PersonalInfoForm from "../components/profile/PersonalInfoForm";
import BMIDisplay from "../components/profile/BMIDisplay";
import PageContainer from "../components/layout/PageContainer";
import InfoBadge from "../components/common/InfoBadge";

import { fetchProfile } from "../services/profileService";
import { useUser } from "../context/UserContext";

const ProfilePage = () => {
  const { userId, setUserId } = useUser(); // ✅ SINGLE SOURCE

  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(false);

  // ✅ AUTO FETCH WHEN USER CHANGES
  useEffect(() => {
    if (!userId) return;

    setLoading(true);

    fetchProfile(userId)
      .then((data) => {
        if (!data.error) {
          setProfileData(data);
        }
      })
      .catch((err) => {
        console.error(err);
      })
      .finally(() => setLoading(false));

  }, [userId]);

  // 🔥 MANUAL FETCH BUTTON
  const handleFetch = () => {
    if (!userId) return;
    // trigger useEffect automatically
  };

  const handleClear = () => {
    setUserId("");
    setProfileData(null);
  };

  return (
    <PageContainer
      title="Profile"
      subtitle="View your personal health information and body metrics"
    >
      <div className="space-y-6">

        {/* INPUT */}
        <div className="flex gap-3">
          <input
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            placeholder="Enter User ID (e.g. user_1)"
            className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white"
          />

          <button onClick={handleFetch} className="btn-primary">
            {loading ? "Loading..." : "Load"}
          </button>

          <button
            onClick={handleClear}
            className="px-4 py-2 rounded-xl bg-red-500/20 border border-red-500 text-red-400"
          >
            Clear
          </button>
        </div>

        {/* TOP CARD */}
        <div className="rounded-3xl border border-white/10 bg-white/5 p-5 shadow-soft">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

            <div className="flex items-start gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-white/10 bg-primary/10 text-primary">
                <UserRound size={24} />
              </div>

              <div>
                <h2 className="text-xl font-semibold text-white">
                  {profileData?.name || "Profile User"} {/* ✅ FIX */}
                </h2>

                <p className="mt-1 text-sm text-slate-400">
                  Personal health profile and identity details
                </p>

                <div className="mt-3 flex flex-wrap gap-2">
                  <InfoBadge
                    label={profileData?.blood_group || "Blood Group N/A"} // ✅ FIX
                    variant="danger"
                  />
                  <InfoBadge label="Profile Active" variant="success" />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                <div className="mb-1 flex items-center gap-2 text-slate-400">
                  <ShieldCheck size={16} />
                  <span className="text-xs">Record Status</span>
                </div>

                <p className="text-sm font-medium text-white">
                  {profileData ? "Verified Profile" : "Not Loaded"}
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                <div className="mb-1 flex items-center gap-2 text-slate-400">
                  <Activity size={16} />
                  <span className="text-xs">Health Snapshot</span>
                </div>

                <p className="text-sm font-medium text-white">
                  BMI + identity linked
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* MAIN */}
        <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
          <div className="xl:col-span-2">
            <PersonalInfoForm profile={profileData || {}} />
          </div>

          <div>
            <BMIDisplay profile={profileData || {}} />
          </div>
        </div>

      </div>
    </PageContainer>
  );
};

export default ProfilePage;