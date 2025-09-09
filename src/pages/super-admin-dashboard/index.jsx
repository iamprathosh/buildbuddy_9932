import React, { useState, useEffect } from 'react';
import Header from '../../components/ui/Header';
import Sidebar from '../../components/ui/Sidebar';
import KPICard from './components/KPICard';
import InventoryTrendsChart from './components/InventoryTrendsChart';
import InventoryDistributionChart from './components/InventoryDistributionChart';
import GetStartedSection from './components/GetStartedSection';
import QuickActionsSection from './components/QuickActionsSection';

const SuperAdminDashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [dashboardData, setDashboardData] = useState({
    totalInventoryValue: 325000,
    lowStockItems: 23,
    activeProjects: 8,
    lastUpdated: new Date()
  });

  useEffect(() => {
    // Simulate real-time data updates
    const interval = setInterval(() => {
      setDashboardData(prev => ({
        ...prev,
        lastUpdated: new Date(),
        // Simulate minor fluctuations
        totalInventoryValue: prev?.totalInventoryValue + Math.floor(Math.random() * 2000 - 1000),
        lowStockItems: Math.max(0, prev?.lowStockItems + Math.floor(Math.random() * 3 - 1))
      }));
    }, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, []);

  const kpiData = [
    {
      title: 'Total Inventory Value',
      value: `$${dashboardData?.totalInventoryValue?.toLocaleString()}`,
      subtitle: '1,625 items in stock',
      icon: 'DollarSign',
      trend: 'up',
      trendValue: '+12.5%',
      color: 'primary'
    },
    {
      title: 'Low Stock Items',
      value: dashboardData?.lowStockItems?.toString(),
      subtitle: 'Require immediate attention',
      icon: 'AlertTriangle',
      trend: 'down',
      trendValue: '-8.3%',
      color: 'warning'
    },
    {
      title: 'Active Projects',
      value: dashboardData?.activeProjects?.toString(),
      subtitle: '3 starting this week',
      icon: 'Building2',
      trend: 'up',
      trendValue: '+25.0%',
      color: 'success'
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header 
        onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
      />
      <Sidebar 
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        userRole="super-admin"
      />
      <main className="lg:ml-60 pt-16">
        <div className="p-6 space-y-8">
          {/* Page Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Super Admin Dashboard</h1>
              <p className="text-muted-foreground mt-1">
                System overview and administrative controls
              </p>
            </div>
            <div className="mt-4 sm:mt-0 text-sm text-muted-foreground">
              Last updated: {dashboardData?.lastUpdated?.toLocaleTimeString()}
            </div>
          </div>

          {/* KPI Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {kpiData?.map((kpi, index) => (
              <KPICard
                key={index}
                title={kpi?.title}
                value={kpi?.value}
                subtitle={kpi?.subtitle}
                icon={kpi?.icon}
                trend={kpi?.trend}
                trendValue={kpi?.trendValue}
                color={kpi?.color}
              />
            ))}
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            <InventoryTrendsChart />
            <InventoryDistributionChart />
          </div>

          {/* Get Started Section */}
          <GetStartedSection />

          {/* Quick Actions */}
          <QuickActionsSection />

          {/* Recent Activity Summary */}
          <div className="bg-card border border-border rounded-lg p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4">Recent System Activity</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between py-3 border-b border-border last:border-b-0">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-success rounded-full"></div>
                  <div>
                    <p className="text-sm font-medium text-foreground">New user registered</p>
                    <p className="text-xs text-muted-foreground">Sarah Johnson joined as Project Manager</p>
                  </div>
                </div>
                <span className="text-xs text-muted-foreground">2 hours ago</span>
              </div>
              
              <div className="flex items-center justify-between py-3 border-b border-border last:border-b-0">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-warning rounded-full"></div>
                  <div>
                    <p className="text-sm font-medium text-foreground">Low stock alert triggered</p>
                    <p className="text-xs text-muted-foreground">Portland Cement below minimum threshold</p>
                  </div>
                </div>
                <span className="text-xs text-muted-foreground">4 hours ago</span>
              </div>
              
              <div className="flex items-center justify-between py-3 border-b border-border last:border-b-0">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                  <div>
                    <p className="text-sm font-medium text-foreground">Bulk inventory update completed</p>
                    <p className="text-xs text-muted-foreground">145 items updated successfully</p>
                  </div>
                </div>
                <span className="text-xs text-muted-foreground">6 hours ago</span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default SuperAdminDashboard;