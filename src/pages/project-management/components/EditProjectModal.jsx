import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';

const EditProjectModal = ({ isOpen, onClose, onUpdateProject, project, customers }) => {
  const [formData, setFormData] = useState({
    name: '',
    jobNumber: '',
    customerId: '',
    description: '',
    budget: '',
    startDate: '',
    endDate: '',
    status: 'pending',
    priority: 'medium',
    location: '',
    contactPerson: '',
    contactPhone: '',
    contactEmail: ''
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const statusOptions = [
    { value: 'pending', label: 'Pending' },
    { value: 'active', label: 'Active' },
    { value: 'completed', label: 'Completed' },
    { value: 'on-hold', label: 'On Hold' },
    { value: 'archived', label: 'Archived' }
  ];

  const priorityOptions = [
    { value: 'low', label: 'Low Priority' },
    { value: 'medium', label: 'Medium Priority' },
    { value: 'high', label: 'High Priority' },
    { value: 'urgent', label: 'Urgent' }
  ];

  const customerOptions = customers?.map(customer => ({
    value: customer?.id,
    label: customer?.name,
    description: customer?.contact
  }));

  // Populate form when project changes
  useEffect(() => {
    if (project) {
      setFormData({
        name: project?.name || '',
        jobNumber: project?.jobNumber || '',
        customerId: project?.customer?.id || '',
        description: project?.description || '',
        budget: project?.budget?.toString() || '',
        startDate: project?.startDate ? new Date(project.startDate)?.toISOString()?.split('T')?.[0] : '',
        endDate: project?.endDate ? new Date(project.endDate)?.toISOString()?.split('T')?.[0] : '',
        status: project?.status || 'pending',
        priority: project?.priority || 'medium',
        location: project?.location || '',
        contactPerson: project?.contactPerson || '',
        contactPhone: project?.contactPhone || '',
        contactEmail: project?.contactEmail || ''
      });
      setErrors({});
    }
  }, [project]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors?.[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData?.name?.trim()) {
      newErrors.name = 'Project name is required';
    }

    if (!formData?.jobNumber?.trim()) {
      newErrors.jobNumber = 'Job number is required';
    }

    if (!formData?.customerId) {
      newErrors.customerId = 'Customer selection is required';
    }

    if (!formData?.budget || parseFloat(formData?.budget) <= 0) {
      newErrors.budget = 'Valid budget amount is required';
    }

    if (!formData?.startDate) {
      newErrors.startDate = 'Start date is required';
    }

    if (formData?.endDate && formData?.startDate && new Date(formData.endDate) <= new Date(formData.startDate)) {
      newErrors.endDate = 'End date must be after start date';
    }

    if (!formData?.location?.trim()) {
      newErrors.location = 'Project location is required';
    }

    if (!formData?.contactPerson?.trim()) {
      newErrors.contactPerson = 'Contact person is required';
    }

    if (!formData?.contactPhone?.trim()) {
      newErrors.contactPhone = 'Contact phone is required';
    }

    if (formData?.contactEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/?.test(formData?.contactEmail)) {
      newErrors.contactEmail = 'Valid email address is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors)?.length === 0;
  };

  const handleSubmit = async (e) => {
    e?.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const selectedCustomer = customers?.find(c => c?.id === formData?.customerId);
      
      const updatedProject = {
        ...project,
        ...formData,
        budget: parseFloat(formData?.budget),
        customer: {
          id: selectedCustomer?.id,
          name: selectedCustomer?.name,
          contact: selectedCustomer?.contact
        },
        updatedAt: new Date()?.toISOString()
      };

      await onUpdateProject(updatedProject);
      onClose();
    } catch (error) {
      console.error('Error updating project:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      onClose();
    }
  };

  if (!isOpen || !project) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-300 p-4">
      <div className="bg-card rounded-lg shadow-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div>
            <h2 className="text-xl font-semibold text-foreground">Edit Project</h2>
            <p className="text-sm text-muted-foreground mt-1">
              Update project details and settings
            </p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleClose}
            disabled={isSubmitting}
          >
            <Icon name="X" size={20} />
          </Button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-foreground">Basic Information</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Project Name"
                type="text"
                placeholder="Enter project name"
                value={formData?.name}
                onChange={(e) => handleInputChange('name', e?.target?.value)}
                error={errors?.name}
                required
              />

              <Input
                label="Job Number"
                type="text"
                placeholder="Enter job number"
                value={formData?.jobNumber}
                onChange={(e) => handleInputChange('jobNumber', e?.target?.value)}
                error={errors?.jobNumber}
                required
              />
            </div>

            <Select
              label="Customer"
              placeholder="Select customer"
              options={customerOptions}
              value={formData?.customerId}
              onChange={(value) => handleInputChange('customerId', value)}
              error={errors?.customerId}
              searchable
              required
            />

            <Input
              label="Description"
              type="text"
              placeholder="Brief project description (optional)"
              value={formData?.description}
              onChange={(e) => handleInputChange('description', e?.target?.value)}
            />
          </div>

          {/* Project Details */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-foreground">Project Details</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Budget"
                type="number"
                placeholder="0.00"
                value={formData?.budget}
                onChange={(e) => handleInputChange('budget', e?.target?.value)}
                error={errors?.budget}
                min="0"
                step="0.01"
                required
              />

              <Select
                label="Priority"
                options={priorityOptions}
                value={formData?.priority}
                onChange={(value) => handleInputChange('priority', value)}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Start Date"
                type="date"
                value={formData?.startDate}
                onChange={(e) => handleInputChange('startDate', e?.target?.value)}
                error={errors?.startDate}
                required
              />

              <Input
                label="End Date"
                type="date"
                value={formData?.endDate}
                onChange={(e) => handleInputChange('endDate', e?.target?.value)}
                error={errors?.endDate}
                description="Leave empty for ongoing projects"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Select
                label="Status"
                options={statusOptions}
                value={formData?.status}
                onChange={(value) => handleInputChange('status', value)}
              />

              <Input
                label="Location"
                type="text"
                placeholder="Project site location"
                value={formData?.location}
                onChange={(e) => handleInputChange('location', e?.target?.value)}
                error={errors?.location}
                required
              />
            </div>
          </div>

          {/* Contact Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-foreground">Contact Information</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Contact Person"
                type="text"
                placeholder="Primary contact name"
                value={formData?.contactPerson}
                onChange={(e) => handleInputChange('contactPerson', e?.target?.value)}
                error={errors?.contactPerson}
                required
              />

              <Input
                label="Contact Phone"
                type="tel"
                placeholder="(555) 123-4567"
                value={formData?.contactPhone}
                onChange={(e) => handleInputChange('contactPhone', e?.target?.value)}
                error={errors?.contactPhone}
                required
              />
            </div>

            <Input
              label="Contact Email"
              type="email"
              placeholder="contact@example.com (optional)"
              value={formData?.contactEmail}
              onChange={(e) => handleInputChange('contactEmail', e?.target?.value)}
              error={errors?.contactEmail}
            />
          </div>

          {/* Project Stats (Read-only) */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-foreground">Project Statistics</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-3 bg-muted rounded-md">
                <p className="text-sm text-muted-foreground">Total Spent</p>
                <p className="text-lg font-semibold text-foreground">
                  ${project?.spent?.toLocaleString() || '0'}
                </p>
              </div>
              <div className="p-3 bg-muted rounded-md">
                <p className="text-sm text-muted-foreground">Remaining Budget</p>
                <p className="text-lg font-semibold text-foreground">
                  ${((project?.budget || 0) - (project?.spent || 0))?.toLocaleString()}
                </p>
              </div>
              <div className="p-3 bg-muted rounded-md">
                <p className="text-sm text-muted-foreground">Budget Usage</p>
                <p className="text-lg font-semibold text-foreground">
                  {project?.budget ? Math.round(((project?.spent || 0) / project?.budget) * 100) : 0}%
                </p>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end space-x-3 pt-4 border-t border-border">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              loading={isSubmitting}
              iconName="Save"
              iconPosition="left"
            >
              Update Project
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProjectModal;