个人自用待办网站 技术设计文档

## 一、文档基础信息

| 项目名称    | 个人自用待办网站                                             |
| ----------- | ------------------------------------------------------------ |
| 文档版本    | V1.0                                                         |
| 适配PRD版本 | V1.0 基础可用版                                              |
| 更新日期    | 2026年05月                                                   |
| 核心技术栈  | React 18 + TypeScript + Vite、Zustand、Tailwind CSS、date-fns、LocalStorage |
| 文档目的    | 对齐PRD功能需求，明确项目技术架构、模块拆分、实现方案与开发规范，为个人编码开发提供可直接落地的执行标准，保障项目快速开发、可维护、可扩展 |
| 阅读对象    | 项目开发者本人                                               |

## 二、技术选型详情

本项目为纯前端单页应用（SPA），无后端服务依赖，所有技术选型均遵循「轻量易上手、匹配个人开发能力、开发效率高」的原则，与PRD核心边界完全对齐，无AI、语音识别、云端服务等复杂功能引入。

| 技术/库       | 版本建议 | 核心用途     | 选型说明                                                     |
| ------------- | -------- | ------------ | ------------------------------------------------------------ |
| React         | 18.x     | 前端核心框架 | 采用函数式组件+Hooks开发模式，生态成熟，学习成本低，适配个人练手需求 |
| TypeScript    | 5.x      | 类型系统     | 为项目提供完整的静态类型约束，减少开发阶段的类型错误，提升代码可维护性 |
| Vite          | 5.x      | 构建工具     | 极速的热更新与构建能力，开箱即用的React+TS支持，远优于webpack的开发体验 |
| Zustand       | 4.x      | 状态管理     | 轻量级状态管理库，API极简，无Redux的样板代码，内置持久化中间件，完美适配LocalStorage数据同步，学习成本极低 |
| Tailwind CSS  | 3.x      | 样式方案     | 原子化CSS框架，无需编写大量自定义CSS，快速实现响应式布局，提升样式开发效率 |
| date-fns      | 3.x      | 日期处理     | 轻量级日期工具库，按需引入API，无冗余体积，替代moment.js，实现日期格式化、时间对比、周期计算等核心能力 |
| 浏览器原生API | -        | 通知能力     | 基于Notification API实现任务到期提醒，无需引入第三方推送服务，纯前端可实现 |
| LocalStorage  | -        | 数据存储     | 浏览器原生本地存储，实现全量数据持久化，无后端依赖，完全离线可用 |

## 三、整体架构设计

本项目为纯前端单页应用，采用极简的分层架构设计，职责清晰、拆分合理，便于个人开发维护，无过度设计，整体分为4层，从上到下依赖关系单向流动，避免循环依赖。

### 3.1 架构分层说明

1. **视图层**：负责页面渲染与用户交互，分为页面组件与通用业务组件，仅负责接收状态、触发动作，不处理复杂业务逻辑
2. **状态层**：基于Zustand实现全局状态管理，统一管理所有业务数据、筛选状态与业务动作，是整个应用的唯一数据源，同时负责数据与LocalStorage的同步
3. **工具层**：封装通用工具函数，包括日期处理、浏览器通知、唯一ID生成、数据导出等通用能力，供状态层与视图层调用，无业务逻辑耦合
4. **类型层**：统一定义全项目的TypeScript类型、枚举与接口，保障全项目类型一致性，无零散类型定义

### 3.2 核心数据流

用户交互触发动作 → 调用Zustand状态管理的Action方法 → 更新全局State → 自动同步到LocalStorage → 视图层监听State变化自动重新渲染，完成闭环。

## 四、项目目录结构设计

基于Vite+React+TS标准项目结构，结合业务需求做极简拆分，无冗余目录，每个目录职责单一，便于个人开发维护，目录结构如下：

```Plaintext
todo-app/
├── index.html                 # 项目入口HTML文件
├── package.json               # 项目依赖与脚本配置
├── tsconfig.json              # TypeScript配置
├── vite.config.ts             # Vite构建配置
├── tailwind.config.js         # Tailwind CSS配置
├── postcss.config.js          # PostCSS配置（Tailwind依赖）
├── public/                    # 静态资源目录（favicon、全局静态文件）
└── src/                       # 项目核心源码目录
    ├── main.tsx               # 项目入口文件，挂载React应用
    ├── App.tsx                # 应用根组件，整合页面与全局状态
    ├── index.css              # 全局样式文件，引入Tailwind指令
    ├── components/            # 业务组件目录，按功能拆分单一职责组件
    │   ├── TaskInput.tsx      # 任务创建输入框组件
    │   ├── TaskList.tsx       # 任务列表容器组件
    │   ├── TaskItem.tsx       # 单条任务条目组件
    │   ├── TaskEditModal.tsx  # 任务编辑弹窗组件
    │   ├── SearchBar.tsx      # 搜索与筛选栏组件
    │   ├── TimerModal.tsx     # 番茄钟计时器组件（可选拓展）
    │   └── ui/                # 通用UI组件（按钮、弹窗、复选框等）
    ├── pages/                 # 页面组件目录，本项目为单页应用，仅首页
    │   └── HomePage.tsx       # 首页，整合所有核心业务组件
    ├── store/                 # Zustand状态管理目录
    │   └── taskStore.ts       # 任务全局状态管理，含所有业务动作
    ├── types/                 # TypeScript类型定义目录
    │   ├── index.ts           # 统一导出所有类型
    │   ├── task.ts            # 任务、标签相关类型定义
    │   └── filter.ts          # 筛选相关类型定义
    ├── utils/                 # 通用工具函数目录
    │   ├── dateUtils.ts       # 日期处理工具函数，基于date-fns封装
    │   ├── idUtils.ts         # 唯一ID生成工具函数
    │   ├── notifyUtils.ts     # 浏览器通知工具函数
    │   └── storageUtils.ts    # 本地存储工具函数（可选拓展）
    └── hooks/                 # 自定义React Hooks目录
        ├── useNotification.ts  # 通知权限与提醒Hook
        └── useTaskReminder.ts # 任务到期提醒定时器Hook
```

## 五、核心类型定义设计

统一定义全项目的TypeScript类型，保障类型安全，所有类型均集中在`src/types`目录下，核心类型定义如下：

### 5.1 任务核心类型

```TypeScript
// src/types/task.ts
// 任务状态枚举
export enum TaskStatus {
  PENDING = 'pending',    // 未完成
  COMPLETED = 'completed' // 已完成
}

// 任务优先级枚举
export enum TaskPriority {
  HIGH = 'high',     // 高优
  MEDIUM = 'medium', // 中优
  LOW = 'low'        // 低优
}

// 标签类型
export interface Tag {
  id: string;       // 标签唯一标识
  name: string;     // 标签名称
  color: string;    // 标签颜色（Tailwind色值，如'red-500'）
  createTime: string; // 创建时间，ISO格式
}

// 任务核心类型
export interface Task {
  id: string;                // 任务唯一标识
  title: string;             // 任务标题，必填
  content: string;           // 任务备注，选填
  status: TaskStatus;        // 任务状态
  priority: TaskPriority;    // 任务优先级
  tagIds: string[];          // 关联的标签ID数组
  deadline: string | null;   // 截止时间，ISO格式，选填
  remindAdvance: number | null; // 提前提醒分钟数（5/10/30），选填
  createTime: string;        // 创建时间，ISO格式
  updateTime: string;        // 最后更新时间，ISO格式
}
```

### 5.2 筛选相关类型

```TypeScript
// src/types/filter.ts
import { TaskPriority, TaskStatus } from './task';

// 筛选参数类型
export interface FilterParams {
  status: TaskStatus | 'all';          // 任务状态筛选
  priority: TaskPriority | 'all';      // 优先级筛选
  tagIds: string[];                     // 标签筛选
}

// 搜索与筛选全局状态类型
export interface SearchFilterState {
  keyword: string;                      // 搜索关键词
  filterParams: FilterParams;           // 筛选参数
}
```

## 六、状态管理设计

基于Zustand实现全局状态管理，采用单Store设计（项目体量小，无需拆分多Store），内置持久化中间件，实现状态变化实时同步到LocalStorage，所有业务动作均在Store内封装，视图层仅负责调用，不处理业务逻辑。

### 6.1 Store核心设计

