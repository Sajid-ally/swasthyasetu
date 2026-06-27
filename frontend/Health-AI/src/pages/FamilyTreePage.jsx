import { useEffect, useMemo, useState } from "react";
import {
  Users,
  ShieldCheck,
  HeartPulse,
  Plus,
  UserRound,
  LockKeyhole,
  Activity,
} from "lucide-react";

import PageContainer from "../components/layout/PageContainer";
import FamilyTreeView from "../components/family/FamilyTreeView";
import AccessLegend from "../components/family/AccessLegend";
import AddFamilyMemberModal from "../components/family/AddFamilyMemberModal";
import InfoBadge from "../components/common/InfoBadge";
import Loader from "../components/common/Loader";
import ErrorState from "../components/common/ErrorState";

import { useUser } from "../context/UserContext";
import {
  getFamilyData,
  addFamilyMember,
  deleteFamilyMember,
} from "../services/dashboardApi";

const emptyForm = {
  name: "",
  relation: "",
  age: "",
  gender: "",
  accessLevel: "",
  conditions: "",
};

const normalizeAccessLevel = (accessLevel) => {
  if (accessLevel === "FULL_ACCESS") return "full";
  if (accessLevel === "LIMITED_ACCESS") return "limited";
  if (accessLevel === "EMERGENCY_ONLY") return "emergency";
  return accessLevel || "limited";
};

const FamilyStat = ({ icon: Icon, label, value, tone = "primary" }) => {
  const toneClass =
    tone === "success"
      ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-300"
      : tone === "warning"
      ? "border-yellow-500/20 bg-yellow-500/10 text-yellow-300"
      : "border-primary/20 bg-primary/10 text-primary";

  return (
    <div className={`rounded-3xl border p-4 ${toneClass}`}>
      <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-2xl bg-white/10">
        <Icon size={20} />
      </div>
      <p className="text-2xl font-bold text-white">{value}</p>
      <p className="mt-1 text-xs font-medium opacity-80">{label}</p>
    </div>
  );
};

