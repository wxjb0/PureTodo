import React, { useCallback } from 'react';
import { useTaskStore } from '../store/taskStore';

const SearchBar = React.memo(function SearchBar() {
  const keyword = useTaskStore((state) => state.searchFilter.keyword);
  const updateSearchKeyword = useTaskStore((state) => state.updateSearchKeyword);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      updateSearchKeyword(e.target.value);
    },
    [updateSearchKeyword]
  );

  return (
    <div className="relative group">
      <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-brand-500 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
      <input
        type="text"
        value={keyword}
        onChange={handleChange}
        placeholder="搜索任务标题或备注..."
        className="w-full pl-10 pr-10 py-2.5 bg-white border border-gray-200 rounded-xl text-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-brand-300 focus:border-brand-400 placeholder:text-gray-400 shadow-sm hover:shadow"
      />
      {keyword && (
        <button
          onClick={() => updateSearchKeyword('')}
          className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 hover:bg-gray-300 hover:text-gray-700 transition-colors"
          aria-label="清除搜索"
        >
          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}
    </div>
  );
});

export default SearchBar;
