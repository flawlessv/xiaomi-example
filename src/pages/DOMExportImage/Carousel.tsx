import React from "react";
import "./Carousel.css";

export interface CarouselItem {
  id: number;
  title: string;
  description: string;
  image?: string;
  color: string;
}

interface CarouselProps {
  items: CarouselItem[];
  isExport?: boolean; // 是否为导出模式
}

// 页面展示用的横向轮播图组件
export const Carousel: React.FC<CarouselProps> = ({ items, isExport = false }) => {
  if (isExport) {
    // 导出模式：垂直排列，带标题
    return (
      <div className="carousel-export-container">
        <h1 className="export-title">产品展示报告</h1>
        <div className="carousel-export-grid">
          {items.map((item) => (
            <div key={item.id} className="carousel-item-export">
              <div
                className="carousel-item-image"
                style={{ backgroundColor: item.color }}
              >
                {item.image ? (
                  <img src={item.image} alt={item.title} />
                ) : (
                  <div className="carousel-item-placeholder">
                    {item.title.charAt(0)}
                  </div>
                )}
              </div>
              <div className="carousel-item-content">
                <h3>{item.title}</h3>
                <p>{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // 页面展示模式：横向滚动
  return (
    <div className="carousel-container">
      <div className="carousel-wrapper">
        {items.map((item) => (
          <div key={item.id} className="carousel-item">
            <div
              className="carousel-item-image"
              style={{ backgroundColor: item.color }}
            >
              {item.image ? (
                <img src={item.image} alt={item.title} />
              ) : (
                <div className="carousel-item-placeholder">
                  {item.title.charAt(0)}
                </div>
              )}
            </div>
            <div className="carousel-item-content">
              <h3>{item.title}</h3>
              <p>{item.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

