import React, { useCallback } from 'react';
import { useTaskStore } from '../store/taskStore';
import { TaskStatus } from '../types';
import TaskItem from './TaskItem';
import EmptyState from './ui/EmptyState';

const TaskList = React.memo(function TaskList() {
  const filteredTaskList = useTaskStore((state) => state.filteredTaskList);
  const batchDeleteCompletedTasks = useTaskStore((state) => state.batchDeleteCompletedTasks);
  const taskList = useTaskStore((state) => state.taskList);

  const tasks = filteredTaskList();
  const completedCount = taskList.filter((t) => t.status === TaskStatus.COMPLETED).length;

  const handleBatchDelete = useCallback(() => {
    if (window.confirm('确定删除所有已完成任务？此操作不可撤销。')) {
      batchDeleteCompletedTasks();
    }
  }, [batchDeleteCompletedTasks]);

  if (tasks.length === 0) {
    return (
      <EmptyState
        title="暂无匹配任务"
        description="试试添加新任务或调整筛选条件"
      />
    );
  }

  return (
    <div className="space-y-2 animate-fade-in">
      {tasks.map((task, index) => (
        <div key={task.id} style={{ animationDelay: `${index * 30}ms` }} className="animate-slide-up">
          <TaskItem task={task} />
        </div>
      ))}

      {completedCount > 0 && (
        <div className="flex justify-center pt-3 pb-1">
          <button
            onClick={handleBatchDelete}
            className="text-xs text-gray-400 hover:text-red-500 transition-colors px-4 py-2 rounded-lg hover:bg-red-50"
          >
            清除 {completedCount} 个已完成任务
          </button>
        </div>
      )}
    </div>
  );
});

export default TaskList;
