import React from 'react';

const StatusBadge = ({ status, size = 'default' }) => {
  const getStatusConfig = (status) => {
    switch (status?.toLowerCase()) {
      case 'active':
        return {
          label: 'Active',
          className: 'bg-success/10 text-success border-success/20',
          dotColor: 'bg-success'
        };
      case 'pending':
        return {
          label: 'Pending',
          className: 'bg-warning/10 text-warning border-warning/20',
          dotColor: 'bg-warning'
        };
      case 'completed':
        return {
          label: 'Completed',
          className: 'bg-accent/10 text-accent border-accent/20',
          dotColor: 'bg-accent'
        };
      case 'archived':
        return {
          label: 'Archived',
          className: 'bg-muted text-muted-foreground border-border',
          dotColor: 'bg-muted-foreground'
        };
      case 'on-hold':
        return {
          label: 'On Hold',
          className: 'bg-destructive/10 text-destructive border-destructive/20',
          dotColor: 'bg-destructive'
        };
      default:
        return {
          label: status,
          className: 'bg-muted text-muted-foreground border-border',
          dotColor: 'bg-muted-foreground'
        };
    }
  };

  const config = getStatusConfig(status);
  const sizeClasses = size === 'sm' ? 'px-2 py-1 text-xs' : 'px-3 py-1.5 text-sm';

  return (
    <span
      className={`
        inline-flex items-center space-x-1.5 rounded-full border font-medium
        ${config?.className} ${sizeClasses}
      `}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${config?.dotColor}`} />
      <span>{config?.label}</span>
    </span>
  );
};

export default StatusBadge;