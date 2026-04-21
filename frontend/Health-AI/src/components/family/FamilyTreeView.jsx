import { Users, GitBranch, Plus } from "lucide-react";
import SectionCard from "../common/SectionCard";
import ActionButton from "../common/ActionButton";
import FamilyMemberCard from "./FamilyMemberCard";

const FamilyTreeView = ({ members = [], onAddMember }) => {
  return (
    <SectionCard
      title="Family Tree"
      subtitle="Manage linked family members and inherited health connections"
      icon={Users}
      action={
        <ActionButton variant="secondary" size="sm" onClick={onAddMember}>
          <Plus size={16} />
          Add Member
        </ActionButton>
      }
    >
      <div className="space-y-5">
        <div className="rounded-2xl border border-primary/20 bg-primary/10 p-4">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-white/10 text-primary">
              <GitBranch size={18} />
            </div>

            <div>
              <h3 className="text-sm font-semibold text-white">
                Connected Health Network
              </h3>
              <p className="mt-1 text-sm leading-6 text-slate-300">
                View family-linked members, relationship details, access level,
                and recorded conditions in one place.
              </p>
            </div>
          </div>
        </div>

        {members.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-white/10 bg-white/5 px-4 py-10 text-center">
            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-slate-400">
              <Users size={20} />
            </div>
            <h4 className="text-sm font-semibold text-white">
              No family members added
            </h4>
            <p className="mt-2 text-sm text-slate-400">
              Start building the family tree by adding your first member.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
            {members.map((member, index) => (
              <FamilyMemberCard
                key={member.id || `${member.name || "member"}-${index}`}
                member={member}
              />
            ))}
          </div>
        )}
      </div>
    </SectionCard>
  );
};

export default FamilyTreeView;