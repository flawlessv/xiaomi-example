# 快速启动指南

## 可用的启动命令

### 🚀 同时启动前后端（推荐）

```bash
npm run dev
```

这个命令会同时启动：
- **后端服务器** (蓝色输出) - 运行在 `http://localhost:3001`
- **前端应用** (绿色输出) - 运行在 `http://localhost:3000`

输出会用不同颜色区分，方便查看日志。

---

### 分别启动

#### 仅启动前端
```bash
npm start
```
- 前端会运行在 `http://localhost:3000`
- 需要手动启动后端才能访问API接口

#### 仅启动后端
```bash
npm run server
```
- 后端会运行在 `http://localhost:3001`
- 可以单独测试API接口

---

## 启动后访问

### 前端应用
打开浏览器访问: `http://localhost:3000`

### 可用页面
- 🏠 **首页** - `/`
- 📊 **数据表格** - `/table`
- 🚀 **虚拟滚动** - `/virtual-list` (需要后端运行)
- ℹ️ **关于** - `/about`

### 后端API
- 📡 **API文档** - `http://localhost:3001/api`
- 🏥 **健康检查** - `http://localhost:3001/health`
- 📦 **虚拟列表API** - `http://localhost:3001/api/virtual-list/data`

---

## 常见问题

### Q: 端口被占用怎么办？
**A:** 
- 前端端口被占用：会自动提示使用其他端口
- 后端端口被占用：修改 `server/config/index.js` 中的 `port` 配置

### Q: 如何停止服务？
**A:** 在终端按 `Ctrl + C` 停止

### Q: 虚拟滚动页面无法加载数据？
**A:** 确保后端服务器正在运行，使用 `npm run dev` 同时启动前后端

### Q: 如何查看后端日志？
**A:** 
- 使用 `npm run dev`：在终端可以看到蓝色的后端日志
- 使用 `npm run server`：可以单独查看后端日志

---

## 开发流程建议

1. **开始开发**: 运行 `npm run dev`
2. **前端开发**: 修改 `src/` 目录下的文件，热重载自动生效
3. **后端开发**: 修改 `server/` 目录下的文件，需要手动重启后端
4. **添加新页面**: 参考 `ROUTES_GUIDE.md`
5. **添加新API**: 参考 `server/README.md`

---

## 脚本说明

| 命令 | 说明 | 用途 |
|------|------|------|
| `npm run dev` | 同时启动前后端 | 日常开发（推荐） |
| `npm start` | 仅启动前端 | 纯前端开发或后端已运行 |
| `npm run server` | 仅启动后端 | 后端开发或API测试 |
| `npm run build` | 构建生产版本 | 部署前构建 |
| `npm test` | 运行测试 | 单元测试 |

---

## 首次运行

如果是首次克隆项目，请先安装依赖：

```bash
npm install
```

然后运行：

```bash
npm run dev
```

就可以开始开发了！🎉

