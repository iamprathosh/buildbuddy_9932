import React, { useState, useEffect } from 'react';
import Icon from '../AppIcon';
import Button from './Button';

const Sidebar = ({ isOpen = false, onClose, userRole = 'project-manager' }) => {
  const [activeItem, setActiveItem] = useState('');

  // Role-based navigation items
  const getNavigationItems = () => {
    const baseItems = [
      {
        label: 'Dashboard',
        path: getDashboardPath(),
        icon: 'LayoutDashboard',
        roles: ['super-admin', 'project-manager', 'worker']
      }
    ];

    const managementItems = [
      {
        label: 'Inventory Management',
        path: '/inventory-management',
        icon: 'Package',
        roles: ['super-admin', 'project-manager']
      },
      {
        label: 'Project Management',
        path: '/project-management',
        icon: 'FolderOpen',
        roles: ['super-admin', 'project-manager']
      }
    ];

    const adminItems = [
      {
        label: 'System Analytics',
        path: '/analytics',
        icon: 'BarChart3',
        roles: ['super-admin']
      },
      {
        label: 'User Management',
        path: '/users',
        icon: 'Users',
        roles: ['super-admin']
      }
    ];

    return [...baseItems, ...managementItems, ...adminItems]?.filter(item =>
      item?.roles?.includes(userRole)
    );
  };

  const getDashboardPath = () => {
    switch (userRole) {
      case 'super-admin':
        return '/super-admin-dashboard';
      case 'project-manager':
        return '/project-manager-dashboard';
      case 'worker':
        return '/worker-dashboard';
      default:
        return '/project-manager-dashboard';
    }
  };

  const navigationItems = getNavigationItems();

  useEffect(() => {
    const currentPath = window.location?.pathname;
    const activeNav = navigationItems?.find(item => item?.path === currentPath);
    if (activeNav) {
      setActiveItem(activeNav?.path);
    }
  }, [navigationItems]);

  const handleNavigation = (path) => {
    setActiveItem(path);
    window.location.href = path;
    if (onClose) onClose();
  };

  const handleLogout = () => {
    // Clear authentication data
    localStorage.removeItem('authToken');
    localStorage.removeItem('userRole');
    window.location.href = '/login';
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-200 lg:hidden"
          onClick={onClose}
        />
      )}
      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 h-full w-60 bg-card border-r border-border shadow-lg z-300
          transform transition-transform duration-300 ease-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
          lg:translate-x-0 lg:fixed
        `}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-border">
            <div className="flex items-center space-x-3">
              <div className="flex items-center justify-center w-8 h-8 bg-primary rounded-md">
                <svg
                  viewBox="0 0 24 24"
                  className="w-5 h-5 text-primary-foreground"
                  fill="currentColor"
                >
                  <path d="M12 2L2 7v10c0 5.55 3.84 9.74 9 11 5.16-1.26 9-5.45 9-11V7l-10-5z"/>
                  <path d="M9 12l2 2 4-4" stroke="currentColor" strokeWidth="2" fill="none"/>
                </svg>
              </div>
              <div>
                <h2 className="text-lg font-semibold text-foreground">BuildBuddy</h2>
                <p className="text-xs text-muted-foreground -mt-1">Construction Management</p>
              </div>
            </div>
            
            {/* Close button for mobile */}
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="lg:hidden"
            >
              <Icon name="X" size={18} />
            </Button>
          </div>

          {/* User Info */}
          <div className="p-4 border-b border-border">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-secondary rounded-full flex items-center justify-center">
                <span className="text-sm font-medium text-secondary-foreground">JS</span>
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">John Smith</p>
                <p className="text-xs text-muted-foreground capitalize">
                  {userRole?.replace('-', ' ')}
                </p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-1">
            {navigationItems?.map((item) => (
              <button
                key={item?.path}
                onClick={() => handleNavigation(item?.path)}
                className={`
                  flex items-center space-x-3 w-full px-3 py-3 rounded-md text-sm font-medium
                  transition-colors duration-200 focus-ring
                  ${activeItem === item?.path
                    ? 'bg-secondary text-secondary-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-secondary hover:bg-muted'
                  }
                `}
              >
                <Icon name={item?.icon} size={18} />
                <span>{item?.label}</span>
              </button>
            ))}
          </nav>

          {/* Quick Actions */}
          <div className="p-4 border-t border-border space-y-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleNavigation('/help')}
              className="w-full justify-start"
              iconName="HelpCircle"
              iconPosition="left"
            >
              Help & Support
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleNavigation('/settings')}
              className="w-full justify-start text-muted-foreground"
              iconName="Settings"
              iconPosition="left"
            >
              Settings
            </Button>
          </div>

          {/* Logout */}
          <div className="p-4 border-t border-border">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              className="w-full justify-start text-muted-foreground hover:text-destructive"
              iconName="LogOut"
              iconPosition="left"
            >
              Sign Out
            </Button>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;