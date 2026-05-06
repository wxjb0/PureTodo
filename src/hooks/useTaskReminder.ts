import { useEffect, useRef } from 'react';
import { useTaskStore } from '../store/taskStore';
import { TaskStatus } from '../types';
import { calculateRemindTime } from '../utils/dateUtils';
import { sendNotification } from '../utils/notifyUtils';

export function useTaskReminder(): void {
  const taskList = useTaskStore((state) => state.taskList);
  const openEditModal = useTaskStore((state) => state.openEditModal);
  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => {
    // 清除之前的定时器
    timersRef.current.forEach((timer) => clearTimeout(timer));
    timersRef.current = [];

    // 遍历所有未完成且有截止时间的任务
    const pendingTasks = taskList.filter(
      (task) => task.status === TaskStatus.PENDING && task.deadline
    );

    pendingTasks.forEach((task) => {
      if (!task.deadline) return;

      const remindAdvance = task.remindAdvance ?? 0;
      const remindTime = calculateRemindTime(task.deadline, remindAdvance);
      const now = new Date();
      const delay = remindTime.getTime() - now.getTime();

      // 只设置未来的提醒
      if (delay > 0) {
        const timer = setTimeout(() => {
          sendNotification(
            '任务提醒',
            `"${task.title}" 即将到期`,
            () => openEditModal(task.id)
          );
        }, delay);
        timersRef.current.push(timer);
      }
    });

    // 组件卸载时清除所有定时器
    return () => {
      timersRef.current.forEach((timer) => clearTimeout(timer));
      timersRef.current = [];
    };
  }, [taskList, openEditModal]);
}
