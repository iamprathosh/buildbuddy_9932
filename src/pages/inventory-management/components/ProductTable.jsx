import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';

const ProductTable = ({ 
  products, 
  selectedProducts, 
  onSelectProduct, 
  onSelectAll, 
  onEditProduct, 
  onDeleteProduct, 
  onPullStock, 
  onReceiveStock, 
  onReturnStock,
  sortConfig,
  onSort 
}) => {
  const [expandedImage, setExpandedImage] = useState(null);

  const handleSort = (column) => {
    onSort(column);
  };

  const getSortIcon = (column) => {
    if (sortConfig?.key !== column) return 'ArrowUpDown';
    return sortConfig?.direction === 'asc' ? 'ArrowUp' : 'ArrowDown';
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    })?.format(amount);
  };

  const getStockStatusColor = (stock) => {
    if (stock <= 10) return 'text-error';
    if (stock <= 50) return 'text-warning';
    return 'text-success';
  };

  return (
    <div className="bg-card rounded-lg border border-border shadow-sm overflow-hidden">
      {/* Desktop Table View */}
      <div className="hidden lg:block overflow-x-auto">
        <table className="w-full">
          <thead className="bg-muted border-b border-border">
            <tr>
              <th className="w-12 px-4 py-3">
                <input
                  type="checkbox"
                  checked={selectedProducts?.length === products?.length && products?.length > 0}
                  onChange={onSelectAll}
                  className="rounded border-border focus:ring-2 focus:ring-ring"
                />
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                Image
              </th>
              {[
                { key: 'sku', label: 'SKU' },
                { key: 'name', label: 'Product Name' },
                { key: 'category', label: 'Category' },
                { key: 'unitOfMeasure', label: 'Unit' },
                { key: 'currentStock', label: 'Stock' },
                { key: 'mauc', label: 'MAUC' }
              ]?.map((column) => (
                <th
                  key={column?.key}
                  className="px-4 py-3 text-left text-sm font-medium text-muted-foreground cursor-pointer hover:text-foreground transition-colors"
                  onClick={() => handleSort(column?.key)}
                >
                  <div className="flex items-center space-x-2">
                    <span>{column?.label}</span>
                    <Icon name={getSortIcon(column?.key)} size={14} />
                  </div>
                </th>
              ))}
              <th className="px-4 py-3 text-right text-sm font-medium text-muted-foreground">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {products?.map((product) => (
              <tr key={product?.id} className="hover:bg-muted/50 transition-colors">
                <td className="px-4 py-4">
                  <input
                    type="checkbox"
                    checked={selectedProducts?.includes(product?.id)}
                    onChange={() => onSelectProduct(product?.id)}
                    className="rounded border-border focus:ring-2 focus:ring-ring"
                  />
                </td>
                <td className="px-4 py-4">
                  <div className="relative">
                    <Image
                      src={product?.image}
                      alt={product?.name}
                      className="w-12 h-12 rounded-md object-cover cursor-pointer hover:opacity-80 transition-opacity"
                      onClick={() => setExpandedImage(product?.image)}
                    />
                  </div>
                </td>
                <td className="px-4 py-4">
                  <span className="text-sm font-medium text-foreground">{product?.sku}</span>
                </td>
                <td className="px-4 py-4">
                  <span className="text-sm text-foreground">{product?.name}</span>
                </td>
                <td className="px-4 py-4">
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-secondary/10 text-secondary">
                    {product?.category}
                  </span>
                </td>
                <td className="px-4 py-4">
                  <span className="text-sm text-muted-foreground">{product?.unitOfMeasure}</span>
                </td>
                <td className="px-4 py-4">
                  <span className={`text-sm font-medium ${getStockStatusColor(product?.currentStock)}`}>
                    {product?.currentStock?.toLocaleString()}
                  </span>
                </td>
                <td className="px-4 py-4">
                  <span className="text-sm font-medium text-foreground">
                    {formatCurrency(product?.mauc)}
                  </span>
                </td>
                <td className="px-4 py-4">
                  <div className="flex items-center justify-end space-x-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onPullStock(product)}
                      className="text-warning hover:text-warning hover:bg-warning/10"
                    >
                      <Icon name="Minus" size={16} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onReceiveStock(product)}
                      className="text-success hover:text-success hover:bg-success/10"
                    >
                      <Icon name="Plus" size={16} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onReturnStock(product)}
                      className="text-accent hover:text-accent hover:bg-accent/10"
                    >
                      <Icon name="RotateCcw" size={16} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onEditProduct(product)}
                      className="text-muted-foreground hover:text-secondary"
                    >
                      <Icon name="Edit" size={16} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onDeleteProduct(product)}
                      className="text-muted-foreground hover:text-destructive"
                    >
                      <Icon name="Trash2" size={16} />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* Mobile Card View */}
      <div className="lg:hidden space-y-4 p-4">
        {products?.map((product) => (
          <div key={product?.id} className="bg-background rounded-lg border border-border p-4">
            <div className="flex items-start space-x-4">
              <input
                type="checkbox"
                checked={selectedProducts?.includes(product?.id)}
                onChange={() => onSelectProduct(product?.id)}
                className="mt-1 rounded border-border focus:ring-2 focus:ring-ring"
              />
              <Image
                src={product?.image}
                alt={product?.name}
                className="w-16 h-16 rounded-md object-cover flex-shrink-0"
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-sm font-medium text-foreground truncate">
                      {product?.name}
                    </h3>
                    <p className="text-xs text-muted-foreground mt-1">SKU: {product?.sku}</p>
                  </div>
                  <span className={`text-sm font-medium ${getStockStatusColor(product?.currentStock)}`}>
                    {product?.currentStock?.toLocaleString()}
                  </span>
                </div>
                
                <div className="flex items-center justify-between mt-3">
                  <div className="flex items-center space-x-4">
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-secondary/10 text-secondary">
                      {product?.category}
                    </span>
                    <span className="text-xs text-muted-foreground">{product?.unitOfMeasure}</span>
                  </div>
                  <span className="text-sm font-medium text-foreground">
                    {formatCurrency(product?.mauc)}
                  </span>
                </div>

                <div className="flex items-center justify-end space-x-2 mt-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onPullStock(product)}
                    iconName="Minus"
                    iconPosition="left"
                  >
                    Pull
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onReceiveStock(product)}
                    iconName="Plus"
                    iconPosition="left"
                  >
                    Receive
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onEditProduct(product)}
                    iconName="Edit"
                    iconPosition="left"
                  >
                    Edit
                  </Button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      {/* Image Expansion Modal */}
      {expandedImage && (
        <div className="fixed inset-0 bg-black bg-opacity-75 z-300 flex items-center justify-center p-4">
          <div className="relative max-w-3xl max-h-full">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setExpandedImage(null)}
              className="absolute -top-12 right-0 text-white hover:text-white hover:bg-white/20"
            >
              <Icon name="X" size={24} />
            </Button>
            <Image
              src={expandedImage}
              alt="Expanded product"
              className="max-w-full max-h-full rounded-lg"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductTable;