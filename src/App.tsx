import { Routes, Route, Navigate } from 'react-router-dom';
import { AnimatePresence } from 'motion/react';
import ProtectedRoute from './components/ProtectedRoute';
import LandingPage from './pages/LandingPage';
import AuthPage from './pages/AuthPage';
import PricingPage from './pages/PricingPage';
import DashboardLayout from './pages/dashboard/DashboardLayout';
import OverviewTab from './pages/dashboard/OverviewTab';
import ProspectorTab from './pages/dashboard/ProspectorTab';
import LeadsTab from './pages/dashboard/LeadsTab';
import ProfileTab from './pages/dashboard/ProfileTab';

export default function App() {
  return (
    <AnimatePresence mode="wait">
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<AuthPage mode="login" />} />
        <Route path="/signup" element={<AuthPage mode="signup" />} />

        <Route
          path="/pricing"
          element={
            <ProtectedRoute>
              <PricingPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute requirePaid>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<OverviewTab />} />
          <Route path="leads" element={<LeadsTab />} />
          <Route path="prospector" element={<ProspectorTab />} />
          <Route path="settings" element={<ProfileTab />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AnimatePresence>
  );
}
