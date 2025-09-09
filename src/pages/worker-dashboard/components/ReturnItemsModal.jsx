import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';

const ReturnItemsModal = ({ isOpen, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    project: '',
    product: '',
    quantity: '',
    reason: '',
    condition: 'good',
    notes: ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  // Mock data for projects
  const projectOptions = [
    { value: 'proj-001', label: 'Downtown Office Complex - Phase 1' },
    { value: 'proj-002', label: 'Residential Tower - Building A' },
    { value: 'proj-003', label: 'Shopping Mall Renovation' },
    { value: 'proj-004', label: 'Industrial Warehouse - Unit 5' },
    { value: 'proj-005', label: 'School Building Extension' }
  ];

  // Mock data for products
  const productOptions = [
    { value: 'prod-001', label: 'Portland Cement - 50kg Bags', description: 'SKU: CEM-001' },
    { value: 'prod-002', label: 'Steel Rebar - 12mm x 6m', description: 'SKU: REB-012' },
    { value: 'prod-003', label: 'Concrete Blocks - 8x8x16', description: 'SKU: BLK-816' },
    { value: 'prod-004', label: 'Sand - Fine Grade', description: 'SKU: SND-001' },
    { value: 'prod-005', label: 'Gravel - 3/4 inch', description: 'SKU: GRV-034' }
  ];

  // Return reason options
  const reasonOptions = [
    { value: 'excess', label: 'Excess Material' },
    { value: 'wrong-spec', label: 'Wrong Specification' },
    { value: 'damaged', label: 'Damaged on Site' },
    { value: 'project-change', label: 'Project Change' },
    { value: 'quality-issue', label: 'Quality Issue' }
  ];

  // Condition options
  const conditionOptions = [
    { value: 'good', label: 'Good Condition' },
    { value: 'fair', label: 'Fair Condition' },
    { value: 'damaged', label: 'Damaged' },
    { value: 'unusable', label: 'Unusable' }
  ];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors?.[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData?.project) newErrors.project = 'Please select a project';
    if (!formData?.product) newErrors.product = 'Please select a product';
    if (!formData?.quantity || formData?.quantity <= 0) {
      newErrors.quantity = 'Please enter a valid quantity';
    }
    if (!formData?.reason) newErrors.reason = 'Please select a return reason';

    setErrors(newErrors);
    return Object.keys(newErrors)?.length === 0;
  };

  const handleSubmit = async (e) => {
    e?.preventDefault();
    
    if (!validateForm()) return;

    setLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      onSubmit({
        ...formData,
        timestamp: new Date()?.toISOString(),
        worker: 'John Smith',
        transactionType: 'return'
      });
      
      // Reset form
      setFormData({
        project: '',
        product: '',
        quantity: '',
        reason: '',
        condition: 'good',
        notes: ''
      });
      
      onClose();
    } catch (error) {
      console.error('Error submitting form:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-300 p-4">
      <div className="bg-card rounded-xl shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-warning rounded-lg flex items-center justify-center">
              <Icon name="RotateCcw" size={20} className="text-warning-foreground" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-foreground">Return Items</h2>
              <p className="text-sm text-muted-foreground">Return unused materials</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            disabled={loading}
          >
            <Icon name="X" size={20} />
          </Button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <Select
            label="Select Project"
            placeholder="Choose a project"
            required
            searchable
            options={projectOptions}
            value={formData?.project}
            onChange={(value) => handleInputChange('project', value)}
            error={errors?.project}
          />

          <Select
            label="Select Product"
            placeholder="Choose a product"
            required
            searchable
            options={productOptions}
            value={formData?.product}
            onChange={(value) => handleInputChange('product', value)}
            error={errors?.product}
          />

          <Input
            label="Quantity to Return"
            type="number"
            placeholder="Enter quantity"
            required
            min="1"
            value={formData?.quantity}
            onChange={(e) => handleInputChange('quantity', e?.target?.value)}
            error={errors?.quantity}
          />

          <Select
            label="Return Reason"
            placeholder="Select reason for return"
            required
            options={reasonOptions}
            value={formData?.reason}
            onChange={(value) => handleInputChange('reason', value)}
            error={errors?.reason}
          />

          <Select
            label="Item Condition"
            placeholder="Select condition"
            required
            options={conditionOptions}
            value={formData?.condition}
            onChange={(value) => handleInputChange('condition', value)}
            description="Current condition of items being returned"
          />

          <Input
            label="Additional Notes (Optional)"
            type="text"
            placeholder="Add any additional notes"
            value={formData?.notes}
            onChange={(e) => handleInputChange('notes', e?.target?.value)}
            description="Optional notes about the return"
          />

          {/* Actions */}
          <div className="flex space-x-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={loading}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="default"
              loading={loading}
              className="flex-1"
              iconName="Check"
              iconPosition="left"
            >
              {loading ? 'Processing...' : 'Return Items'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReturnItemsModal;