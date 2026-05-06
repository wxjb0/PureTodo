import React, { useMemo } from 'react';
import { useTaskStore } from '../store/taskStore';
import { TaskStatus } from '../types';
import { useTaskReminder } from '../hooks/useTaskReminder';
import { useNotificationPermission } from '../hooks/useNotificationPermission';
import TaskInput from '../components/TaskInput';
import SearchBar from '../components/SearchBar';
import FilterBar from '../components/FilterBar';
import TaskList from '../components/TaskList';
import TaskEditModal from '../components/TaskEditModal';

const HomePage = React.memo(function HomePage() {
  const taskList = useTaskStore((state) => state.taskList);
  const { supported, permission, requestPermission } = useNotificationPermission();

  useTaskReminder();

  const stats = useMemo(() => {
    const total = taskList.length;
    const completed = taskList.filter((t) => t.status === TaskStatus.COMPLETED).length;
    const pending = total - completed;
    const progress = total > 0 ? Math.round((completed / total) * 100) : 0;
    return { total, completed, pending, progress };
  }, [taskList]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* 背景装饰 */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-brand-200/30 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-200/20 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-xl mx-auto py-8 px-4 sm:px-6">
        {/* 头部 */}
        <header className="text-center mb-8 animate-fade-in">
          <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-brand-600 to-purple-600 bg-clip-text text-transparent">
            轻办
          </h1>
          <p className="text-sm text-gray-400 mt-1.5">简洁高效的待办管理</p>
        </header>

        {/* 统计卡片 */}
        {stats.total > 0 && (
          <div className="grid grid-cols-3 gap-3 mb-6 animate-slide-up">
            <div className="glass rounded-2xl p-3 text-center shadow-glass">
              <p className="text-2xl font-bold text-gray-800">{stats.pending}</p>
              <p className="text-xs text-gray-400 mt-0.5">待办</p>
            </div>
            <div className="glass rounded-2xl p-3 text-center shadow-glass">
              <p className="text-2xl font-bold text-brand-600">{stats.completed}</p>
              <p className="text-xs text-gray-400 mt-0.5">完成</p>
            </div>
            <div className="glass rounded-2xl p-3 text-center shadow-glass">
              <div className="relative w-12 h-12 mx-auto">
                <svg className="w-12 h-12 -rotate-90" viewBox="0 0 36 36">
                  <circle cx="18" cy="18" r="15" fill="none" stroke="#e5e7eb" strokeWidth="3" />
                  <circle
                    cx="18" cy="18" r="15" fill="none"
                    stroke="url(#progressGradient)"
                    strokeWidth="3"
                    strokeDasharray={`${stats.progress * 0.942} 100`}
                    strokeLinecap="round"
                  />
                  <defs>
                    <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#4c6ef5" />
                      <stop offset="100%" stopColor="#8b5cf6" />
                    </linearGradient>
                  </defs>
                </svg>
                <span className="absolute inset-0 flex items-center justify-center text-xs font-bold text-gray-700">
                  {stats.progress}%
                </span>
              </div>
              <p className="text-xs text-gray-400 mt-1">进度</p>
            </div>
          </div>
        )}

        {/* 通知权限提示 */}
        {supported && permission === 'default' && (
          <div className="mb-4 p-3 glass rounded-2xl flex items-center justify-between shadow-glass animate-slide-up">
            <div className="flex items-center gap-2">
              <span className="text-lg">🔔</span>
              <span className="text-sm text-gray-600">开启通知以接收到期提醒</span>
            </div>
            <button
              onClick={requestPermission}
              className="px-3 py-1.5 text-xs font-medium bg-brand-500 text-white rounded-lg hover:bg-brand-600 transition-colors shadow-sm"
            >
              开启
            </button>
          </div>
        )}

        {/* 任务输入 */}
        <div className="mb-5 animate-slide-up">
          <TaskInput />
        </div>

        {/* 搜索栏 */}
        <div className="mb-3">
          <SearchBar />
        </div>

        {/* 筛选栏 */}
        <div className="mb-5">
          <FilterBar />
        </div>

        {/* 任务列表 */}
        <TaskList />

        {/* 底部留白 */}
        <div className="h-8" />
      </div>

      {/* 编辑弹窗 */}
      <TaskEditModal />
    </div>
  );
});

export default HomePage;
