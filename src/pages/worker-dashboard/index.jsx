import React, { useState } from 'react';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import ActionButton from './components/ActionButton';
import TakeOutStockModal from './components/TakeOutStockModal';
import StockInProcessModal from './components/StockInProcessModal';
import ReturnItemsModal from './components/ReturnItemsModal';
import TransactionSuccessModal from './components/TransactionSuccessModal';
import QuickStats from './components/QuickStats';

const WorkerDashboard = () => {
  const [activeModal, setActiveModal] = useState(null);
  const [successTransaction, setSuccessTransaction] = useState(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const handleModalOpen = (modalType) => {
    setActiveModal(modalType);
  };

  const handleModalClose = () => {
    setActiveModal(null);
  };

  const handleTransactionSubmit = (transactionData) => {
    console.log('Transaction submitted:', transactionData);
    setSuccessTransaction(transactionData);
    setShowSuccessModal(true);
    setActiveModal(null);
  };

  const handleSuccessModalClose = () => {
    setShowSuccessModal(false);
    setSuccessTransaction(null);
  };

  const getCurrentTime = () => {
    const now = new Date();
    return now?.toLocaleString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-card border-b border-border shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo and Title */}
            <div className="flex items-center space-x-4">
              <div className="flex items-center justify-center w-10 h-10 bg-primary rounded-lg">
                <svg
                  viewBox="0 0 24 24"
                  className="w-6 h-6 text-primary-foreground"
                  fill="currentColor"
                >
                  <path d="M12 2L2 7v10c0 5.55 3.84 9.74 9 11 5.16-1.26 9-5.45 9-11V7l-10-5z"/>
                  <path d="M9 12l2 2 4-4" stroke="currentColor" strokeWidth="2" fill="none"/>
                </svg>
              </div>
              <div>
                <h1 className="text-xl font-bold text-foreground">BuildBuddy</h1>
                <p className="text-sm text-muted-foreground -mt-1">Worker Dashboard</p>
              </div>
            </div>

            {/* User Info */}
            <div className="flex items-center space-x-3">
              <div className="hidden sm:block text-right">
                <p className="text-sm font-medium text-foreground">John Smith</p>
                <p className="text-xs text-muted-foreground">Construction Worker</p>
              </div>
              <div className="w-10 h-10 bg-secondary rounded-full flex items-center justify-center">
                <span className="text-sm font-medium text-secondary-foreground">JS</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-2">
            <Icon name="Clock" size={20} className="text-muted-foreground" />
            <p className="text-sm text-muted-foreground">{getCurrentTime()}</p>
          </div>
          <h2 className="text-2xl font-bold text-foreground mb-1">Welcome back, John!</h2>
          <p className="text-muted-foreground">
            Ready to manage inventory transactions? Choose an action below to get started.
          </p>
        </div>

        {/* Quick Stats */}
        <QuickStats />

        {/* Action Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <ActionButton
            title="Take Out Stock"
            description="Remove inventory for project use"
            iconName="Minus"
            variant="default"
            onClick={() => handleModalOpen('takeOut')}
            className="bg-primary hover:bg-primary/90 text-primary-foreground"
          />

          <ActionButton
            title="Stock In Process"
            description="Log material receipt from suppliers"
            iconName="Plus"
            variant="outline"
            onClick={() => handleModalOpen('stockIn')}
            className="border-accent text-accent hover:bg-accent hover:text-accent-foreground"
          />

          <ActionButton
            title="Return Items"
            description="Return unused materials to inventory"
            iconName="RotateCcw"
            variant="outline"
            onClick={() => handleModalOpen('return')}
            className="border-warning text-warning hover:bg-warning hover:text-warning-foreground"
          />
        </div>

        {/* Quick Access Section */}
        <div className="bg-card rounded-xl border border-border p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold text-foreground">Quick Access</h3>
              <p className="text-sm text-muted-foreground">Frequently used actions and information</p>
            </div>
            <Icon name="Zap" size={20} className="text-accent" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Button
              variant="ghost"
              className="h-auto p-4 flex flex-col items-center space-y-2 hover:bg-muted"
              onClick={() => window.location.href = '/inventory-management'}
            >
              <Icon name="Package" size={24} className="text-muted-foreground" />
              <span className="text-sm font-medium">View Inventory</span>
            </Button>

            <Button
              variant="ghost"
              className="h-auto p-4 flex flex-col items-center space-y-2 hover:bg-muted"
              onClick={() => window.location.href = '/project-management'}
            >
              <Icon name="FolderOpen" size={24} className="text-muted-foreground" />
              <span className="text-sm font-medium">Active Projects</span>
            </Button>

            <Button
              variant="ghost"
              className="h-auto p-4 flex flex-col items-center space-y-2 hover:bg-muted"
            >
              <Icon name="History" size={24} className="text-muted-foreground" />
              <span className="text-sm font-medium">Transaction History</span>
            </Button>

            <Button
              variant="ghost"
              className="h-auto p-4 flex flex-col items-center space-y-2 hover:bg-muted"
            >
              <Icon name="HelpCircle" size={24} className="text-muted-foreground" />
              <span className="text-sm font-medium">Help & Support</span>
            </Button>
          </div>
        </div>

        {/* Safety Notice */}
        <div className="mt-8 bg-warning/10 border border-warning/20 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <Icon name="AlertTriangle" size={20} className="text-warning mt-0.5" />
            <div>
              <h4 className="text-sm font-semibold text-foreground mb-1">Safety Reminder</h4>
              <p className="text-sm text-muted-foreground">
                Always wear appropriate PPE when handling materials. Report any damaged or unsafe items immediately to your supervisor.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      <TakeOutStockModal
        isOpen={activeModal === 'takeOut'}
        onClose={handleModalClose}
        onSubmit={handleTransactionSubmit}
      />

      <StockInProcessModal
        isOpen={activeModal === 'stockIn'}
        onClose={handleModalClose}
        onSubmit={handleTransactionSubmit}
      />

      <ReturnItemsModal
        isOpen={activeModal === 'return'}
        onClose={handleModalClose}
        onSubmit={handleTransactionSubmit}
      />

      <TransactionSuccessModal
        isOpen={showSuccessModal}
        onClose={handleSuccessModalClose}
        transaction={successTransaction}
      />
    </div>
  );
};

export default WorkerDashboard;