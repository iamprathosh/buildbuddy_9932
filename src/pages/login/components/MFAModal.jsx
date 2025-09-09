import React, { useState, useEffect } from 'react';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Icon from '../../../components/AppIcon';

const MFAModal = ({ isOpen, onClose, onVerify, method = 'email', isLoading }) => {
  const [code, setCode] = useState('');
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes
  const [canResend, setCanResend] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          setCanResend(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isOpen]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs?.toString()?.padStart(2, '0')}`;
  };

  const handleSubmit = (e) => {
    e?.preventDefault();
    if (code?.length === 6) {
      onVerify(code);
    }
  };

  const handleResend = () => {
    setTimeLeft(300);
    setCanResend(false);
    setCode('');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-300 p-4">
      <div className="bg-card rounded-lg shadow-xl max-w-md w-full p-6 animate-fade-in">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
              <Icon name="Shield" size={20} className="text-primary" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-foreground">Verify Your Identity</h3>
              <p className="text-sm text-muted-foreground">
                {method === 'email' ? 'Check your email' : 'Check your phone'}
              </p>
            </div>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <Icon name="X" size={18} />
          </Button>
        </div>

        <div className="mb-6">
          <p className="text-sm text-muted-foreground mb-4">
            We've sent a 6-digit verification code to your {method === 'email' ? 'email address' : 'phone number'}.
            Enter the code below to continue.
          </p>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Verification Code"
              type="text"
              value={code}
              onChange={(e) => setCode(e?.target?.value?.replace(/\D/g, '')?.slice(0, 6))}
              placeholder="Enter 6-digit code"
              maxLength={6}
              required
              disabled={isLoading}
              className="text-center text-lg tracking-widest"
            />

            <Button
              type="submit"
              variant="default"
              size="lg"
              fullWidth
              loading={isLoading}
              disabled={code?.length !== 6 || isLoading}
              className="bg-primary hover:bg-primary/90"
            >
              Verify Code
            </Button>
          </form>
        </div>

        <div className="text-center space-y-2">
          {timeLeft > 0 ? (
            <p className="text-sm text-muted-foreground">
              Code expires in {formatTime(timeLeft)}
            </p>
          ) : (
            <p className="text-sm text-destructive">
              Verification code has expired
            </p>
          )}
          
          <Button
            variant="ghost"
            size="sm"
            onClick={handleResend}
            disabled={!canResend || isLoading}
            className="text-primary hover:text-primary/80"
          >
            Resend Code
          </Button>
        </div>
      </div>
    </div>
  );
};

export default MFAModal;