import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Select from '../../../components/ui/Select';

const BulkActionsBar = ({ 
  selectedCount, 
  onBulkStatusUpdate, 
  onBulkArchive, 
  onClearSelection,
  onExportSelected 
}) => {
  const [bulkStatus, setBulkStatus] = useState('');
  const [showConfirm, setShowConfirm] = useState(false);
  const [confirmAction, setConfirmAction] = useState(null);

  const statusOptions = [
    { value: '', label: 'Select status...' },
    { value: 'active', label: 'Set to Active' },
    { value: 'pending', label: 'Set to Pending' },
    { value: 'completed', label: 'Set to Completed' },
    { value: 'on-hold', label: 'Set to On Hold' }
  ];

  const handleBulkStatusUpdate = () => {
    if (bulkStatus) {
      onBulkStatusUpdate(bulkStatus);
      setBulkStatus('');
    }
  };

  const handleBulkArchive = () => {
    setConfirmAction('archive');
    setShowConfirm(true);
  };

  const handleConfirmAction = () => {
    if (confirmAction === 'archive') {
      onBulkArchive();
    }
    setShowConfirm(false);
    setConfirmAction(null);
  };

  const handleCancelAction = () => {
    setShowConfirm(false);
    setConfirmAction(null);
  };

  if (selectedCount === 0) return null;

  return (
    <>
      <div className="bg-secondary/10 border border-secondary/20 rounded-lg p-4 mb-4">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          {/* Selection Info */}
          <div className="flex items-center space-x-3">
            <div className="flex items-center justify-center w-8 h-8 bg-secondary rounded-full">
              <Icon name="Check" size={16} className="text-secondary-foreground" />
            </div>
            <div>
              <p className="text-sm font-medium text-foreground">
                {selectedCount} project{selectedCount !== 1 ? 's' : ''} selected
              </p>
              <p className="text-xs text-muted-foreground">
                Choose an action to apply to selected projects
              </p>
            </div>
          </div>

          {/* Bulk Actions */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            {/* Status Update */}
            <div className="flex items-center space-x-2">
              <Select
                options={statusOptions}
                value={bulkStatus}
                onChange={setBulkStatus}
                className="w-40"
              />
              <Button
                variant="outline"
                size="sm"
                onClick={handleBulkStatusUpdate}
                disabled={!bulkStatus}
                iconName="RefreshCw"
                iconPosition="left"
              >
                Update
              </Button>
            </div>

            {/* Other Actions */}
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={onExportSelected}
                iconName="Download"
                iconPosition="left"
              >
                Export
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={handleBulkArchive}
                className="text-warning hover:text-warning"
                iconName="Archive"
                iconPosition="left"
              >
                Archive
              </Button>

              <Button
                variant="ghost"
                size="sm"
                onClick={onClearSelection}
                iconName="X"
                iconPosition="left"
              >
                Clear
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      {showConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-300 p-4">
          <div className="bg-card rounded-lg shadow-lg w-full max-w-md">
            <div className="p-6">
              <div className="flex items-center space-x-3 mb-4">
                <div className="flex items-center justify-center w-10 h-10 bg-warning/10 rounded-full">
                  <Icon name="AlertTriangle" size={20} className="text-warning" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-foreground">Confirm Bulk Action</h3>
                  <p className="text-sm text-muted-foreground">
                    This action cannot be undone
                  </p>
                </div>
              </div>

              <p className="text-sm text-foreground mb-6">
                Are you sure you want to archive {selectedCount} selected project{selectedCount !== 1 ? 's' : ''}? 
                Archived projects will be moved out of the active project list.
              </p>

              <div className="flex items-center justify-end space-x-3">
                <Button
                  variant="outline"
                  onClick={handleCancelAction}
                >
                  Cancel
                </Button>
                <Button
                  variant="destructive"
                  onClick={handleConfirmAction}
                  iconName="Archive"
                  iconPosition="left"
                >
                  Archive Projects
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default BulkActionsBar;