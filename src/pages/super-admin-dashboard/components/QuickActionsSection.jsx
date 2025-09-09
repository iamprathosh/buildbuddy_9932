import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const QuickActionsSection = () => {
  const quickActions = [
    {
      title: 'User Management',
      description: 'Manage user accounts, roles, and permissions',
      icon: 'Users',
      color: 'primary',
      path: '/users',
      stats: '12 active users'
    },
    {
      title: 'System Settings',
      description: 'Configure system preferences and security',
      icon: 'Settings',
      color: 'secondary',
      path: '/settings',
      stats: 'Last updated 2 days ago'
    },
    {
      title: 'Bulk Operations',
      description: 'Import/export data and bulk inventory updates',
      icon: 'Database',
      color: 'success',
      path: '/bulk-operations',
      stats: '3 pending imports'
    },
    {
      title: 'Analytics & Reports',
      description: 'Generate detailed reports and analytics',
      icon: 'BarChart3',
      color: 'warning',
      path: '/analytics',
      stats: '15 reports available'
    }
  ];

  const handleActionClick = (path) => {
    window.location.href = path;
  };

  const getColorClasses = (color) => {
    switch (color) {
      case 'primary':
        return {
          bg: 'bg-primary/10',
          icon: 'text-primary',
          border: 'border-primary/20',
          hover: 'hover:bg-primary/15'
        };
      case 'secondary':
        return {
          bg: 'bg-secondary/10',
          icon: 'text-secondary',
          border: 'border-secondary/20',
          hover: 'hover:bg-secondary/15'
        };
      case 'success':
        return {
          bg: 'bg-success/10',
          icon: 'text-success',
          border: 'border-success/20',
          hover: 'hover:bg-success/15'
        };
      case 'warning':
        return {
          bg: 'bg-warning/10',
          icon: 'text-warning',
          border: 'border-warning/20',
          hover: 'hover:bg-warning/15'
        };
      default:
        return {
          bg: 'bg-muted',
          icon: 'text-muted-foreground',
          border: 'border-border',
          hover: 'hover:bg-muted/80'
        };
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-foreground">Quick Actions</h3>
          <p className="text-sm text-muted-foreground">Administrative tools and system management</p>
        </div>
        <Button
          variant="outline"
          size="sm"
          iconName="ExternalLink"
          iconPosition="right"
          onClick={() => handleActionClick('/admin')}
        >
          Admin Panel
        </Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {quickActions?.map((action, index) => {
          const colorClasses = getColorClasses(action?.color);
          
          return (
            <button
              key={index}
              onClick={() => handleActionClick(action?.path)}
              className={`
                bg-card border border-border rounded-lg p-6 text-left
                transition-all duration-200 hover:shadow-md focus-ring
                ${colorClasses?.hover}
              `}
            >
              <div className="flex items-start justify-between mb-4">
                <div className={`p-3 rounded-lg ${colorClasses?.bg} ${colorClasses?.border} border`}>
                  <Icon name={action?.icon} size={20} className={colorClasses?.icon} />
                </div>
                <Icon name="ArrowUpRight" size={16} className="text-muted-foreground" />
              </div>
              <div className="space-y-2">
                <h4 className="font-medium text-foreground">{action?.title}</h4>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {action?.description}
                </p>
                <p className="text-xs text-muted-foreground font-medium">
                  {action?.stats}
                </p>
              </div>
            </button>
          );
        })}
      </div>
      {/* System Status Bar */}
      <div className="bg-card border border-border rounded-lg p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-success rounded-full"></div>
              <span className="text-sm font-medium text-foreground">System Status: Operational</span>
            </div>
            <div className="text-sm text-muted-foreground">
              Last backup: {new Date()?.toLocaleDateString()}
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              iconName="RefreshCw"
              iconPosition="left"
            >
              Refresh
            </Button>
            <Button
              variant="outline"
              size="sm"
              iconName="Activity"
              iconPosition="left"
              onClick={() => handleActionClick('/system-logs')}
            >
              View Logs
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuickActionsSection;