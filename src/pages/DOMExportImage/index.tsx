import React, { useState } from "react";
import { useExportImage } from "../../hooks/useExportImage";
import { ExportPortal, DebugableExportPortal } from "../../components/ExportPortal";
import { exportWithIframe } from "../../utils/exportVirtualDOM";
import { Carousel, CarouselItem } from "./Carousel";
import "./index.css";

// 轮播图数据
const carouselItems: CarouselItem[] = [
  {
    id: 1,
    title: "产品A",
    description: "这是一款功能强大的产品，具有出色的性能和用户体验。",
    color: "#4A90E2",
  },
  {
    id: 2,
    title: "产品B",
    description: "专为现代设计打造，简洁优雅，满足您的各种需求。",
    color: "#50C878",
  },
  {
    id: 3,
    title: "产品C",
    description: "高性能解决方案，让您的工作效率提升数倍。",
    color: "#FF6B6B",
  },
  {
    id: 4,
    title: "产品D",
    description: "创新技术，引领行业潮流，为您带来全新体验。",
    color: "#FFA500",
  },
  {
    id: 5,
    title: "产品E",
    description: "安全可靠，值得信赖，是您的最佳选择。",
    color: "#9B59B6",
  },
  {
    id: 6,
    title: "产品F",
    description: "智能便捷，让生活更简单，让工作更高效。",
    color: "#1ABC9C",
  },
];

const DOMExportImagePage: React.FC = () => {
  const { exportCustomContent } = useExportImage();
  const [isExportingPortal, setIsExportingPortal] = useState(false);
  const [isExportingDebug, setIsExportingDebug] = useState(false);

  // 方案一：隐藏DOM导出
  const handleExportHiddenDOM = () => {
    exportCustomContent(
      () => <Carousel items={carouselItems} isExport={true} />,
      {
        filename: "隐藏DOM导出报告.png",
        width: 1200,
        height: 1000,
        scale: 2,
      }
    );
  };

  // 方案二：Portal导出
  const handleExportPortal = () => {
    setIsExportingPortal(true);
  };

  const handleExportComplete = () => {
    setIsExportingPortal(false);
  };

  // 方案二：Portal调试模式
  const handleExportDebug = () => {
    setIsExportingDebug(true);
  };

  const handleDebugComplete = () => {
    setIsExportingDebug(false);
  };

  // 方案三：iframe隔离渲染导出
  const handleExportIframe = async () => {
    const component = <Carousel items={carouselItems} isExport={true} />;

    await exportWithIframe(component, {
      filename: "iframe隔离渲染报告.png",
      width: 1200,
      height: 1000,
      scale: 2,
      backgroundColor: "#ffffff",
    });
  };

  return (
    <div className="dom-export-page">
      <div className="page-header">
        <h1>差异化DOM导出图片</h1>
        <p className="subtitle">
          演示三种不同的DOM导出图片方案，适用于不同的业务场景
        </p>
      </div>

      {/* 统一的轮播图展示区域 */}
      <div className="carousel-showcase">
        <h2 className="showcase-title">产品轮播图展示</h2>
        <p className="showcase-description">
          页面展示为横向滚动的轮播图，导出时会自动转换为垂直排列并添加标题
        </p>
        <Carousel items={carouselItems} isExport={false} />
      </div>

      <div className="schemes-container">
        {/* 方案一：隐藏DOM */}
        <div className="scheme-card">
          <div className="scheme-header">
            <h2>方案一：html2canvas + 隐藏DOM</h2>
            <span className="scheme-badge">推荐</span>
          </div>
          <div className="scheme-description">
            <p>
              <strong>优点：</strong>完全支持React生命周期和状态管理，功能最全面
            </p>
            <p>
              <strong>适用场景：</strong>复杂交互组件、需要状态管理的场景
            </p>
            <p className="note">
              <strong>导出效果：</strong>轮播图会垂直排列（自动换行），顶部添加"产品展示报告"标题
            </p>
          </div>
          <div className="scheme-demo">
            <button
              className="export-button"
              onClick={handleExportHiddenDOM}
            >
              导出图片
            </button>
          </div>
        </div>

        {/* 方案二：React Portal */}
        <div className="scheme-card">
          <div className="scheme-header">
            <h2>方案二：React Portal</h2>
            <span className="scheme-badge">易调试</span>
          </div>
          <div className="scheme-description">
            <p>
              <strong>优点：</strong>代码结构清晰，易于调试，支持可视化预览
            </p>
            <p>
              <strong>适用场景：</strong>需要与页面状态共享、需要调试验证的场景
            </p>
            <p className="note">
              <strong>导出效果：</strong>轮播图会垂直排列（自动换行），顶部添加"产品展示报告"标题
            </p>
          </div>
          <div className="scheme-demo">
            <div className="button-group">
              <button
                className="export-button"
                onClick={handleExportPortal}
                disabled={isExportingPortal}
              >
                {isExportingPortal ? "导出中..." : "Portal导出"}
              </button>
              <button
                className="export-button secondary"
                onClick={handleExportDebug}
                disabled={isExportingDebug}
              >
                调试模式
              </button>
            </div>
          </div>
        </div>

        {/* 方案三：iframe隔离渲染 */}
        <div className="scheme-card">
          <div className="scheme-header">
            <h2>方案三：iframe隔离渲染</h2>
            <span className="scheme-badge">高性能</span>
          </div>
          <div className="scheme-description">
            <p>
              <strong>优点：</strong>性能最好，渲染环境隔离，样式不会污染主页面
            </p>
            <p>
              <strong>适用场景：</strong>纯静态内容、不使用hooks的组件
            </p>
            <p className="note">
              <strong>导出效果：</strong>轮播图会垂直排列（自动换行），顶部添加"产品展示报告"标题
            </p>
          </div>
          <div className="scheme-demo">
            <button
              className="export-button"
              onClick={handleExportIframe}
            >
              iframe隔离导出
            </button>
          </div>
        </div>
      </div>

      {/* Portal导出组件 */}
      <ExportPortal
        isVisible={isExportingPortal}
        onExportComplete={handleExportComplete}
        exportOptions={{
          filename: "Portal导出报告.png",
          width: 1200,
          height: 1000,
          scale: 2,
        }}
      >
        <Carousel items={carouselItems} isExport={true} />
      </ExportPortal>

      {/* 调试模式Portal */}
      <DebugableExportPortal
        isVisible={isExportingDebug}
        debugMode={true}
        onExportComplete={handleDebugComplete}
        exportOptions={{
          filename: "调试导出报告.png",
          width: 1200,
          height: 1000,
          scale: 2,
        }}
      >
        <Carousel items={carouselItems} isExport={true} />
      </DebugableExportPortal>
    </div>
  );
};

export default DOMExportImagePage;

