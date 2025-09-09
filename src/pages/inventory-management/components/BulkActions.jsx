import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Select from '../../../components/ui/Select';

const BulkActions = ({ 
  selectedCount, 
  onBulkDelete, 
  onBulkCategoryUpdate, 
  onBulkExport,
  categories 
}) => {
  const [showBulkMenu, setShowBulkMenu] = useState(false);
  const [bulkCategory, setBulkCategory] = useState('');

  const categoryOptions = categories?.map(category => ({
    value: category,
    label: category
  }));

  const handleBulkCategoryUpdate = () => {
    if (bulkCategory) {
      onBulkCategoryUpdate(bulkCategory);
      setBulkCategory('');
      setShowBulkMenu(false);
    }
  };

  const handleBulkDelete = () => {
    if (window.confirm(`Are you sure you want to delete ${selectedCount} selected products? This action cannot be undone.`)) {
      onBulkDelete();
      setShowBulkMenu(false);
    }
  };

  const handleBulkExport = () => {
    onBulkExport();
    setShowBulkMenu(false);
  };

  if (selectedCount === 0) return null;

  return (
    <div className="bg-accent/5 border border-accent/20 rounded-lg p-4 mb-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="flex items-center justify-center w-8 h-8 bg-accent/10 rounded-full">
            <Icon name="CheckSquare" size={16} className="text-accent" />
          </div>
          <div>
            <p className="text-sm font-medium text-foreground">
              {selectedCount} {selectedCount === 1 ? 'product' : 'products'} selected
            </p>
            <p className="text-xs text-muted-foreground">
              Choose an action to apply to selected items
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          {/* Quick Actions */}
          <Button
            variant="outline"
            size="sm"
            onClick={handleBulkExport}
            iconName="Download"
            iconPosition="left"
          >
            Export Selected
          </Button>

          {/* Bulk Actions Dropdown */}
          <div className="relative">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowBulkMenu(!showBulkMenu)}
              iconName="MoreVertical"
              iconPosition="right"
            >
              More Actions
            </Button>

            {showBulkMenu && (
              <div className="absolute right-0 top-full mt-2 w-64 bg-popover border border-border rounded-md shadow-lg z-200">
                <div className="p-4 space-y-4">
                  {/* Update Category */}
                  <div>
                    <label className="text-sm font-medium text-foreground mb-2 block">
                      Update Category
                    </label>
                    <div className="flex space-x-2">
                      <Select
                        options={categoryOptions}
                        value={bulkCategory}
                        onChange={setBulkCategory}
                        placeholder="Select category"
                        className="flex-1"
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleBulkCategoryUpdate}
                        disabled={!bulkCategory}
                        iconName="Check"
                      >
                        Apply
                      </Button>
                    </div>
                  </div>

                  <div className="border-t border-border pt-4">
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={handleBulkDelete}
                      iconName="Trash2"
                      iconPosition="left"
                      className="w-full"
                    >
                      Delete Selected Products
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Click outside to close menu */}
      {showBulkMenu && (
        <div
          className="fixed inset-0 z-100"
          onClick={() => setShowBulkMenu(false)}
        />
      )}
    </div>
  );
};

export default BulkActions;