import PermissionRow from "./PermissionRow";

const FamilyAccessCard = ({ members }) => {
  return (
    <div className="rounded-card border border-border bg-surface p-6">
      <h3 className="mb-4 text-lg font-semibold text-white">Family Access</h3>

      <div className="space-y-4">
        {members.map((member, index) => (
          <PermissionRow key={index} person={member} />
        ))}
      </div>
    </div>
  );
};

export default FamilyAccessCard;