import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import StatusBadge from './StatusBadge';

const ProjectsTable = ({ 
  projects, 
  onEditProject, 
  onArchiveProject, 
  onViewProject,
  selectedProjects,
  onSelectProject,
  onSelectAll,
  sortConfig,
  onSort
}) => {
  const [hoveredRow, setHoveredRow] = useState(null);

  const handleSort = (column) => {
    const direction = sortConfig?.key === column && sortConfig?.direction === 'asc' ? 'desc' : 'asc';
    onSort({ key: column, direction });
  };

  const getSortIcon = (column) => {
    if (sortConfig?.key !== column) return 'ArrowUpDown';
    return sortConfig?.direction === 'asc' ? 'ArrowUp' : 'ArrowDown';
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    })?.format(amount);
  };

  const formatDate = (date) => {
    return new Date(date)?.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div className="bg-card rounded-lg border border-border shadow-sm overflow-hidden">
      {/* Desktop Table */}
      <div className="hidden lg:block overflow-x-auto">
        <table className="w-full">
          <thead className="bg-muted border-b border-border">
            <tr>
              <th className="w-12 px-4 py-3">
                <input
                  type="checkbox"
                  checked={selectedProjects?.length === projects?.length && projects?.length > 0}
                  onChange={(e) => onSelectAll(e?.target?.checked)}
                  className="rounded border-border focus:ring-2 focus:ring-ring"
                />
              </th>
              {[
                { key: 'name', label: 'Project Name' },
                { key: 'jobNumber', label: 'Job Number' },
                { key: 'customer', label: 'Customer' },
                { key: 'status', label: 'Status' },
                { key: 'budget', label: 'Budget' },
                { key: 'spent', label: 'Spent' },
                { key: 'startDate', label: 'Start Date' },
                { key: 'endDate', label: 'End Date' }
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
              <th className="w-24 px-4 py-3 text-center text-sm font-medium text-muted-foreground">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {projects?.map((project) => (
              <tr
                key={project?.id}
                className={`hover:bg-muted/50 transition-colors ${
                  selectedProjects?.includes(project?.id) ? 'bg-muted/30' : ''
                }`}
                onMouseEnter={() => setHoveredRow(project?.id)}
                onMouseLeave={() => setHoveredRow(null)}
              >
                <td className="px-4 py-4">
                  <input
                    type="checkbox"
                    checked={selectedProjects?.includes(project?.id)}
                    onChange={(e) => onSelectProject(project?.id, e?.target?.checked)}
                    className="rounded border-border focus:ring-2 focus:ring-ring"
                  />
                </td>
                <td className="px-4 py-4">
                  <button
                    onClick={() => onViewProject(project?.id)}
                    className="text-sm font-medium text-secondary hover:text-secondary/80 transition-colors"
                  >
                    {project?.name}
                  </button>
                </td>
                <td className="px-4 py-4 text-sm text-foreground font-mono">
                  {project?.jobNumber}
                </td>
                <td className="px-4 py-4">
                  <div>
                    <p className="text-sm font-medium text-foreground">{project?.customer?.name}</p>
                    <p className="text-xs text-muted-foreground">{project?.customer?.contact}</p>
                  </div>
                </td>
                <td className="px-4 py-4">
                  <StatusBadge status={project?.status} />
                </td>
                <td className="px-4 py-4 text-sm font-medium text-foreground">
                  {formatCurrency(project?.budget)}
                </td>
                <td className="px-4 py-4">
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-foreground">
                      {formatCurrency(project?.spent)}
                    </span>
                    <div className="w-16 bg-muted rounded-full h-1.5 mt-1">
                      <div
                        className={`h-1.5 rounded-full transition-all ${
                          (project?.spent / project?.budget) > 0.9 
                            ? 'bg-destructive' 
                            : (project?.spent / project?.budget) > 0.7 
                            ? 'bg-warning' :'bg-success'
                        }`}
                        style={{ width: `${Math.min((project?.spent / project?.budget) * 100, 100)}%` }}
                      />
                    </div>
                  </div>
                </td>
                <td className="px-4 py-4 text-sm text-muted-foreground">
                  {formatDate(project?.startDate)}
                </td>
                <td className="px-4 py-4 text-sm text-muted-foreground">
                  {project?.endDate ? formatDate(project?.endDate) : 'Ongoing'}
                </td>
                <td className="px-4 py-4">
                  <div className="flex items-center space-x-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onEditProject(project)}
                      className="h-8 w-8"
                    >
                      <Icon name="Edit2" size={14} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onArchiveProject(project?.id)}
                      className="h-8 w-8 text-muted-foreground hover:text-destructive"
                    >
                      <Icon name="Archive" size={14} />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* Mobile Cards */}
      <div className="lg:hidden space-y-4 p-4">
        {projects?.map((project) => (
          <div
            key={project?.id}
            className={`bg-card border border-border rounded-lg p-4 ${
              selectedProjects?.includes(project?.id) ? 'ring-2 ring-ring' : ''
            }`}
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-start space-x-3">
                <input
                  type="checkbox"
                  checked={selectedProjects?.includes(project?.id)}
                  onChange={(e) => onSelectProject(project?.id, e?.target?.checked)}
                  className="mt-1 rounded border-border focus:ring-2 focus:ring-ring"
                />
                <div>
                  <button
                    onClick={() => onViewProject(project?.id)}
                    className="text-sm font-medium text-secondary hover:text-secondary/80 transition-colors"
                  >
                    {project?.name}
                  </button>
                  <p className="text-xs text-muted-foreground font-mono mt-1">
                    {project?.jobNumber}
                  </p>
                </div>
              </div>
              <StatusBadge status={project?.status} />
            </div>

            <div className="space-y-2 mb-4">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Customer:</span>
                <span className="font-medium text-foreground">{project?.customer?.name}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Budget:</span>
                <span className="font-medium text-foreground">{formatCurrency(project?.budget)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Spent:</span>
                <span className="font-medium text-foreground">{formatCurrency(project?.spent)}</span>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div
                  className={`h-2 rounded-full transition-all ${
                    (project?.spent / project?.budget) > 0.9 
                      ? 'bg-destructive' 
                      : (project?.spent / project?.budget) > 0.7 
                      ? 'bg-warning' :'bg-success'
                  }`}
                  style={{ width: `${Math.min((project?.spent / project?.budget) * 100, 100)}%` }}
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="text-xs text-muted-foreground">
                Started: {formatDate(project?.startDate)}
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onEditProject(project)}
                  iconName="Edit2"
                  iconPosition="left"
                >
                  Edit
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onArchiveProject(project?.id)}
                  className="text-muted-foreground hover:text-destructive"
                >
                  <Icon name="Archive" size={16} />
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
      {/* Empty State */}
      {projects?.length === 0 && (
        <div className="text-center py-12">
          <Icon name="FolderOpen" size={48} className="mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium text-foreground mb-2">No projects found</h3>
          <p className="text-muted-foreground">
            Create your first project to get started with project management.
          </p>
        </div>
      )}
    </div>
  );
};

export default ProjectsTable;