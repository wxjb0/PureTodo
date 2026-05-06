import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Task, Tag, CreateTaskData, FilterParams, SearchFilterState } from '../types';
import { TaskStatus, TaskPriority } from '../types';
import { generateUUID } from '../utils/idUtils';
import { formatISO } from 'date-fns';

interface TaskStoreState {
  // 核心数据状态
  taskList: Task[];
  tagList: Tag[];
  // 搜索与筛选状态
  searchFilter: SearchFilterState;
  // 弹窗控制状态
  isEditModalOpen: boolean;
  currentEditTaskId: string | null;

  // 任务核心操作Action
  addTask: (taskData: CreateTaskData) => void;
  editTask: (taskId: string, updateData: Partial<Task>) => void;
  toggleTaskStatus: (taskId: string) => void;
  deleteTask: (taskId: string) => void;
  batchDeleteCompletedTasks: () => void;

  // 标签管理Action
  addTag: (name: string, color: string) => void;
  deleteTag: (tagId: string) => void;

  // 搜索与筛选Action
  updateSearchKeyword: (keyword: string) => void;
  updateFilterParams: (params: Partial<FilterParams>) => void;
  clearFilter: () => void;

  // 弹窗控制Action
  openEditModal: (taskId: string | null) => void;
  closeEditModal: () => void;

  // 计算属性：过滤后的任务列表
  filteredTaskList: () => Task[];
}

export const useTaskStore = create<TaskStoreState>()(
  persist(
    (set, get) => ({
      taskList: [],
      tagList: [],
      searchFilter: {
        keyword: '',
        filterParams: {
          status: 'all',
          priority: 'all',
          tagIds: []
        }
      },
      isEditModalOpen: false,
      currentEditTaskId: null,

      addTask: (taskData) => {
        const newTask: Task = {
          id: generateUUID(),
          title: taskData.title,
          content: taskData.content || '',
          status: TaskStatus.PENDING,
          priority: taskData.priority || TaskPriority.MEDIUM,
          tagIds: taskData.tagIds || [],
          deadline: taskData.deadline || null,
          remindAdvance: taskData.remindAdvance || null,
          createTime: formatISO(new Date()),
          updateTime: formatISO(new Date())
        };
        set((state) => ({
          taskList: [newTask, ...state.taskList]
        }));
      },

      editTask: (taskId, updateData) => {
        set((state) => ({
          taskList: state.taskList.map((task) =>
            task.id === taskId
              ? { ...task, ...updateData, updateTime: formatISO(new Date()) }
              : task
          )
        }));
      },

      toggleTaskStatus: (taskId) => {
        set((state) => ({
          taskList: state.taskList.map((task) => {
            if (task.id === taskId) {
              const newStatus = task.status === TaskStatus.PENDING
                ? TaskStatus.COMPLETED
                : TaskStatus.PENDING;
              return { ...task, status: newStatus, updateTime: formatISO(new Date()) };
            }
            return task;
          })
        }));
      },

      deleteTask: (taskId) => {
        set((state) => ({
          taskList: state.taskList.filter((task) => task.id !== taskId)
        }));
      },

      batchDeleteCompletedTasks: () => {
        set((state) => ({
          taskList: state.taskList.filter((task) => task.status !== TaskStatus.COMPLETED)
        }));
      },

      addTag: (name, color) => {
        const newTag: Tag = {
          id: generateUUID(),
          name,
          color,
          createTime: formatISO(new Date())
        };
        set((state) => ({
          tagList: [...state.tagList, newTag]
        }));
      },

      deleteTag: (tagId) => {
        set((state) => ({
          tagList: state.tagList.filter((tag) => tag.id !== tagId),
          taskList: state.taskList.map((task) => ({
            ...task,
            tagIds: task.tagIds.filter((id) => id !== tagId)
          }))
        }));
      },

      updateSearchKeyword: (keyword) => {
        set((state) => ({
          searchFilter: { ...state.searchFilter, keyword }
        }));
      },

      updateFilterParams: (params) => {
        set((state) => ({
          searchFilter: {
            ...state.searchFilter,
            filterParams: { ...state.searchFilter.filterParams, ...params }
          }
        }));
      },

      clearFilter: () => {
        set((state) => ({
          searchFilter: {
            ...state.searchFilter,
            keyword: '',
            filterParams: {
              status: 'all',
              priority: 'all',
              tagIds: []
            }
          }
        }));
      },

      openEditModal: (taskId) => {
        set({
          isEditModalOpen: true,
          currentEditTaskId: taskId
        });
      },

      closeEditModal: () => {
        set({
          isEditModalOpen: false,
          currentEditTaskId: null
        });
      },

      filteredTaskList: () => {
        const { taskList, searchFilter } = get();
        const { keyword, filterParams } = searchFilter;

        let result = [...taskList];

        // 关键词搜索过滤
        if (keyword.trim()) {
          const lowerKeyword = keyword.toLowerCase().trim();
          result = result.filter(
            (task) =>
              task.title.toLowerCase().includes(lowerKeyword) ||
              task.content.toLowerCase().includes(lowerKeyword)
          );
        }

        // 状态过滤
        if (filterParams.status !== 'all') {
          result = result.filter((task) => task.status === filterParams.status);
        }

        // 优先级过滤
        if (filterParams.priority !== 'all') {
          result = result.filter((task) => task.priority === filterParams.priority);
        }

        // 标签过滤
        if (filterParams.tagIds.length > 0) {
          result = result.filter((task) =>
            filterParams.tagIds.some((tagId) => task.tagIds.includes(tagId))
          );
        }

        // 排序：未完成任务置顶，同状态下高优在前，同优先级下创建时间倒序
        result.sort((a, b) => {
          if (a.status !== b.status) {
            return a.status === TaskStatus.PENDING ? -1 : 1;
          }
          const priorityOrder: Record<TaskPriority, number> = {
            [TaskPriority.HIGH]: 0,
            [TaskPriority.MEDIUM]: 1,
            [TaskPriority.LOW]: 2
          };
          if (a.priority !== b.priority) {
            return priorityOrder[a.priority] - priorityOrder[b.priority];
          }
          return new Date(b.createTime).getTime() - new Date(a.createTime).getTime();
        });

        return result;
      }
    }),
    {
      name: 'personal-todo-storage',
      partialize: (state) => ({
        taskList: state.taskList,
        tagList: state.tagList,
        searchFilter: state.searchFilter
      })
    }
  )
);
