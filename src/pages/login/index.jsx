import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';


import BrandLogo from './components/BrandLogo';
import SecurityBadge from './components/SecurityBadge';
import SocialLogin from './components/SocialLogin';
import LoginForm from './components/LoginForm';
import MFAModal from './components/MFAModal';

const Login = () => {
  const [showMFA, setShowMFA] = useState(false);
  const [mfaCode, setMfaCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();

  // Redirect if already logged in
  React.useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  const demoCredentials = [
    { email: 'admin@buildbuddy.com', password: 'admin123', role: 'Super Admin' },
    { email: 'manager@buildbuddy.com', password: 'manager123', role: 'Project Manager' },
    { email: 'worker1@buildbuddy.com', password: 'worker123', role: 'Worker' },
    { email: 'worker2@buildbuddy.com', password: 'worker123', role: 'Worker' }
  ];

  // Add missing handler functions
  const handleGoogleLogin = () => {
    setIsLoading(true);
    // Handle Google login
    console.log('Google login initiated');
    setIsLoading(false);
  };

  const handlePhoneLogin = () => {
    setIsLoading(true);
    // Handle phone login
    console.log('Phone login initiated');
    setIsLoading(false);
  };

  const handleMFASubmit = (code) => {
    console.log('MFA Code:', code);
    setShowMFA(false);
    // Handle MFA verification
  };

  const handleMFAVerify = () => {
    setIsLoading(true);
    // Handle MFA verification
    console.log('MFA verification initiated');
    setIsLoading(false);
    setShowMFA(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-primary/5 flex">
      {/* Left Panel - Brand/Info */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-primary/5 to-transparent" />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMjAiIGN5PSIyMCIgcj0iMSIgZmlsbD0iIzEwMWZmZiIgZmlsbC1vcGFjaXR5PSIwLjEiLz4KPC9zdmc+')] opacity-20" />
        
        <div className="relative z-10 flex flex-col justify-center items-center p-12 text-center w-full">
          <BrandLogo size="large" />
          
          <h1 className="text-4xl font-bold text-foreground mb-4 mt-8">
            BuildBuddy
          </h1>
          
          <p className="text-xl text-muted-foreground mb-8 leading-relaxed max-w-md">
            Construction Inventory Management System for Modern Teams
          </p>
          
          <div className="space-y-4 text-left max-w-sm">
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-primary rounded-full" />
              <span className="text-muted-foreground">Real-time inventory tracking</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-primary rounded-full" />
              <span className="text-muted-foreground">Project-based management</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-primary rounded-full" />
              <span className="text-muted-foreground">Multi-role access control</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-primary rounded-full" />
              <span className="text-muted-foreground">Advanced reporting</span>
            </div>
          </div>
          
          <SecurityBadge className="mt-12" />
        </div>
      </div>

      {/* Right Panel - Login Form */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-20 xl:px-24">
        <div className="mx-auto w-full max-w-sm lg:w-96">
          <div className="lg:hidden text-center mb-8">
            <BrandLogo size="small" />
            <h1 className="text-2xl font-bold text-foreground mt-4">BuildBuddy</h1>
          </div>
          
          <div>
            <h2 className="text-3xl font-bold tracking-tight text-foreground">
              Sign in to your account
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Welcome back! Please enter your details to continue.
            </p>
          </div>

          <div className="mt-8">
            <LoginForm />
            
            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-border" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="bg-background px-2 text-muted-foreground">
                    Or continue with
                  </span>
                </div>
              </div>

              <SocialLogin 
                className="mt-6" 
                onGoogleLogin={handleGoogleLogin}
                onPhoneLogin={handlePhoneLogin}
                isLoading={isLoading}
              />
            </div>
            
            {/* Demo Credentials Section */}
            <div className="mt-8 p-4 bg-muted/30 rounded-lg border border-border">
              <h3 className="text-sm font-medium text-foreground mb-3">
                Demo Credentials (For Testing)
              </h3>
              <div className="space-y-2 text-xs">
                {demoCredentials?.map((cred, index) => (
                  <div key={index} className="flex justify-between items-center py-1">
                    <span className="font-medium text-muted-foreground">
                      {cred?.role}:
                    </span>
                    <div className="text-right">
                      <div className="text-foreground">{cred?.email}</div>
                      <div className="text-muted-foreground">{cred?.password}</div>
                    </div>
                  </div>
                ))}
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                Click on any credential above to copy and use for testing.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* MFA Modal */}
      <MFAModal
        isOpen={showMFA}
        onClose={() => setShowMFA(false)}
        onSubmit={handleMFASubmit}
        onVerify={handleMFAVerify}
        mfaCode={mfaCode}
        setMfaCode={setMfaCode}
        isLoading={isLoading}
      />
    </div>
  );
};

export default Login;