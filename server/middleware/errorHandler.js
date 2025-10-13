// 全局错误处理中间件
const errorHandler = (err, req, res, next) => {
  console.error('❌ Error:', err);

  // 设置默认状态码
  const statusCode = err.statusCode || 500;
  
  // 开发环境返回详细错误，生产环境返回简单信息
  const isDevelopment = process.env.NODE_ENV !== 'production';
  
  res.status(statusCode).json({
    success: false,
    error: {
      message: err.message || 'Internal Server Error',
      ...(isDevelopment && { stack: err.stack })
    }
  });
};

// 404处理
const notFoundHandler = (req, res) => {
  res.status(404).json({
    success: false,
    error: {
      message: `Route ${req.method} ${req.url} not found`
    }
  });
};

module.exports = {
  errorHandler,
  notFoundHandler
};

