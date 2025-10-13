// 虚拟列表数据服务
class VirtualListService {
  constructor() {
    this.data = [];
    this.initialize();
  }

  // 初始化数据
  initialize() {
    const names = ['张三', '李四', '王五', '赵六', '钱七', '孙八', '周九', '吴十'];
    const departments = ['技术部', '产品部', '运营部', '市场部', '设计部', '财务部'];
    
    for (let i = 0; i < 10000; i++) {
      this.data.push({
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
    
    console.log(`✅ VirtualList: 已生成 ${this.data.length} 条数据`);
  }

  // 获取数据总数
  getTotal() {
    return this.data.length;
  }

  // 获取数据块
  getChunk(start = 0, limit = 40) {
    const startIndex = parseInt(start);
    const limitCount = parseInt(limit);
    const chunk = this.data.slice(startIndex, startIndex + limitCount);
    
    return {
      data: chunk,
      meta: {
        start: startIndex,
        limit: limitCount,
        returned: chunk.length,
        total: this.data.length,
        hasMore: startIndex + limitCount < this.data.length
      }
    };
  }

  // 搜索数据
  search(keyword = '', start = 0, limit = 40) {
    const startIndex = parseInt(start);
    const limitCount = parseInt(limit);
    
    let results = this.data;
    
    if (keyword) {
      results = this.data.filter(item => 
        item.title.includes(keyword) || 
        item.content.includes(keyword) ||
        item.author.includes(keyword)
      );
    }
    
    const chunk = results.slice(startIndex, startIndex + limitCount);
    
    return {
      data: chunk,
      meta: {
        start: startIndex,
        limit: limitCount,
        returned: chunk.length,
        total: results.length,
        hasMore: startIndex + limitCount < results.length,
        keyword
      }
    };
  }

  // 根据ID获取单条数据
  getById(id) {
    return this.data.find(item => item.id === id);
  }
}

// 导出单例
module.exports = new VirtualListService();

