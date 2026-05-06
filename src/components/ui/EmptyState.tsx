import React from 'react';

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
}

const DefaultIcon = () => (
  <div className="w-20 h-20 rounded-full flex items-center justify-center macaron-bg-lavender">
    <i className="fa-regular fa-clipboard-list sketch-icon sketch-icon-lg sketch-icon-tilt-1 text-white text-4xl" />
  </div>
);

const EmptyState = React.memo(function EmptyState({
  icon,
  title,
  description,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 animate-fade-in">
      {icon || <DefaultIcon />}
      <p className="mt-5 text-base font-medium text-gray-500">{title}</p>
      {description && (
        <p className="mt-1.5 text-sm text-gray-400">{description}</p>
      )}
    </div>
  );
});

export default EmptyState;
