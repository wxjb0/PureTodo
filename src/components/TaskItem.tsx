import React, { useCallback, useMemo } from 'react';
import { useTaskStore } from '../store/taskStore';
import type { Task } from '../types';
import { TaskPriority, TaskStatus } from '../types';
import { isDeadlineExpired, isDeadlineSoon, formatDeadline } from '../utils/dateUtils';
import Checkbox from './ui/Checkbox';
import TagChip from './TagChip';

interface TaskItemProps {
  task: Task;
}

const priorityConfig: Record<TaskPriority, { color: string; bg: string; label: string }> = {
  [TaskPriority.HIGH]: { color: 'bg-red-500', bg: 'bg-red-50', label: '高' },
  [TaskPriority.MEDIUM]: { color: 'bg-amber-500', bg: 'bg-amber-50', label: '中' },
  [TaskPriority.LOW]: { color: 'bg-gray-400', bg: 'bg-gray-50', label: '低' },
};

const TaskItem = React.memo(function TaskItem({ task }: TaskItemProps) {
  const toggleTaskStatus = useTaskStore((state) => state.toggleTaskStatus);
  const openEditModal = useTaskStore((state) => state.openEditModal);
  const tagList = useTaskStore((state) => state.tagList);

  const isCompleted = task.status === TaskStatus.COMPLETED;

  const handleToggle = useCallback(() => {
    toggleTaskStatus(task.id);
  }, [toggleTaskStatus, task.id]);

  const handleEdit = useCallback(() => {
    openEditModal(task.id);
  }, [openEditModal, task.id]);

  const taskTags = useMemo(
    () => tagList.filter((tag) => task.tagIds.includes(tag.id)),
    [tagList, task.tagIds]
  );

  const deadlineInfo = useMemo(() => {
    if (!task.deadline) return null;
    if (isCompleted) return { text: formatDeadline(task.deadline), style: 'text-gray-400', icon: '🕐' };
    if (isDeadlineExpired(task.deadline)) return { text: '已过期', style: 'text-red-500 font-medium', icon: '⚠️' };
    if (isDeadlineSoon(task.deadline)) return { text: '即将到期', style: 'text-amber-600 font-medium', icon: '⏰' };
    return { text: formatDeadline(task.deadline), style: 'text-gray-500', icon: '🕐' };
  }, [task.deadline, isCompleted]);

  const priority = priorityConfig[task.priority];

  return (
    <div
      onClick={handleEdit}
      className={`group relative flex items-start gap-3 p-4 rounded-2xl transition-all duration-200 cursor-pointer task-item-hover ${isCompleted ? 'glass opacity-70' : 'glass-strong shadow-glass hover:shadow-glass-lg'}`}
    >
      {/* 左侧优先级色条 */}
      <div className={`absolute left-0 top-3 bottom-3 w-1 rounded-full ${priority.color} ${isCompleted ? 'opacity-30' : ''}`} />

      {/* 复选框 */}
      <div className="pl-2 pt-0.5" onClick={(e) => e.stopPropagation()}>
        <Checkbox checked={isCompleted} onChange={handleToggle} />
      </div>

      {/* 内容 */}
      <div className="flex-1 min-w-0 pl-1">
        {/* 标题行 */}
        <div className="flex items-center gap-2">
          <span className={`flex-1 text-sm font-medium truncate ${isCompleted ? 'line-through text-gray-400' : 'text-gray-800'}`}>
            {task.title}
          </span>
          <span className={`px-1.5 py-0.5 text-[10px] font-medium rounded ${priority.bg} ${isCompleted ? 'text-gray-400' : 'text-gray-500'}`}>
            {priority.label}
          </span>
        </div>

        {/* 备注预览 */}
        {task.content && (
          <p className={`mt-1 text-xs truncate ${isCompleted ? 'text-gray-300' : 'text-gray-500'}`}>
            {task.content}
          </p>
        )}

        {/* 底部标签+截止时间 */}
        <div className="flex items-center gap-2 mt-2 flex-wrap">
          {taskTags.map((tag) => (
            <TagChip key={tag.id} name={tag.name} color={tag.color} />
          ))}
          {deadlineInfo && (
            <span className={`inline-flex items-center gap-1 text-xs ${deadlineInfo.style}`}>
              <span className="text-[10px]">{deadlineInfo.icon}</span>
              {deadlineInfo.text}
            </span>
          )}
        </div>
      </div>

      {/* 编辑提示 */}
      <div className="opacity-0 group-hover:opacity-100 transition-opacity pt-1">
        <svg className="w-4 h-4 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
        </svg>
      </div>
    </div>
  );
});

export default TaskItem;
