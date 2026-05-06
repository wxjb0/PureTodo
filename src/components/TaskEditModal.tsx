import React, { useState, useEffect, useCallback } from 'react';
import { useTaskStore } from '../store/taskStore';
import { TaskPriority } from '../types';
import { formatISO, parseISO } from 'date-fns';
import Modal from './ui/Modal';
import Button from './ui/Button';
import TagSelector from './TagSelector';

const priorityOptions = [
  { value: TaskPriority.HIGH, label: '高优', color: 'text-red-500', bg: 'bg-red-50 border-red-200', activeBg: 'bg-red-500 border-red-500 text-white' },
  { value: TaskPriority.MEDIUM, label: '中优', color: 'text-amber-500', bg: 'bg-amber-50 border-amber-200', activeBg: 'bg-amber-500 border-amber-500 text-white' },
  { value: TaskPriority.LOW, label: '低优', color: 'text-gray-500', bg: 'bg-gray-50 border-gray-200', activeBg: 'bg-gray-500 border-gray-500 text-white' },
];

const remindOptions = [
  { value: null, label: '不提醒' },
  { value: 5, label: '5分钟' },
  { value: 10, label: '10分钟' },
  { value: 30, label: '30分钟' },
];

function toLocalDatetime(isoString: string): string {
  const date = parseISO(isoString);
  const offset = date.getTimezoneOffset();
  const local = new Date(date.getTime() - offset * 60 * 1000);
  return local.toISOString().slice(0, 16);
}

const TaskEditModal = React.memo(function TaskEditModal() {
  const isOpen = useTaskStore((state) => state.isEditModalOpen);
  const currentEditTaskId = useTaskStore((state) => state.currentEditTaskId);
  const taskList = useTaskStore((state) => state.taskList);
  const editTask = useTaskStore((state) => state.editTask);
  const deleteTask = useTaskStore((state) => state.deleteTask);
  const closeEditModal = useTaskStore((state) => state.closeEditModal);

  const task = currentEditTaskId ? taskList.find((t) => t.id === currentEditTaskId) ?? null : null;

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [priority, setPriority] = useState<TaskPriority>(TaskPriority.MEDIUM);
  const [tagIds, setTagIds] = useState<string[]>([]);
  const [deadline, setDeadline] = useState('');
  const [remindAdvance, setRemindAdvance] = useState<number | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [titleError, setTitleError] = useState('');

  useEffect(() => {
    if (task) {
      setTitle(task.title);
      setContent(task.content);
      setPriority(task.priority);
      setTagIds(task.tagIds);
      setDeadline(task.deadline ? toLocalDatetime(task.deadline) : '');
      setRemindAdvance(task.remindAdvance);
      setShowDeleteConfirm(false);
      setTitleError('');
    }
  }, [task]);

  const handleSave = useCallback(() => {
    const trimmed = title.trim();
    if (!trimmed) {
      setTitleError('任务标题不能为空');
      return;
    }
    if (!currentEditTaskId) return;
    editTask(currentEditTaskId, {
      title: trimmed,
      content,
      priority,
      tagIds,
      deadline: deadline ? formatISO(new Date(deadline)) : null,
      remindAdvance,
    });
    closeEditModal();
  }, [title, content, priority, tagIds, deadline, remindAdvance, currentEditTaskId, editTask, closeEditModal]);

  const handleDelete = useCallback(() => {
    if (!currentEditTaskId) return;
    deleteTask(currentEditTaskId);
    closeEditModal();
  }, [currentEditTaskId, deleteTask, closeEditModal]);

  if (!task) return null;

  return (
    <Modal isOpen={isOpen} onClose={closeEditModal} title="编辑任务" maxWidth="lg">
      <div className="space-y-5">
        {/* 标题 */}
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1.5">任务标题</label>
          <input
            type="text"
            value={title}
            onChange={(e) => { setTitle(e.target.value); if (titleError) setTitleError(''); }}
            className={`w-full px-4 py-2.5 bg-gray-50 border rounded-xl text-sm transition-all focus:outline-none focus:ring-2 focus:ring-brand-300 focus:bg-white ${titleError ? 'border-red-300' : 'border-gray-200'}`}
          />
          {titleError && <p className="mt-1 text-xs text-red-500">{titleError}</p>}
        </div>

        {/* 备注 */}
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1.5">备注</label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={3}
            className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm transition-all focus:outline-none focus:ring-2 focus:ring-brand-300 focus:bg-white resize-none"
            placeholder="添加备注（选填）"
          />
        </div>

        {/* 优先级 */}
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1.5">优先级</label>
          <div className="flex gap-2">
            {priorityOptions.map((opt) => (
              <button
                key={opt.value}
                onClick={() => setPriority(opt.value)}
                className={`flex-1 py-2 text-xs font-medium rounded-xl border transition-all ${priority === opt.value ? opt.activeBg + ' shadow-sm' : opt.bg + ' ' + opt.color + ' hover:shadow-sm'}`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* 截止时间 */}
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1.5">截止时间</label>
          <input
            type="datetime-local"
            value={deadline}
            onChange={(e) => setDeadline(e.target.value)}
            className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm transition-all focus:outline-none focus:ring-2 focus:ring-brand-300 focus:bg-white"
          />
        </div>

        {/* 提前提醒 */}
        {deadline && (
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1.5">提前提醒</label>
            <div className="flex gap-2">
              {remindOptions.map((opt) => (
                <button
                  key={opt.value ?? 'none'}
                  onClick={() => setRemindAdvance(opt.value)}
                  className={`flex-1 py-2 text-xs font-medium rounded-xl border transition-all ${remindAdvance === opt.value ? 'bg-brand-500 border-brand-500 text-white shadow-sm' : 'bg-gray-50 border-gray-200 text-gray-600 hover:shadow-sm'}`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* 标签 */}
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1.5">标签</label>
          <TagSelector selectedTagIds={tagIds} onChange={setTagIds} />
        </div>

        {/* 操作按钮 */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <div>
            {!showDeleteConfirm ? (
              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="text-xs text-gray-400 hover:text-red-500 transition-colors px-3 py-2 rounded-lg hover:bg-red-50"
              >
                删除任务
              </button>
            ) : (
              <div className="flex items-center gap-2 animate-fade-in">
                <span className="text-xs text-red-500">确认删除？</span>
                <Button variant="danger" size="sm" onClick={handleDelete}>确认</Button>
                <button onClick={() => setShowDeleteConfirm(false)} className="text-xs text-gray-400 hover:text-gray-600 px-2 py-1 rounded-lg hover:bg-gray-100 transition-colors">取消</button>
              </div>
            )}
          </div>
          <div className="flex gap-2">
            <Button variant="secondary" onClick={closeEditModal}>取消</Button>
            <Button variant="primary" onClick={handleSave}>保存</Button>
          </div>
        </div>
      </div>
    </Modal>
  );
});

export default TaskEditModal;
