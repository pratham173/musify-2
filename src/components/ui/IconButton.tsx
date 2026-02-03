import React, { ButtonHTMLAttributes, ReactNode } from 'react';
import './IconButton.css';

interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'primary' | 'ghost';
  children: ReactNode;
  ariaLabel?: string;
}

export const IconButton: React.FC<IconButtonProps> = ({
  size = 'md',
  variant = 'default',
  children,
  ariaLabel,
  className = '',
  ...props
}) => {
  return (
    <button
      className={`icon-button icon-button-${size} icon-button-${variant} ${className}`}
      aria-label={ariaLabel}
      {...props}
    >
      {children}
    </button>
  );
};
