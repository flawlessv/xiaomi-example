import React, { useState } from 'react';
import './index.css';

const ClassicLayoutsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'holy' | 'twin'>('holy');

  return (
    <div className="classic-layouts-page">
      <header className="page-header">
        <h1>经典三栏布局：圣杯布局 vs 双飞翼布局</h1>
        <p className="page-description">
          深入理解两种经典的CSS布局方案及其原理
        </p>
      </header>

      <div className="intro-section">
        <h2>📐 布局目标</h2>
        <div className="goals-grid">
          <div className="goal-item">
            <div className="goal-icon">⚡</div>
            <h3>中间优先加载</h3>
            <p>中间内容在HTML中最先出现，优先渲染</p>
          </div>
          <div className="goal-item">
            <div className="goal-icon">📏</div>
            <h3>两侧固定宽度</h3>
            <p>左右两栏宽度固定，不随窗口变化</p>
          </div>
          <div className="goal-item">
            <div className="goal-icon">📱</div>
            <h3>中间自适应</h3>
            <p>中间栏宽度自适应，填满剩余空间</p>
          </div>
        </div>
      </div>

      <div className="tabs-section">
        <div className="tabs">
          <button
            className={`tab ${activeTab === 'holy' ? 'active' : ''}`}
            onClick={() => setActiveTab('holy')}
          >
            圣杯布局
          </button>
          <button
            className={`tab ${activeTab === 'twin' ? 'active' : ''}`}
            onClick={() => setActiveTab('twin')}
          >
            双飞翼布局
          </button>
        </div>

        {activeTab === 'holy' && <HolyGrailLayout />}
        {activeTab === 'twin' && <TwinWingsLayout />}
      </div>

      <div className="comparison-section">
        <h2>🔄 两者对比</h2>
        <table className="comparison-table">
          <thead>
            <tr>
              <th>对比项</th>
              <th>圣杯布局</th>
              <th>双飞翼布局</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>HTML结构</td>
              <td>三个元素平级</td>
              <td>中间栏需要额外包裹层</td>
            </tr>
            <tr>
              <td>防止覆盖的方法</td>
              <td>父容器设置padding</td>
              <td>中间栏内部元素设置margin</td>
            </tr>
            <tr>
              <td>左侧定位</td>
              <td>使用relative定位</td>
              <td>只用float和margin</td>
            </tr>
            <tr>
              <td>复杂度</td>
              <td>相对复杂（需要定位）</td>
              <td>相对简单</td>
            </tr>
            <tr>
              <td>兼容性</td>
              <td>IE6+</td>
              <td>IE6+</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="principle-section">
        <h2>🔬 核心原理：margin负值</h2>
        <div className="principle-content">
          <div className="principle-card">
            <h3>margin-left: -100% 的作用</h3>
            <p><code>-100%</code> 是相对于<strong>父元素的content宽度</strong>（不包括padding和border）</p>
            <ul>
              <li>当元素float后，设置<code>margin-left: -100%</code></li>
              <li>元素会向左移动一个父元素content的宽度</li>
              <li>由于中间栏占据了100%宽度，-100%正好让左侧栏移到中间栏的左边</li>
            </ul>
          </div>

          <div className="principle-card">
            <h3>margin-left/right 负值的原理</h3>
            <ul>
              <li><strong>margin-left负值</strong>：元素向左移动，后续元素也会跟着左移</li>
              <li><strong>margin-right负值</strong>：元素本身不动，但右侧元素会向左移动</li>
              <li><strong>margin-top负值</strong>：元素向上移动</li>
              <li><strong>margin-bottom负值</strong>：元素本身不动，但下方元素会向上移动</li>
            </ul>
          </div>

          <div className="principle-card">
            <h3>float浮动的作用</h3>
            <ul>
              <li>所有栏都设置<code>float: left</code></li>
              <li>浮动元素脱离文档流，可以横向排列</li>
              <li>配合margin负值实现三栏并排效果</li>
              <li>需要清除浮动避免父元素高度塌陷</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="modern-section">
        <h2>💡 现代替代方案</h2>
        <div className="modern-grid">
          <div className="modern-card">
            <h3>Flexbox</h3>
            <pre className="code-block">{`.container {
  display: flex;
}
.left, .right {
  flex: 0 0 200px;
}
.center {
  flex: 1;
}`}</pre>
          </div>
          <div className="modern-card">
            <h3>Grid</h3>
            <pre className="code-block">{`.container {
  display: grid;
  grid-template-columns: 
    200px 1fr 150px;
}`}</pre>
          </div>
        </div>
        <p className="modern-note">
          💡 <strong>推荐</strong>：现代项目建议使用Flexbox或Grid，它们更简单、更灵活。
          圣杯和双飞翼布局主要用于理解CSS布局原理和面试。
        </p>
      </div>
    </div>
  );
};

// 圣杯布局组件
const HolyGrailLayout: React.FC = () => {
  return (
    <div className="layout-demo">
      <h3>圣杯布局实现</h3>
      
      <div className="demo-container">
        <div className="holy-grail-container clearfix">
          <div className="holy-center">
            <div className="content">中间栏（优先加载）<br/>宽度自适应</div>
          </div>
          <div className="holy-left">
            <div className="content">左侧栏<br/>200px</div>
          </div>
          <div className="holy-right">
            <div className="content">右侧栏<br/>150px</div>
          </div>
        </div>
      </div>

      <div className="code-section">
        <h4>HTML结构</h4>
        <pre className="code-block">{`<div id="container" class="clearfix">
  <p class="center">我是中间</p>
  <p class="left">我是左边</p>
  <p class="right">我是右边</p>
</div>`}</pre>

        <h4>CSS样式</h4>
        <pre className="code-block">{`#container {
  padding-left: 200px;   /* 为左侧栏留空间 */
  padding-right: 150px;  /* 为右侧栏留空间 */
  overflow: auto;
}

#container p {
  float: left;  /* 所有栏都浮动 */
}

.center {
  width: 100%;  /* 占满整行 */
  background-color: lightcoral;
}

.left {
  width: 200px;
  position: relative;  /* 使用相对定位 */
  left: -200px;        /* 向左移动自身宽度 */
  margin-left: -100%;  /* 移到上一行最左边 */
  background-color: lightcyan;
}

.right {
  width: 150px;
  margin-right: -150px;  /* 向左移动自身宽度 */
  background-color: lightgreen;
}

.clearfix:after {
  content: "";
  display: table;
  clear: both;
}`}</pre>
      </div>

      <div className="steps-section">
        <h4>实现步骤详解</h4>
        <div className="steps">
          <div className="step">
            <div className="step-number">1</div>
            <div className="step-content">
              <h5>父容器设置padding</h5>
              <p>为左右两侧预留空间，防止内容被覆盖</p>
              <code>padding-left: 200px; padding-right: 150px;</code>
            </div>
          </div>
          <div className="step">
            <div className="step-number">2</div>
            <div className="step-content">
              <h5>所有栏设置float</h5>
              <p>三个元素都左浮动，中间栏宽度100%占满</p>
              <code>float: left; .center width: 100%;</code>
            </div>
          </div>
          <div className="step">
            <div className="step-number">3</div>
            <div className="step-content">
              <h5>左侧栏使用margin负值</h5>
              <p>margin-left: -100%让左侧栏移动到上一行最左边</p>
              <code>margin-left: -100%;</code>
            </div>
          </div>
          <div className="step">
            <div className="step-number">4</div>
            <div className="step-content">
              <h5>左侧栏相对定位调整</h5>
              <p>使用relative定位，向左移动200px到padding区域</p>
              <code>position: relative; left: -200px;</code>
            </div>
          </div>
          <div className="step">
            <div className="step-number">5</div>
            <div className="step-content">
              <h5>右侧栏使用margin负值</h5>
              <p>margin-right: -150px让右侧栏移到右边padding区域</p>
              <code>margin-right: -150px;</code>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// 双飞翼布局组件
const TwinWingsLayout: React.FC = () => {
  return (
    <div className="layout-demo">
      <h3>双飞翼布局实现</h3>
      
      <div className="demo-container">
        <div className="twin-wings-container">
          <div className="twin-main">
            <div className="twin-main-wrap">
              <div className="content">中间栏（优先加载）<br/>宽度自适应</div>
            </div>
          </div>
          <div className="twin-left">
            <div className="content">左侧栏<br/>190px</div>
          </div>
          <div className="twin-right">
            <div className="content">右侧栏<br/>190px</div>
          </div>
        </div>
      </div>

      <div className="code-section">
        <h4>HTML结构</h4>
        <pre className="code-block">{`<div id="main" class="float">
  <div id="main-wrap">main</div>
</div>
<div id="left" class="float">left</div>
<div id="right" class="float">right</div>`}</pre>

        <h4>CSS样式</h4>
        <pre className="code-block">{`.float {
  float: left;  /* 所有栏都浮动 */
}

#main {
  width: 100%;  /* 占满整行 */
  height: 200px;
  background-color: lightpink;
}

#main-wrap {
  margin: 0 190px 0 190px;  /* 为左右留空间 */
}

#left {
  width: 190px;
  height: 200px;
  background-color: lightsalmon;
  margin-left: -100%;  /* 移到上一行最左边 */
}

#right {
  width: 190px;
  height: 200px;
  background-color: lightskyblue;
  margin-left: -190px;  /* 向左移动自身宽度 */
}`}</pre>
      </div>

      <div className="steps-section">
        <h4>实现步骤详解</h4>
        <div className="steps">
          <div className="step">
            <div className="step-number">1</div>
            <div className="step-content">
              <h5>中间栏额外包裹层</h5>
              <p>中间栏需要一个内部div来设置margin</p>
              <code>&lt;div id="main"&gt;&lt;div id="main-wrap"&gt;&lt;/div&gt;&lt;/div&gt;</code>
            </div>
          </div>
          <div className="step">
            <div className="step-number">2</div>
            <div className="step-content">
              <h5>所有栏设置float</h5>
              <p>三个外层元素都左浮动，main宽度100%</p>
              <code>float: left; #main width: 100%;</code>
            </div>
          </div>
          <div className="step">
            <div className="step-number">3</div>
            <div className="step-content">
              <h5>中间栏内层设置margin</h5>
              <p>通过内层的margin为左右两侧预留空间</p>
              <code>margin: 0 190px 0 190px;</code>
            </div>
          </div>
          <div className="step">
            <div className="step-number">4</div>
            <div className="step-content">
              <h5>左侧栏使用margin负值</h5>
              <p>margin-left: -100%移动到上一行最左边</p>
              <code>margin-left: -100%;</code>
            </div>
          </div>
          <div className="step">
            <div className="step-number">5</div>
            <div className="step-content">
              <h5>右侧栏使用margin负值</h5>
              <p>margin-left: -190px移动到右侧</p>
              <code>margin-left: -190px;</code>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClassicLayoutsPage;

