import React from 'react';

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
}

const DefaultIcon = () => (
  <div className="w-20 h-20 rounded-full bg-brand-50 flex items-center justify-center">
    <svg className="w-10 h-10 text-brand-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
    </svg>
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
