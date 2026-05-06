import React from 'react';

interface ButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  className?: string;
}

const variantStyles: Record<string, string> = {
  primary: 'bg-blue-500 text-white hover:bg-blue-600 active:bg-blue-700 focus:ring-blue-300',
  secondary: 'bg-gray-200 text-gray-700 hover:bg-gray-300 active:bg-gray-400 focus:ring-gray-300',
  danger: 'bg-red-500 text-white hover:bg-red-600 active:bg-red-700 focus:ring-red-300',
  ghost: 'bg-transparent text-gray-600 hover:bg-gray-100 active:bg-gray-200 focus:ring-gray-300',
};

const sizeStyles: Record<string, string> = {
  sm: 'px-2 py-1 text-sm min-h-[32px]',
  md: 'px-4 py-2 text-base min-h-[44px]',
  lg: 'px-6 py-3 text-lg min-h-[48px]',
};

const Button = React.memo(function Button({
  children,
  variant = 'primary',
  size = 'md',
  disabled = false,
  onClick,
  type = 'button',
  className = '',
}: ButtonProps) {
  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={`rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-1 disabled:opacity-50 disabled:cursor-not-allowed ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
    >
      {children}
    </button>
  );
});

export default Button;
