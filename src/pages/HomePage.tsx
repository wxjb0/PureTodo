import React, { useMemo, useState, useEffect, useCallback, useRef } from 'react';
import { useTaskStore } from '../store/taskStore';
import { TaskStatus } from '../types';
import { useTaskReminder } from '../hooks/useTaskReminder';
import { useNotificationPermission } from '../hooks/useNotificationPermission';
import { startOfDay, subDays, format, parseISO, isSameDay } from 'date-fns';
import TaskInput from '../components/TaskInput';
import SearchBar from '../components/SearchBar';
import FilterBar from '../components/FilterBar';
import TaskList from '../components/TaskList';
import TaskEditModal from '../components/TaskEditModal';

const HomePage = React.memo(function HomePage() {
  const taskList = useTaskStore((state) => state.taskList);
  const exportData = useTaskStore((state) => state.exportData);
  const importData = useTaskStore((state) => state.importData);
  const isEditModalOpen = useTaskStore((state) => state.isEditModalOpen);
  const { supported, permission, requestPermission } = useNotificationPermission();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [showShortcuts, setShowShortcuts] = useState(false);
  const [importStatus, setImportStatus] = useState<'success' | 'error' | null>(null);

  useTaskReminder();

  const stats = useMemo(() => {
    const total = taskList.length;
    const completed = taskList.filter((t) => t.status === TaskStatus.COMPLETED).length;
    const pending = total - completed;
    const progress = total > 0 ? Math.round((completed / total) * 100) : 0;
    return { total, completed, pending, progress };
  }, [taskList]);

  // 近7天完成趋势
  const weeklyTrend = useMemo(() => {
    const today = startOfDay(new Date());
    const days = Array.from({ length: 7 }, (_, i) => {
      const date = subDays(today, 6 - i);
      const count = taskList.filter(
        (t) => t.completedTime && isSameDay(parseISO(t.completedTime), date)
      ).length;
      return { date, count, label: format(date, 'MM/dd') };
    });
    const maxCount = Math.max(...days.map((d) => d.count), 1);
    return { days, maxCount };
  }, [taskList]);

  // 连续打卡天数
  const streak = useMemo(() => {
    const today = startOfDay(new Date());
    let count = 0;
    for (let i = 0; i < 365; i++) {
      const date = subDays(today, i);
      const hasCompleted = taskList.some(
        (t) => t.completedTime && isSameDay(parseISO(t.completedTime), date)
      );
      if (hasCompleted) {
        count++;
      } else {
        break;
      }
    }
    return count;
  }, [taskList]);

  // 键盘快捷键
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      const isInput = target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable;
      if (isInput) return;
      if (isEditModalOpen) return;

      if (e.key === 'n' || e.key === 'N') {
        e.preventDefault();
        document.querySelector<HTMLInputElement>('[data-task-input]')?.focus();
      } else if (e.key === '/') {
        e.preventDefault();
        document.querySelector<HTMLInputElement>('[data-search-input]')?.focus();
      } else if (e.key === '?') {
        e.preventDefault();
        setShowShortcuts((prev) => !prev);
      }
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [isEditModalOpen]);

  const handleExport = useCallback(() => {
    const json = exportData();
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    const date = format(new Date(), 'yyyyMMdd');
    a.href = url;
    a.download = `轻办备份_${date}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }, [exportData]);

  const handleImport = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (ev) => {
        const text = ev.target?.result as string;
        const ok = importData(text);
        setImportStatus(ok ? 'success' : 'error');
        setTimeout(() => setImportStatus(null), 2000);
      };
      reader.readAsText(file);
      e.target.value = '';
    },
    [importData]
  );

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
          <div className="flex items-center justify-center gap-3">
            <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-brand-600 to-purple-600 bg-clip-text text-transparent">
              轻办
            </h1>
            <div className="flex items-center gap-1">
              <button
                onClick={handleExport}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:text-macaron-green hover:bg-white/60 transition-all"
                title="导出数据"
              >
                <i className="fa-regular fa-download sketch-icon sketch-icon-tilt-2 text-sm" />
              </button>
              <button
                onClick={handleImport}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:text-macaron-blue hover:bg-white/60 transition-all"
                title="导入数据"
              >
                <i className="fa-regular fa-upload sketch-icon sketch-icon-tilt-4 text-sm" />
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept=".json"
                onChange={handleFileChange}
                className="hidden"
              />
            </div>
          </div>
          <p className="text-sm text-gray-400 mt-1.5">简洁高效的待办管理</p>
          {importStatus && (
            <p className={`mt-2 text-xs animate-fade-in ${importStatus === 'success' ? 'text-green-500' : 'text-red-500'}`}>
              {importStatus === 'success' ? '导入成功' : '导入失败，请检查文件格式'}
            </p>
          )}
        </header>

        {/* 统计卡片 */}
        {stats.total > 0 && (
          <div className="grid grid-cols-3 gap-3 mb-4 animate-slide-up">
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

        {/* 增强统计面板 */}
        {stats.total > 0 && (
          <div className="glass rounded-2xl p-4 shadow-glass mb-4 animate-slide-up">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-medium text-gray-500">近7天完成趋势</span>
              <span className="text-xs text-gray-400">
                <i className="fa-solid fa-fire sketch-icon macaron-peach text-[10px] mr-0.5" />
                连续 {streak} 天
              </span>
            </div>
            <div className="flex items-end gap-1.5 h-16">
              {weeklyTrend.days.map((day, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-1">
                  <div
                    className="w-full rounded-t-md transition-all duration-300 min-h-[2px]"
                    style={{
                      height: `${(day.count / weeklyTrend.maxCount) * 48}px`,
                      background: day.count > 0
                        ? 'linear-gradient(180deg, #B5D8FF 0%, #5c7cfa 100%)'
                        : '#e5e7eb',
                    }}
                  />
                  <span className="text-[9px] text-gray-400">{day.label.slice(-2)}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 通知权限提示 */}
        {supported && permission === 'default' && (
          <div className="mb-4 p-3 glass rounded-2xl flex items-center justify-between shadow-glass animate-slide-up">
            <div className="flex items-center gap-2">
              <i className="fa-regular fa-bell sketch-icon sketch-icon-tilt-4 macaron-yellow text-lg" />
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

        {/* 底部：快捷键提示 */}
        <div className="mt-6 flex justify-center">
          <button
            onClick={() => setShowShortcuts((prev) => !prev)}
            className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-gray-600 transition-colors"
          >
            <i className="fa-regular fa-keyboard sketch-icon sketch-icon-tilt-1 text-sm" />
            按 ? 查看快捷键
          </button>
        </div>

        {/* 快捷键面板 */}
        {showShortcuts && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in" onClick={() => setShowShortcuts(false)}>
            <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" />
            <div
              className="relative glass-strong rounded-2xl p-6 shadow-glass-lg max-w-xs w-full animate-scale-in"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                <i className="fa-regular fa-keyboard sketch-icon sketch-icon-tilt-1 text-brand-500" />
                键盘快捷键
              </h3>
              <div className="space-y-2 text-xs text-gray-600">
                <div className="flex justify-between">
                  <span>新建任务</span>
                  <kbd className="px-1.5 py-0.5 bg-gray-100 rounded text-gray-500 font-mono">N</kbd>
                </div>
                <div className="flex justify-between">
                  <span>搜索任务</span>
                  <kbd className="px-1.5 py-0.5 bg-gray-100 rounded text-gray-500 font-mono">/</kbd>
                </div>
                <div className="flex justify-between">
                  <span>关闭弹窗</span>
                  <kbd className="px-1.5 py-0.5 bg-gray-100 rounded text-gray-500 font-mono">Esc</kbd>
                </div>
                <div className="flex justify-between">
                  <span>显示/隐藏快捷键</span>
                  <kbd className="px-1.5 py-0.5 bg-gray-100 rounded text-gray-500 font-mono">?</kbd>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 底部留白 */}
        <div className="h-8" />
      </div>

      {/* 编辑弹窗 */}
      <TaskEditModal />
    </div>
  );
});

export default HomePage;
