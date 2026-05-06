import React from 'react';

interface CheckboxProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
  label?: string;
}

const Checkbox = React.memo(function Checkbox({
  checked,
  onChange,
  disabled = false,
  label,
}: CheckboxProps) {
  return (
    <label className="inline-flex items-center cursor-pointer select-none">
      <span
        role="checkbox"
        aria-checked={checked}
        tabIndex={disabled ? -1 : 0}
        onClick={() => !disabled && onChange(!checked)}
        onKeyDown={(e) => {
          if (!disabled && (e.key === 'Enter' || e.key === ' ')) {
            e.preventDefault();
            onChange(!checked);
          }
        }}
        className={`
          inline-flex items-center justify-center w-5 h-5 rounded border-2 transition-all
          ${checked
            ? 'bg-blue-500 border-blue-500'
            : 'bg-white border-gray-300 hover:border-blue-400'
          }
          ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        `}
      >
        {checked && (
          <svg
            className="w-3 h-3 text-white"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={3}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        )}
      </span>
      {label && (
        <span className="ml-2 text-sm text-gray-700">{label}</span>
      )}
    </label>
  );
});

export default Checkbox;
