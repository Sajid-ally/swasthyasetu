import { useEffect, useMemo, useState } from "react";
import {
  UserRound,
  ShieldCheck,
  Activity,
  ChevronDown,
  HeartPulse,
  MapPin,
  Phone,
  Mail,
  CalendarDays,
  Ruler,
  Weight,
} from "lucide-react";

import PersonalInfoForm from "../components/profile/PersonalInfoForm";
import BMIDisplay from "../components/profile/BMIDisplay";
import HealthConditionsSection from "../components/profile/HealthConditionsSections";
import CurrentMedicationSection from "../components/profile/CurrentMedicationSection";
import PageContainer from "../components/layout/PageContainer";
import InfoBadge from "../components/common/InfoBadge";
import Loader from "../components/common/Loader";
import ErrorState from "../components/common/ErrorState";

import { useUser } from "../context/UserContext";
import {
  getAllUsers,
  getProfile,
  deleteProfileCondition,
  deleteProfileMedication,
} from "../services/dashboardApi";

const normalizeProfile = (data) => {
  if (!data || data.error) return null;

  return {
    ...data,
    fullName: data.name || "Not available",
    phone: data.phone_number || "Not available",
    dob: data.date_of_birth || "Not available",
    bloodGroup: data.blood_group || data.emergency?.blood_group || "Not available",
    height_cm: data.height_cm,
    weight_kg: data.weight_kg,
    bmi: data.bmi,
  };
};

const ProfileStat = ({ icon: Icon, label, value }) => {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-4">
      <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
        <Icon size={19} />
      </div>
      <p className="text-xs text-slate-400">{label}</p>
      <p className="mt-1 truncate text-sm font-semibold text-white">
        {value || "Not available"}
      </p>
    </div>
  );
};

const ProfilePage = () => {
  const { userId, setUserId } = useUser();

  const [users, setUsers] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState(userId || "user_1");

  const [profileData, setProfileData] = useState(null);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [loadingProfile, setLoadingProfile] = useState(false);
  const [hasError, setHasError] = useState(false);

  const [deletingConditionIndex, setDeletingConditionIndex] = useState(null);
  const [deletingMedicationIndex, setDeletingMedicationIndex] = useState(null);

  const selectedUser = useMemo(() => {
    return users.find((user) => user.id === selectedUserId);
  }, [users, selectedUserId]);

  const profileCompletion = useMemo(() => {
    if (!profileData) return 0;

    const fields = [
      profileData.fullName,
      profileData.email,
      profileData.phone,
      profileData.dob,
      profileData.address,
      profileData.height_cm,
      profileData.weight_kg,
      profileData.diseases?.length,
      profileData.medications?.length,
    ];

    const filled = fields.filter(Boolean).length;
    return Math.round((filled / fields.length) * 100);
  }, [profileData]);

  const loadUsers = async () => {
    setLoadingUsers(true);

    try {
      const res = await getAllUsers();
      const backendUsers = res?.users || [];

      setUsers(backendUsers);

      if (!selectedUserId && backendUsers.length > 0) {
        setSelectedUserId(backendUsers[0].id);
        setUserId(backendUsers[0].id);
      }
    } catch (err) {
      console.error("Users fetch error:", err);
      setHasError(true);
    } finally {
      setLoadingUsers(false);
    }
  };

  const loadProfile = async (id) => {
    if (!id) return;

    setLoadingProfile(true);
    setHasError(false);

    try {
      const data = await getProfile(id);
      const normalized = normalizeProfile(data);

      if (normalized) {
        setProfileData(normalized);
      } else {
        setProfileData(null);
        setHasError(true);
      }
    } catch (err) {
      console.error("Profile fetch error:", err);
      setProfileData(null);
      setHasError(true);
    } finally {
      setLoadingProfile(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  useEffect(() => {
    if (!userId) return;

    setSelectedUserId(userId);
    loadProfile(userId);
  }, [userId]);

  const handleUserChange = (e) => {
    const newUserId = e.target.value;

    setSelectedUserId(newUserId);
    setUserId(newUserId);

    window.dispatchEvent(new Event("global-user-changed"));
    window.dispatchEvent(new Event("smart-add-updated"));
    window.dispatchEvent(new Event("assistant-command-updated"));
    window.dispatchEvent(new Event("timeline-updated"));
  };

  const handleDeleteCondition = async (conditionIndex, conditionName) => {
    if (!userId) return;

    const confirmDelete = window.confirm(
      `Remove condition "${conditionName}" from profile?`
    );

    if (!confirmDelete) return;

    try {
      setDeletingConditionIndex(conditionIndex);

      const res = await deleteProfileCondition(userId, conditionIndex);

      if (!res?.success) {
        alert(res?.message || "Could not remove condition.");
        return;
      }

      await loadProfile(userId);

      window.dispatchEvent(new Event("smart-add-updated"));
      window.dispatchEvent(new Event("assistant-command-updated"));
      window.dispatchEvent(new Event("timeline-updated"));
    } catch (err) {
      console.error("Delete condition error:", err);
      alert("Failed to delete condition.");
    } finally {
      setDeletingConditionIndex(null);
    }
  };

  const handleDeleteMedication = async (medicationIndex, medication) => {
    if (!userId) return;

    const confirmDelete = window.confirm(
      `Remove medicine "${medication?.name || "this medicine"}" from profile?`
    );

    if (!confirmDelete) return;

    try {
      setDeletingMedicationIndex(medicationIndex);

      const res = await deleteProfileMedication(userId, medicationIndex);

      if (!res?.success) {
        alert(res?.message || "Could not remove medication.");
        return;
      }

      await loadProfile(userId);

      window.dispatchEvent(new Event("smart-add-updated"));
      window.dispatchEvent(new Event("assistant-command-updated"));
      window.dispatchEvent(new Event("timeline-updated"));
    } catch (err) {
      console.error("Delete medication error:", err);
      alert("Failed to delete medication.");
    } finally {
      setDeletingMedicationIndex(null);
    }
  };

  if (loadingUsers && !profileData) {
    return <Loader text="Loading users..." />;
  }

  if (hasError && !profileData) {
    return (
      <ErrorState
        title="Failed to load profile"
        message="Profile data could not be loaded from backend."
      />
    );
  }

  return (
    <PageContainer>
      <div className="space-y-6">
        <section className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.04] p-5 shadow-2xl shadow-black/20">
          <div className="pointer-events-none absolute right-0 top-0 h-44 w-44 rounded-full bg-primary/20 blur-[100px]" />
          <div className="pointer-events-none absolute bottom-0 left-1/3 h-44 w-44 rounded-full bg-cyan-500/10 blur-[100px]" />

          <div className="relative flex flex-col gap-6 xl:flex-row xl:items-center xl:justify-between">
            <div className="flex items-start gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-3xl border border-primary/20 bg-primary/10 text-primary shadow-lg shadow-primary/10">
                <UserRound size={30} />
              </div>

              <div>
                <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-200">
                  <ShieldCheck size={13} />
                  Secure health identity
                </div>

                <h2 className="text-2xl font-bold text-white">
                  {loadingProfile
                    ? "Loading profile..."
                    : profileData?.fullName || "Profile User"}
                </h2>

                <p className="mt-1 max-w-2xl text-sm leading-6 text-slate-400">
                  View personal information, health conditions, BMI details,
                  medicines, and emergency-linked profile data.
                </p>

                <div className="mt-4 flex flex-wrap gap-2">
                  <InfoBadge
                    label={profileData?.bloodGroup || "Blood Group N/A"}
                    variant="danger"
                  />
                  <InfoBadge
                    label={`${profileCompletion}% Complete`}
                    variant="primary"
                  />
                  <InfoBadge label="Profile Active" variant="success" />
                </div>
              </div>
            </div>

            <div className="relative w-full xl:w-[360px]">
              <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-slate-500">
                Switch active profile
              </label>

              <select
                value={selectedUserId}
                onChange={handleUserChange}
                className="w-full appearance-none rounded-2xl border border-white/10 bg-[#020617] px-4 py-3 pr-11 text-sm font-medium text-white outline-none transition focus:border-primary"
              >
                {users.map((user) => (
                  <option
                    key={user.id}
                    value={user.id}
                    className="bg-slate-900 text-white"
                  >
                    {user.name || "Unknown User"} — {user.id}
                  </option>
                ))}
              </select>

              <ChevronDown
                size={18}
                className="pointer-events-none absolute bottom-3.5 right-4 text-slate-400"
              />
            </div>
          </div>
        </section>

        {selectedUser ? (
          <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <ProfileStat icon={Mail} label="Email" value={profileData?.email} />
            <ProfileStat icon={Phone} label="Phone" value={profileData?.phone} />
            <ProfileStat
              icon={CalendarDays}
              label="Date of Birth"
              value={profileData?.dob}
            />
            <ProfileStat
              icon={MapPin}
              label="Address"
              value={profileData?.address}
            />
          </section>
        ) : null}

        <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <ProfileStat
            icon={HeartPulse}
            label="Blood Group"
            value={profileData?.bloodGroup}
          />
          <ProfileStat
            icon={Ruler}
            label="Height"
            value={profileData?.height_cm ? `${profileData.height_cm} cm` : ""}
          />
          <ProfileStat
            icon={Weight}
            label="Weight"
            value={profileData?.weight_kg ? `${profileData.weight_kg} kg` : ""}
          />
          <ProfileStat
            icon={Activity}
            label="Health Snapshot"
            value="BMI + conditions linked"
          />
        </section>

        {loadingProfile ? (
          <Loader text="Loading profile..." />
        ) : (
          <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
            <div className="space-y-6 xl:col-span-2">
              <PersonalInfoForm profile={profileData || {}} />

              <HealthConditionsSection
                profile={profileData || {}}
                onDeleteCondition={handleDeleteCondition}
                deletingConditionIndex={deletingConditionIndex}
              />
            </div>

            <div className="space-y-6">
              <BMIDisplay profile={profileData || {}} />

              <CurrentMedicationSection
                profile={profileData || {}}
                onDeleteMedication={handleDeleteMedication}
                deletingMedicationIndex={deletingMedicationIndex}
              />
            </div>
          </div>
        )}
      </div>
    </PageContainer>
  );
};

export default ProfilePage;