import { Download, Share2, Trash2 } from "lucide-react";
import SectionCard from "../common/SectionCard";
import ActionButton from "../common/ActionButton";

const PrivacyActions = () => {
  return (
    <SectionCard
      title="Privacy Actions"
      subtitle="Manage your data access and export options"
    >
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <ActionButton variant="secondary">
          <Download size={16} />
          Download Data
        </ActionButton>

        <ActionButton variant="secondary">
          <Share2 size={16} />
          Share Data
        </ActionButton>

        <ActionButton variant="danger">
          <Trash2 size={16} />
          Delete Data
        </ActionButton>
      </div>
    </SectionCard>
  );
};

export default PrivacyActions;