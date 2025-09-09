import React from 'react';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import Button from '../../../components/ui/Button';


const ProjectFilters = ({
  searchTerm,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  customerFilter,
  onCustomerFilterChange,
  onClearFilters,
  customers
}) => {
  const statusOptions = [
    { value: 'all', label: 'All Statuses' },
    { value: 'active', label: 'Active' },
    { value: 'pending', label: 'Pending' },
    { value: 'completed', label: 'Completed' },
    { value: 'on-hold', label: 'On Hold' },
    { value: 'archived', label: 'Archived' }
  ];

  const customerOptions = [
    { value: 'all', label: 'All Customers' },
    ...customers?.map(customer => ({
      value: customer?.id,
      label: customer?.name
    }))
  ];

  const hasActiveFilters = searchTerm || statusFilter !== 'all' || customerFilter !== 'all';

  return (
    <div className="bg-card rounded-lg border border-border p-4 mb-6">
      <div className="flex flex-col lg:flex-row lg:items-end gap-4">
        {/* Search Input */}
        <div className="flex-1 lg:max-w-md">
          <Input
            type="search"
            label="Search Projects"
            placeholder="Search by project name or job number..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e?.target?.value)}
            className="w-full"
          />
        </div>

        {/* Status Filter */}
        <div className="lg:w-48">
          <Select
            label="Status"
            options={statusOptions}
            value={statusFilter}
            onChange={onStatusFilterChange}
          />
        </div>

        {/* Customer Filter */}
        <div className="lg:w-56">
          <Select
            label="Customer"
            options={customerOptions}
            value={customerFilter}
            onChange={onCustomerFilterChange}
            searchable
          />
        </div>

        {/* Clear Filters Button */}
        {hasActiveFilters && (
          <div className="lg:w-auto">
            <Button
              variant="outline"
              onClick={onClearFilters}
              iconName="X"
              iconPosition="left"
              className="w-full lg:w-auto"
            >
              Clear Filters
            </Button>
          </div>
        )}
      </div>
      {/* Active Filters Summary */}
      {hasActiveFilters && (
        <div className="mt-4 pt-4 border-t border-border">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-sm text-muted-foreground">Active filters:</span>
            {searchTerm && (
              <span className="inline-flex items-center px-2 py-1 rounded-md bg-muted text-sm">
                Search: "{searchTerm}"
              </span>
            )}
            {statusFilter !== 'all' && (
              <span className="inline-flex items-center px-2 py-1 rounded-md bg-muted text-sm">
                Status: {statusOptions?.find(opt => opt?.value === statusFilter)?.label}
              </span>
            )}
            {customerFilter !== 'all' && (
              <span className="inline-flex items-center px-2 py-1 rounded-md bg-muted text-sm">
                Customer: {customerOptions?.find(opt => opt?.value === customerFilter)?.label}
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectFilters;