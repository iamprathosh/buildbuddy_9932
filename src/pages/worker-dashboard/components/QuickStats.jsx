import React from 'react';
import Icon from '../../../components/AppIcon';

const QuickStats = () => {
  // Mock data for quick stats
  const stats = [
    {
      id: 1,
      label: 'Today\'s Transactions',
      value: '12',
      icon: 'Activity',
      color: 'text-accent',
      bgColor: 'bg-accent/10'
    },
    {
      id: 2,
      label: 'Items Taken Out',
      value: '8',
      icon: 'Minus',
      color: 'text-primary',
      bgColor: 'bg-primary/10'
    },
    {
      id: 3,
      label: 'Items Returned',
      value: '3',
      icon: 'RotateCcw',
      color: 'text-warning',
      bgColor: 'bg-warning/10'
    },
    {
      id: 4,
      label: 'Stock Received',
      value: '1',
      icon: 'Plus',
      color: 'text-success',
      bgColor: 'bg-success/10'
    }
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {stats?.map((stat) => (
        <div
          key={stat?.id}
          className="bg-card rounded-lg border border-border p-4 hover:shadow-md transition-shadow duration-200"
        >
          <div className="flex items-center space-x-3">
            <div className={`w-10 h-10 ${stat?.bgColor} rounded-lg flex items-center justify-center`}>
              <Icon name={stat?.icon} size={20} className={stat?.color} />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{stat?.value}</p>
              <p className="text-xs text-muted-foreground leading-tight">{stat?.label}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default QuickStats;