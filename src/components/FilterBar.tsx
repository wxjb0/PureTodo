import React, { useCallback, useMemo } from 'react';
import { useTaskStore } from '../store/taskStore';
import { TaskStatus, TaskPriority } from '../types';
import TagChip from './TagChip';

const statusOptions = [
  { value: 'all' as const, label: '全部', icon: '◯' },
  { value: TaskStatus.PENDING, label: '待办', icon: '○' },
  { value: TaskStatus.COMPLETED, label: '完成', icon: '●' },
];

const priorityOptions = [
  { value: 'all' as const, label: '全部', color: 'text-gray-500' },
  { value: TaskPriority.HIGH, label: '高', color: 'text-red-500' },
  { value: TaskPriority.MEDIUM, label: '中', color: 'text-amber-500' },
  { value: TaskPriority.LOW, label: '低', color: 'text-gray-400' },
];

const FilterBar = React.memo(function FilterBar() {
  const filterParams = useTaskStore((state) => state.searchFilter.filterParams);
  const updateFilterParams = useTaskStore((state) => state.updateFilterParams);
  const clearFilter = useTaskStore((state) => state.clearFilter);
  const tagList = useTaskStore((state) => state.tagList);

  const handleStatusChange = useCallback(
    (status: TaskStatus | 'all') => updateFilterParams({ status }),
    [updateFilterParams]
  );

  const handlePriorityChange = useCallback(
    (priority: TaskPriority | 'all') => updateFilterParams({ priority }),
    [updateFilterParams]
  );

  const handleToggleTag = useCallback(
    (tagId: string) => {
      const current = filterParams.tagIds;
      updateFilterParams({
        tagIds: current.includes(tagId) ? current.filter((id) => id !== tagId) : [...current, tagId],
      });
    },
    [filterParams.tagIds, updateFilterParams]
  );

  const hasActiveFilter = useMemo(
    () => filterParams.status !== 'all' || filterParams.priority !== 'all' || filterParams.tagIds.length > 0,
    [filterParams]
  );

  return (
    <div className="glass rounded-2xl p-4 shadow-glass space-y-3 animate-slide-up">
      {/* 状态筛选 */}
      <div className="flex items-center gap-2">
        <span className="text-xs font-medium text-gray-400 w-12 flex-shrink-0">状态</span>
        <div className="flex gap-1.5">
          {statusOptions.map((opt) => (
            <button
              key={opt.value}
              onClick={() => handleStatusChange(opt.value)}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all duration-200 ${filterParams.status === opt.value
                ? 'bg-brand-500 text-white shadow-sm shadow-brand-200'
                : 'bg-white/60 text-gray-600 hover:bg-white hover:shadow-sm border border-gray-100'
                }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* 优先级筛选 */}
      <div className="flex items-center gap-2">
        <span className="text-xs font-medium text-gray-400 w-12 flex-shrink-0">优先</span>
        <div className="flex gap-1.5">
          {priorityOptions.map((opt) => (
            <button
              key={opt.value}
              onClick={() => handlePriorityChange(opt.value)}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all duration-200 ${filterParams.priority === opt.value
                ? 'bg-brand-500 text-white shadow-sm shadow-brand-200'
                : 'bg-white/60 text-gray-600 hover:bg-white hover:shadow-sm border border-gray-100'
                }`}
            >
              <span className={filterParams.priority === opt.value ? '' : opt.color}>●</span>
              {' '}{opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* 标签筛选 */}
      {tagList.length > 0 && (
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium text-gray-400 w-12 flex-shrink-0">标签</span>
          <div className="flex flex-wrap gap-1.5">
            {tagList.map((tag) => (
              <TagChip
                key={tag.id}
                name={tag.name}
                color={tag.color}
                selected={filterParams.tagIds.includes(tag.id)}
                onClick={() => handleToggleTag(tag.id)}
              />
            ))}
          </div>
        </div>
      )}

      {/* 清空 */}
      {hasActiveFilter && (
        <div className="flex justify-end pt-1">
          <button
            onClick={clearFilter}
            className="text-xs text-gray-400 hover:text-brand-600 transition-colors"
          >
            清空筛选
          </button>
        </div>
      )}
    </div>
  );
});

export default FilterBar;
