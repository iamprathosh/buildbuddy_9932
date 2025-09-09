import React, { useState, useEffect, useMemo } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { inventoryService } from '../../services/inventoryService';
import { projectService } from '../../services/projectService';
import Header from '../../components/ui/Header';
import Sidebar from '../../components/ui/Sidebar';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import SearchAndFilters from './components/SearchAndFilters';
import BulkActions from './components/BulkActions';
import ProductTable from './components/ProductTable';
import ProductModal from './components/ProductModal';
import StockTransactionModal from './components/StockTransactionModal';

const InventoryManagement = () => {
  const { user, userProfile, loading: authLoading } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [sortConfig, setSortConfig] = useState({ key: 'name', direction: 'asc' });
  const [showProductModal, setShowProductModal] = useState(false);
  const [showStockModal, setShowStockModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [stockTransaction, setStockTransaction] = useState({ product: null, type: 'pull' });

  // Data state
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const unitsOfMeasure = ['Pieces', 'Bags', 'Tons', 'Feet', 'Sheets', 'Gallons', 'Pounds', 'Yards'];

  // Load data from Supabase
  useEffect(() => {
    if (!authLoading && user) {
      loadData();
    }
  }, [user, authLoading]);

  const loadData = async () => {
    setLoading(true);
    setError('');

    try {
      // Load products
      const { data: productsData, error: productsError } = await inventoryService?.getAllProducts();
      if (productsError) {
        setError(`Failed to load products: ${productsError}`);
        return;
      }

      // Load categories
      const { data: categoriesData, error: categoriesError } = await inventoryService?.getAllCategories();
      if (categoriesError) {
        setError(`Failed to load categories: ${categoriesError}`);
        return;
      }

      // Load projects (for stock transactions)
      const { data: projectsData, error: projectsError } = await projectService?.getAllProjects();
      if (projectsError) {
        setError(`Failed to load projects: ${projectsError}`);
        return;
      }

      setProducts(productsData || []);
      setCategories(categoriesData || []);
      setProjects(projectsData || []);
    } catch (error) {
      setError(`Unexpected error: ${error?.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Filter and sort products
  const filteredAndSortedProducts = useMemo(() => {
    if (!products) return [];

    let filtered = products?.filter(product => {
      const matchesSearch = !searchTerm || 
        product?.name?.toLowerCase()?.includes(searchTerm?.toLowerCase()) ||
        product?.sku?.toLowerCase()?.includes(searchTerm?.toLowerCase());
      
      const matchesCategory = !selectedCategory || product?.category?.name === selectedCategory;
      
      return matchesSearch && matchesCategory;
    });

    // Sort products
    filtered?.sort((a, b) => {
      const aValue = a?.[sortConfig?.key];
      const bValue = b?.[sortConfig?.key];
      
      if (typeof aValue === 'string') {
        return sortConfig?.direction === 'asc' ? aValue?.localeCompare(bValue ||'')
          : (bValue || '')?.localeCompare(aValue || '');
      }
      
      return sortConfig?.direction === 'asc' 
        ? (aValue || 0) - (bValue || 0) 
        : (bValue || 0) - (aValue || 0);
    });

    return filtered || [];
  }, [products, searchTerm, selectedCategory, sortConfig]);

  const handleSort = (key) => {
    setSortConfig(prev => ({
      key,
      direction: prev?.key === key && prev?.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const handleSelectProduct = (productId) => {
    setSelectedProducts(prev => 
      prev?.includes(productId)
        ? prev?.filter(id => id !== productId)
        : [...prev, productId]
    );
  };

  const handleSelectAll = () => {
    setSelectedProducts(prev => 
      prev?.length === filteredAndSortedProducts?.length 
        ? [] 
        : filteredAndSortedProducts?.map(p => p?.id) || []
    );
  };

  const handleClearFilters = () => {
    setSearchTerm('');
    setSelectedCategory('');
  };

  const handleExportCSV = () => {
    const csvData = filteredAndSortedProducts?.map(product => ({
      SKU: product?.sku || '',
      Name: product?.name || '',
      Category: product?.category?.name || '',
      'Unit of Measure': product?.unit_of_measure || '',
      'Current Stock': product?.current_stock || 0,
      'MAUC': product?.mauc || 0,
      'Min Stock': product?.min_stock_level || 0,
      'Max Stock': product?.max_stock_level || 0,
      Supplier: product?.supplier || '',
      Location: product?.location || ''
    }));

    const csvContent = [
      Object.keys(csvData?.[0] || [])?.join(','),
      ...(csvData?.map(row => Object.values(row)) || [])
    ]?.join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL?.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `inventory-export-${new Date()?.toISOString()?.split('T')?.[0]}.csv`;
    a?.click();
    window.URL?.revokeObjectURL(url);
  };

  const handleBulkExport = () => {
    const selectedProductsData = products?.filter(p => selectedProducts?.includes(p?.id));
    console.log('Exporting selected products:', selectedProductsData);
  };

  const handleBulkDelete = async () => {
    if (!confirm(`Are you sure you want to delete ${selectedProducts?.length} selected products?`)) {
      return;
    }

    try {
      // Delete selected products
      for (const productId of selectedProducts) {
        const { error } = await inventoryService?.deleteProduct(productId);
        if (error) {
          setError(`Failed to delete product: ${error}`);
          return;
        }
      }
      
      setSelectedProducts([]);
      await loadData(); // Reload data
    } catch (error) {
      setError(`Failed to delete products: ${error?.message}`);
    }
  };

  const handleBulkCategoryUpdate = async (newCategoryId) => {
    try {
      // Update category for selected products
      for (const productId of selectedProducts) {
        const { error } = await inventoryService?.updateProduct(productId, { category_id: newCategoryId });
        if (error) {
          setError(`Failed to update product category: ${error}`);
          return;
        }
      }
      
      setSelectedProducts([]);
      await loadData(); // Reload data
    } catch (error) {
      setError(`Failed to update categories: ${error?.message}`);
    }
  };

  const handleAddProduct = () => {
    setEditingProduct(null);
    setShowProductModal(true);
  };

  const handleEditProduct = (product) => {
    setEditingProduct(product);
    setShowProductModal(true);
  };

  const handleDeleteProduct = async (product) => {
    if (!window.confirm(`Are you sure you want to delete "${product?.name}"? This action cannot be undone.`)) {
      return;
    }

    try {
      const { error } = await inventoryService?.deleteProduct(product?.id);
      if (error) {
        setError(error);
        return;
      }
      
      await loadData(); // Reload data
    } catch (error) {
      setError(`Failed to delete product: ${error?.message}`);
    }
  };

  const handleSaveProduct = async (productData) => {
    try {
      if (editingProduct) {
        const { error } = await inventoryService?.updateProduct(editingProduct?.id, productData);
        if (error) {
          setError(error);
          return;
        }
      } else {
        const { error } = await inventoryService?.createProduct(productData);
        if (error) {
          setError(error);
          return;
        }
      }
      
      setShowProductModal(false);
      setEditingProduct(null);
      await loadData(); // Reload data
    } catch (error) {
      setError(`Failed to save product: ${error?.message}`);
    }
  };

  const handleStockTransaction = (product, type) => {
    setStockTransaction({ product, type });
    setShowStockModal(true);
  };

  const handleSaveStockTransaction = async (transactionData) => {
    try {
      const { error } = await inventoryService?.createStockTransaction({
        ...transactionData,
        user_id: user?.id
      });
      
      if (error) {
        setError(error);
        return;
      }
      
      setShowStockModal(false);
      await loadData(); // Reload to get updated stock levels
    } catch (error) {
      setError(`Failed to save stock transaction: ${error?.message}`);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex items-center space-x-2">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
          <span className="text-muted-foreground">Loading inventory...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Icon name="AlertCircle" size={48} className="text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-foreground mb-2">Error Loading Data</h3>
          <p className="text-muted-foreground mb-4">{error}</p>
          <Button onClick={loadData} iconName="RefreshCw" iconPosition="left">
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header 
        isCollapsed={false}
        onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
      />
      <Sidebar 
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        userRole={userProfile?.role || 'worker'}
      />
      <main className="lg:ml-60 pt-16">
        <div className="p-6">
          {/* Page Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
            <div>
              <h1 className="text-2xl font-bold text-foreground">Inventory Management</h1>
              <p className="text-muted-foreground mt-1">
                Manage products, track stock levels, and handle inventory transactions
              </p>
            </div>
            
            <div className="flex items-center space-x-3 mt-4 sm:mt-0">
              <Button
                variant="outline"
                onClick={() => handleStockTransaction(null, 'pull')}
                iconName="Minus"
                iconPosition="left"
              >
                Pull Stock
              </Button>
              <Button
                variant="outline"
                onClick={() => handleStockTransaction(null, 'receive')}
                iconName="Plus"
                iconPosition="left"
              >
                Receive Stock
              </Button>
              <Button
                variant="outline"
                onClick={() => handleStockTransaction(null, 'return')}
                iconName="RotateCcw"
                iconPosition="left"
              >
                Return Stock
              </Button>
              {(userProfile?.role === 'super_admin' || userProfile?.role === 'project_manager') && (
                <Button
                  onClick={handleAddProduct}
                  iconName="Plus"
                  iconPosition="left"
                >
                  Add Product
                </Button>
              )}
            </div>
          </div>

          {/* Search and Filters */}
          <SearchAndFilters
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
            categories={categories?.map(cat => cat?.name) || []}
            resultsCount={filteredAndSortedProducts?.length || 0}
            onClearFilters={handleClearFilters}
            onExportCSV={handleExportCSV}
          />

          {/* Bulk Actions */}
          {selectedProducts?.length > 0 && (userProfile?.role === 'super_admin' || userProfile?.role === 'project_manager') && (
            <BulkActions
              selectedCount={selectedProducts?.length}
              onBulkDelete={handleBulkDelete}
              onBulkCategoryUpdate={handleBulkCategoryUpdate}
              onBulkExport={handleBulkExport}
              categories={categories?.map(cat => cat?.name) || []}
            />
          )}

          {/* Products Table */}
          <ProductTable
            products={filteredAndSortedProducts}
            selectedProducts={selectedProducts}
            onSelectProduct={handleSelectProduct}
            onSelectAll={handleSelectAll}
            onEditProduct={handleEditProduct}
            onDeleteProduct={handleDeleteProduct}
            onPullStock={(product) => handleStockTransaction(product, 'pull')}
            onReceiveStock={(product) => handleStockTransaction(product, 'receive')}
            onReturnStock={(product) => handleStockTransaction(product, 'return')}
            sortConfig={sortConfig}
            onSort={handleSort}
            canManage={userProfile?.role === 'super_admin' || userProfile?.role === 'project_manager'}
          />

          {/* Empty State */}
          {filteredAndSortedProducts?.length === 0 && (
            <div className="text-center py-12">
              <Icon name="Package" size={48} className="text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium text-foreground mb-2">No products found</h3>
              <p className="text-muted-foreground mb-6">
                {searchTerm || selectedCategory 
                  ? 'Try adjusting your search or filter criteria' :'Get started by adding your first product to inventory'
                }
              </p>
              {!searchTerm && !selectedCategory && (userProfile?.role === 'super_admin' || userProfile?.role === 'project_manager') && (
                <Button onClick={handleAddProduct} iconName="Plus" iconPosition="left">
                  Add Your First Product
                </Button>
              )}
            </div>
          )}
        </div>
      </main>
      
      {/* Product Modal */}
      <ProductModal
        isOpen={showProductModal}
        onClose={() => {
          setShowProductModal(false);
          setEditingProduct(null);
        }}
        product={editingProduct}
        onSave={handleSaveProduct}
        categories={categories}
        unitsOfMeasure={unitsOfMeasure}
      />
      
      {/* Stock Transaction Modal */}
      <StockTransactionModal
        isOpen={showStockModal}
        onClose={() => setShowStockModal(false)}
        product={stockTransaction?.product}
        transactionType={stockTransaction?.type}
        onSave={handleSaveStockTransaction}
        projects={projects}
        products={products}
      />
    </div>
  );
};

export default InventoryManagement;