const FamilyTreePage = () => {
  const { userId } = useUser();

  const [members, setMembers] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [formData, setFormData] = useState(emptyForm);

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [message, setMessage] = useState("");
  const [deletingMemberId, setDeletingMemberId] = useState("");

  const stats = useMemo(() => {
    return {
      total: members.length,
      fullAccess: members.filter((m) => m.accessLevel === "full").length,
      limited: members.filter((m) => m.accessLevel === "limited").length,
      emergency: members.filter((m) => m.accessLevel === "emergency").length,
    };
  }, [members]);

  const fetchFamilyData = async () => {
    if (!userId) return;

    setIsLoading(true);
    setHasError(false);

    try {
      const res = await getFamilyData(userId);
      const backendMembers = res?.familyTree?.members || [];

      const formattedMembers = backendMembers.map((member) => ({
        id: member.id,
        name: member.name,
        relation: member.relation || "Family",
        age: member.age,
        gender: member.gender || "Unknown",
        accessLevel: normalizeAccessLevel(member.accessLevel),
        conditions: Array.isArray(member.healthConditions)
          ? member.healthConditions
          : [],
      }));

      setMembers(formattedMembers);
    } catch (err) {
      console.error("Family page load error:", err);
      setHasError(true);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchFamilyData();
  }, [userId]);

  const handleOpenModal = () => {
    setMessage("");
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setFormData(emptyForm);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateForm = () => {
    if (!formData.name.trim()) return "Name is required.";
    if (!formData.relation.trim()) return "Relation is required.";
    if (!formData.accessLevel) return "Access level is required.";
    return "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationError = validateForm();

    if (validationError) {
      setMessage(validationError);
      return;
    }

    setIsSaving(true);
    setMessage("");

    try {
      const payload = {
        name: formData.name.trim(),
        relation: formData.relation.trim(),
        age: formData.age ? Number(formData.age) : null,
        gender: formData.gender || "Unknown",
        accessLevel: formData.accessLevel,
        conditions: formData.conditions
          ? formData.conditions
              .split(",")
              .map((item) => item.trim())
              .filter(Boolean)
          : [],
      };

      await addFamilyMember(userId, payload);

      await fetchFamilyData();
      handleCloseModal();
      setMessage("Family member added successfully ✅");

      window.dispatchEvent(new Event("smart-add-updated"));
      window.dispatchEvent(new Event("assistant-command-updated"));
      window.dispatchEvent(new Event("timeline-updated"));
    } catch (err) {
      console.error("Error adding family member:", err);
      setMessage("Failed to add family member. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteMember = async (member) => {
    if (!member?.id || !userId) return;

    if (member.id === userId) {
      setMessage("You cannot delete the currently active user.");
      return;
    }

    const confirmDelete = window.confirm(
      `Are you sure you want to delete ${member.name || "this member"}?`
    );

    if (!confirmDelete) return;

    try {
      setDeletingMemberId(member.id);
      setMessage("");

      const res = await deleteFamilyMember(userId, member.id);

      if (!res?.success) {
        setMessage(res?.message || "Could not delete family member.");
        return;
      }

      await fetchFamilyData();

      setMessage("Family member deleted successfully ✅");

      window.dispatchEvent(new Event("smart-add-updated"));
      window.dispatchEvent(new Event("assistant-command-updated"));
      window.dispatchEvent(new Event("timeline-updated"));
    } catch (err) {
      console.error("Delete family member error:", err);
      setMessage("Failed to delete family member. Please try again.");
    } finally {
      setDeletingMemberId("");
    }
  };

  if (isLoading) return <Loader text="Loading family data..." />;

  if (hasError) {
    return (
      <ErrorState
        title="Failed to load family page"
        message="Family data could not be loaded from backend."
      />
    );
  }

  return (
    <PageContainer>
      <div className="space-y-6">
        <section className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.04] p-5 shadow-2xl shadow-black/20">
          <div className="pointer-events-none absolute right-0 top-0 h-44 w-44 rounded-full bg-primary/20 blur-[100px]" />
          <div className="pointer-events-none absolute bottom-0 left-1/3 h-44 w-44 rounded-full bg-emerald-500/10 blur-[100px]" />

          <div className="relative flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-start gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-3xl border border-primary/20 bg-primary/10 text-primary shadow-lg shadow-primary/10">
                <Users size={30} />
              </div>

              <div>
                <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-200">
                  <ShieldCheck size={13} />
                  Family health access enabled
                </div>

                <h2 className="text-2xl font-bold text-white">
                  Connected Family Network
                </h2>

                <p className="mt-1 max-w-2xl text-sm leading-6 text-slate-400">
                  Manage linked members, shared health history, emergency access,
                  and controlled permission levels.
                </p>

                <div className="mt-4 flex flex-wrap gap-2">
                  <InfoBadge
                    label={`${members.length} Members Linked`}
                    variant="primary"
                  />
                  <InfoBadge label="Health Access Active" variant="success" />
                </div>
              </div>
            </div>

            <button
              onClick={handleOpenModal}
              className="flex items-center justify-center gap-2 rounded-2xl bg-primary px-5 py-3 text-sm font-semibold text-white transition hover:bg-primaryLight"
            >
              <Plus size={16} />
              Add Member
            </button>
          </div>
        </section>

        <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <FamilyStat
            icon={UserRound}
            label="Total Members"
            value={stats.total}
          />
          <FamilyStat
            icon={ShieldCheck}
            label="Full Access"
            value={stats.fullAccess}
            tone="success"
          />
          <FamilyStat
            icon={LockKeyhole}
            label="Limited Access"
            value={stats.limited}
            tone="primary"
          />
          <FamilyStat
            icon={HeartPulse}
            label="Emergency Only"
            value={stats.emergency}
            tone="warning"
          />
        </section>

        <section className="rounded-3xl border border-white/10 bg-white/[0.04] p-4">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <Activity size={20} />
              </div>
              <div>
                <p className="text-sm font-semibold text-white">
                  Family risk tracking
                </p>
                <p className="text-xs text-slate-400">
                  Useful for inherited diseases, emergency readiness, and shared records.
                </p>
              </div>
            </div>

            <InfoBadge label="Controlled Permissions" variant="success" />
          </div>
        </section>

        {message ? (
          <div className="rounded-2xl border border-primary/20 bg-primary/10 p-4 text-sm text-slate-200">
            {message}
          </div>
        ) : null}

        <FamilyTreeView
          members={members}
          onAddMember={handleOpenModal}
          onDeleteMember={handleDeleteMember}
          deletingMemberId={deletingMemberId}
          activeUserId={userId}
        />

        <AccessLegend />

        <AddFamilyMemberModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          onSubmit={handleSubmit}
          formData={formData}
          onChange={handleChange}
          isSaving={isSaving}
        />
      </div>
    </PageContainer>
  );
};

export default FamilyTreePage;