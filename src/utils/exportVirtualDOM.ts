import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import html2canvas from "html2canvas";
import { ExportOptions } from "../hooks/useExportImage";

// 轮播图导出模式的CSS样式
const carouselExportCSS = `
  /* 导出模式：垂直排列 */
  .carousel-export-container {
    width: 100%;
    padding: 20px;
    background: #fff;
  }

  .export-title {
    font-size: 28px;
    font-weight: 600;
    color: #1a1a1a;
    margin: 0 0 24px 0;
    text-align: center;
    padding-bottom: 16px;
    border-bottom: 2px solid #e0e0e0;
  }

  .carousel-export-grid {
    display: flex;
    flex-wrap: wrap;
    gap: 20px;
    justify-content: flex-start;
  }

  .carousel-item-export {
    flex: 0 0 calc(33.333% - 14px);
    min-width: 240px;
    background: #fff;
    border: 1px solid #e0e0e0;
    border-radius: 12px;
    overflow: hidden;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  }

  .carousel-item-image {
    width: 100%;
    height: 160px;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
  }

  .carousel-item-image img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .carousel-item-placeholder {
    width: 80px;
    height: 80px;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.3);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 36px;
    font-weight: bold;
    color: rgba(255, 255, 255, 0.9);
  }

  .carousel-item-content {
    padding: 16px;
  }

  .carousel-item-content h3 {
    margin: 0 0 8px 0;
    font-size: 16px;
    font-weight: 600;
    color: #333;
  }

  .carousel-item-content p {
    margin: 0;
    font-size: 14px;
    color: #666;
    line-height: 1.5;
  }

  @media (max-width: 768px) {
    .carousel-item-export {
      flex: 0 0 calc(50% - 10px);
    }
  }

  @media (max-width: 480px) {
    .carousel-item-export {
      flex: 0 0 100%;
    }
  }
`;

// iframe隔离渲染导出函数 - 方案三：iframe隔离渲染
export const exportWithIframe = async (
  component: React.ReactElement,
  options: ExportOptions = {}
) => {
  const {
    filename = "export.png",
    width = 800,
    height = 600,
    scale = 2,
    backgroundColor = "#ffffff",
  } = options;

  try {
    // 1. 渲染React组件为HTML字符串（使用 renderToStaticMarkup 生成更干净的HTML）
    const htmlString = renderToStaticMarkup(component);

    // 2. 创建完整的HTML文档
    const fullHTML = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
          <style>
            body {
              margin: 0;
              padding: 20px;
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
              background-color: ${backgroundColor};
              width: ${width}px;
              min-height: ${height}px;
              box-sizing: border-box;
            }
            * {
              box-sizing: border-box;
            }
            ${carouselExportCSS}
          </style>
        </head>
        <body>
          ${htmlString}
        </body>
      </html>
    `;

    // 3. 创建iframe来渲染HTML
    const iframe = document.createElement("iframe");
    iframe.style.cssText = `
      position: absolute;
      left: -9999px;
      top: -9999px;
      width: ${width}px;
      min-height: ${height}px;
      border: none;
    `;

    document.body.appendChild(iframe);

    // 4. 写入HTML内容
    iframe.contentDocument?.open();
    iframe.contentDocument?.write(fullHTML);
    iframe.contentDocument?.close();

    // 5. 等待iframe加载完成
    await new Promise<void>((resolve) => {
      iframe.onload = () => {
        setTimeout(resolve, 200); // 额外等待时间确保样式应用
      };
    });

    // 6. 对iframe内容截图
    const canvas = await html2canvas(iframe.contentDocument!.body, {
      backgroundColor,
      scale,
      useCORS: true,
      allowTaint: true,
    });

    // 7. 下载图片
    canvas.toBlob((blob) => {
      if (blob) {
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.download = filename;
        link.href = url;
        link.click();
        setTimeout(() => URL.revokeObjectURL(url), 100);
      }
    }, "image/png");

    // 8. 清理iframe
    document.body.removeChild(iframe);
  } catch (error) {
    console.error("iframe隔离渲染导出失败:", error);
    throw error;
  }
};

// 高级iframe隔离渲染：支持CSS样式注入
export interface VirtualDOMExportOptions extends ExportOptions {
  customCSS?: string;
  externalCSS?: string[];
}

export const exportWithIframeAndCSS = async (
  component: React.ReactElement,
  options: VirtualDOMExportOptions = {}
) => {
  const {
    filename = "export.png",
    width = 800,
    height = 600,
    scale = 2,
    backgroundColor = "#ffffff",
    customCSS = "",
    externalCSS = [],
  } = options;

  // 渲染组件（使用 renderToStaticMarkup 生成更干净的HTML）
  const htmlString = renderToStaticMarkup(component);

  // 构建CSS链接
  const cssLinks = externalCSS
    .map((url) => `<link rel="stylesheet" href="${url}">`)
    .join("\n");

  // 创建完整HTML
  const fullHTML = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        ${cssLinks}
        <style>
          body {
            margin: 0;
            padding: 20px;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background-color: ${backgroundColor};
            width: ${width}px;
            min-height: ${height}px;
            box-sizing: border-box;
          }
          * {
            box-sizing: border-box;
          }
          
          ${carouselExportCSS}
          
          /* 自定义样式 */
          ${customCSS}
        </style>
      </head>
      <body>
        ${htmlString}
      </body>
    </html>
  `;

  // 创建iframe并渲染
  const iframe = document.createElement("iframe");
  iframe.style.cssText = `
    position: absolute;
    left: -9999px;
    top: -9999px;
    width: ${width}px;
    min-height: ${height}px;
    border: none;
  `;

  document.body.appendChild(iframe);

  try {
    iframe.contentDocument?.open();
    iframe.contentDocument?.write(fullHTML);
    iframe.contentDocument?.close();

    // 等待外部CSS加载
    await new Promise<void>((resolve) => {
      iframe.onload = () => {
        // 等待CSS加载完成
        setTimeout(resolve, 500);
      };
    });

    // 截图并下载
    const canvas = await html2canvas(iframe.contentDocument!.body, {
      backgroundColor,
      scale,
      useCORS: true,
      allowTaint: true,
    });

    canvas.toBlob((blob) => {
      if (blob) {
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.download = filename;
        link.href = url;
        link.click();
        setTimeout(() => URL.revokeObjectURL(url), 100);
      }
    }, "image/png");
  } finally {
    document.body.removeChild(iframe);
  }
};

