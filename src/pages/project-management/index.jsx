import React, { useState, useEffect, useMemo } from 'react';
import Header from '../../components/ui/Header';
import Sidebar from '../../components/ui/Sidebar';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import ProjectsTable from './components/ProjectsTable';

import ProjectFilters from './components/ProjectFilters';
import CreateProjectModal from './components/CreateProjectModal';
import EditProjectModal from './components/EditProjectModal';
import BulkActionsBar from './components/BulkActionsBar';
import QuickActionsPanel from './components/QuickActionsPanel';

const ProjectManagement = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [projects, setProjects] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [customerFilter, setCustomerFilter] = useState('all');
  
  // Modal states
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  
  // Selection states
  const [selectedProjects, setSelectedProjects] = useState([]);
  
  // Sorting state
  const [sortConfig, setSortConfig] = useState({ key: 'name', direction: 'asc' });

  // Mock data initialization
  useEffect(() => {
    const initializeData = () => {
      // Mock customers data
      const mockCustomers = [
        {
          id: 'cust_001',
          name: 'ABC Construction Corp',
          contact: 'john.smith@abcconstruction.com',
          phone: '(555) 123-4567'
        },
        {
          id: 'cust_002',
          name: 'Metro Development LLC',
          contact: 'sarah.johnson@metrodev.com',
          phone: '(555) 234-5678'
        },
        {
          id: 'cust_003',
          name: 'Riverside Properties',
          contact: 'mike.wilson@riverside.com',
          phone: '(555) 345-6789'
        },
        {
          id: 'cust_004',
          name: 'Urban Planning Associates',
          contact: 'lisa.brown@urbanplanning.com',
          phone: '(555) 456-7890'
        },
        {
          id: 'cust_005',
          name: 'Greenfield Developments',
          contact: 'david.garcia@greenfield.com',
          phone: '(555) 567-8901'
        }
      ];

      // Mock projects data
      const mockProjects = [
        {
          id: 'proj_001',
          name: 'Downtown Office Complex',
          jobNumber: 'JOB-2024-001',
          customer: {
            id: 'cust_001',
            name: 'ABC Construction Corp',
            contact: 'john.smith@abcconstruction.com'
          },
          status: 'active',
          priority: 'high',
          budget: 2500000,
          spent: 1875000,
          startDate: '2024-01-15',
          endDate: '2024-12-30',
          location: '123 Main Street, Downtown',
          contactPerson: 'John Smith',
          contactPhone: '(555) 123-4567',
          contactEmail: 'john.smith@abcconstruction.com',
          description: 'Modern 15-story office building with retail space',
          createdAt: '2024-01-10T08:00:00Z',
          updatedAt: '2024-09-09T16:30:00Z'
        },
        {
          id: 'proj_002',
          name: 'Residential Tower Phase 1',
          jobNumber: 'JOB-2024-002',
          customer: {
            id: 'cust_002',
            name: 'Metro Development LLC',
            contact: 'sarah.johnson@metrodev.com'
          },
          status: 'active',
          priority: 'medium',
          budget: 4200000,
          spent: 2940000,
          startDate: '2024-02-01',
          endDate: '2025-03-15',
          location: '456 Oak Avenue, Midtown',
          contactPerson: 'Sarah Johnson',
          contactPhone: '(555) 234-5678',
          contactEmail: 'sarah.johnson@metrodev.com',
          description: '25-story luxury residential tower with amenities',
          createdAt: '2024-01-25T09:15:00Z',
          updatedAt: '2024-09-09T14:20:00Z'
        },
        {
          id: 'proj_003',
          name: 'Riverside Shopping Center',
          jobNumber: 'JOB-2024-003',
          customer: {
            id: 'cust_003',
            name: 'Riverside Properties',
            contact: 'mike.wilson@riverside.com'
          },
          status: 'pending',
          priority: 'medium',
          budget: 1800000,
          spent: 0,
          startDate: '2024-10-01',
          endDate: '2025-08-30',
          location: '789 River Road, Westside',
          contactPerson: 'Mike Wilson',
          contactPhone: '(555) 345-6789',
          contactEmail: 'mike.wilson@riverside.com',
          description: 'Mixed-use retail and dining complex',
          createdAt: '2024-08-15T10:30:00Z',
          updatedAt: '2024-09-05T11:45:00Z'
        },
        {
          id: 'proj_004',
          name: 'City Hall Renovation',
          jobNumber: 'JOB-2024-004',
          customer: {
            id: 'cust_004',
            name: 'Urban Planning Associates',
            contact: 'lisa.brown@urbanplanning.com'
          },
          status: 'completed',
          priority: 'high',
          budget: 950000,
          spent: 925000,
          startDate: '2024-03-01',
          endDate: '2024-08-15',
          location: '100 Government Plaza, City Center',
          contactPerson: 'Lisa Brown',
          contactPhone: '(555) 456-7890',
          contactEmail: 'lisa.brown@urbanplanning.com',
          description: 'Historic building restoration and modernization',
          createdAt: '2024-02-20T13:00:00Z',
          updatedAt: '2024-08-15T17:30:00Z'
        },
        {
          id: 'proj_005',
          name: 'Suburban Housing Development',
          jobNumber: 'JOB-2024-005',
          customer: {
            id: 'cust_005',
            name: 'Greenfield Developments',
            contact: 'david.garcia@greenfield.com'
          },
          status: 'on-hold',
          priority: 'low',
          budget: 3600000,
          spent: 720000,
          startDate: '2024-04-15',
          endDate: null,
          location: '200 Maple Street, Suburbs',
          contactPerson: 'David Garcia',
          contactPhone: '(555) 567-8901',
          contactEmail: 'david.garcia@greenfield.com',
          description: '50-unit single-family home community',
          createdAt: '2024-04-01T08:45:00Z',
          updatedAt: '2024-07-20T16:15:00Z'
        },
        {
          id: 'proj_006',
          name: 'Industrial Warehouse Complex',
          jobNumber: 'JOB-2024-006',
          customer: {
            id: 'cust_001',
            name: 'ABC Construction Corp',
            contact: 'john.smith@abcconstruction.com'
          },
          status: 'active',
          priority: 'medium',
          budget: 2100000,
          spent: 1260000,
          startDate: '2024-05-01',
          endDate: '2024-11-30',
          location: '500 Industrial Drive, East Side',
          contactPerson: 'John Smith',
          contactPhone: '(555) 123-4567',
          contactEmail: 'john.smith@abcconstruction.com',
          description: 'Multi-unit warehouse and distribution facility',
          createdAt: '2024-04-20T12:00:00Z',
          updatedAt: '2024-09-08T15:45:00Z'
        },
        {
          id: 'proj_007',
          name: 'Medical Center Expansion',
          jobNumber: 'JOB-2024-007',
          customer: {
            id: 'cust_002',
            name: 'Metro Development LLC',
            contact: 'sarah.johnson@metrodev.com'
          },
          status: 'archived',
          priority: 'urgent',
          budget: 5200000,
          spent: 5150000,
          startDate: '2023-06-01',
          endDate: '2024-05-30',
          location: '300 Health Boulevard, Medical District',
          contactPerson: 'Sarah Johnson',
          contactPhone: '(555) 234-5678',
          contactEmail: 'sarah.johnson@metrodev.com',
          description: 'New wing addition with advanced medical facilities',
          createdAt: '2023-05-15T09:30:00Z',
          updatedAt: '2024-05-30T18:00:00Z'
        }
      ];

      setCustomers(mockCustomers);
      setProjects(mockProjects);
      setLoading(false);
    };

    initializeData();
  }, []);

  // Filtered and sorted projects
  const filteredAndSortedProjects = useMemo(() => {
    let filtered = projects?.filter(project => {
      const matchesSearch = !searchTerm || 
        project?.name?.toLowerCase()?.includes(searchTerm?.toLowerCase()) ||
        project?.jobNumber?.toLowerCase()?.includes(searchTerm?.toLowerCase());
      
      const matchesStatus = statusFilter === 'all' || project?.status === statusFilter;
      
      const matchesCustomer = customerFilter === 'all' || project?.customer?.id === customerFilter;
      
      return matchesSearch && matchesStatus && matchesCustomer;
    });

    // Sort projects
    filtered?.sort((a, b) => {
      let aValue = a?.[sortConfig?.key];
      let bValue = b?.[sortConfig?.key];

      // Handle nested customer name sorting
      if (sortConfig?.key === 'customer') {
        aValue = a?.customer?.name;
        bValue = b?.customer?.name;
      }

      // Handle date sorting
      if (sortConfig?.key === 'startDate' || sortConfig?.key === 'endDate') {
        aValue = new Date(aValue || 0);
        bValue = new Date(bValue || 0);
      }

      // Handle numeric sorting
      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return sortConfig?.direction === 'asc' ? aValue - bValue : bValue - aValue;
      }

      // Handle string sorting
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sortConfig?.direction === 'asc' 
          ? aValue?.localeCompare(bValue)
          : bValue?.localeCompare(aValue);
      }

      return 0;
    });

    return filtered;
  }, [projects, searchTerm, statusFilter, customerFilter, sortConfig]);

  // Event handlers
  const handleCreateProject = async (projectData) => {
    setProjects(prev => [...prev, projectData]);
  };

  const handleUpdateProject = async (updatedProject) => {
    setProjects(prev => prev?.map(p => p?.id === updatedProject?.id ? updatedProject : p));
    setEditingProject(null);
  };

  const handleArchiveProject = (projectId) => {
    setProjects(prev => prev?.map(p => 
      p?.id === projectId ? { ...p, status: 'archived', updatedAt: new Date()?.toISOString() } : p
    ));
  };

  const handleViewProject = (projectId) => {
    // Navigate to project analytics page
    window.location.href = `/project-analytics/${projectId}`;
  };

  const handleEditProject = (project) => {
    setEditingProject(project);
    setShowEditModal(true);
  };

  const handleSelectProject = (projectId, isSelected) => {
    if (isSelected) {
      setSelectedProjects(prev => [...prev, projectId]);
    } else {
      setSelectedProjects(prev => prev?.filter(id => id !== projectId));
    }
  };

  const handleSelectAll = (isSelected) => {
    if (isSelected) {
      setSelectedProjects(filteredAndSortedProjects?.map(p => p?.id));
    } else {
      setSelectedProjects([]);
    }
  };

  const handleBulkStatusUpdate = (newStatus) => {
    setProjects(prev => prev?.map(p => 
      selectedProjects?.includes(p?.id) 
        ? { ...p, status: newStatus, updatedAt: new Date()?.toISOString() }
        : p
    ));
    setSelectedProjects([]);
  };

  const handleBulkArchive = () => {
    setProjects(prev => prev?.map(p => 
      selectedProjects?.includes(p?.id) 
        ? { ...p, status: 'archived', updatedAt: new Date()?.toISOString() }
        : p
    ));
    setSelectedProjects([]);
  };

  const handleClearFilters = () => {
    setSearchTerm('');
    setStatusFilter('all');
    setCustomerFilter('all');
  };

  const handleSort = (sortConfig) => {
    setSortConfig(sortConfig);
  };

  // Quick action handlers
  const handleGenerateReport = () => {
    console.log('Generating project report...');
    // Implementation would generate and download report
  };

  const handleViewBudgetSummary = () => {
    console.log('Opening budget summary...');
    // Implementation would show budget summary modal
  };

  const handleViewMaterialAllocation = () => {
    console.log('Opening material allocation...');
    // Implementation would show material allocation modal
  };

  const handleImportProjects = () => {
    console.log('Opening import dialog...');
    // Implementation would show CSV import modal
  };

  const handleExportAll = () => {
    console.log('Exporting all projects...');
    // Implementation would export all projects to CSV
  };

  const handleExportSelected = () => {
    console.log('Exporting selected projects...');
    // Implementation would export selected projects to CSV
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Icon name="Loader2" size={32} className="animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Loading projects...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
      <Sidebar 
        isOpen={sidebarOpen} 
        onClose={() => setSidebarOpen(false)}
        userRole="project-manager"
      />
      <main className="lg:ml-60 pt-16">
        <div className="p-6">
          {/* Page Header */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
            <div>
              <h1 className="text-2xl font-bold text-foreground">Project Management</h1>
              <p className="text-muted-foreground mt-1">
                Track and manage construction projects, budgets, and timelines
              </p>
            </div>
            <div className="flex items-center space-x-3 mt-4 lg:mt-0">
              <Button
                variant="outline"
                iconName="RefreshCw"
                iconPosition="left"
                onClick={() => window.location?.reload()}
              >
                Refresh
              </Button>
              <Button
                onClick={() => setShowCreateModal(true)}
                iconName="Plus"
                iconPosition="left"
              >
                Create Project
              </Button>
            </div>
          </div>

          {/* Project Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-card rounded-lg border border-border p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Projects</p>
                  <p className="text-2xl font-bold text-foreground">{projects?.length}</p>
                </div>
                <div className="flex items-center justify-center w-12 h-12 bg-primary/10 rounded-lg">
                  <Icon name="FolderOpen" size={24} className="text-primary" />
                </div>
              </div>
            </div>

            <div className="bg-card rounded-lg border border-border p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Active Projects</p>
                  <p className="text-2xl font-bold text-foreground">
                    {projects?.filter(p => p?.status === 'active')?.length}
                  </p>
                </div>
                <div className="flex items-center justify-center w-12 h-12 bg-success/10 rounded-lg">
                  <Icon name="Play" size={24} className="text-success" />
                </div>
              </div>
            </div>

            <div className="bg-card rounded-lg border border-border p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Budget</p>
                  <p className="text-2xl font-bold text-foreground">
                    ${projects?.reduce((sum, p) => sum + (p?.budget || 0), 0)?.toLocaleString()}
                  </p>
                </div>
                <div className="flex items-center justify-center w-12 h-12 bg-accent/10 rounded-lg">
                  <Icon name="DollarSign" size={24} className="text-accent" />
                </div>
              </div>
            </div>

            <div className="bg-card rounded-lg border border-border p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Spent</p>
                  <p className="text-2xl font-bold text-foreground">
                    ${projects?.reduce((sum, p) => sum + (p?.spent || 0), 0)?.toLocaleString()}
                  </p>
                </div>
                <div className="flex items-center justify-center w-12 h-12 bg-warning/10 rounded-lg">
                  <Icon name="TrendingUp" size={24} className="text-warning" />
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions Panel */}
          <QuickActionsPanel
            onGenerateReport={handleGenerateReport}
            onViewBudgetSummary={handleViewBudgetSummary}
            onViewMaterialAllocation={handleViewMaterialAllocation}
            onImportProjects={handleImportProjects}
            onExportAll={handleExportAll}
          />

          {/* Filters */}
          <ProjectFilters
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            statusFilter={statusFilter}
            onStatusFilterChange={setStatusFilter}
            customerFilter={customerFilter}
            onCustomerFilterChange={setCustomerFilter}
            onClearFilters={handleClearFilters}
            customers={customers}
          />

          {/* Bulk Actions */}
          <BulkActionsBar
            selectedCount={selectedProjects?.length}
            onBulkStatusUpdate={handleBulkStatusUpdate}
            onBulkArchive={handleBulkArchive}
            onClearSelection={() => setSelectedProjects([])}
            onExportSelected={handleExportSelected}
          />

          {/* Projects Table */}
          <ProjectsTable
            projects={filteredAndSortedProjects}
            onEditProject={handleEditProject}
            onArchiveProject={handleArchiveProject}
            onViewProject={handleViewProject}
            selectedProjects={selectedProjects}
            onSelectProject={handleSelectProject}
            onSelectAll={handleSelectAll}
            sortConfig={sortConfig}
            onSort={handleSort}
          />

          {/* Results Summary */}
          {filteredAndSortedProjects?.length > 0 && (
            <div className="mt-6 text-center">
              <p className="text-sm text-muted-foreground">
                Showing {filteredAndSortedProjects?.length} of {projects?.length} projects
                {(searchTerm || statusFilter !== 'all' || customerFilter !== 'all') && ' (filtered)'}
              </p>
            </div>
          )}
        </div>
      </main>
      {/* Modals */}
      <CreateProjectModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onCreateProject={handleCreateProject}
        customers={customers}
      />
      <EditProjectModal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        onUpdateProject={handleUpdateProject}
        project={editingProject}
        customers={customers}
      />
    </div>
  );
};

export default ProjectManagement;