```TypeScript
// src/store/taskStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Task, Tag, TaskStatus, TaskPriority } from '../types/task';
import { FilterParams, SearchFilterState } from '../types/filter';
import { generateUUID } from '../utils/idUtils';
import { formatISO } from 'date-fns';

// 全局State与Action类型定义
interface TaskStoreState {
  // 核心数据状态
  taskList: Task[];
  tagList: Tag[];
  // 搜索与筛选状态
  searchFilter: SearchFilterState;
  // 弹窗控制状态
  isEditModalOpen: boolean;
  currentEditTaskId: string | null;

  // ------------------------------
  // 任务核心操作Action
  // ------------------------------
  // 新增任务
  addTask: (task: Pick<Task, 'title' | 'content' | 'priority' | 'tagIds' | 'deadline' | 'remindAdvance'>) => void;
  // 编辑任务
  editTask: (taskId: string, updateData: Partial<Task>) => void;
  // 切换任务完成/未完成状态
  toggleTaskStatus: (taskId: string) => void;
  // 删除单条任务
  deleteTask: (taskId: string) => void;
  // 批量删除已完成任务
  batchDeleteCompletedTasks: () => void;

  // ------------------------------
  // 标签管理Action
  // ------------------------------
  // 新增标签
  addTag: (name: string, color: string) => void;
  // 删除标签
  deleteTag: (tagId: string) => void;

  // ------------------------------
  // 搜索与筛选Action
  // ------------------------------
  // 更新搜索关键词
  updateSearchKeyword: (keyword: string) => void;
  // 更新筛选参数
  updateFilterParams: (params: Partial<FilterParams>) => void;
  // 清空所有筛选条件
  clearFilter: () => void;

  // ------------------------------
  // 弹窗控制Action
  // ------------------------------
  // 打开编辑弹窗
  openEditModal: (taskId: string | null) => void;
  // 关闭编辑弹窗
  closeEditModal: () => void;

  // ------------------------------
  // 计算属性：过滤后的任务列表
  // ------------------------------
  filteredTaskList: () => Task[];
}

// 创建Store，内置持久化
export const useTaskStore = create<TaskStoreState>()(
  persist(
    (set, get) => ({
      // 初始化默认状态
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

      // 新增任务实现
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
          taskList: [newTask, ...state.taskList] // 新任务置顶
        }));
      },

      // 编辑任务实现
      editTask: (taskId, updateData) => {
        set((state) => ({
          taskList: state.taskList.map((task) =>
            task.id === taskId
              ? { ...task, ...updateData, updateTime: formatISO(new Date()) }
              : task
          )
        }));
      },

      // 切换任务状态实现
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

      // 删除单条任务实现
      deleteTask: (taskId) => {
        set((state) => ({
          taskList: state.taskList.filter((task) => task.id !== taskId)
        }));
      },

      // 批量删除已完成任务实现
      batchDeleteCompletedTasks: () => {
        set((state) => ({
          taskList: state.taskList.filter((task) => task.status !== TaskStatus.COMPLETED)
        }));
      },

      // 新增标签实现
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

      // 删除标签实现
      deleteTag: (tagId) => {
        set((state) => ({
          // 删除标签本身
          tagList: state.tagList.filter((tag) => tag.id !== tagId),
          // 清除任务中绑定的该标签ID
          taskList: state.taskList.map((task) => ({
            ...task,
            tagIds: task.tagIds.filter((id) => id !== tagId)
          }))
        }));
      },

      // 更新搜索关键词实现
      updateSearchKeyword: (keyword) => {
        set((state) => ({
          searchFilter: { ...state.searchFilter, keyword }
        }));
      },

      // 更新筛选参数实现
      updateFilterParams: (params) => {
        set((state) => ({
          searchFilter: {
            ...state.searchFilter,
            filterParams: { ...state.searchFilter.filterParams, ...params }
          }
        }));
      },

      // 清空筛选条件实现
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

      // 打开编辑弹窗实现
      openEditModal: (taskId) => {
        set({
          isEditModalOpen: true,
          currentEditTaskId: taskId
        });
      },

      // 关闭编辑弹窗实现
      closeEditModal: () => {
        set({
          isEditModalOpen: false,
          currentEditTaskId: null
        });
      },

      // 过滤后的任务列表计算实现
      filteredTaskList: () => {
        const { taskList, searchFilter } = get();
        const { keyword, filterParams } = searchFilter;

        let result = [...taskList];

        // 1. 关键词搜索过滤
        if (keyword.trim()) {
          const lowerKeyword = keyword.toLowerCase().trim();
          result = result.filter(
            (task) =>
              task.title.toLowerCase().includes(lowerKeyword) ||
              task.content.toLowerCase().includes(lowerKeyword)
          );
        }

        // 2. 状态过滤
        if (filterParams.status !== 'all') {
          result = result.filter((task) => task.status === filterParams.status);
        }

        // 3. 优先级过滤
        if (filterParams.priority !== 'all') {
          result = result.filter((task) => task.priority === filterParams.priority);
        }

        // 4. 标签过滤
        if (filterParams.tagIds.length > 0) {
          result = result.filter((task) =>
            filterParams.tagIds.some((tagId) => task.tagIds.includes(tagId))
          );
        }

        // 5. 排序：未完成任务置顶，同状态下高优在前，同优先级下创建时间倒序
        result.sort((a, b) => {
          // 状态排序：未完成在前
          if (a.status !== b.status) {
            return a.status === TaskStatus.PENDING ? -1 : 1;
          }
          // 优先级排序：高>中>低
          const priorityOrder = { [TaskPriority.HIGH]: 0, [TaskPriority.MEDIUM]: 1, [TaskPriority.LOW]: 2 };
          if (a.priority !== b.priority) {
            return priorityOrder[a.priority] - priorityOrder[b.priority];
          }
          // 创建时间倒序：新的在前
          return new Date(b.createTime).getTime() - new Date(a.createTime).getTime();
        });

        return result;
      }
    }),
    {
      // 持久化配置
      name: 'personal-todo-storage', // LocalStorage存储的key
      partialize: (state) => ({
        // 只持久化需要本地存储的状态，过滤弹窗等临时状态
        taskList: state.taskList,
        tagList: state.tagList,
        searchFilter: state.searchFilter
      })
    }
  )
);
```

### 6.2 持久化机制说明

- 基于Zustand内置的`persist`中间件实现，状态变化时自动同步到LocalStorage，无需手动操作存储
- 仅持久化核心业务数据，弹窗显隐、临时输入值等非持久化状态不参与存储
- 应用初始化时，自动从LocalStorage读取已存储的状态，恢复用户数据，实现离线可用

## 七、核心功能实现方案

所有功能实现严格对齐PRD需求，基于上述架构与状态设计，拆解核心功能的具体实现逻辑，确保可直接落地编码。

### 7.1 任务创建功能实现

#### 核心逻辑

1. 组件：`TaskInput.tsx`，首页顶部固定输入框，支持回车快速创建
2. 交互流程：
   1. 用户在输入框中输入任务标题，回车或点击「添加」按钮触发创建
   2. 前置校验：标题不能为空，为空时给出提示，不执行创建
   3. 调用`useTaskStore`的`addTask`方法，传入标题与默认配置
   4. 创建成功后，自动清空输入框，任务列表实时更新，新任务置顶
3. 极简实现：无需跳转页面，单步完成创建，符合PRD「操作路径≤2步」的要求

### 7.2 任务编辑与状态切换功能实现

#### 任务编辑

1. 组件：`TaskItem.tsx` + `TaskEditModal.tsx`
2. 交互流程：
   1. 点击任务条目或「编辑」图标，调用`openEditModal`方法，传入当前任务ID，打开编辑弹窗
   2. 弹窗内自动回显当前任务的所有属性，支持修改标题、备注、优先级、标签、截止时间、提醒配置
   3. 点击「保存」，调用`editTask`方法更新任务数据，同时关闭弹窗
   4. 点击「取消」或弹窗蒙层，直接关闭弹窗，不修改数据
3. 边界处理：编辑过程中刷新页面，已输入的内容不保存，以Store内的原始数据为准

#### 状态切换

1. 组件：`TaskItem.tsx`
2. 交互流程：
   1. 任务条目左侧复选框，勾选/取消勾选时，调用`toggleTaskStatus`方法
   2. 状态切换实时同步到Store与LocalStorage，无延迟
   3. 标记完成的任务自动添加划线置灰样式，下沉到列表底部；撤销完成后，回归原排序位置
3. 性能优化：用`React.memo`包裹`TaskItem`组件，仅当任务数据变化时才重新渲染，避免列表整体重渲染

### 7.3 截止时间与到期提醒功能实现

#### 截止时间处理

1. 基于`date-fns`实现日期格式化、时间对比，核心能力封装在`src/utils/dateUtils.ts`
2. 核心逻辑：
   1. 日期选择器采用HTML原生`input type="datetime-local"`，无需引入第三方日期组件，降低开发难度
   2. 选择的日期转换为ISO格式字符串，存储到任务的`deadline`字段
   3. 任务列表渲染时，对比当前时间与截止时间，判断状态：
      - 已过期（截止时间<当前时间，且未完成）：添加红色过期标识
      - 即将过期（截止时间-当前时间<1小时，且未完成）：添加黄色预警标识
      - 未到截止时间：正常展示截止时间

