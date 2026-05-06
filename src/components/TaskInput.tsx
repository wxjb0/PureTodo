import React, { useState, useCallback } from 'react';
import { useTaskStore } from '../store/taskStore';
import { TaskPriority } from '../types';

const TaskInput = React.memo(function TaskInput() {
  const addTask = useTaskStore((state) => state.addTask);
  const [title, setTitle] = useState('');
  const [error, setError] = useState('');
  const [isFocused, setIsFocused] = useState(false);

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

  return (
    <div className="w-full">
      <div className={`flex items-center gap-2 p-1.5 rounded-2xl transition-all duration-300 ${isFocused ? 'bg-white shadow-glass-lg ring-2 ring-brand-200' : 'glass shadow-glass'}`}>
        <div className="flex-1 relative">
          <i className="fa-regular fa-plus sketch-icon sketch-icon-tilt-2 absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-brand-400" />
          <input
            type="text"
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              if (error) setError('');
            }}
            onKeyDown={handleKeyDown}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder="添加新任务，按回车确认..."
            autoFocus
            data-task-input
            className="w-full pl-10 pr-4 py-3 bg-transparent text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none"
          />
        </div>
        <button
          onClick={handleAdd}
          className="flex-shrink-0 px-5 py-2.5 bg-brand-600 text-white text-sm font-medium rounded-xl hover:bg-brand-700 active:bg-brand-800 transition-all duration-200 shadow-sm hover:shadow-md"
        >
          添加
        </button>
      </div>
      {error && (
        <p className="mt-2 ml-2 text-xs text-red-500 animate-fade-in">{error}</p>
      )}
    </div>
  );
});

export default TaskInput;
