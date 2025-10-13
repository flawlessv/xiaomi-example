import React from 'react';
import './About.css';

const About: React.FC = () => {
  return (
    <div className="about-page">
      <div className="about-container">
        <h1>关于本项目</h1>
        
        <div className="about-section">
          <h2>📦 项目介绍</h2>
          <p>
            这是一个用于实验和演示的React应用程序，采用现代化的技术栈构建。
            项目旨在提供一个灵活、易扩展的基础架构，方便快速开发和测试各种功能模块。
          </p>
        </div>

        <div className="about-section">
          <h2>🛠️ 技术栈</h2>
          <div className="tech-stack">
            <div className="tech-item">
              <span className="tech-name">React</span>
              <span className="tech-version">17.0.2</span>
            </div>
            <div className="tech-item">
              <span className="tech-name">TypeScript</span>
              <span className="tech-version">4.9.5</span>
            </div>
            <div className="tech-item">
              <span className="tech-name">React Router</span>
              <span className="tech-version">6.x</span>
            </div>
            <div className="tech-item">
              <span className="tech-name">HiUI</span>
              <span className="tech-version">4.14.0</span>
            </div>
            <div className="tech-item">
              <span className="tech-name">Schema Components</span>
              <span className="tech-version">0.0.13</span>
            </div>
          </div>
        </div>

        <div className="about-section">
          <h2>✨ 特性</h2>
          <ul className="features-list">
            <li>✅ TypeScript 类型安全</li>
            <li>✅ 模块化路由配置</li>
            <li>✅ 响应式侧边导航</li>
            <li>✅ 高性能数据表格</li>
            <li>✅ 丰富的UI组件库</li>
            <li>✅ 易于扩展的架构</li>
          </ul>
        </div>

        <div className="about-section">
          <h2>📝 如何添加新模块</h2>
          <ol className="guide-list">
            <li>
              <strong>创建页面组件：</strong>
              在 <code>src/pages</code> 目录下创建新的页面组件文件
            </li>
            <li>
              <strong>配置路由：</strong>
              在 <code>src/routes/index.tsx</code> 中添加新路由
            </li>
            <li>
              <strong>更新导航：</strong>
              在路由配置中添加导航信息，自动显示在侧边栏
            </li>
          </ol>
        </div>

        <div className="about-footer">
          <p>💡 这是一个实验性项目，可以自由添加和测试各种功能</p>
        </div>
      </div>
    </div>
  );
};

export default About;