#### 到期提醒实现

1. 基于浏览器`Notification API`实现，核心能力封装在`src/utils/notifyUtils.ts`与自定义Hook`useTaskReminder.ts`
2. 核心流程：
   1. 应用初始化时，检查浏览器是否支持Notification API，不支持则隐藏提醒相关功能
   2. 用户首次设置提醒时，申请通知权限，用户拒绝后不再重复申请
   3. 自定义Hook`useTaskReminder.ts`在应用挂载时，遍历所有未完成、有截止时间的任务，计算提醒时间，设置定时器
   4. 到达提醒时间时，触发浏览器系统通知，展示任务标题与截止时间，点击通知可跳转到网站
   5. 任务新增、编辑、删除时，自动更新定时器，避免无效提醒
3. 边界处理：浏览器关闭后，定时器不生效，仅在浏览器打开状态下触发提醒，符合纯前端实现的能力边界

### 7.4 搜索与筛选功能实现

1. 组件：`SearchBar.tsx`
2. 核心逻辑：
   1. 搜索框输入内容时，实时调用`updateSearchKeyword`更新搜索关键词
   2. 筛选按钮点击时，调用`updateFilterParams`更新筛选条件
   3. 任务列表`TaskList.tsx`中，调用`filteredTaskList`方法获取过滤后的任务列表，实时渲染
   4. 基于`useMemo`缓存过滤结果，仅当任务列表、关键词、筛选条件变化时，才重新计算过滤结果，避免不必要的计算与重渲染
3. 空状态处理：无匹配结果时，展示「暂无匹配任务」提示，优化体验

### 7.5 数据持久化与离线可用实现

1. 核心依赖：Zustand持久化中间件 + 浏览器LocalStorage
2. 实现逻辑：
   1. 所有核心业务数据（任务列表、标签列表、筛选配置）均实时同步到LocalStorage
   2. 应用初始化时，自动从LocalStorage读取数据，恢复到Store中，刷新/关闭浏览器后数据不丢失
   3. 无任何云端上传行为，所有数据仅存储在用户本地浏览器，完全离线可用，无网络时可正常使用所有功能
3. 容量说明：LocalStorage默认容量为5MB，纯文本任务数据可存储上万条，完全满足个人自用需求

### 7.6 响应式布局实现

1. 基于Tailwind CSS的断点系统实现，核心断点设计：
   1. `sm`：≥640px，移动端适配
   2. `md`：≥768px，平板适配
   3. `lg`：≥1024px，PC端适配
2. 适配规则：
   1. PC端：双列布局，左侧筛选栏，右侧任务列表，操作按钮平铺展示
   2. 移动端：单列布局，筛选栏折叠为下拉弹窗，操作按钮合并为图标，避免误触
   3. 核心操作按钮最小尺寸为44px，适配移动端点击，无误触问题
   4. 无横向滚动条，所有元素宽度自适应屏幕尺寸

## 八、性能与兼容性设计

### 8.1 性能优化设计

针对个人项目体量，采用极简有效的优化方案，无过度设计，保障应用流畅运行：

1. **渲染优化**
   1. 用`React.memo`包裹纯展示组件，避免不必要的重渲染
   2. 用`useMemo`缓存过滤后的任务列表、计算属性，减少重复计算
   3. 用`useCallback`缓存传递给子组件的函数，避免子组件重复渲染
2. **构建优化**
   1. Vite生产构建开启代码压缩、Tree Shaking，剔除未使用的代码
   2. date-fns采用按需引入，避免全量导入导致包体积过大
   3. 第三方依赖拆包，优化浏览器缓存策略
3. **内存优化**
   1. 自定义Hook中，组件卸载时自动清除所有定时器，避免内存泄漏
   2. 事件监听统一管理，组件卸载时移除监听，避免内存泄漏

### 8.2 兼容性设计

1. **浏览器兼容**
   1. 核心兼容Chrome、Edge、Firefox等主流现代浏览器，不兼容IE浏览器
   2. 对Notification API等存在兼容性的API，做特性检测，不支持时优雅降级，隐藏对应功能，不影响核心流程
2. **设备兼容**
   1. 响应式布局适配PC端、移动端、平板端所有主流屏幕尺寸
   2. 交互同时适配鼠标点击与触屏操作，移动端无操作障碍

