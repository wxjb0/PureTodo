import React, { useCallback } from 'react';
import { useTaskStore } from '../store/taskStore';
import { TaskStatus } from '../types';
import TaskItem from './TaskItem';
import EmptyState from './ui/EmptyState';
import Button from './ui/Button';

const TaskList = React.memo(function TaskList() {
  const filteredTaskList = useTaskStore((state) => state.filteredTaskList);
  const batchDeleteCompletedTasks = useTaskStore((state) => state.batchDeleteCompletedTasks);
  const taskList = useTaskStore((state) => state.taskList);

  const tasks = filteredTaskList();
  const hasCompletedTasks = taskList.some((t) => t.status === TaskStatus.COMPLETED);

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
    <div className="space-y-2">
      {/* 任务列表 */}
      {tasks.map((task) => (
        <TaskItem key={task.id} task={task} />
      ))}

      {/* 批量删除已完成 */}
      {hasCompletedTasks && (
        <div className="flex justify-end pt-2">
          <Button variant="ghost" size="sm" onClick={handleBatchDelete}>
            清除已完成任务
          </Button>
        </div>
      )}
    </div>
  );
});

export default TaskList;
