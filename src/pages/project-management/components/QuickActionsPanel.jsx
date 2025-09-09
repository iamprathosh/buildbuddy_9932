import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const QuickActionsPanel = ({ 
  onGenerateReport, 
  onViewBudgetSummary, 
  onViewMaterialAllocation,
  onImportProjects,
  onExportAll
}) => {
  const quickActions = [
    {
      id: 'report',
      label: 'Generate Report',
      description: 'Create project status report',
      icon: 'FileText',
      color: 'text-accent',
      bgColor: 'bg-accent/10',
      onClick: onGenerateReport
    },
    {
      id: 'budget',
      label: 'Budget Summary',
      description: 'View budget allocation overview',
      icon: 'DollarSign',
      color: 'text-success',
      bgColor: 'bg-success/10',
      onClick: onViewBudgetSummary
    },
    {
      id: 'materials',
      label: 'Material Allocation',
      description: 'Check material assignments',
      icon: 'Package',
      color: 'text-warning',
      bgColor: 'bg-warning/10',
      onClick: onViewMaterialAllocation
    },
    {
      id: 'import',
      label: 'Import Projects',
      description: 'Import from CSV file',
      icon: 'Upload',
      color: 'text-secondary',
      bgColor: 'bg-secondary/10',
      onClick: onImportProjects
    }
  ];

  return (
    <div className="bg-card rounded-lg border border-border p-4 mb-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-medium text-foreground">Quick Actions</h3>
          <p className="text-sm text-muted-foreground">
            Common project management tasks
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={onExportAll}
          iconName="Download"
          iconPosition="left"
        >
          Export All
        </Button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {quickActions?.map((action) => (
          <button
            key={action?.id}
            onClick={action?.onClick}
            className="flex items-center space-x-3 p-3 rounded-lg border border-border hover:border-ring hover:shadow-sm transition-all duration-200 text-left group"
          >
            <div className={`flex items-center justify-center w-10 h-10 rounded-lg ${action?.bgColor} group-hover:scale-110 transition-transform`}>
              <Icon name={action?.icon} size={18} className={action?.color} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground group-hover:text-secondary transition-colors">
                {action?.label}
              </p>
              <p className="text-xs text-muted-foreground truncate">
                {action?.description}
              </p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default QuickActionsPanel;