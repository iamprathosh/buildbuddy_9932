import React from "react";
import { BrowserRouter, Routes as RouterRoutes, Route } from "react-router-dom";
import ScrollToTop from "components/ScrollToTop";
import ErrorBoundary from "components/ErrorBoundary";
import NotFound from "pages/NotFound";
import ProjectManagement from './pages/project-management';
import WorkerDashboard from './pages/worker-dashboard';
import InventoryManagement from './pages/inventory-management';
import Login from './pages/login';
import SuperAdminDashboard from './pages/super-admin-dashboard';
import ProjectManagerDashboard from './pages/project-manager-dashboard';

const Routes = () => {
  return (
    <BrowserRouter>
      <ErrorBoundary>
      <ScrollToTop />
      <RouterRoutes>
        {/* Define your route here */}
        <Route path="/" element={<InventoryManagement />} />
        <Route path="/project-management" element={<ProjectManagement />} />
        <Route path="/worker-dashboard" element={<WorkerDashboard />} />
        <Route path="/inventory-management" element={<InventoryManagement />} />
        <Route path="/login" element={<Login />} />
        <Route path="/super-admin-dashboard" element={<SuperAdminDashboard />} />
        <Route path="/project-manager-dashboard" element={<ProjectManagerDashboard />} />
        <Route path="*" element={<NotFound />} />
      </RouterRoutes>
      </ErrorBoundary>
    </BrowserRouter>
  );
};

export default Routes;
