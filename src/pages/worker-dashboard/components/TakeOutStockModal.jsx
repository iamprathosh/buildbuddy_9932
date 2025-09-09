import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';

const TakeOutStockModal = ({ isOpen, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    project: '',
    product: '',
    quantity: '',
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
    { value: 'prod-001', label: 'Portland Cement - 50kg Bags', description: 'SKU: CEM-001 | Stock: 150 bags' },
    { value: 'prod-002', label: 'Steel Rebar - 12mm x 6m', description: 'SKU: REB-012 | Stock: 85 pieces' },
    { value: 'prod-003', label: 'Concrete Blocks - 8x8x16', description: 'SKU: BLK-816 | Stock: 500 blocks' },
    { value: 'prod-004', label: 'Sand - Fine Grade', description: 'SKU: SND-001 | Stock: 25 tons' },
    { value: 'prod-005', label: 'Gravel - 3/4 inch', description: 'SKU: GRV-034 | Stock: 18 tons' }
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
        transactionType: 'take-out'
      });
      
      // Reset form
      setFormData({
        project: '',
        product: '',
        quantity: '',
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
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
              <Icon name="Minus" size={20} className="text-primary-foreground" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-foreground">Take Out Stock</h2>
              <p className="text-sm text-muted-foreground">Remove inventory for project use</p>
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
            label="Quantity"
            type="number"
            placeholder="Enter quantity"
            required
            min="1"
            value={formData?.quantity}
            onChange={(e) => handleInputChange('quantity', e?.target?.value)}
            error={errors?.quantity}
          />

          <Input
            label="Notes (Optional)"
            type="text"
            placeholder="Add any additional notes"
            value={formData?.notes}
            onChange={(e) => handleInputChange('notes', e?.target?.value)}
            description="Optional notes about this transaction"
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
              {loading ? 'Processing...' : 'Take Out Stock'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TakeOutStockModal;