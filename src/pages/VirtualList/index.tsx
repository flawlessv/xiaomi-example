// VirtualList Page
import React from 'react'
import { VirtualListWithLoading } from './VirtualListWithLoading'
import './index.css'

const VirtualListPage: React.FC = () => {
  return (
    <div className="virtual-list-page">
      <header className="page-header">
        <h1>虚拟滚动 + 虚拟加载示例</h1>
        <p className="page-description">
          使用 @tanstack/react-virtual 实现高性能虚拟滚动
        </p>
        <div className="feature-tags">
          <span className="tag">✅ 10000条数据</span>
          <span className="tag">✅ 按需加载</span>
          <span className="tag">✅ DOM优化</span>
          <span className="tag">✅ 数据缓存</span>
        </div>
      </header>
      
      <div className="content-wrapper">
        <VirtualListWithLoading 
          totalCount={10000}
          chunkSize={40}
          bufferSize={80}
          estimateSize={80}
        />
      </div>

      <div className="info-section">
        <h2>核心特性</h2>
        <div className="feature-grid">
          <div className="feature-card">
            <h3>🚀 虚拟滚动</h3>
            <p>只渲染可视区域的DOM元素，大幅提升性能</p>
          </div>
          <div className="feature-card">
            <h3>📦 虚拟加载</h3>
            <p>按需请求数据，初始加载40条，滚动时动态加载更多</p>
          </div>
          <div className="feature-card">
            <h3>💾 数据缓存</h3>
            <p>避免重复请求已加载的数据，提升用户体验</p>
          </div>
          <div className="feature-card">
            <h3>⚡ 预加载</h3>
            <p>滚动到接近边界时提前加载，保证流畅体验</p>
          </div>
        </div>
      </div>

      <div className="tech-info">
        <h3>技术实现</h3>
        <ul>
          <li><strong>虚拟化库:</strong> @tanstack/react-virtual</li>
          <li><strong>数据分块:</strong> 每块40条数据，按需加载</li>
          <li><strong>缓冲区:</strong> 预加载上下80条数据</li>
          <li><strong>DOM优化:</strong> 可视区域渲染，性能极佳</li>
        </ul>
      </div>
    </div>
  )
}

export default VirtualListPage

