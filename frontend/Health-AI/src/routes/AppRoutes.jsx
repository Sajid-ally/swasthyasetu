import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import AppLayout from "../components/layout/AppLayout";

import LoginPage from "../pages/LoginPage";
import DashboardPage from "../pages/DashboardPage";
import ProfilePage from "../pages/ProfilePage";
import FamilyTreePage from "../pages/FamilyTreePage";
import DailyRoutinePage from "../pages/DailyRoutinePage";
import AnalysisPage from "../pages/AnalysisPage";
import HealthTimelinePage from "../pages/HealthTimelinePage";
import EmergencyPage from "../pages/EmergencyPage";
import PrivacyPage from "../pages/PrivacyPage";

import { useUser } from "../context/UserContext";

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useUser();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

const PublicRoute = ({ children }) => {
  const { isAuthenticated } = useUser();

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return children;
};

const AppRoutes = () => {
  return (
    <Router>
      <Routes>
        <Route
          path="/login"
          element={
            <PublicRoute>
              <LoginPage />
            </PublicRoute>
          }
        />

        <Route
          path="/"
          element={
            <ProtectedRoute>
              <AppLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<DashboardPage />} />
          <Route path="profile" element={<ProfilePage />} />
          <Route path="family" element={<FamilyTreePage />} />
          <Route path="routine" element={<DailyRoutinePage />} />
          <Route path="analysis" element={<AnalysisPage />} />
          <Route path="timeline" element={<HealthTimelinePage />} />
          <Route path="emergency" element={<EmergencyPage />} />
          <Route path="privacy" element={<PrivacyPage />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
};

export default AppRoutes;