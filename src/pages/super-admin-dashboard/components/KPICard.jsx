import React from 'react';
import Icon from '../../../components/AppIcon';

const KPICard = ({ title, value, subtitle, icon, trend, trendValue, color = 'primary' }) => {
  const getColorClasses = () => {
    switch (color) {
      case 'success':
        return {
          bg: 'bg-success/10',
          icon: 'text-success',
          border: 'border-success/20'
        };
      case 'warning':
        return {
          bg: 'bg-warning/10',
          icon: 'text-warning',
          border: 'border-warning/20'
        };
      case 'error':
        return {
          bg: 'bg-error/10',
          icon: 'text-error',
          border: 'border-error/20'
        };
      default:
        return {
          bg: 'bg-primary/10',
          icon: 'text-primary',
          border: 'border-primary/20'
        };
    }
  };

  const colorClasses = getColorClasses();

  return (
    <div className="bg-card border border-border rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow duration-200">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-muted-foreground mb-1">{title}</p>
          <p className="text-3xl font-bold text-foreground mb-2">{value}</p>
          {subtitle && (
            <p className="text-sm text-muted-foreground">{subtitle}</p>
          )}
        </div>
        <div className={`p-3 rounded-lg ${colorClasses?.bg} ${colorClasses?.border} border`}>
          <Icon name={icon} size={24} className={colorClasses?.icon} />
        </div>
      </div>
      {trend && trendValue && (
        <div className="flex items-center mt-4 pt-4 border-t border-border">
          <Icon 
            name={trend === 'up' ? 'TrendingUp' : 'TrendingDown'} 
            size={16} 
            className={trend === 'up' ? 'text-success' : 'text-error'} 
          />
          <span className={`text-sm font-medium ml-1 ${trend === 'up' ? 'text-success' : 'text-error'}`}>
            {trendValue}
          </span>
          <span className="text-sm text-muted-foreground ml-1">vs last month</span>
        </div>
      )}
    </div>
  );
};

export default KPICard;