// 请求日志中间件
const logger = (req, res, next) => {
  const start = Date.now();
  
  // 响应结束时记录日志
  res.on('finish', () => {
    const duration = Date.now() - start;
    const statusColor = res.statusCode >= 400 ? '\x1b[31m' : '\x1b[32m';
    const reset = '\x1b[0m';
    
    console.log(
      `${statusColor}${res.statusCode}${reset} ${req.method} ${req.url} - ${duration}ms`
    );
  });
  
  next();
};

module.exports = logger;

