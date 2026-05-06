import React from 'react';

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
}

const DefaultIcon = () => (
  <svg className="w-16 h-16 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
  </svg>
);

const EmptyState = React.memo(function EmptyState({
  icon,
  title,
  description,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4">
      {icon || <DefaultIcon />}
      <p className="mt-4 text-lg font-medium text-gray-500">{title}</p>
      {description && (
        <p className="mt-1 text-sm text-gray-400">{description}</p>
      )}
    </div>
  );
});

export default EmptyState;
