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
  primary: 'bg-brand-600 text-white hover:bg-brand-700 active:bg-brand-800 shadow-sm hover:shadow-md',
  secondary: 'bg-white text-gray-700 hover:bg-gray-50 active:bg-gray-100 border border-gray-200 shadow-sm',
  danger: 'bg-red-500 text-white hover:bg-red-600 active:bg-red-700 shadow-sm hover:shadow-md',
  ghost: 'bg-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-100 active:bg-gray-200',
};

const sizeStyles: Record<string, string> = {
  sm: 'px-3 py-1.5 text-xs font-medium min-h-[32px] rounded-lg',
  md: 'px-4 py-2 text-sm font-medium min-h-[40px] rounded-xl',
  lg: 'px-6 py-2.5 text-base font-medium min-h-[44px] rounded-xl',
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
      className={`inline-flex items-center justify-center gap-2 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-brand-300 focus:ring-offset-1 disabled:opacity-40 disabled:cursor-not-allowed disabled:transform-none ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
    >
      {children}
    </button>
  );
});

export default Button;
