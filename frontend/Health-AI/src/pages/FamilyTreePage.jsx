import { useState } from "react";
import { Users, ShieldCheck, HeartPulse } from "lucide-react";
import PageContainer from "../components/layout/PageContainer";
import FamilyTreeView from "../components/family/FamilyTreeView";
import AccessLegend from "../components/family/AccessLegend";
import AddFamilyMemberModal from "../components/family/AddFamilyMemberModal";
import InfoBadge from "../components/common/InfoBadge";
import { familyData as initialFamilyData } from "../utils/mockData";

const FamilyTreePage = () => {
  const [members, setMembers] = useState(initialFamilyData || []);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    relation: "",
    age: "",
    gender: "",
    accessLevel: "",
    conditions: "",
  });

  const handleOpenModal = () => setIsModalOpen(true);

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setFormData({
      name: "",
      relation: "",
      age: "",
      gender: "",
      accessLevel: "",
      conditions: "",
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const newMember = {
      id: Date.now(),
      name: formData.name.trim(),
      relation: formData.relation.trim(),
      age: formData.age ? Number(formData.age) : "",
      gender: formData.gender,
      accessLevel: formData.accessLevel || "limited",
      conditions: formData.conditions
        ? formData.conditions
            .split(",")
            .map((item) => item.trim())
            .filter(Boolean)
        : [],
    };

    if (!newMember.name || !newMember.relation) {
      return;
    }

    setMembers((prev) => [newMember, ...prev]);
    handleCloseModal();
  };

  return (
    <PageContainer
      title="Family Tree"
      subtitle="Manage linked family members, inherited risks, and access permissions"
    >
      <div className="space-y-6">
        {/* Top summary strip */}
        <div className="rounded-3xl border border-white/10 bg-white/5 p-5 shadow-soft">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-start gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-white/10 bg-primary/10 text-primary">
                <Users size={24} />
              </div>

              <div>
                <h2 className="text-xl font-semibold text-white">
                  Connected Family Network
                </h2>
                <p className="mt-1 text-sm text-slate-400">
                  Track linked members, shared health history, and controlled access.
                </p>

                <div className="mt-3 flex flex-wrap gap-2">
                  <InfoBadge
                    label={`${members.length} Members Linked`}
                    variant="primary"
                  />
                  <InfoBadge label="Health Access Active" variant="success" />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                <div className="mb-1 flex items-center gap-2 text-slate-400">
                  <ShieldCheck size={16} />
                  <span className="text-xs">Access Status</span>
                </div>
                <p className="text-sm font-medium text-white">
                  Controlled permissions
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                <div className="mb-1 flex items-center gap-2 text-slate-400">
                  <HeartPulse size={16} />
                  <span className="text-xs">Family Insights</span>
                </div>
                <p className="text-sm font-medium text-white">
                  Inherited risk tracking
                </p>
              </div>
            </div>
          </div>
        </div>

        <FamilyTreeView members={members} onAddMember={handleOpenModal} />

        <AccessLegend />

        <AddFamilyMemberModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          onSubmit={handleSubmit}
          formData={formData}
          onChange={handleChange}
        />
      </div>
    </PageContainer>
  );
};

export default FamilyTreePage;