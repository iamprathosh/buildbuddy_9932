import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const ActionButton = ({ 
  title, 
  description, 
  iconName, 
  variant = "default",
  onClick,
  disabled = false,
  loading = false,
  className = ""
}) => {
  return (
    <Button
      variant={variant}
      onClick={onClick}
      disabled={disabled}
      loading={loading}
      className={`
        w-full h-32 sm:h-40 flex flex-col items-center justify-center space-y-3
        text-center p-6 rounded-xl shadow-md hover:shadow-lg
        transition-all duration-200 transform hover:scale-105
        ${className}
      `}
    >
      <Icon name={iconName} size={32} className="mb-2" />
      <div>
        <h3 className="text-lg font-semibold mb-1">{title}</h3>
        <p className="text-sm opacity-80 leading-tight">{description}</p>
      </div>
    </Button>
  );
};

export default ActionButton;