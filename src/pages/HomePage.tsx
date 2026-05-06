import React from 'react';
import { useTaskStore } from '../store/taskStore';
import { useTaskReminder } from '../hooks/useTaskReminder';
import { useNotificationPermission } from '../hooks/useNotificationPermission';
import TaskInput from '../components/TaskInput';
import SearchBar from '../components/SearchBar';
import FilterBar from '../components/FilterBar';
import TaskList from '../components/TaskList';
import TaskEditModal from '../components/TaskEditModal';
import Button from '../components/ui/Button';

const HomePage = React.memo(function HomePage() {
  const taskList = useTaskStore((state) => state.taskList);
  const { supported, permission, requestPermission } = useNotificationPermission();

  // 启动任务提醒
  useTaskReminder();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto py-6 px-4 sm:px-6">
        {/* 头部 */}
        <header className="text-center mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">轻办</h1>
          <p className="text-sm text-gray-500 mt-1">简洁高效的待办管理</p>
        </header>

        {/* 通知权限提示 */}
        {supported && permission === 'default' && (
          <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg flex items-center justify-between">
            <span className="text-sm text-blue-700">开启通知以接收任务到期提醒</span>
            <Button variant="primary" size="sm" onClick={requestPermission}>
              开启
            </Button>
          </div>
        )}

        {/* 任务输入 */}
        <div className="mb-4">
          <TaskInput />
        </div>

        {/* 搜索栏 */}
        <div className="mb-3">
          <SearchBar />
        </div>

        {/* 筛选栏 */}
        <div className="mb-4">
          <FilterBar />
        </div>

        {/* 任务统计 */}
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm text-gray-500">
            共 {taskList.length} 个任务
          </span>
        </div>

        {/* 任务列表 */}
        <TaskList />
      </div>

      {/* 编辑弹窗 */}
      <TaskEditModal />
    </div>
  );
});

export default HomePage;
