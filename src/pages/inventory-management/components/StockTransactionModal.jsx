import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';

const StockTransactionModal = ({ 
  isOpen, 
  onClose, 
  product, 
  transactionType, 
  onSave,
  projects = []
}) => {
  const [formData, setFormData] = useState({
    quantity: '',
    projectId: '',
    reason: '',
    notes: '',
    unitCost: ''
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const transactionConfig = {
    pull: {
      title: 'Pull Stock',
      icon: 'Minus',
      color: 'text-warning',
      description: 'Remove inventory for project use',
      requiresProject: true,
      quantityLabel: 'Quantity to Pull'
    },
    receive: {
      title: 'Receive Stock',
      icon: 'Plus',
      color: 'text-success',
      description: 'Add new inventory to stock',
      requiresProject: false,
      quantityLabel: 'Quantity Received',
      requiresUnitCost: true
    },
    return: {
      title: 'Return Stock',
      icon: 'RotateCcw',
      color: 'text-accent',
      description: 'Return unused inventory to stock',
      requiresProject: true,
      quantityLabel: 'Quantity to Return'
    }
  };

  const config = transactionConfig?.[transactionType] || transactionConfig?.pull;

  useEffect(() => {
    if (isOpen) {
      setFormData({
        quantity: '',
        projectId: '',
        reason: '',
        notes: '',
        unitCost: product?.mauc?.toString() || ''
      });
      setErrors({});
    }
  }, [isOpen, product]);

  const projectOptions = projects?.map(project => ({
    value: project?.id,
    label: `${project?.name} (${project?.jobNumber})`
  }));

  const reasonOptions = {
    pull: [
      { value: 'construction', label: 'Construction Use' },
      { value: 'maintenance', label: 'Maintenance' },
      { value: 'repair', label: 'Repair Work' },
      { value: 'testing', label: 'Testing/Quality Control' },
      { value: 'other', label: 'Other' }
    ],
    receive: [
      { value: 'purchase', label: 'New Purchase' },
      { value: 'delivery', label: 'Supplier Delivery' },
      { value: 'transfer', label: 'Transfer from Another Site' },
      { value: 'return', label: 'Return from Project' },
      { value: 'other', label: 'Other' }
    ],
    return: [
      { value: 'unused', label: 'Unused Materials' },
      { value: 'excess', label: 'Excess Quantity' },
      { value: 'defective', label: 'Defective/Damaged' },
      { value: 'wrong-spec', label: 'Wrong Specification' },
      { value: 'other', label: 'Other' }
    ]
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    if (errors?.[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData?.quantity || formData?.quantity <= 0) {
      newErrors.quantity = 'Quantity must be greater than 0';
    }

    if (transactionType === 'pull' && Number(formData?.quantity) > product?.currentStock) {
      newErrors.quantity = `Cannot pull more than available stock (${product?.currentStock})`;
    }

    if (config?.requiresProject && !formData?.projectId) {
      newErrors.projectId = 'Project selection is required';
    }

    if (!formData?.reason) {
      newErrors.reason = 'Reason is required';
    }

    if (config?.requiresUnitCost && (!formData?.unitCost || formData?.unitCost <= 0)) {
      newErrors.unitCost = 'Unit cost is required and must be greater than 0';
    }

    setErrors(newErrors);
    return Object.keys(newErrors)?.length === 0;
  };

  const handleSubmit = async (e) => {
    e?.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    
    try {
      const transactionData = {
        productId: product?.id,
        type: transactionType,
        quantity: Number(formData?.quantity),
        projectId: formData?.projectId || null,
        reason: formData?.reason,
        notes: formData?.notes,
        unitCost: formData?.unitCost ? Number(formData?.unitCost) : null,
        timestamp: new Date()?.toISOString(),
        userId: 'current-user-id' // In real app, get from auth context
      };

      await onSave(transactionData);
      onClose();
    } catch (error) {
      console.error('Error saving transaction:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const calculateNewStock = () => {
    const quantity = Number(formData?.quantity) || 0;
    const currentStock = product?.currentStock || 0;
    
    switch (transactionType) {
      case 'pull':
        return Math.max(0, currentStock - quantity);
      case 'receive': case'return':
        return currentStock + quantity;
      default:
        return currentStock;
    }
  };

  if (!isOpen || !product) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-300 flex items-center justify-center p-4">
      <div className="bg-card rounded-lg border border-border shadow-lg w-full max-w-md">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div className="flex items-center space-x-3">
            <div className={`flex items-center justify-center w-10 h-10 rounded-full bg-muted ${config?.color}`}>
              <Icon name={config?.icon} size={20} />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-foreground">{config?.title}</h2>
              <p className="text-sm text-muted-foreground">{config?.description}</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            disabled={isLoading}
          >
            <Icon name="X" size={20} />
          </Button>
        </div>

        {/* Product Info */}
        <div className="p-6 border-b border-border bg-muted/30">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-background rounded-md flex items-center justify-center">
              <Icon name="Package" size={20} className="text-muted-foreground" />
            </div>
            <div>
              <h3 className="font-medium text-foreground">{product?.name}</h3>
              <p className="text-sm text-muted-foreground">
                SKU: {product?.sku} • Current Stock: {product?.currentStock} {product?.unitOfMeasure}
              </p>
            </div>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div className="p-6 space-y-4">
            {/* Quantity */}
            <Input
              label={config?.quantityLabel}
              type="number"
              value={formData?.quantity}
              onChange={(e) => handleInputChange('quantity', e?.target?.value)}
              error={errors?.quantity}
              placeholder="0"
              min="1"
              step="1"
              required
            />

            {/* Project Selection */}
            {config?.requiresProject && (
              <Select
                label="Project"
                options={projectOptions}
                value={formData?.projectId}
                onChange={(value) => handleInputChange('projectId', value)}
                error={errors?.projectId}
                placeholder="Select project"
                required
              />
            )}

            {/* Unit Cost (for receive transactions) */}
            {config?.requiresUnitCost && (
              <Input
                label="Unit Cost"
                type="number"
                step="0.01"
                value={formData?.unitCost}
                onChange={(e) => handleInputChange('unitCost', e?.target?.value)}
                error={errors?.unitCost}
                placeholder="0.00"
                min="0"
                required
              />
            )}

            {/* Reason */}
            <Select
              label="Reason"
              options={reasonOptions?.[transactionType] || []}
              value={formData?.reason}
              onChange={(value) => handleInputChange('reason', value)}
              error={errors?.reason}
              placeholder="Select reason"
              required
            />

            {/* Notes */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Notes (Optional)
              </label>
              <textarea
                value={formData?.notes}
                onChange={(e) => handleInputChange('notes', e?.target?.value)}
                placeholder="Add any additional notes..."
                rows={3}
                className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent resize-none"
              />
            </div>

            {/* Stock Preview */}
            {formData?.quantity && (
              <div className="bg-muted/50 rounded-md p-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">New Stock Level:</span>
                  <span className="font-medium text-foreground">
                    {calculateNewStock()} {product?.unitOfMeasure}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end space-x-3 p-6 border-t border-border">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              loading={isLoading}
              iconName={config?.icon}
              iconPosition="left"
            >
              {config?.title}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default StockTransactionModal;