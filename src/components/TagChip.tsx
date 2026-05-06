import React from 'react';

interface TagChipProps {
  name: string;
  color: string;
  removable?: boolean;
  onRemove?: () => void;
  onClick?: () => void;
  selected?: boolean;
  size?: 'sm' | 'md';
}

const TagChip = React.memo(function TagChip({
  name,
  color,
  removable = false,
  onRemove,
  onClick,
  selected = false,
  size = 'sm',
}: TagChipProps) {
  const sizeClasses = size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-3 py-1 text-sm';

  return (
    <span
      onClick={onClick}
      className={`inline-flex items-center gap-1 rounded-full font-medium transition-all duration-200 ${sizeClasses} ${onClick ? 'cursor-pointer hover:shadow-sm' : ''} ${selected ? 'ring-2 ring-offset-1 shadow-sm' : ''}`}
      style={{
        backgroundColor: selected ? `${color}30` : `${color}15`,
        color: color,
        borderColor: selected ? color : 'transparent',
        borderWidth: '1px',
        ...(selected ? { ringColor: color } : {}),
      }}
    >
      {name}
      {removable && onRemove && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          className="ml-0.5 opacity-60 hover:opacity-100 transition-opacity"
          aria-label={`删除标签 ${name}`}
        >
          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}
    </span>
  );
});

export default TagChip;
