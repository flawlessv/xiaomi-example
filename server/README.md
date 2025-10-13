# Demo API 后端服务器

这是一个基于Express的模块化Node.js后端服务器，采用MVC架构，为前端示例提供真实的API接口。

## 项目结构

```
server/
├── index.js                 # 主入口文件
├── config/
│   └── index.js            # 配置文件（端口、CORS等）
├── routes/
│   ├── index.js            # 路由入口（统一管理）
│   └── virtualList.js      # 虚拟列表路由
├── controllers/
│   └── virtualListController.js  # 虚拟列表控制器
├── services/
│   └── virtualListService.js     # 虚拟列表数据服务
├── middleware/
│   ├── logger.js           # 请求日志中间件
│   └── errorHandler.js     # 错误处理中间件
└── README.md               # 本文档
```

## 架构特点

- ✅ **模块化设计** - 按功能分离代码，易于维护和扩展
- ✅ **MVC架构** - 路由 → 控制器 → 服务层，职责分明
- ✅ **统一配置** - 集中管理服务器配置
- ✅ **中间件系统** - 日志记录、错误处理、CORS等
- ✅ **易于扩展** - 添加新模块只需3步

## 快速开始

### 启动后端服务器

```bash
# 仅启动后端
npm run server

# 同时启动前后端（推荐）
npm run dev
```

服务器将在 `http://localhost:3001` 启动

## 如何添加新的API模块

### 步骤1：创建Service（数据服务层）

在 `services/` 目录下创建新的服务文件，例如 `tableService.js`：

```javascript
// services/tableService.js
class TableService {
  constructor() {
    this.data = [];
    this.initialize();
  }

  initialize() {
    // 初始化数据
  }

  getData() {
    return this.data;
  }
}

module.exports = new TableService();
```

### 步骤2：创建Controller（控制器层）

在 `controllers/` 目录下创建控制器文件，例如 `tableController.js`：

```javascript
// controllers/tableController.js
const tableService = require('../services/tableService');

exports.getData = (req, res) => {
  const data = tableService.getData();
  res.json({
    success: true,
    data
  });
};
```

### 步骤3：创建Route（路由层）

在 `routes/` 目录下创建路由文件，例如 `table.js`：

```javascript
// routes/table.js
const express = require('express');
const router = express.Router();
const tableController = require('../controllers/tableController');

router.get('/data', tableController.getData);

module.exports = router;
```

### 步骤4：注册路由

在 `routes/index.js` 中导入并注册新路由：

```javascript
const tableRoutes = require('./table');
router.use('/table', tableRoutes);
```

完成！新的API模块就可以通过 `/api/table/data` 访问了。

---

## 现有API模块

### 虚拟列表模块 (Virtual List)

基础路径: `/api/virtual-list`

#### 1. 获取数据块

**请求**
```
GET /api/virtual-list/data?start=0&limit=40
```

**参数**
- `start` (number): 起始索引，默认0
- `limit` (number): 每页数量，默认40

**响应**
```json
{
  "success": true,
  "data": [
    {
      "id": "item-0",
      "title": "张三的项目 1",
      "content": "这是第 1 个项目的详细内容描述...",
      "department": "技术部",
      "status": "进行中",
      "priority": "高",
      "timestamp": 1697234567890,
      "author": "张三",
      "views": 234,
      "likes": 45
    }
  ],
  "meta": {
    "start": 0,
    "limit": 40,
    "returned": 40,
    "total": 10000,
    "hasMore": true
  }
}
```

#### 2. 获取数据总数

**请求**
```
GET /api/virtual-list/data/count
```

**响应**
```json
{
  "success": true,
  "total": 10000
}
```

#### 3. 搜索数据

**请求**
```
GET /api/virtual-list/data/search?keyword=张三&start=0&limit=40
```

**参数**
- `keyword` (string): 搜索关键词
- `start` (number): 起始索引，默认0
- `limit` (number): 每页数量，默认40

**响应**
```json
{
  "success": true,
  "data": [...],
  "meta": {
    "start": 0,
    "limit": 40,
    "returned": 15,
    "total": 1250,
    "hasMore": true,
    "keyword": "张三"
  }
}
```

#### 4. 根据ID获取数据

**请求**
```
GET /api/virtual-list/data/:id
```

**参数**
- `id` (string): 数据ID

**响应**
```json
{
  "success": true,
  "data": {
    "id": "item-0",
    "title": "张三的项目 1",
    ...
  }
}
```

---

## 通用接口

### 健康检查

**请求**
```
GET /health
```

**响应**
```json
{
  "status": "ok",
  "timestamp": 1697234567890,
  "dataCount": 10000
}
```

## 数据结构

每条数据包含以下字段：

| 字段 | 类型 | 说明 |
|------|------|------|
| id | string | 唯一标识符 |
| title | string | 项目标题 |
| content | string | 项目内容描述 |
| department | string | 所属部门 |
| status | string | 状态（进行中/已完成/待开始） |
| priority | string | 优先级（高/中/低） |
| timestamp | number | 时间戳 |
| author | string | 作者 |
| views | number | 浏览次数 |
| likes | number | 点赞数 |

### API文档

**请求**
```
GET /api
```

返回所有可用的API模块和端点信息。

---

## 配置说明

编辑 `config/index.js` 可以修改以下配置：

```javascript
{
  port: 3001,              // 服务器端口
  apiPrefix: '/api',       // API路径前缀
  cors: { ... },          // CORS配置
  mockDelay: {            // 模拟网络延迟
    min: 300,
    max: 800
  }
}
```

## 中间件说明

### Logger (日志中间件)
- 记录每个请求的方法、路径、状态码和耗时
- 错误请求显示为红色，成功请求显示为绿色

### Error Handler (错误处理)
- 统一的错误处理机制
- 开发环境返回详细错误堆栈
- 生产环境返回简化错误信息

## 技术栈

- **Express.js** - Web框架
- **CORS** - 跨域中间件
- **Node.js** - 运行环境
- **MVC架构** - 代码组织模式

## 开发提示

1. **添加新模块**：遵循 Service → Controller → Route 的流程
2. **错误处理**：在Controller中使用try-catch，错误会被全局错误处理中间件捕获
3. **日志**：所有请求自动记录，无需手动添加日志代码
4. **网络延迟**：使用`withDelay`包装Controller方法即可模拟延迟

## 未来扩展计划

- [ ] 添加数据表格API模块
- [ ] 添加图表数据API模块
- [ ] 添加用户认证模块
- [ ] 集成数据库（MongoDB/MySQL）
- [ ] 添加API文档自动生成（Swagger）

---

## 相关文档

- [虚拟列表性能优化详解](../docs/VIRTUAL_LIST_OPTIMIZATION.md) - 包含请求取消算法和区间交集详解

