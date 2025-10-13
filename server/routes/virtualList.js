// 虚拟列表路由
const express = require('express');
const router = express.Router();
const virtualListController = require('../controllers/virtualListController');

// 获取数据块
router.get('/data', virtualListController.getDataChunk);

// 获取数据总数
router.get('/data/count', virtualListController.getCount);

// 搜索数据
router.get('/data/search', virtualListController.search);

// 根据ID获取单条数据
router.get('/data/:id', virtualListController.getById);

module.exports = router;

