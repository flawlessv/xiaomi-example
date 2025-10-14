import React, { useState, useMemo } from 'react';
import './index.css';

interface Selector {
  selector: string;
  name: string;
  description: string;
  example: string;
  category: string;
  version: string;
}

const CSSSelectorsPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  // 完整的CSS选择器数据
  const selectors: Selector[] = [
    // 基础选择器
    { selector: '*', name: '通配符选择器', description: '选择所有元素', example: '* { margin: 0; }', category: 'basic', version: 'CSS1' },
    { selector: 'element', name: '元素选择器', description: '选择所有指定类型的元素', example: 'p { color: red; }', category: 'basic', version: 'CSS1' },
    { selector: '.class', name: '类选择器', description: '选择所有具有指定class的元素', example: '.intro { font-size: 16px; }', category: 'basic', version: 'CSS1' },
    { selector: '#id', name: 'ID选择器', description: '选择具有指定id的元素（唯一）', example: '#header { height: 80px; }', category: 'basic', version: 'CSS1' },
    
    // 组合选择器
    { selector: 'A B', name: '后代选择器', description: '选择A元素内部的所有B元素（所有层级）', example: 'div p { color: blue; }', category: 'combinator', version: 'CSS1' },
    { selector: 'A > B', name: '子选择器', description: '选择A元素的直接子元素B（仅一级）', example: 'ul > li { list-style: none; }', category: 'combinator', version: 'CSS2' },
    { selector: 'A + B', name: '相邻兄弟选择器', description: '选择紧接在A元素后的B元素', example: 'h1 + p { margin-top: 0; }', category: 'combinator', version: 'CSS2' },
    { selector: 'A ~ B', name: '通用兄弟选择器', description: '选择A元素后的所有B兄弟元素', example: 'h1 ~ p { color: gray; }', category: 'combinator', version: 'CSS3' },
    
    // 属性选择器
    { selector: '[attr]', name: '属性选择器', description: '选择具有指定属性的元素', example: '[disabled] { opacity: 0.5; }', category: 'attribute', version: 'CSS2' },
    { selector: '[attr=value]', name: '属性值选择器', description: '选择属性值完全等于value的元素', example: '[type="text"] { border: 1px solid; }', category: 'attribute', version: 'CSS2' },
    { selector: '[attr~=value]', name: '属性包含词选择器', description: '选择属性值包含独立单词value的元素', example: '[class~="btn"] { padding: 10px; }', category: 'attribute', version: 'CSS2' },
    { selector: '[attr|=value]', name: '属性开头选择器', description: '选择属性值以value或value-开头的元素', example: '[lang|="en"] { font-family: Arial; }', category: 'attribute', version: 'CSS2' },
    { selector: '[attr^=value]', name: '属性前缀选择器', description: '选择属性值以value开头的元素', example: '[href^="https"] { color: green; }', category: 'attribute', version: 'CSS3' },
    { selector: '[attr$=value]', name: '属性后缀选择器', description: '选择属性值以value结尾的元素', example: '[href$=".pdf"] { color: red; }', category: 'attribute', version: 'CSS3' },
    { selector: '[attr*=value]', name: '属性包含选择器', description: '选择属性值包含value子串的元素', example: '[href*="example"] { font-weight: bold; }', category: 'attribute', version: 'CSS3' },
    
    // 伪类选择器 - 链接/用户行为
    { selector: ':link', name: '链接伪类', description: '选择未访问过的链接', example: 'a:link { color: blue; }', category: 'pseudo-class', version: 'CSS1' },
    { selector: ':visited', name: '已访问伪类', description: '选择已访问过的链接', example: 'a:visited { color: purple; }', category: 'pseudo-class', version: 'CSS1' },
    { selector: ':hover', name: '悬停伪类', description: '选择鼠标悬停的元素', example: 'button:hover { background: gray; }', category: 'pseudo-class', version: 'CSS1' },
    { selector: ':active', name: '激活伪类', description: '选择被激活（点击）的元素', example: 'a:active { color: red; }', category: 'pseudo-class', version: 'CSS1' },
    { selector: ':focus', name: '聚焦伪类', description: '选择获得焦点的元素', example: 'input:focus { border-color: blue; }', category: 'pseudo-class', version: 'CSS2' },
    { selector: ':focus-within', name: '内部聚焦伪类', description: '选择内部有元素获得焦点的元素', example: 'form:focus-within { box-shadow: 0 0 5px; }', category: 'pseudo-class', version: 'CSS4' },
    { selector: ':focus-visible', name: '键盘聚焦伪类', description: '选择通过键盘聚焦的元素', example: 'button:focus-visible { outline: 2px solid; }', category: 'pseudo-class', version: 'CSS4' },
    
    // 伪类选择器 - 结构
    { selector: ':first-child', name: '首个子元素', description: '选择作为父元素第一个子元素的元素', example: 'li:first-child { font-weight: bold; }', category: 'pseudo-class', version: 'CSS2' },
    { selector: ':last-child', name: '最后子元素', description: '选择作为父元素最后一个子元素的元素', example: 'li:last-child { border-bottom: none; }', category: 'pseudo-class', version: 'CSS3' },
    { selector: ':nth-child(n)', name: '第n个子元素', description: '选择父元素的第n个子元素', example: 'tr:nth-child(2n) { background: #f0f0f0; }', category: 'pseudo-class', version: 'CSS3' },
    { selector: ':nth-last-child(n)', name: '倒数第n个子元素', description: '选择父元素倒数第n个子元素', example: 'li:nth-last-child(2) { color: gray; }', category: 'pseudo-class', version: 'CSS3' },
    { selector: ':only-child', name: '唯一子元素', description: '选择是其父元素唯一子元素的元素', example: 'p:only-child { margin: 0; }', category: 'pseudo-class', version: 'CSS3' },
    { selector: ':first-of-type', name: '首个类型元素', description: '选择父元素中第一个该类型的元素', example: 'p:first-of-type { font-size: 18px; }', category: 'pseudo-class', version: 'CSS3' },
    { selector: ':last-of-type', name: '最后类型元素', description: '选择父元素中最后一个该类型的元素', example: 'p:last-of-type { margin-bottom: 0; }', category: 'pseudo-class', version: 'CSS3' },
    { selector: ':nth-of-type(n)', name: '第n个类型元素', description: '选择父元素中第n个该类型的元素', example: 'p:nth-of-type(2) { color: blue; }', category: 'pseudo-class', version: 'CSS3' },
    { selector: ':nth-last-of-type(n)', name: '倒数第n个类型元素', description: '选择父元素中倒数第n个该类型的元素', example: 'p:nth-last-of-type(1) { font-style: italic; }', category: 'pseudo-class', version: 'CSS3' },
    { selector: ':only-of-type', name: '唯一类型元素', description: '选择是其父元素中唯一该类型的元素', example: 'p:only-of-type { text-align: center; }', category: 'pseudo-class', version: 'CSS3' },
    
    // 伪类选择器 - 表单/输入
    { selector: ':checked', name: '选中伪类', description: '选择被选中的radio、checkbox或option元素', example: 'input:checked { outline: 2px solid green; }', category: 'pseudo-class', version: 'CSS3' },
    { selector: ':disabled', name: '禁用伪类', description: '选择被禁用的表单元素', example: 'input:disabled { opacity: 0.5; }', category: 'pseudo-class', version: 'CSS3' },
    { selector: ':enabled', name: '启用伪类', description: '选择启用的表单元素', example: 'input:enabled { border: 1px solid; }', category: 'pseudo-class', version: 'CSS3' },
    { selector: ':required', name: '必填伪类', description: '选择有required属性的表单元素', example: 'input:required { border-color: red; }', category: 'pseudo-class', version: 'CSS3' },
    { selector: ':optional', name: '可选伪类', description: '选择没有required属性的表单元素', example: 'input:optional { border-color: gray; }', category: 'pseudo-class', version: 'CSS3' },
    { selector: ':valid', name: '有效伪类', description: '选择验证通过的表单元素', example: 'input:valid { border-color: green; }', category: 'pseudo-class', version: 'CSS3' },
    { selector: ':invalid', name: '无效伪类', description: '选择验证未通过的表单元素', example: 'input:invalid { border-color: red; }', category: 'pseudo-class', version: 'CSS3' },
    { selector: ':in-range', name: '范围内伪类', description: '选择值在指定范围内的input元素', example: 'input:in-range { border-color: green; }', category: 'pseudo-class', version: 'CSS3' },
    { selector: ':out-of-range', name: '范围外伪类', description: '选择值超出指定范围的input元素', example: 'input:out-of-range { border-color: red; }', category: 'pseudo-class', version: 'CSS3' },
    { selector: ':read-only', name: '只读伪类', description: '选择只读的表单元素', example: 'input:read-only { background: #f5f5f5; }', category: 'pseudo-class', version: 'CSS3' },
    { selector: ':read-write', name: '可读写伪类', description: '选择可编辑的表单元素', example: 'input:read-write { background: white; }', category: 'pseudo-class', version: 'CSS3' },
    { selector: ':placeholder-shown', name: '占位符显示伪类', description: '选择显示占位符文本的input元素', example: 'input:placeholder-shown { border: 1px dashed; }', category: 'pseudo-class', version: 'CSS4' },
    
    // 伪类选择器 - 其他
    { selector: ':empty', name: '空元素伪类', description: '选择没有任何子元素（包括文本）的元素', example: 'div:empty { display: none; }', category: 'pseudo-class', version: 'CSS3' },
    { selector: ':not(selector)', name: '否定伪类', description: '选择不匹配selector的元素', example: 'li:not(.active) { opacity: 0.5; }', category: 'pseudo-class', version: 'CSS3' },
    { selector: ':root', name: '根元素伪类', description: '选择文档的根元素（通常是html）', example: ':root { --main-color: blue; }', category: 'pseudo-class', version: 'CSS3' },
    { selector: ':target', name: '目标伪类', description: '选择当前URL片段标识符指向的元素', example: ':target { background: yellow; }', category: 'pseudo-class', version: 'CSS3' },
    { selector: ':lang(language)', name: '语言伪类', description: '选择指定语言的元素', example: ':lang(zh) { font-family: "SimSun"; }', category: 'pseudo-class', version: 'CSS2' },
    
    // 伪元素选择器
    { selector: '::before', name: 'before伪元素', description: '在元素内容之前插入内容', example: 'p::before { content: "→ "; }', category: 'pseudo-element', version: 'CSS2' },
    { selector: '::after', name: 'after伪元素', description: '在元素内容之后插入内容', example: 'p::after { content: " ←"; }', category: 'pseudo-element', version: 'CSS2' },
    { selector: '::first-letter', name: '首字母伪元素', description: '选择元素的第一个字母', example: 'p::first-letter { font-size: 2em; }', category: 'pseudo-element', version: 'CSS1' },
    { selector: '::first-line', name: '首行伪元素', description: '选择元素的第一行', example: 'p::first-line { font-weight: bold; }', category: 'pseudo-element', version: 'CSS1' },
    { selector: '::selection', name: '选中文本伪元素', description: '选择用户选中的文本', example: '::selection { background: yellow; }', category: 'pseudo-element', version: 'CSS3' },
    { selector: '::placeholder', name: '占位符伪元素', description: '选择input的占位符文本', example: '::placeholder { color: gray; }', category: 'pseudo-element', version: 'CSS4' },
    { selector: '::marker', name: '列表标记伪元素', description: '选择列表项的标记', example: '::marker { color: red; }', category: 'pseudo-element', version: 'CSS3' },
    { selector: '::backdrop', name: '背景伪元素', description: '选择全屏模式的背景', example: '::backdrop { background: rgba(0,0,0,0.5); }', category: 'pseudo-element', version: 'CSS4' },
  ];

  const categories = [
    { value: 'all', label: '全部选择器', count: selectors.length },
    { value: 'basic', label: '基础选择器', count: selectors.filter(s => s.category === 'basic').length },
    { value: 'combinator', label: '组合选择器', count: selectors.filter(s => s.category === 'combinator').length },
    { value: 'attribute', label: '属性选择器', count: selectors.filter(s => s.category === 'attribute').length },
    { value: 'pseudo-class', label: '伪类选择器', count: selectors.filter(s => s.category === 'pseudo-class').length },
    { value: 'pseudo-element', label: '伪元素选择器', count: selectors.filter(s => s.category === 'pseudo-element').length },
  ];

  // 过滤选择器
  const filteredSelectors = useMemo(() => {
    return selectors.filter(selector => {
      const matchesCategory = selectedCategory === 'all' || selector.category === selectedCategory;
      const matchesSearch = !searchTerm || 
        selector.selector.toLowerCase().includes(searchTerm.toLowerCase()) ||
        selector.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        selector.description.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [searchTerm, selectedCategory]);

  return (
    <div className="css-selectors-page">
      <header className="page-header">
        <h1>CSS 选择器完整参考手册</h1>
        <p className="page-description">
          包含所有CSS选择器的详细说明、示例代码和兼容性信息
        </p>
        <div className="stats">
          <span className="stat-item">
            <strong>{selectors.length}</strong> 个选择器
          </span>
          <span className="stat-item">
            <strong>{categories.length - 1}</strong> 个分类
          </span>
          <span className="stat-item">
            覆盖 <strong>CSS1-CSS4</strong>
          </span>
        </div>
      </header>

      <div className="controls-section">
        <div className="search-box">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            placeholder="搜索选择器、名称或描述..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          {searchTerm && (
            <button className="clear-btn" onClick={() => setSearchTerm('')}>
              ✕
            </button>
          )}
        </div>

        <div className="category-filters">
          {categories.map(cat => (
            <button
              key={cat.value}
              className={`filter-btn ${selectedCategory === cat.value ? 'active' : ''}`}
              onClick={() => setSelectedCategory(cat.value)}
            >
              {cat.label} <span className="count">({cat.count})</span>
            </button>
          ))}
        </div>
      </div>

      <div className="results-info">
        显示 <strong>{filteredSelectors.length}</strong> 个选择器
      </div>

      <div className="table-container">
        <table className="selectors-table">
          <thead>
            <tr>
              <th className="col-selector">选择器</th>
              <th className="col-name">名称</th>
              <th className="col-description">说明</th>
              <th className="col-example">示例</th>
              <th className="col-version">版本</th>
            </tr>
          </thead>
          <tbody>
            {filteredSelectors.map((selector, index) => (
              <tr key={index} className="selector-row">
                <td className="col-selector">
                  <code className="selector-code">{selector.selector}</code>
                </td>
                <td className="col-name">{selector.name}</td>
                <td className="col-description">{selector.description}</td>
                <td className="col-example">
                  <code className="example-code">{selector.example}</code>
                </td>
                <td className="col-version">
                  <span className={`version-badge version-${selector.version.toLowerCase()}`}>
                    {selector.version}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {filteredSelectors.length === 0 && (
        <div className="no-results">
          <div className="no-results-icon">🔍</div>
          <h3>没有找到匹配的选择器</h3>
          <p>试试其他搜索词或切换分类</p>
        </div>
      )}
    </div>
  );
};

export default CSSSelectorsPage;

