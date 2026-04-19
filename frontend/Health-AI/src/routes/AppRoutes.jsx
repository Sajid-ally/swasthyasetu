import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Layout
import AppLayout from "../components/layout/AppLayout";

// Pages
import DashboardPage from "../pages/DashboardPage";
import ProfilePage from "../pages/ProfilePage";
import FamilyTreePage from "../pages/FamilyTreePage";
import DailyRoutinePage from "../pages/DailyRoutinePage";
import AnalysisPage from "../pages/AnalysisPage";
import HealthTimelinePage from "../pages/HealthTimelinePage";
import EmergencyPage from "../pages/EmergencyPage";
import PrivacyPage from "../pages/PrivacyPage";

const AppRoutes = () => {
  return (
    <Router>
      <Routes>
        {/* Layout Wrapper */}
        <Route path="/" element={<AppLayout />}>
          
          {/* Dashboard */}
          <Route index element={<DashboardPage />} />

          {/* Other Pages */}
          <Route path="profile" element={<ProfilePage />} />
          <Route path="family" element={<FamilyTreePage />} />
          <Route path="routine" element={<DailyRoutinePage />} />
          <Route path="analysis" element={<AnalysisPage />} />
          <Route path="timeline" element={<HealthTimelinePage />} />
          <Route path="emergency" element={<EmergencyPage />} />
          <Route path="privacy" element={<PrivacyPage />} />

        </Route>
      </Routes>
    </Router>
  );
};

export default AppRoutes;