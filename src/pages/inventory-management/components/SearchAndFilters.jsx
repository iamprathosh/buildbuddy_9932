import React from 'react';
import Icon from '../../../components/AppIcon';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import Button from '../../../components/ui/Button';

const SearchAndFilters = ({
  searchTerm,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
  categories,
  resultsCount,
  onClearFilters,
  onExportCSV
}) => {
  const categoryOptions = [
    { value: '', label: 'All Categories' },
    ...categories?.map(category => ({
      value: category,
      label: category
    }))
  ];

  const hasActiveFilters = searchTerm || selectedCategory;

  return (
    <div className="bg-card rounded-lg border border-border p-6 mb-6">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0 lg:space-x-4">
        {/* Search and Filter Controls */}
        <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 flex-1">
          {/* Search Input */}
          <div className="flex-1 max-w-md">
            <Input
              type="search"
              placeholder="Search by product name or SKU..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e?.target?.value)}
              className="w-full"
            />
          </div>

          {/* Category Filter */}
          <div className="w-full sm:w-48">
            <Select
              options={categoryOptions}
              value={selectedCategory}
              onChange={onCategoryChange}
              placeholder="Filter by category"
              className="w-full"
            />
          </div>

          {/* Clear Filters Button */}
          {hasActiveFilters && (
            <Button
              variant="outline"
              onClick={onClearFilters}
              iconName="X"
              iconPosition="left"
              className="whitespace-nowrap"
            >
              Clear Filters
            </Button>
          )}
        </div>

        {/* Results Count and Export */}
        <div className="flex items-center justify-between lg:justify-end space-x-4">
          <div className="text-sm text-muted-foreground">
            {resultsCount} {resultsCount === 1 ? 'product' : 'products'} found
          </div>
          
          <Button
            variant="outline"
            onClick={onExportCSV}
            iconName="Download"
            iconPosition="left"
            className="whitespace-nowrap"
          >
            Export CSV
          </Button>
        </div>
      </div>
      {/* Active Filters Display */}
      {hasActiveFilters && (
        <div className="flex items-center space-x-2 mt-4 pt-4 border-t border-border">
          <span className="text-sm text-muted-foreground">Active filters:</span>
          
          {searchTerm && (
            <div className="inline-flex items-center space-x-1 px-3 py-1 bg-secondary/10 text-secondary rounded-full text-sm">
              <Icon name="Search" size={14} />
              <span>"{searchTerm}"</span>
              <button
                onClick={() => onSearchChange('')}
                className="ml-1 hover:text-secondary/80"
              >
                <Icon name="X" size={12} />
              </button>
            </div>
          )}
          
          {selectedCategory && (
            <div className="inline-flex items-center space-x-1 px-3 py-1 bg-accent/10 text-accent rounded-full text-sm">
              <Icon name="Tag" size={14} />
              <span>{selectedCategory}</span>
              <button
                onClick={() => onCategoryChange('')}
                className="ml-1 hover:text-accent/80"
              >
                <Icon name="X" size={12} />
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchAndFilters;