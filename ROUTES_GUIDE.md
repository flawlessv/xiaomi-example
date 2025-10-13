# 路由扩展指南

本文档说明如何在项目中添加新的路由和页面模块。

## 项目结构

```
src/
├── components/
│   └── Layout/
│       ├── MainLayout.tsx      # 主布局组件（包含侧边导航）
│       └── MainLayout.css      # 布局样式
├── pages/                      # 页面组件目录
│   ├── Home.tsx                # 首页
│   ├── Home.css
│   ├── About.tsx               # 关于页面
│   ├── About.css
│   └── TablePage.tsx           # 表格页面
├── routes/
│   └── index.tsx               # 路由配置文件
└── App.tsx                     # 应用入口
```

## 如何添加新模块

### 步骤1：创建页面组件

在 `src/pages` 目录下创建新的页面组件：

```tsx
// src/pages/NewModule.tsx
import React from 'react';
import './NewModule.css';

const NewModule: React.FC = () => {
  return (
    <div className="new-module-page">
      <h1>新模块</h1>
      <p>这是一个新的功能模块</p>
    </div>
  );
};

export default NewModule;
```

### 步骤2：添加路由配置

在 `src/routes/index.tsx` 中添加导航配置：

```tsx
export const routesConfig: RouteConfig[] = [
  // ... 现有的路由
  {
    path: '/new-module',
    label: '新模块',
    icon: '🎯',  // 可以使用emoji或留空
  },
];
```

### 步骤3：在App.tsx中注册路由

在 `src/App.tsx` 中导入新组件并添加路由：

```tsx
// 1. 导入新组件
import NewModule from './pages/NewModule';

// 2. 在Switch中添加Route
<Switch>
  <Route exact path="/" component={Home} />
  <Route path="/table" component={TablePage} />
  <Route path="/about" component={About} />
  <Route path="/new-module" component={NewModule} />  {/* 新增 */}
</Switch>
```

## 现有路由

当前项目包含以下路由：

| 路径 | 组件 | 说明 |
|------|------|------|
| `/` | Home | 首页，展示项目介绍 |
| `/table` | TablePage | 数据表格页面，展示人员信息管理 |
| `/virtual-list` | VirtualListPage | 虚拟滚动列表，10000条数据按需加载 |
| `/about` | About | 关于页面，展示项目技术栈和特性 |

## 导航菜单

左侧导航菜单会自动根据 `routesConfig` 配置生成，支持：

- ✅ 自动高亮当前路由
- ✅ 图标显示（使用emoji）
- ✅ 可折叠/展开
- ✅ 响应式设计

## 注意事项

1. **路径一致性**：确保 `routesConfig` 中的 `path` 与 `App.tsx` 中的 `Route path` 保持一致
2. **组件命名**：建议使用 PascalCase 命名组件文件
3. **样式文件**：为每个页面创建对应的 CSS 文件，避免样式冲突
4. **懒加载**：对于大型组件，可以考虑使用 React.lazy 进行代码分割

## 示例：添加一个设置页面

```tsx
// 1. 创建 src/pages/Settings.tsx
import React from 'react';
import './Settings.css';

const Settings: React.FC = () => {
  return (
    <div className="settings-page">
      <h1>系统设置</h1>
      {/* 设置内容 */}
    </div>
  );
};

export default Settings;

// 2. 更新 src/routes/index.tsx
export const routesConfig: RouteConfig[] = [
  // ... 其他路由
  {
    path: '/settings',
    label: '设置',
    icon: '⚙️',
  },
];

// 3. 更新 src/App.tsx
import Settings from './pages/Settings';

// 在Switch中添加：
<Route path="/settings" component={Settings} />
```

## 技术栈

- React 17.0.2
- React Router DOM 5.3.4
- TypeScript 4.9.5

---

**提示**：路由系统已配置完成，可以随时添加新的模块进行实验和开发！

