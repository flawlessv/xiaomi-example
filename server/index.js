// Node.js 后端服务器
const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 3001;

// 中间件
app.use(cors());
app.use(express.json());

// 模拟数据库 - 10000条数据
const generateAllData = () => {
  const data = [];
  const names = ['张三', '李四', '王五', '赵六', '钱七', '孙八', '周九', '吴十'];
  const departments = ['技术部', '产品部', '运营部', '市场部', '设计部', '财务部'];
  
  for (let i = 0; i < 10000; i++) {
    data.push({
      id: `item-${i}`,
      title: `${names[i % names.length]}的项目 ${i + 1}`,
      content: `这是第 ${i + 1} 个项目的详细内容描述。包含了项目的基本信息和相关说明。`,
      department: departments[i % departments.length],
      status: ['进行中', '已完成', '待开始'][i % 3],
      priority: ['高', '中', '低'][i % 3],
      timestamp: Date.now() - (10000 - i) * 1000,
      author: names[i % names.length],
      views: Math.floor(Math.random() * 1000),
      likes: Math.floor(Math.random() * 100)
    });
  }
  
  return data;
};

// 初始化数据
const allData = generateAllData();
console.log(`✅ 已生成 ${allData.length} 条数据`);

// API路由：获取数据块
app.get('/api/data', (req, res) => {
  const { start = 0, limit = 40 } = req.query;
  const startIndex = parseInt(start);
  const limitCount = parseInt(limit);
  
  // 模拟网络延迟（300-800ms）
  const delay = 300 + Math.random() * 500;
  
  setTimeout(() => {
    const chunk = allData.slice(startIndex, startIndex + limitCount);
    
    res.json({
      success: true,
      data: chunk,
      meta: {
        start: startIndex,
        limit: limitCount,
        returned: chunk.length,
        total: allData.length,
        hasMore: startIndex + limitCount < allData.length
      }
    });
    
    console.log(`📦 返回数据: start=${startIndex}, limit=${limitCount}, returned=${chunk.length}`);
  }, delay);
});

// 获取数据总数
app.get('/api/data/count', (req, res) => {
  res.json({
    success: true,
    total: allData.length
  });
});

// 搜索数据
app.get('/api/data/search', (req, res) => {
  const { keyword = '', start = 0, limit = 40 } = req.query;
  const startIndex = parseInt(start);
  const limitCount = parseInt(limit);
  
  let results = allData;
  
  if (keyword) {
    results = allData.filter(item => 
      item.title.includes(keyword) || 
      item.content.includes(keyword) ||
      item.author.includes(keyword)
    );
  }
  
  const chunk = results.slice(startIndex, startIndex + limitCount);
  
  res.json({
    success: true,
    data: chunk,
    meta: {
      start: startIndex,
      limit: limitCount,
      returned: chunk.length,
      total: results.length,
      hasMore: startIndex + limitCount < results.length,
      keyword
    }
  });
});

// 健康检查
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: Date.now(),
    dataCount: allData.length
  });
});

// 启动服务器
app.listen(PORT, () => {
  console.log(`\n🚀 后端服务器已启动`);
  console.log(`📍 地址: http://localhost:${PORT}`);
  console.log(`📊 数据总量: ${allData.length} 条`);
  console.log(`\n可用的API端点:`);
  console.log(`  GET /api/data?start=0&limit=40       - 获取数据块`);
  console.log(`  GET /api/data/count                  - 获取数据总数`);
  console.log(`  GET /api/data/search?keyword=xxx     - 搜索数据`);
  console.log(`  GET /health                          - 健康检查\n`);
});

