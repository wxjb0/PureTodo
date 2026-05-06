import React, { useState, useEffect, useCallback } from 'react';
import { useTaskStore } from '../store/taskStore';
import { TaskPriority } from '../types';
import { formatISO, parseISO } from 'date-fns';
import Modal from './ui/Modal';
import Button from './ui/Button';
import TagSelector from './TagSelector';

const priorityOptions = [
  { value: TaskPriority.HIGH, label: '高优', color: 'text-red-500' },
  { value: TaskPriority.MEDIUM, label: '中优', color: 'text-yellow-500' },
  { value: TaskPriority.LOW, label: '低优', color: 'text-gray-500' },
];

const remindOptions = [
  { value: null, label: '不提醒' },
  { value: 5, label: '提前5分钟' },
  { value: 10, label: '提前10分钟' },
  { value: 30, label: '提前30分钟' },
];

const TaskEditModal = React.memo(function TaskEditModal() {
  const isOpen = useTaskStore((state) => state.isEditModalOpen);
  const currentEditTaskId = useTaskStore((state) => state.currentEditTaskId);
  const taskList = useTaskStore((state) => state.taskList);
  const editTask = useTaskStore((state) => state.editTask);
  const deleteTask = useTaskStore((state) => state.deleteTask);
  const closeEditModal = useTaskStore((state) => state.closeEditModal);

  const task = currentEditTaskId
    ? taskList.find((t) => t.id === currentEditTaskId) ?? null
    : null;

  // 编辑表单状态
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [priority, setPriority] = useState<TaskPriority>(TaskPriority.MEDIUM);
  const [tagIds, setTagIds] = useState<string[]>([]);
  const [deadline, setDeadline] = useState('');
  const [remindAdvance, setRemindAdvance] = useState<number | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [titleError, setTitleError] = useState('');

  // 打开弹窗时回显数据
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

  // ISO字符串转本地datetime-local格式
  function toLocalDatetime(isoString: string): string {
    const date = parseISO(isoString);
    const offset = date.getTimezoneOffset();
    const local = new Date(date.getTime() - offset * 60 * 1000);
    return local.toISOString().slice(0, 16);
  }

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
      <div className="space-y-4">
        {/* 标题 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">标题</label>
          <input
            type="text"
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              if (titleError) setTitleError('');
            }}
            className={`w-full px-3 py-2 border rounded-md text-base focus:outline-none focus:ring-2 focus:ring-blue-300 ${titleError ? 'border-red-500' : 'border-gray-300'}`}
            placeholder="任务标题"
          />
          {titleError && <p className="mt-1 text-sm text-red-500">{titleError}</p>}
        </div>

        {/* 备注 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">备注</label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-base focus:outline-none focus:ring-2 focus:ring-blue-300 resize-none"
            placeholder="添加备注（选填）"
          />
        </div>

        {/* 优先级 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">优先级</label>
          <div className="flex gap-3">
            {priorityOptions.map((opt) => (
              <label key={opt.value} className="flex items-center gap-1.5 cursor-pointer">
                <input
                  type="radio"
                  name="priority"
                  value={opt.value}
                  checked={priority === opt.value}
                  onChange={() => setPriority(opt.value)}
                  className="w-4 h-4 text-blue-500 focus:ring-blue-300"
                />
                <span className={`text-sm font-medium ${opt.color}`}>{opt.label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* 截止时间 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">截止时间</label>
          <input
            type="datetime-local"
            value={deadline}
            onChange={(e) => setDeadline(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-base focus:outline-none focus:ring-2 focus:ring-blue-300"
          />
        </div>

        {/* 提前提醒 */}
        {deadline && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">提前提醒</label>
            <div className="flex gap-3 flex-wrap">
              {remindOptions.map((opt) => (
                <label key={opt.value ?? 'none'} className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="radio"
                    name="remind"
                    checked={remindAdvance === opt.value}
                    onChange={() => setRemindAdvance(opt.value)}
                    className="w-4 h-4 text-blue-500 focus:ring-blue-300"
                  />
                  <span className="text-sm text-gray-700">{opt.label}</span>
                </label>
              ))}
            </div>
          </div>
        )}

        {/* 标签 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">标签</label>
          <TagSelector selectedTagIds={tagIds} onChange={setTagIds} />
        </div>

        {/* 操作按钮 */}
        <div className="flex items-center justify-between pt-2 border-t border-gray-200">
          <div>
            {!showDeleteConfirm ? (
              <Button variant="danger" size="sm" onClick={() => setShowDeleteConfirm(true)}>
                删除任务
              </Button>
            ) : (
              <div className="flex items-center gap-2">
                <span className="text-sm text-red-500">确认删除？</span>
                <Button variant="danger" size="sm" onClick={handleDelete}>
                  确认
                </Button>
                <Button variant="ghost" size="sm" onClick={() => setShowDeleteConfirm(false)}>
                  取消
                </Button>
              </div>
            )}
          </div>
          <div className="flex gap-2">
            <Button variant="secondary" onClick={closeEditModal}>
              取消
            </Button>
            <Button variant="primary" onClick={handleSave}>
              保存
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
});

export default TaskEditModal;
