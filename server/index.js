// Node.js 后端服务器 - 主入口
const express = require('express');
const cors = require('cors');
const config = require('./config');
const apiRoutes = require('./routes');
const logger = require('./middleware/logger');
const { errorHandler, notFoundHandler } = require('./middleware/errorHandler');

const app = express();

// ==================== 中间件 ====================
// CORS跨域
app.use(cors(config.cors));

// 解析JSON请求体
app.use(express.json());

// 请求日志
app.use(logger);

// ==================== 路由 ====================
// 健康检查
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: Date.now(),
    server: 'Demo API Server',
    version: '1.0.0'
  });
});

// API路由（所有业务路由都在这里）
app.use(config.apiPrefix, apiRoutes);

// ==================== 错误处理 ====================
// 404处理
app.use(notFoundHandler);

// 全局错误处理
app.use(errorHandler);

// ==================== 启动服务器 ====================
app.listen(config.port, () => {
  console.log(`\n${'='.repeat(50)}`);
  console.log(`🚀 Demo API Server 已启动`);
  console.log(`${'='.repeat(50)}`);
  console.log(`📍 服务地址: http://localhost:${config.port}`);
  console.log(`📡 API前缀: ${config.apiPrefix}`);
  console.log(`\n可用的API模块:`);
  console.log(`  📦 虚拟列表: ${config.apiPrefix}/virtual-list`);
  console.log(`     - GET /data?start=0&limit=40`);
  console.log(`     - GET /data/count`);
  console.log(`     - GET /data/search?keyword=xxx`);
  console.log(`     - GET /data/:id`);
  console.log(`\n  🏥 健康检查: /health`);
  console.log(`  📖 API文档: ${config.apiPrefix}/`);
  console.log(`\n💡 提示: 访问 http://localhost:${config.port}${config.apiPrefix} 查看所有可用接口`);
  console.log(`${'='.repeat(50)}\n`);
});

