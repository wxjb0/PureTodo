import React from 'react';

interface CheckboxProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
}

const Checkbox = React.memo(function Checkbox({
  checked,
  onChange,
  disabled = false,
}: CheckboxProps) {
  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={checked}
      disabled={disabled}
      onClick={() => !disabled && onChange(!checked)}
      className={`
        relative w-5 h-5 rounded-full border-2 transition-all duration-200 flex-shrink-0
        ${checked
          ? 'bg-brand-500 border-brand-500 shadow-sm shadow-brand-200'
          : 'bg-white border-gray-300 hover:border-brand-400 hover:shadow-sm'
        }
        ${disabled ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'}
        focus:outline-none focus:ring-2 focus:ring-brand-300 focus:ring-offset-1
      `}
    >
      {checked && (
        <i className="fa-solid fa-check sketch-icon w-3 h-3 text-white absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
      )}
    </button>
  );
});

export default Checkbox;
