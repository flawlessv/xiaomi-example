// 虚拟列表控制器
const virtualListService = require('../services/virtualListService');
const { mockDelay } = require('../config');

// 模拟延迟的中间件
const withDelay = (handler) => {
  return async (req, res) => {
    const delay = mockDelay.min + Math.random() * (mockDelay.max - mockDelay.min);
    
    setTimeout(async () => {
      try {
        await handler(req, res);
      } catch (error) {
        console.error('Controller error:', error);
        res.status(500).json({
          success: false,
          error: error.message
        });
      }
    }, delay);
  };
};

// 获取数据块
exports.getDataChunk = withDelay((req, res) => {
  const { start = 0, limit = 40 } = req.query;
  const result = virtualListService.getChunk(start, limit);
  
  console.log(`📦 VirtualList: 返回数据 start=${start}, limit=${limit}, returned=${result.data.length}`);
  
  res.json({
    success: true,
    ...result
  });
});

// 获取数据总数
exports.getCount = (req, res) => {
  const total = virtualListService.getTotal();
  
  res.json({
    success: true,
    total
  });
};

// 搜索数据
exports.search = withDelay((req, res) => {
  const { keyword = '', start = 0, limit = 40 } = req.query;
  const result = virtualListService.search(keyword, start, limit);
  
  console.log(`🔍 VirtualList: 搜索 keyword="${keyword}", returned=${result.data.length}`);
  
  res.json({
    success: true,
    ...result
  });
});

// 根据ID获取单条数据
exports.getById = (req, res) => {
  const { id } = req.params;
  const item = virtualListService.getById(id);
  
  if (!item) {
    return res.status(404).json({
      success: false,
      error: 'Item not found'
    });
  }
  
  res.json({
    success: true,
    data: item
  });
};

