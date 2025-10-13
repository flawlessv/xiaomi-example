import React from 'react';
import './Home.css';

const Home: React.FC = () => {
  return (
    <div className="home-page">
      <div className="home-header">
        <h1>欢迎来到 Demo 应用</h1>
        <p className="subtitle">这是一个用于实验和演示的React应用程序</p>
      </div>

      <div className="cards-container">
        <div className="info-card">
          <div className="card-icon">📊</div>
          <h3>数据表格</h3>
          <p>查看和管理人员信息，支持虚拟列表、分组、筛选和排序功能</p>
        </div>

        <div className="info-card">
          <div className="card-icon">🎨</div>
          <h3>UI组件</h3>
          <p>集成了HiUI组件库，提供丰富的UI组件供你使用</p>
        </div>

        <div className="info-card">
          <div className="card-icon">🚀</div>
          <h3>快速开发</h3>
          <p>基于TypeScript和React 17，提供类型安全的开发体验</p>
        </div>

        <div className="info-card">
          <div className="card-icon">🔧</div>
          <h3>易于扩展</h3>
          <p>模块化的路由配置，可以轻松添加新的页面和功能</p>
        </div>
      </div>

      <div className="getting-started">
        <h2>快速开始</h2>
        <div className="steps">
          <div className="step">
            <div className="step-number">1</div>
            <div className="step-content">
              <h4>添加新页面</h4>
              <p>在 <code>src/pages</code> 目录下创建新的页面组件</p>
            </div>
          </div>
          <div className="step">
            <div className="step-number">2</div>
            <div className="step-content">
              <h4>配置路由</h4>
              <p>在 <code>src/routes/index.tsx</code> 中添加路由配置</p>
            </div>
          </div>
          <div className="step">
            <div className="step-number">3</div>
            <div className="step-content">
              <h4>更新导航</h4>
              <p>在 <code>routesConfig</code> 中添加导航项，它会自动显示在左侧菜单</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;

