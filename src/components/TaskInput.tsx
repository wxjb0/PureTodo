import React, { useState, useCallback } from 'react';
import { useTaskStore } from '../store/taskStore';
import { TaskPriority } from '../types';
import Input from './ui/Input';
import Button from './ui/Button';

const TaskInput = React.memo(function TaskInput() {
  const addTask = useTaskStore((state) => state.addTask);
  const [title, setTitle] = useState('');
  const [error, setError] = useState('');

  const handleAdd = useCallback(() => {
    const trimmed = title.trim();
    if (!trimmed) {
      setError('任务标题不能为空');
      return;
    }
    addTask({
      title: trimmed,
      content: '',
      priority: TaskPriority.MEDIUM,
      tagIds: [],
      deadline: null,
      remindAdvance: null,
    });
    setTitle('');
    setError('');
  }, [title, addTask]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        handleAdd();
      }
    },
    [handleAdd]
  );

  const handleChange = useCallback((value: string) => {
    setTitle(value);
    if (error) setError('');
  }, [error]);

  return (
    <div className="w-full">
      <div className="flex gap-2">
        <div className="flex-1">
          <Input
            value={title}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            placeholder="添加新任务，按回车确认..."
            autoFocus
          />
        </div>
        <Button variant="primary" onClick={handleAdd}>
          添加
        </Button>
      </div>
      {error && (
        <p className="mt-1 text-sm text-red-500">{error}</p>
      )}
    </div>
  );
});

export default TaskInput;
