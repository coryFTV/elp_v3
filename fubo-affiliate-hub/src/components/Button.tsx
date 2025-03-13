import React from 'react';

// Simple button component with props defined with TypeScript
interface ButtonProps {
  label: string;
  onClick: () => void;
  disabled?: boolean;
  className?: string;
}

const Button: React.FC<ButtonProps> = ({ 
  label, 
  onClick, 
  disabled = false, 
  className = '' 
}) => {
  return (
    <button
      className={`btn ${className}`}
      onClick={onClick}
      disabled={disabled}
      data-testid="custom-button"
    >
      {label}
    </button>
  );
};

export default Button; 