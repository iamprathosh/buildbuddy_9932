import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';

const ProjectsOverview = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState('name');
  const [sortDirection, setSortDirection] = useState('asc');

  const projectsData = [
    {
      id: 1,
      name: 'Downtown Office Complex',
      jobNumber: 'JOB-2024-001',
      status: 'In Progress',
      customer: 'Metro Development Corp',
      startDate: '2024-08-15',
      completion: 65,
      budget: 2500000,
      spent: 1625000
    },
    {
      id: 2,
      name: 'Riverside Residential',
      jobNumber: 'JOB-2024-002',
      status: 'Planning',
      customer: 'Riverside Homes LLC',
      startDate: '2024-09-20',
      completion: 15,
      budget: 1800000,
      spent: 270000
    },
    {
      id: 3,
      name: 'Industrial Warehouse',
      jobNumber: 'JOB-2024-003',
      status: 'In Progress',
      customer: 'LogiCorp Industries',
      startDate: '2024-07-10',
      completion: 85,
      budget: 3200000,
      spent: 2720000
    },
    {
      id: 4,
      name: 'School Renovation',
      jobNumber: 'JOB-2024-004',
      status: 'Completed',
      customer: 'City School District',
      startDate: '2024-06-01',
      completion: 100,
      budget: 950000,
      spent: 925000
    },
    {
      id: 5,
      name: 'Shopping Center Phase 2',
      jobNumber: 'JOB-2024-005',
      status: 'On Hold',
      customer: 'Retail Partners Inc',
      startDate: '2024-08-30',
      completion: 25,
      budget: 4100000,
      spent: 1025000
    }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'Completed':
        return 'bg-success/10 text-success border-success/20';
      case 'In Progress':
        return 'bg-primary/10 text-primary border-primary/20';
      case 'Planning':
        return 'bg-warning/10 text-warning border-warning/20';
      case 'On Hold':
        return 'bg-error/10 text-error border-error/20';
      default:
        return 'bg-muted text-muted-foreground border-border';
    }
  };

  const getCompletionColor = (completion) => {
    if (completion >= 80) return 'bg-success';
    if (completion >= 50) return 'bg-primary';
    if (completion >= 25) return 'bg-warning';
    return 'bg-error';
  };

  const filteredProjects = projectsData?.filter(project =>
    project?.name?.toLowerCase()?.includes(searchTerm?.toLowerCase()) ||
    project?.jobNumber?.toLowerCase()?.includes(searchTerm?.toLowerCase()) ||
    project?.customer?.toLowerCase()?.includes(searchTerm?.toLowerCase())
  );

  const sortedProjects = [...filteredProjects]?.sort((a, b) => {
    const aValue = a?.[sortField];
    const bValue = b?.[sortField];
    
    if (sortDirection === 'asc') {
      return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
    } else {
      return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
    }
  });

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const handleProjectClick = (projectId) => {
    window.location.href = `/project-management?id=${projectId}`;
  };

  return (
    <div className="bg-card border border-border rounded-lg shadow-sm">
      <div className="p-6 border-b border-border">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h3 className="text-lg font-semibold text-foreground">Active Projects</h3>
            <p className="text-sm text-muted-foreground">Monitor project progress and status</p>
          </div>
          <div className="flex items-center space-x-3">
            <div className="w-64">
              <Input
                type="search"
                placeholder="Search projects..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e?.target?.value)}
                className="w-full"
              />
            </div>
            <Button
              variant="outline"
              onClick={() => window.location.href = '/project-management'}
              iconName="Plus"
              iconPosition="left"
            >
              New Project
            </Button>
          </div>
        </div>
      </div>
      {/* Desktop Table View */}
      <div className="hidden lg:block overflow-x-auto">
        <table className="w-full">
          <thead className="bg-muted/50">
            <tr>
              <th className="text-left p-4">
                <button
                  onClick={() => handleSort('name')}
                  className="flex items-center space-x-1 text-sm font-medium text-muted-foreground hover:text-foreground"
                >
                  <span>Project Name</span>
                  <Icon 
                    name={sortField === 'name' && sortDirection === 'desc' ? 'ChevronDown' : 'ChevronUp'} 
                    size={14} 
                  />
                </button>
              </th>
              <th className="text-left p-4">
                <button
                  onClick={() => handleSort('jobNumber')}
                  className="flex items-center space-x-1 text-sm font-medium text-muted-foreground hover:text-foreground"
                >
                  <span>Job Number</span>
                  <Icon 
                    name={sortField === 'jobNumber' && sortDirection === 'desc' ? 'ChevronDown' : 'ChevronUp'} 
                    size={14} 
                  />
                </button>
              </th>
              <th className="text-left p-4">
                <span className="text-sm font-medium text-muted-foreground">Status</span>
              </th>
              <th className="text-left p-4">
                <button
                  onClick={() => handleSort('customer')}
                  className="flex items-center space-x-1 text-sm font-medium text-muted-foreground hover:text-foreground"
                >
                  <span>Customer</span>
                  <Icon 
                    name={sortField === 'customer' && sortDirection === 'desc' ? 'ChevronDown' : 'ChevronUp'} 
                    size={14} 
                  />
                </button>
              </th>
              <th className="text-left p-4">
                <span className="text-sm font-medium text-muted-foreground">Progress</span>
              </th>
              <th className="text-left p-4">
                <span className="text-sm font-medium text-muted-foreground">Budget</span>
              </th>
              <th className="text-right p-4">
                <span className="text-sm font-medium text-muted-foreground">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {sortedProjects?.map((project) => (
              <tr key={project?.id} className="border-b border-border hover:bg-muted/30 transition-colors">
                <td className="p-4">
                  <button
                    onClick={() => handleProjectClick(project?.id)}
                    className="text-left hover:text-primary transition-colors"
                  >
                    <p className="font-medium text-foreground">{project?.name}</p>
                    <p className="text-sm text-muted-foreground">Started {new Date(project.startDate)?.toLocaleDateString()}</p>
                  </button>
                </td>
                <td className="p-4">
                  <span className="text-sm font-mono text-foreground">{project?.jobNumber}</span>
                </td>
                <td className="p-4">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(project?.status)}`}>
                    {project?.status}
                  </span>
                </td>
                <td className="p-4">
                  <span className="text-sm text-foreground">{project?.customer}</span>
                </td>
                <td className="p-4">
                  <div className="flex items-center space-x-3">
                    <div className="flex-1 bg-muted rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${getCompletionColor(project?.completion)}`}
                        style={{ width: `${project?.completion}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium text-foreground w-10">{project?.completion}%</span>
                  </div>
                </td>
                <td className="p-4">
                  <div className="text-sm">
                    <p className="text-foreground font-medium">${(project?.spent / 1000)?.toFixed(0)}K / ${(project?.budget / 1000)?.toFixed(0)}K</p>
                    <p className="text-muted-foreground">{((project?.spent / project?.budget) * 100)?.toFixed(0)}% spent</p>
                  </div>
                </td>
                <td className="p-4 text-right">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleProjectClick(project?.id)}
                    iconName="ExternalLink"
                    iconPosition="left"
                  >
                    View Details
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* Mobile Card View */}
      <div className="lg:hidden p-4 space-y-4">
        {sortedProjects?.map((project) => (
          <div key={project?.id} className="bg-muted/30 rounded-lg p-4 border border-border">
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <button
                  onClick={() => handleProjectClick(project?.id)}
                  className="text-left hover:text-primary transition-colors"
                >
                  <h4 className="font-medium text-foreground">{project?.name}</h4>
                  <p className="text-sm text-muted-foreground font-mono">{project?.jobNumber}</p>
                </button>
              </div>
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(project?.status)}`}>
                {project?.status}
              </span>
            </div>
            
            <div className="space-y-2 mb-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Customer:</span>
                <span className="text-foreground">{project?.customer}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Progress:</span>
                <div className="flex items-center space-x-2">
                  <div className="w-16 bg-muted rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${getCompletionColor(project?.completion)}`}
                      style={{ width: `${project?.completion}%` }}
                    ></div>
                  </div>
                  <span className="text-foreground font-medium">{project?.completion}%</span>
                </div>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Budget:</span>
                <span className="text-foreground">${(project?.spent / 1000)?.toFixed(0)}K / ${(project?.budget / 1000)?.toFixed(0)}K</span>
              </div>
            </div>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleProjectClick(project?.id)}
              iconName="ExternalLink"
              iconPosition="left"
              fullWidth
            >
              View Project Details
            </Button>
          </div>
        ))}
      </div>
      {sortedProjects?.length === 0 && (
        <div className="p-8 text-center">
          <Icon name="Search" size={48} className="mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium text-foreground mb-2">No projects found</h3>
          <p className="text-muted-foreground mb-4">Try adjusting your search terms or create a new project.</p>
          <Button
            variant="outline"
            onClick={() => window.location.href = '/project-management'}
            iconName="Plus"
            iconPosition="left"
          >
            Create New Project
          </Button>
        </div>
      )}
    </div>
  );
};

export default ProjectsOverview;