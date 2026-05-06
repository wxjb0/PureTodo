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
      className={`w-full px-3 py-2 border border-gray-300 rounded-md text-base transition-colors focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed placeholder:text-gray-400 ${className}`}
    />
  );
});

export default Input;
