// 服务器配置
module.exports = {
  port: process.env.PORT || 3001,
  apiPrefix: '/api',
  cors: {
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
  },
  // 模拟网络延迟配置
  mockDelay: {
    min: 300,
    max: 800
  }
};

