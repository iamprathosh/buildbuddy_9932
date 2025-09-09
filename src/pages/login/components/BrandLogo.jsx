import React from 'react';

const BrandLogo = () => {
  return (
    <div className="text-center mb-8">
      <div className="flex items-center justify-center mb-4">
        <div className="flex items-center justify-center w-16 h-16 bg-primary rounded-xl shadow-lg">
          <svg
            viewBox="0 0 24 24"
            className="w-8 h-8 text-primary-foreground"
            fill="currentColor"
          >
            <path d="M12 2L2 7v10c0 5.55 3.84 9.74 9 11 5.16-1.26 9-5.45 9-11V7l-10-5z"/>
            <path d="M9 12l2 2 4-4" stroke="currentColor" strokeWidth="2" fill="none"/>
          </svg>
        </div>
      </div>
      
      <h1 className="text-3xl font-bold text-secondary mb-2">BuildBuddy</h1>
      <p className="text-muted-foreground text-sm">Construction Management Platform</p>
      <p className="text-xs text-muted-foreground mt-1">Secure access for construction professionals</p>
    </div>
  );
};

export default BrandLogo;