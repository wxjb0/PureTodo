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

const priorityColors: Record<TaskPriority, string> = {
  [TaskPriority.HIGH]: 'bg-red-500',
  [TaskPriority.MEDIUM]: 'bg-yellow-500',
  [TaskPriority.LOW]: 'bg-gray-400',
};

const priorityLabels: Record<TaskPriority, string> = {
  [TaskPriority.HIGH]: '高',
  [TaskPriority.MEDIUM]: '中',
  [TaskPriority.LOW]: '低',
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

  // 任务关联的标签
  const taskTags = useMemo(
    () => tagList.filter((tag) => task.tagIds.includes(tag.id)),
    [tagList, task.tagIds]
  );

  // 截止时间状态
  const deadlineStatus = useMemo(() => {
    if (!task.deadline) return null;
    if (isCompleted) return { text: formatDeadline(task.deadline), style: 'text-gray-400' };
    if (isDeadlineExpired(task.deadline)) return { text: '已过期', style: 'text-red-500 font-medium' };
    if (isDeadlineSoon(task.deadline)) return { text: '即将到期', style: 'text-yellow-600 font-medium' };
    return { text: formatDeadline(task.deadline), style: 'text-gray-500' };
  }, [task.deadline, isCompleted]);

  return (
    <div
      onClick={handleEdit}
      className={`flex items-start gap-3 p-3 rounded-lg border transition-colors cursor-pointer group ${isCompleted ? 'bg-gray-50 border-gray-200' : 'bg-white border-gray-200 hover:border-blue-300 hover:shadow-sm'}`}
    >
      {/* 复选框 */}
      <div className="pt-0.5" onClick={(e) => e.stopPropagation()}>
        <Checkbox checked={isCompleted} onChange={handleToggle} />
      </div>

      {/* 主内容 */}
      <div className="flex-1 min-w-0">
        {/* 标题行 */}
        <div className="flex items-center gap-2">
          {/* 优先级色标 */}
          <span
            className={`w-2 h-2 rounded-full flex-shrink-0 ${priorityColors[task.priority]}`}
            title={`优先级：${priorityLabels[task.priority]}`}
          />
          <span
            className={`flex-1 truncate ${isCompleted ? 'line-through text-gray-400' : 'text-gray-800'}`}
          >
            {task.title}
          </span>
        </div>

        {/* 备注预览 */}
        {task.content && (
          <p className={`mt-1 text-sm truncate ${isCompleted ? 'text-gray-300' : 'text-gray-500'}`}>
            {task.content}
          </p>
        )}

        {/* 底部信息：标签 + 截止时间 */}
        <div className="flex items-center gap-2 mt-1.5 flex-wrap">
          {taskTags.map((tag) => (
            <TagChip key={tag.id} name={tag.name} color={tag.color} />
          ))}
          {deadlineStatus && (
            <span className={`text-xs ${deadlineStatus.style}`}>
              {deadlineStatus.text}
            </span>
          )}
        </div>
      </div>
    </div>
  );
});

export default TaskItem;
