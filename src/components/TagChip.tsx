import React from 'react';

interface TagChipProps {
  name: string;
  color: string;
  removable?: boolean;
  onRemove?: () => void;
  onClick?: () => void;
  selected?: boolean;
}

const TagChip = React.memo(function TagChip({
  name,
  color,
  removable = false,
  onRemove,
  onClick,
  selected = false,
}: TagChipProps) {
  return (
    <span
      onClick={onClick}
      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium transition-colors ${onClick ? 'cursor-pointer' : ''} ${selected ? 'ring-2 ring-offset-1 ring-blue-400' : ''}`}
      style={{
        backgroundColor: `${color}20`,
        color: color,
        borderColor: color,
        borderWidth: '1px',
      }}
    >
      {name}
      {removable && onRemove && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          className="ml-0.5 hover:opacity-70 transition-opacity"
          aria-label={`删除标签 ${name}`}
        >
          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}
    </span>
  );
});

export default TagChip;
