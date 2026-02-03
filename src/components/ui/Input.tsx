import React, { InputHTMLAttributes, ReactNode, forwardRef } from 'react';
import './Input.css';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  containerClassName?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, leftIcon, rightIcon, containerClassName = '', className = '', ...props }, ref) => {
    return (
      <div className={`input-container ${containerClassName}`}>
        {label && <label className="input-label">{label}</label>}
        <div className="input-wrapper">
          {leftIcon && <div className="input-icon input-icon-left">{leftIcon}</div>}
          <input
            ref={ref}
            className={`input ${leftIcon ? 'input-with-left-icon' : ''} ${rightIcon ? 'input-with-right-icon' : ''} ${error ? 'input-error' : ''} ${className}`}
            {...props}
          />
          {rightIcon && <div className="input-icon input-icon-right">{rightIcon}</div>}
        </div>
        {error && <span className="input-error-message">{error}</span>}
      </div>
    );
  }
);

Input.displayName = 'Input';
