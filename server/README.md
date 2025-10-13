# 虚拟列表后端API服务器

这是一个基于Express的Node.js后端服务器，为虚拟列表示例提供真实的API接口。

## 功能特性

- ✅ 提供10000条模拟数据
- ✅ 支持分页查询
- ✅ 支持关键词搜索
- ✅ CORS跨域支持
- ✅ 模拟网络延迟（300-800ms）

## 快速开始

### 启动后端服务器

```bash
# 仅启动后端
npm run server

# 同时启动前后端（推荐）
npm run dev
```

服务器将在 `http://localhost:3001` 启动

## API接口文档

### 1. 获取数据块

**请求**
```
GET /api/data?start=0&limit=40
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

### 2. 获取数据总数

**请求**
```
GET /api/data/count
```

**响应**
```json
{
  "success": true,
  "total": 10000
}
```

### 3. 搜索数据

**请求**
```
GET /api/data/search?keyword=张三&start=0&limit=40
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

### 4. 健康检查

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

## 技术栈

- Express.js - Web框架
- CORS - 跨域中间件
- Node.js - 运行环境

## 开发说明

服务器启动后会：
1. 自动生成10000条模拟数据
2. 在控制台输出可用的API端点
3. 模拟300-800ms的网络延迟，更真实地模拟生产环境

