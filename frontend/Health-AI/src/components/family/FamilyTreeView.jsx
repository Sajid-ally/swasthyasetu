import { Users, GitBranch, Plus, Trash2, Loader2 } from "lucide-react";
import SectionCard from "../common/SectionCard";
import ActionButton from "../common/ActionButton";
import FamilyMemberCard from "./FamilyMemberCard";

const FamilyTreeView = ({
  members = [],
  onAddMember,
  onDeleteMember,
  deletingMemberId = "",
  activeUserId = "",
}) => {
  return (
    <SectionCard
      title="Family Tree"
      subtitle="Manage linked family members and inherited health connections"
      icon={Users}
      rightContent={
        <ActionButton variant="secondary" onClick={onAddMember}>
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
            {members.map((member, index) => {
              const isSelf = member.id === activeUserId;
              const isDeleting = deletingMemberId === member.id;

              return (
                <div
                  key={member.id || `${member.name || "member"}-${index}`}
                  className="rounded-3xl border border-white/10 bg-white/[0.03] p-3"
                >
                  <FamilyMemberCard member={member} />

                  <div className="mt-3 flex justify-end">
                    <button
                      type="button"
                      onClick={() => onDeleteMember?.(member)}
                      disabled={isSelf || isDeleting}
                      className={`flex items-center gap-2 rounded-2xl border px-4 py-2 text-xs font-semibold transition ${
                        isSelf
                          ? "cursor-not-allowed border-white/10 bg-white/5 text-slate-500"
                          : "border-red-500/20 bg-red-500/10 text-red-300 hover:bg-red-500/20"
                      }`}
                    >
                      {isDeleting ? (
                        <>
                          <Loader2 size={14} className="animate-spin" />
                          Deleting
                        </>
                      ) : (
                        <>
                          <Trash2 size={14} />
                          {isSelf ? "Current User" : "Delete Member"}
                        </>
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </SectionCard>
  );
};

export default FamilyTreeView;