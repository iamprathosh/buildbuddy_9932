import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const TransactionSuccessModal = ({ isOpen, onClose, transaction }) => {
  if (!isOpen || !transaction) return null;

  const getTransactionDetails = () => {
    switch (transaction?.transactionType) {
      case 'take-out':
        return {
          title: 'Stock Taken Out Successfully',
          icon: 'CheckCircle',
          color: 'text-success',
          bgColor: 'bg-success',
          message: `Successfully removed ${transaction?.quantity} units from inventory for project use.`
        };
      case 'stock-in':
        return {
          title: 'Stock Received Successfully',
          icon: 'CheckCircle',
          color: 'text-success',
          bgColor: 'bg-success',
          message: `Successfully logged receipt of ${transaction?.quantity} units from supplier.`
        };
      case 'return':
        return {
          title: 'Items Returned Successfully',
          icon: 'CheckCircle',
          color: 'text-success',
          bgColor: 'bg-success',
          message: `Successfully returned ${transaction?.quantity} units to inventory.`
        };
      default:
        return {
          title: 'Transaction Completed',
          icon: 'CheckCircle',
          color: 'text-success',
          bgColor: 'bg-success',
          message: 'Transaction completed successfully.'
        };
    }
  };

  const details = getTransactionDetails();

  const formatDateTime = (timestamp) => {
    const date = new Date(timestamp);
    return date?.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-300 p-4">
      <div className="bg-card rounded-xl shadow-xl w-full max-w-md">
        {/* Header */}
        <div className="flex flex-col items-center text-center p-8">
          <div className={`w-16 h-16 ${details?.bgColor} rounded-full flex items-center justify-center mb-4`}>
            <Icon name={details?.icon} size={32} className="text-white" />
          </div>
          
          <h2 className="text-xl font-semibold text-foreground mb-2">
            {details?.title}
          </h2>
          
          <p className="text-muted-foreground mb-6">
            {details?.message}
          </p>

          {/* Transaction Details */}
          <div className="w-full bg-muted rounded-lg p-4 space-y-3 text-left">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-muted-foreground">Transaction ID:</span>
              <span className="text-sm font-mono text-foreground">
                {transaction?.transactionType?.toUpperCase()}-{Date.now()?.toString()?.slice(-6)}
              </span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-muted-foreground">Date & Time:</span>
              <span className="text-sm text-foreground">
                {formatDateTime(transaction?.timestamp)}
              </span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-muted-foreground">Worker:</span>
              <span className="text-sm text-foreground">{transaction?.worker}</span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-muted-foreground">Quantity:</span>
              <span className="text-sm font-semibold text-foreground">
                {transaction?.quantity} units
              </span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="px-8 pb-8">
          <Button
            variant="default"
            onClick={onClose}
            className="w-full"
            iconName="ArrowLeft"
            iconPosition="left"
          >
            Back to Dashboard
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TransactionSuccessModal;