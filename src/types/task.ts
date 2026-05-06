// 任务状态
export const TaskStatus = {
  PENDING: 'pending',
  COMPLETED: 'completed'
} as const;
export type TaskStatus = (typeof TaskStatus)[keyof typeof TaskStatus];

// 任务优先级
export const TaskPriority = {
  HIGH: 'high',
  MEDIUM: 'medium',
  LOW: 'low'
} as const;
export type TaskPriority = (typeof TaskPriority)[keyof typeof TaskPriority];

// 标签类型
export interface Tag {
  id: string;
  name: string;
  color: string;
  createTime: string;
}

// 任务核心类型
export interface Task {
  id: string;
  title: string;
  content: string;
  status: TaskStatus;
  priority: TaskPriority;
  tagIds: string[];
  deadline: string | null;
  remindAdvance: number | null;
  createTime: string;
  updateTime: string;
}

// 新增任务时需要传入的数据类型
export type CreateTaskData = Pick<Task, 'title' | 'content' | 'priority' | 'tagIds' | 'deadline' | 'remindAdvance'>;
