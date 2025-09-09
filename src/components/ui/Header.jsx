import React, { useState } from 'react';
import Icon from '../AppIcon';
import Button from './Button';

const Header = ({ isCollapsed = false, onToggleSidebar }) => {
  const [showMoreMenu, setShowMoreMenu] = useState(false);

  const primaryNavItems = [
    { label: 'Dashboard', path: '/dashboard', icon: 'LayoutDashboard' },
    { label: 'Inventory', path: '/inventory-management', icon: 'Package' },
    { label: 'Projects', path: '/project-management', icon: 'FolderOpen' },
    { label: 'Reports', path: '/reports', icon: 'BarChart3' }
  ];

  const secondaryNavItems = [
    { label: 'Settings', path: '/settings', icon: 'Settings' },
    { label: 'Help', path: '/help', icon: 'HelpCircle' },
    { label: 'Admin', path: '/admin', icon: 'Shield' }
  ];

  const handleNavigation = (path) => {
    window.location.href = path;
  };

  const handleMoreMenuToggle = () => {
    setShowMoreMenu(!showMoreMenu);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-100 bg-card border-b border-border shadow-sm">
      <div className="flex items-center justify-between h-16 px-6">
        {/* Left Section - Logo and Mobile Menu Toggle */}
        <div className="flex items-center space-x-4">
          {/* Mobile Menu Toggle */}
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggleSidebar}
            className="lg:hidden"
          >
            <Icon name="Menu" size={20} />
          </Button>

          {/* Logo */}
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
            <div className="hidden sm:block">
              <h1 className="text-lg font-semibold text-foreground">BuildBuddy</h1>
              <p className="text-xs text-muted-foreground -mt-1">Construction Management</p>
            </div>
          </div>
        </div>

        {/* Center Section - Primary Navigation (Desktop) */}
        <nav className="hidden lg:flex items-center space-x-1">
          {primaryNavItems?.map((item) => (
            <Button
              key={item?.path}
              variant="ghost"
              onClick={() => handleNavigation(item?.path)}
              className="flex items-center space-x-2 px-3 py-2 text-sm font-medium text-muted-foreground hover:text-secondary hover:bg-muted transition-colors duration-200"
            >
              <Icon name={item?.icon} size={16} />
              <span>{item?.label}</span>
            </Button>
          ))}
        </nav>

        {/* Right Section - User Menu and More Options */}
        <div className="flex items-center space-x-2">
          {/* Notifications */}
          <Button variant="ghost" size="icon" className="relative">
            <Icon name="Bell" size={18} />
            <span className="absolute -top-1 -right-1 w-2 h-2 bg-primary rounded-full"></span>
          </Button>

          {/* More Menu */}
          <div className="relative">
            <Button
              variant="ghost"
              size="icon"
              onClick={handleMoreMenuToggle}
              className="hidden lg:flex"
            >
              <Icon name="MoreHorizontal" size={18} />
            </Button>

            {/* More Menu Dropdown */}
            {showMoreMenu && (
              <div className="absolute right-0 top-full mt-2 w-48 bg-popover border border-border rounded-md shadow-lg animate-fade-in z-200">
                <div className="py-1">
                  {secondaryNavItems?.map((item) => (
                    <button
                      key={item?.path}
                      onClick={() => {
                        handleNavigation(item?.path);
                        setShowMoreMenu(false);
                      }}
                      className="flex items-center space-x-3 w-full px-4 py-2 text-sm text-popover-foreground hover:bg-muted transition-colors duration-200"
                    >
                      <Icon name={item?.icon} size={16} />
                      <span>{item?.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* User Profile */}
          <div className="flex items-center space-x-3 pl-2 border-l border-border">
            <div className="hidden sm:block text-right">
              <p className="text-sm font-medium text-foreground">John Smith</p>
              <p className="text-xs text-muted-foreground">Project Manager</p>
            </div>
            <div className="w-8 h-8 bg-secondary rounded-full flex items-center justify-center">
              <span className="text-sm font-medium text-secondary-foreground">JS</span>
            </div>
          </div>
        </div>
      </div>
      {/* Mobile Navigation Menu */}
      <div className="lg:hidden border-t border-border bg-card">
        <nav className="flex overflow-x-auto px-4 py-2 space-x-1">
          {primaryNavItems?.map((item) => (
            <Button
              key={item?.path}
              variant="ghost"
              onClick={() => handleNavigation(item?.path)}
              className="flex items-center space-x-2 px-3 py-2 text-sm font-medium text-muted-foreground hover:text-secondary hover:bg-muted whitespace-nowrap transition-colors duration-200"
            >
              <Icon name={item?.icon} size={16} />
              <span>{item?.label}</span>
            </Button>
          ))}
        </nav>
      </div>
      {/* Click outside to close more menu */}
      {showMoreMenu && (
        <div
          className="fixed inset-0 z-100"
          onClick={() => setShowMoreMenu(false)}
        />
      )}
    </header>
  );
};

export default Header;