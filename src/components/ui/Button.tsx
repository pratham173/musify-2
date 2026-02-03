import React, { ButtonHTMLAttributes, ReactNode } from 'react';
import './Button.css';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  children: ReactNode;
  isLoading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  children,
  isLoading = false,
  className = '',
  disabled,
  ...props
}) => {
  return (
    <button
      className={`button button-${variant} button-${size} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? <span className="button-spinner" /> : children}
    </button>
  );
};
