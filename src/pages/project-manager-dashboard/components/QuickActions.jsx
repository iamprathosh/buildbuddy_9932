import React from 'react';
import Button from '../../../components/ui/Button';

const QuickActions = () => {
  const quickActions = [
    {
      title: 'Inventory Management',
      description: 'View and manage stock levels',
      icon: 'Package',
      color: 'primary',
      path: '/inventory-management'
    },
    {
      title: 'Project Management',
      description: 'Create and track projects',
      icon: 'FolderOpen',
      color: 'secondary',
      path: '/project-management'
    },
    {
      title: 'Stock Transactions',
      description: 'Record stock movements',
      icon: 'ArrowUpDown',
      color: 'success',
      path: '/inventory-management?tab=transactions'
    },
    {
      title: 'Reports & Analytics',
      description: 'View detailed reports',
      icon: 'BarChart3',
      color: 'warning',
      path: '/reports'
    }
  ];

  const handleActionClick = (path) => {
    window.location.href = path;
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6 shadow-sm">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-foreground">Quick Actions</h3>
        <p className="text-sm text-muted-foreground">Access frequently used features</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {quickActions?.map((action, index) => (
          <Button
            key={index}
            variant="outline"
            onClick={() => handleActionClick(action?.path)}
            className="h-auto p-4 flex-col items-start text-left hover:shadow-md transition-all duration-200"
            fullWidth
          >
            <div className={`p-2 rounded-lg mb-3 ${
              action?.color === 'primary' ? 'bg-primary/10 text-primary' :
              action?.color === 'secondary' ? 'bg-secondary/10 text-secondary' :
              action?.color === 'success' ? 'bg-success/10 text-success' :
              action?.color === 'warning'? 'bg-warning/10 text-warning' : 'bg-muted text-muted-foreground'
            }`}>
              <div className="w-6 h-6 flex items-center justify-center">
                <svg
                  viewBox="0 0 24 24"
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  {action?.icon === 'Package' && (
                    <>
                      <path d="m7.5 4.27 9 5.15" />
                      <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" />
                      <path d="m3.3 7 8.7 5 8.7-5" />
                      <path d="M12 22V12" />
                    </>
                  )}
                  {action?.icon === 'FolderOpen' && (
                    <>
                      <path d="m6 14 1.45-2.9A2 2 0 0 1 9.24 10H20a2 2 0 0 1 1.94 2.5l-1.55 6a2 2 0 0 1-1.94 1.5H4a2 2 0 0 1-2-2V5c0-1.1.9-2 2-2h3.93a2 2 0 0 1 1.66.9l.82 1.2a2 2 0 0 0 1.66.9H18a2 2 0 0 1 2 2v2" />
                    </>
                  )}
                  {action?.icon === 'ArrowUpDown' && (
                    <>
                      <path d="m21 16-4 4-4-4" />
                      <path d="M17 20V4" />
                      <path d="m3 8 4-4 4 4" />
                      <path d="M7 4v16" />
                    </>
                  )}
                  {action?.icon === 'BarChart3' && (
                    <>
                      <path d="M3 3v18h18" />
                      <path d="m19 9-5 5-4-4-3 3" />
                    </>
                  )}
                </svg>
              </div>
            </div>
            <div>
              <h4 className="font-medium text-foreground mb-1">{action?.title}</h4>
              <p className="text-sm text-muted-foreground">{action?.description}</p>
            </div>
          </Button>
        ))}
      </div>
    </div>
  );
};

export default QuickActions;