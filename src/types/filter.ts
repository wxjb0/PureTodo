import { TaskPriority, TaskStatus } from './task';

// 筛选参数类型
export interface FilterParams {
  status: TaskStatus | 'all';
  priority: TaskPriority | 'all';
  tagIds: string[];
}

// 搜索与筛选全局状态类型
export interface SearchFilterState {
  keyword: string;
  filterParams: FilterParams;
}