## 九、开发与部署规范

### 9.1 开发环境要求

- Node.js版本：≥18.0.0
- 包管理工具：pnpm（推荐）/npm/yarn
- 开发工具：VS Code，推荐安装ESLint、Prettier、Tailwind CSS IntelliSense插件

### 9.2 项目初始化步骤

1. 初始化Vite项目：`npm create vite@latest personal-todo-app -- --template react-ts`
2. 进入项目目录：`cd personal-todo-app`
3. 安装核心依赖：`npm install zustand date-fns`
4. 安装Tailwind CSS及依赖：`npm install -D tailwindcss postcss autoprefixer`
5. 初始化Tailwind配置：`npx tailwindcss init -p`
6. 配置Tailwind内容路径，完成开发环境搭建

### 9.3 代码规范

1. **TypeScript规范**：禁止使用`any`类型，所有变量、函数、组件必须定义明确的类型，接口与枚举集中管理，不零散定义
2. **组件规范**：采用函数式组件，单一职责原则，一个组件只负责一个功能，超大组件拆分为子组件，组件文件不超过300行
3. **命名规范**：组件名采用大驼峰命名法，函数、变量采用小驼峰命名法，常量采用全大写下划线分隔命名法
4. **样式规范**：优先使用Tailwind原子类，仅全局通用样式写在`index.css`中，禁止大量自定义CSS
5. **Git规范**（可选）：采用语义化提交信息，如`feat: 新增任务创建功能`、`fix: 修复任务状态切换异常`，便于版本管理

### 9.4 部署上线方案

本项目为纯前端静态网站，部署成本极低，个人自用推荐以下3种方案，均可免费使用：

1. **GitHub Pages**：将代码推送到GitHub仓库，开启GitHub Pages功能，自动构建部署，生成可访问的在线地址
2. **Vercel**：绑定GitHub仓库，一键部署，自动构建，全球CDN加速，支持自定义域名
3. **本地部署**：执行`npm run build`生成dist静态包，本地用nginx、serve等工具启动服务，仅本地局域网访问

## 十、风险与应对方案

| 风险点                 | 风险说明                                                     | 应对方案                                                     |
| ---------------------- | ------------------------------------------------------------ | ------------------------------------------------------------ |
| LocalStorage数据丢失   | 浏览器清理缓存、无痕模式会清除LocalStorage数据，导致任务丢失 | 1. 新增数据导出功能，支持将任务数据导出为JSON文件备份；2. 新增数据导入功能，可通过备份文件恢复数据；3. 定期提示用户备份数据 |
| 浏览器通知权限被拒绝   | 用户拒绝通知权限后，到期提醒功能无法使用                     | 1. 权限被拒绝时，给出清晰提示，引导用户手动开启权限；2. 权限未开启时，隐藏提醒配置功能，避免无效操作 |
| 浏览器关闭后提醒不触发 | 纯前端定时器仅在浏览器打开时运行，关闭后无法触发提醒         | 1. 在功能入口明确说明提醒生效条件，避免用户预期不符；2. 个人自用场景下，浏览器长期打开即可满足需求，无需后端推送服务 |
| LocalStorage容量不足   | 长期使用后，任务数据过多，超出LocalStorage 5MB容量限制       | 1. 新增批量清理已完成旧任务的功能，释放存储空间；2. 容量接近上限时，给出提示，引导用户清理无用任务 |

## 十一、技术验收标准

1. **构建验收**：项目可正常执行`npm run build`，无TS类型错误，无构建报错，生成的dist包可正常运行
2. **功能验收**：所有功能完全对齐PRD需求，任务创建、编辑、状态切换、删除、搜索筛选、提醒等核心功能无异常，操作流程符合设计要求
3. **数据验收**：数据持久化正常，刷新页面、关闭浏览器后重新打开，数据不丢失；状态变化实时同步到LocalStorage，无数据不同步问题
4. **兼容性验收**：主流现代浏览器中功能正常使用，无样式错乱；PC端、移动端响应式布局正常，无操作误触、横向滚动条等问题
5. **性能验收**：首屏加载时间≤2s，无白屏、长时间加载问题；任务数量≥50条时，操作无卡顿、无明显延迟，页面流畅运行
6. **代码验收**：组件拆分合理，代码无冗余，TS类型覆盖完整，无`any`类型，可维护性良好，便于后续拓展功能