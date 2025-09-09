import React, { useState, useEffect } from 'react';
import Header from '../../components/ui/Header';
import Sidebar from '../../components/ui/Sidebar';
import KPICard from './components/KPICard';
import InventoryTrendsChart from './components/InventoryTrendsChart';
import InventoryDistributionChart from './components/InventoryDistributionChart';
import ProjectsOverview from './components/ProjectsOverview';
import QuickActions from './components/QuickActions';

const ProjectManagerDashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000); // Update every minute

    return () => clearInterval(timer);
  }, []);

  const handleSidebarToggle = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleSidebarClose = () => {
    setSidebarOpen(false);
  };

  // Mock KPI data that would typically come from API
  const kpiData = {
    totalInventoryValue: {
      value: '$298,000',
      subtitle: '1,490 items in stock',
      trend: 'down',
      trendValue: '4.2%'
    },
    lowStockItems: {
      value: '23',
      subtitle: 'Items below minimum',
      trend: 'up',
      trendValue: '12%'
    },
    activeProjects: {
      value: '8',
      subtitle: '3 in progress, 2 planning',
      trend: 'up',
      trendValue: '25%'
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <Header 
        onToggleSidebar={handleSidebarToggle}
      />
      {/* Sidebar */}
      <Sidebar 
        isOpen={sidebarOpen}
        onClose={handleSidebarClose}
        userRole="project-manager"
      />
      {/* Main Content */}
      <main className="lg:ml-60 pt-16">
        <div className="p-6 max-w-7xl mx-auto">
          {/* Page Header */}
          <div className="mb-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h1 className="text-2xl font-bold text-foreground mb-2">Project Manager Dashboard</h1>
                <p className="text-muted-foreground">
                  Welcome back, John Smith • {currentTime?.toLocaleDateString('en-US', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </p>
              </div>
              <div className="mt-4 sm:mt-0 text-sm text-muted-foreground">
                Last updated: {currentTime?.toLocaleTimeString('en-US', { 
                  hour: '2-digit', 
                  minute: '2-digit' 
                })}
              </div>
            </div>
          </div>

          {/* KPI Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            <KPICard
              title="Total Inventory Value"
              value={kpiData?.totalInventoryValue?.value}
              subtitle={kpiData?.totalInventoryValue?.subtitle}
              icon="DollarSign"
              trend={kpiData?.totalInventoryValue?.trend}
              trendValue={kpiData?.totalInventoryValue?.trendValue}
              color="primary"
            />
            <KPICard
              title="Low Stock Items"
              value={kpiData?.lowStockItems?.value}
              subtitle={kpiData?.lowStockItems?.subtitle}
              icon="AlertTriangle"
              trend={kpiData?.lowStockItems?.trend}
              trendValue={kpiData?.lowStockItems?.trendValue}
              color="warning"
            />
            <KPICard
              title="Active Projects"
              value={kpiData?.activeProjects?.value}
              subtitle={kpiData?.activeProjects?.subtitle}
              icon="FolderOpen"
              trend={kpiData?.activeProjects?.trend}
              trendValue={kpiData?.activeProjects?.trendValue}
              color="success"
            />
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-8">
            <InventoryTrendsChart />
            <InventoryDistributionChart />
          </div>

          {/* Quick Actions */}
          <div className="mb-8">
            <QuickActions />
          </div>

          {/* Projects Overview */}
          <div className="mb-8">
            <ProjectsOverview />
          </div>

          {/* Footer */}
          <footer className="mt-12 pt-8 border-t border-border">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between text-sm text-muted-foreground">
              <div className="flex items-center space-x-4">
                <span>© {new Date()?.getFullYear()} BuildBuddy Construction Management</span>
                <span>•</span>
                <span>Version 2.1.0</span>
              </div>
              <div className="mt-2 sm:mt-0 flex items-center space-x-4">
                <button 
                  onClick={() => window.location.href = '/help'}
                  className="hover:text-primary transition-colors"
                >
                  Help & Support
                </button>
                <span>•</span>
                <button 
                  onClick={() => window.location.href = '/settings'}
                  className="hover:text-primary transition-colors"
                >
                  Settings
                </button>
              </div>
            </div>
          </footer>
        </div>
      </main>
    </div>
  );
};

export default ProjectManagerDashboard;