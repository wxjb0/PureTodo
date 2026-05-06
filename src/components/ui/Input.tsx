import React from 'react';

interface InputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  disabled?: boolean;
  className?: string;
  autoFocus?: boolean;
}

const Input = React.memo(function Input({
  value,
  onChange,
  placeholder,
  onKeyDown,
  disabled = false,
  className = '',
  autoFocus = false,
}: InputProps) {
  return (
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      onKeyDown={onKeyDown}
      placeholder={placeholder}
      disabled={disabled}
      autoFocus={autoFocus}
      className={`w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-brand-300 focus:border-brand-400 disabled:bg-gray-50 disabled:cursor-not-allowed placeholder:text-gray-400 shadow-sm hover:shadow ${className}`}
    />
  );
});

export default Input;
