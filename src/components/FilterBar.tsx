import React, { useCallback, useMemo } from 'react';
import { useTaskStore } from '../store/taskStore';
import { TaskStatus, TaskPriority } from '../types';
import TagChip from './TagChip';
import Button from './ui/Button';

const statusOptions = [
  { value: 'all' as const, label: '全部' },
  { value: TaskStatus.PENDING, label: '未完成' },
  { value: TaskStatus.COMPLETED, label: '已完成' },
];

const priorityOptions = [
  { value: 'all' as const, label: '全部' },
  { value: TaskPriority.HIGH, label: '高优' },
  { value: TaskPriority.MEDIUM, label: '中优' },
  { value: TaskPriority.LOW, label: '低优' },
];

const FilterBar = React.memo(function FilterBar() {
  const filterParams = useTaskStore((state) => state.searchFilter.filterParams);
  const updateFilterParams = useTaskStore((state) => state.updateFilterParams);
  const clearFilter = useTaskStore((state) => state.clearFilter);
  const tagList = useTaskStore((state) => state.tagList);

  const handleStatusChange = useCallback(
    (status: TaskStatus | 'all') => {
      updateFilterParams({ status });
    },
    [updateFilterParams]
  );

  const handlePriorityChange = useCallback(
    (priority: TaskPriority | 'all') => {
      updateFilterParams({ priority });
    },
    [updateFilterParams]
  );

  const handleToggleTag = useCallback(
    (tagId: string) => {
      const current = filterParams.tagIds;
      if (current.includes(tagId)) {
        updateFilterParams({ tagIds: current.filter((id) => id !== tagId) });
      } else {
        updateFilterParams({ tagIds: [...current, tagId] });
      }
    },
    [filterParams.tagIds, updateFilterParams]
  );

  // 是否有活跃的筛选条件
  const hasActiveFilter = useMemo(
    () =>
      filterParams.status !== 'all' ||
      filterParams.priority !== 'all' ||
      filterParams.tagIds.length > 0,
    [filterParams]
  );

  return (
    <div className="space-y-3">
      {/* 状态筛选 */}
      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-sm text-gray-500 flex-shrink-0">状态：</span>
        {statusOptions.map((opt) => (
          <button
            key={opt.value}
            onClick={() => handleStatusChange(opt.value)}
            className={`px-3 py-1 text-sm rounded-full border transition-colors min-h-[32px] ${filterParams.status === opt.value
              ? 'bg-blue-500 text-white border-blue-500'
              : 'bg-white text-gray-600 border-gray-300 hover:border-blue-400'
              }`}
          >
            {opt.label}
          </button>
        ))}
      </div>

      {/* 优先级筛选 */}
      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-sm text-gray-500 flex-shrink-0">优先级：</span>
        {priorityOptions.map((opt) => (
          <button
            key={opt.value}
            onClick={() => handlePriorityChange(opt.value)}
            className={`px-3 py-1 text-sm rounded-full border transition-colors min-h-[32px] ${filterParams.priority === opt.value
              ? 'bg-blue-500 text-white border-blue-500'
              : 'bg-white text-gray-600 border-gray-300 hover:border-blue-400'
              }`}
          >
            {opt.label}
          </button>
        ))}
      </div>

      {/* 标签筛选 */}
      {tagList.length > 0 && (
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-sm text-gray-500 flex-shrink-0">标签：</span>
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
      )}

      {/* 清空筛选 */}
      {hasActiveFilter && (
        <div className="flex justify-end">
          <Button variant="ghost" size="sm" onClick={clearFilter}>
            清空筛选
          </Button>
        </div>
      )}
    </div>
  );
});

export default FilterBar;
