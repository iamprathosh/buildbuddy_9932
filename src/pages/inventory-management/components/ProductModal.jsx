import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import Image from '../../../components/AppImage';

const ProductModal = ({ 
  isOpen, 
  onClose, 
  product, 
  onSave, 
  categories, 
  unitsOfMeasure 
}) => {
  const [formData, setFormData] = useState({
    sku: '',
    name: '',
    category: '',
    unitOfMeasure: '',
    currentStock: 0,
    mauc: 0,
    image: '',
    description: '',
    minStockLevel: 10,
    maxStockLevel: 1000,
    supplier: '',
    location: ''
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState('');

  useEffect(() => {
    if (product) {
      setFormData({
        sku: product?.sku || '',
        name: product?.name || '',
        category: product?.category || '',
        unitOfMeasure: product?.unitOfMeasure || '',
        currentStock: product?.currentStock || 0,
        mauc: product?.mauc || 0,
        image: product?.image || '',
        description: product?.description || '',
        minStockLevel: product?.minStockLevel || 10,
        maxStockLevel: product?.maxStockLevel || 1000,
        supplier: product?.supplier || '',
        location: product?.location || ''
      });
      setImagePreview(product?.image || '');
    } else {
      setFormData({
        sku: '',
        name: '',
        category: '',
        unitOfMeasure: '',
        currentStock: 0,
        mauc: 0,
        image: '',
        description: '',
        minStockLevel: 10,
        maxStockLevel: 1000,
        supplier: '',
        location: ''
      });
      setImagePreview('');
    }
    setErrors({});
  }, [product, isOpen]);

  const categoryOptions = categories?.map(category => ({
    value: category,
    label: category
  }));

  const unitOptions = unitsOfMeasure?.map(unit => ({
    value: unit,
    label: unit
  }));

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error when user starts typing
    if (errors?.[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const handleImageUpload = (event) => {
    const file = event?.target?.files?.[0];
    if (file) {
      // In a real app, you would upload to a server
      // For now, we'll create a mock URL
      const mockImageUrl = `https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=400&h=400&fit=crop&crop=center`;
      setFormData(prev => ({
        ...prev,
        image: mockImageUrl
      }));
      setImagePreview(mockImageUrl);
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData?.sku?.trim()) {
      newErrors.sku = 'SKU is required';
    }
    if (!formData?.name?.trim()) {
      newErrors.name = 'Product name is required';
    }
    if (!formData?.category) {
      newErrors.category = 'Category is required';
    }
    if (!formData?.unitOfMeasure) {
      newErrors.unitOfMeasure = 'Unit of measure is required';
    }
    if (formData?.currentStock < 0) {
      newErrors.currentStock = 'Stock cannot be negative';
    }
    if (formData?.mauc < 0) {
      newErrors.mauc = 'MAUC cannot be negative';
    }
    if (formData?.minStockLevel < 0) {
      newErrors.minStockLevel = 'Minimum stock level cannot be negative';
    }
    if (formData?.maxStockLevel <= formData?.minStockLevel) {
      newErrors.maxStockLevel = 'Maximum stock level must be greater than minimum';
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
      const productData = {
        ...formData,
        id: product?.id || Date.now(),
        currentStock: Number(formData?.currentStock),
        mauc: Number(formData?.mauc),
        minStockLevel: Number(formData?.minStockLevel),
        maxStockLevel: Number(formData?.maxStockLevel),
        updatedAt: new Date()?.toISOString()
      };

      await onSave(productData);
      onClose();
    } catch (error) {
      console.error('Error saving product:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-300 flex items-center justify-center p-4">
      <div className="bg-card rounded-lg border border-border shadow-lg w-full max-w-2xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h2 className="text-lg font-semibold text-foreground">
            {product ? 'Edit Product' : 'Add New Product'}
          </h2>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            disabled={isLoading}
          >
            <Icon name="X" size={20} />
          </Button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="overflow-y-auto max-h-[calc(90vh-140px)]">
          <div className="p-6 space-y-6">
            {/* Image Upload */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Product Image
              </label>
              <div className="flex items-center space-x-4">
                <div className="w-24 h-24 border-2 border-dashed border-border rounded-lg flex items-center justify-center overflow-hidden">
                  {imagePreview ? (
                    <Image
                      src={imagePreview}
                      alt="Product preview"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <Icon name="ImagePlus" size={32} className="text-muted-foreground" />
                  )}
                </div>
                <div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    id="image-upload"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => document.getElementById('image-upload')?.click()}
                    iconName="Upload"
                    iconPosition="left"
                  >
                    Upload Image
                  </Button>
                  <p className="text-xs text-muted-foreground mt-1">
                    JPG, PNG up to 5MB
                  </p>
                </div>
              </div>
            </div>

            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="SKU"
                type="text"
                value={formData?.sku}
                onChange={(e) => handleInputChange('sku', e?.target?.value)}
                error={errors?.sku}
                placeholder="Enter product SKU"
                required
              />

              <Input
                label="Product Name"
                type="text"
                value={formData?.name}
                onChange={(e) => handleInputChange('name', e?.target?.value)}
                error={errors?.name}
                placeholder="Enter product name"
                required
              />

              <Select
                label="Category"
                options={categoryOptions}
                value={formData?.category}
                onChange={(value) => handleInputChange('category', value)}
                error={errors?.category}
                placeholder="Select category"
                required
              />

              <Select
                label="Unit of Measure"
                options={unitOptions}
                value={formData?.unitOfMeasure}
                onChange={(value) => handleInputChange('unitOfMeasure', value)}
                error={errors?.unitOfMeasure}
                placeholder="Select unit"
                required
              />
            </div>

            {/* Stock Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Current Stock"
                type="number"
                value={formData?.currentStock}
                onChange={(e) => handleInputChange('currentStock', e?.target?.value)}
                error={errors?.currentStock}
                placeholder="0"
                min="0"
                required
              />

              <Input
                label="MAUC (Moving Average Unit Cost)"
                type="number"
                step="0.01"
                value={formData?.mauc}
                onChange={(e) => handleInputChange('mauc', e?.target?.value)}
                error={errors?.mauc}
                placeholder="0.00"
                min="0"
                required
              />

              <Input
                label="Minimum Stock Level"
                type="number"
                value={formData?.minStockLevel}
                onChange={(e) => handleInputChange('minStockLevel', e?.target?.value)}
                error={errors?.minStockLevel}
                placeholder="10"
                min="0"
              />

              <Input
                label="Maximum Stock Level"
                type="number"
                value={formData?.maxStockLevel}
                onChange={(e) => handleInputChange('maxStockLevel', e?.target?.value)}
                error={errors?.maxStockLevel}
                placeholder="1000"
                min="1"
              />
            </div>

            {/* Additional Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Supplier"
                type="text"
                value={formData?.supplier}
                onChange={(e) => handleInputChange('supplier', e?.target?.value)}
                placeholder="Enter supplier name"
              />

              <Input
                label="Storage Location"
                type="text"
                value={formData?.location}
                onChange={(e) => handleInputChange('location', e?.target?.value)}
                placeholder="Enter storage location"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Description
              </label>
              <textarea
                value={formData?.description}
                onChange={(e) => handleInputChange('description', e?.target?.value)}
                placeholder="Enter product description..."
                rows={3}
                className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent resize-none"
              />
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end space-x-3 p-6 border-t border-border bg-muted/30">
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
              iconName="Save"
              iconPosition="left"
            >
              {product ? 'Update Product' : 'Add Product'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductModal;