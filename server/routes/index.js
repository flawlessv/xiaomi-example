// 路由入口 - 统一管理所有API路由
const express = require('express');
const router = express.Router();

// 导入各个模块的路由
const virtualListRoutes = require('./virtualList');
// 未来可以添加更多路由模块
// const tableRoutes = require('./table');
// const chartRoutes = require('./chart');

// 注册路由模块
router.use('/virtual-list', virtualListRoutes);

// 未来添加更多路由
// router.use('/table', tableRoutes);
// router.use('/chart', chartRoutes);

// 根路径 - API信息
router.get('/', (req, res) => {
  res.json({
    message: 'Demo API Server',
    version: '1.0.0',
    endpoints: {
      virtualList: {
        base: '/api/virtual-list',
        routes: [
          'GET /data?start=0&limit=40 - 获取数据块',
          'GET /data/count - 获取数据总数',
          'GET /data/search?keyword=xxx - 搜索数据',
          'GET /data/:id - 根据ID获取数据'
        ]
      }
      // 未来添加更多模块的文档
      // table: { ... },
      // chart: { ... }
    }
  });
});

module.exports = router;

