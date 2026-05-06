import React, { useCallback } from 'react';
import { useTaskStore } from '../store/taskStore';
import Input from './ui/Input';

const SearchBar = React.memo(function SearchBar() {
  const keyword = useTaskStore((state) => state.searchFilter.keyword);
  const updateSearchKeyword = useTaskStore((state) => state.updateSearchKeyword);

  const handleChange = useCallback(
    (value: string) => {
      updateSearchKeyword(value);
    },
    [updateSearchKeyword]
  );

  return (
    <div className="relative">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </div>
      <Input
        value={keyword}
        onChange={handleChange}
        placeholder="搜索任务标题或备注..."
        className="pl-9"
      />
      {keyword && (
        <button
          onClick={() => updateSearchKeyword('')}
          className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
          aria-label="清除搜索"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}
    </div>
  );
});

export default SearchBar;
