import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const GetStartedSection = () => {
  const [showSampleDataModal, setShowSampleDataModal] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [isPopulatingSample, setIsPopulatingSample] = useState(false);
  const [isImporting, setIsImporting] = useState(false);

  const handlePopulateSampleData = async () => {
    setIsPopulatingSample(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsPopulatingSample(false);
    setShowSampleDataModal(false);
    // Show success message or refresh dashboard
  };

  const handleCSVImport = async (file) => {
    setIsImporting(true);
    // Simulate file processing
    await new Promise(resolve => setTimeout(resolve, 3000));
    setIsImporting(false);
    setShowImportModal(false);
    // Show success message or refresh dashboard
  };

  return (
    <>
      <div className="bg-gradient-to-r from-primary/5 to-secondary/5 border border-border rounded-lg p-8">
        <div className="text-center max-w-2xl mx-auto">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-primary/10 rounded-full">
              <Icon name="Rocket" size={32} className="text-primary" />
            </div>
          </div>
          
          <h3 className="text-2xl font-bold text-foreground mb-3">Get Started with BuildBuddy</h3>
          <p className="text-muted-foreground mb-8">
            Set up your construction inventory management system quickly with sample data or import your existing inventory.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              variant="default"
              onClick={() => setShowSampleDataModal(true)}
              iconName="Database"
              iconPosition="left"
              className="sm:w-auto"
            >
              Populate Sample Data
            </Button>
            
            <Button
              variant="outline"
              onClick={() => setShowImportModal(true)}
              iconName="Upload"
              iconPosition="left"
              className="sm:w-auto"
            >
              Import CSV Data
            </Button>
          </div>
        </div>
      </div>
      {/* Sample Data Modal */}
      {showSampleDataModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-300 p-4">
          <div className="bg-card border border-border rounded-lg max-w-md w-full p-6 animate-fade-in">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-lg font-semibold text-foreground">Populate Sample Data</h4>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowSampleDataModal(false)}
                disabled={isPopulatingSample}
              >
                <Icon name="X" size={18} />
              </Button>
            </div>
            
            <div className="mb-6">
              <p className="text-sm text-muted-foreground mb-4">
                This will add sample inventory items, projects, and vendors to help you explore BuildBuddy's features.
              </p>
              
              <div className="bg-muted rounded-lg p-4">
                <h5 className="text-sm font-medium text-foreground mb-2">Sample data includes:</h5>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• 50+ construction materials and tools</li>
                  <li>• 5 active construction projects</li>
                  <li>• 10 vendor relationships</li>
                  <li>• Historical inventory transactions</li>
                </ul>
              </div>
            </div>
            
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => setShowSampleDataModal(false)}
                disabled={isPopulatingSample}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                variant="default"
                onClick={handlePopulateSampleData}
                loading={isPopulatingSample}
                className="flex-1"
              >
                {isPopulatingSample ? 'Populating...' : 'Populate Data'}
              </Button>
            </div>
          </div>
        </div>
      )}
      {/* Import CSV Modal */}
      {showImportModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-300 p-4">
          <div className="bg-card border border-border rounded-lg max-w-lg w-full p-6 animate-fade-in">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-lg font-semibold text-foreground">Import CSV Data</h4>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowImportModal(false)}
                disabled={isImporting}
              >
                <Icon name="X" size={18} />
              </Button>
            </div>
            
            <div className="mb-6">
              <p className="text-sm text-muted-foreground mb-4">
                Upload your existing inventory data in CSV format. Make sure your file includes the required columns.
              </p>
              
              <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
                <Icon name="Upload" size={32} className="text-muted-foreground mx-auto mb-3" />
                <p className="text-sm font-medium text-foreground mb-1">Drop your CSV file here</p>
                <p className="text-xs text-muted-foreground mb-4">or click to browse</p>
                <input
                  type="file"
                  accept=".csv"
                  className="hidden"
                  id="csv-upload"
                  onChange={(e) => {
                    if (e?.target?.files?.[0]) {
                      handleCSVImport(e?.target?.files?.[0]);
                    }
                  }}
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => document.getElementById('csv-upload')?.click()}
                  disabled={isImporting}
                >
                  Choose File
                </Button>
              </div>
              
              <div className="mt-4 p-3 bg-muted rounded-lg">
                <p className="text-xs font-medium text-foreground mb-1">Required CSV columns:</p>
                <p className="text-xs text-muted-foreground">
                  SKU, Name, Category, Unit, Current Stock, Unit Cost
                </p>
              </div>
            </div>
            
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => setShowImportModal(false)}
                disabled={isImporting}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                variant="ghost"
                size="sm"
                iconName="Download"
                iconPosition="left"
                className="text-xs"
              >
                Download Template
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default GetStartedSection;