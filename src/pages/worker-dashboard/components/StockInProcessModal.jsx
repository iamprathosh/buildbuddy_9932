import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';

const StockInProcessModal = ({ isOpen, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    supplier: '',
    product: '',
    quantity: '',
    deliveryNote: '',
    condition: 'good'
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  // Mock data for suppliers
  const supplierOptions = [
    { value: 'sup-001', label: 'ABC Building Supplies' },
    { value: 'sup-002', label: 'Metro Construction Materials' },
    { value: 'sup-003', label: 'Premier Concrete Co.' },
    { value: 'sup-004', label: 'Industrial Supply Partners' },
    { value: 'sup-005', label: 'Quality Materials Inc.' }
  ];

  // Mock data for products
  const productOptions = [
    { value: 'prod-001', label: 'Portland Cement - 50kg Bags', description: 'SKU: CEM-001' },
    { value: 'prod-002', label: 'Steel Rebar - 12mm x 6m', description: 'SKU: REB-012' },
    { value: 'prod-003', label: 'Concrete Blocks - 8x8x16', description: 'SKU: BLK-816' },
    { value: 'prod-004', label: 'Sand - Fine Grade', description: 'SKU: SND-001' },
    { value: 'prod-005', label: 'Gravel - 3/4 inch', description: 'SKU: GRV-034' },
    { value: 'prod-006', label: 'Plywood Sheets - 4x8 ft', description: 'SKU: PLY-048' }
  ];

  // Condition options
  const conditionOptions = [
    { value: 'good', label: 'Good Condition' },
    { value: 'damaged', label: 'Damaged' },
    { value: 'partial', label: 'Partial Delivery' }
  ];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors?.[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData?.supplier) newErrors.supplier = 'Please select a supplier';
    if (!formData?.product) newErrors.product = 'Please select a product';
    if (!formData?.quantity || formData?.quantity <= 0) {
      newErrors.quantity = 'Please enter a valid quantity';
    }
    if (!formData?.deliveryNote?.trim()) {
      newErrors.deliveryNote = 'Please enter delivery note number';
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
        transactionType: 'stock-in'
      });
      
      // Reset form
      setFormData({
        supplier: '',
        product: '',
        quantity: '',
        deliveryNote: '',
        condition: 'good'
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
            <div className="w-10 h-10 bg-accent rounded-lg flex items-center justify-center">
              <Icon name="Plus" size={20} className="text-accent-foreground" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-foreground">Stock In Process</h2>
              <p className="text-sm text-muted-foreground">Log material receipt</p>
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
            label="Select Supplier"
            placeholder="Choose a supplier"
            required
            searchable
            options={supplierOptions}
            value={formData?.supplier}
            onChange={(value) => handleInputChange('supplier', value)}
            error={errors?.supplier}
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
            label="Quantity Received"
            type="number"
            placeholder="Enter quantity"
            required
            min="1"
            value={formData?.quantity}
            onChange={(e) => handleInputChange('quantity', e?.target?.value)}
            error={errors?.quantity}
          />

          <Input
            label="Delivery Note Number"
            type="text"
            placeholder="Enter delivery note number"
            required
            value={formData?.deliveryNote}
            onChange={(e) => handleInputChange('deliveryNote', e?.target?.value)}
            error={errors?.deliveryNote}
            description="Reference number from delivery documentation"
          />

          <Select
            label="Condition"
            placeholder="Select condition"
            required
            options={conditionOptions}
            value={formData?.condition}
            onChange={(value) => handleInputChange('condition', value)}
            description="Overall condition of received materials"
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
              {loading ? 'Processing...' : 'Log Receipt'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default StockInProcessModal;