import { useState } from "react";
import PageContainer from "../components/layout/PageContainer";
import PrivacyOverviewCard from "../components/privacy/PrivacyOverviewCard";
import PermissionToggleCard from "../components/privacy/PermissionToggleCard";
import DataAccessLog from "../components/privacy/DataAccessLog";
import PrivacyActions from "../components/privacy/PrivacyActions";
import { privacyData } from "../utils/mockData";

const PrivacyPage = () => {
  const [permissions, setPermissions] = useState(
    privacyData.permissions || []
  );

  const handleToggle = (id) => {
    setPermissions((prev) =>
      prev.map((p) =>
        p.id === id ? { ...p, enabled: !p.enabled } : p
      )
    );
  };

  return (
    <PageContainer
      title="Privacy"
      subtitle="Manage your health data security and permissions"
    >
      <div className="space-y-6">
        <PrivacyOverviewCard />

        <PermissionToggleCard
          permissions={permissions}
          onToggle={handleToggle}
        />

        <DataAccessLog logs={privacyData.logs || []} />

        <PrivacyActions />
      </div>
    </PageContainer>
  );
};

export default PrivacyPage;