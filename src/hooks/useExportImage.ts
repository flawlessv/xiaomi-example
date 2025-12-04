import html2canvas from "html2canvas";
import ReactDOM from "react-dom";

export interface ExportOptions {
  filename?: string;
  width?: number;
  height?: number;
  scale?: number;
  backgroundColor?: string;
}

// 导出Hook - 方案一：html2canvas + 隐藏DOM
export const useExportImage = () => {
  const exportCustomContent = async (
    renderContent: () => JSX.Element,
    options: ExportOptions = {}
  ) => {
    const {
      filename = "export.png",
      width = 800,
      height = 600,
      scale = 2,
      backgroundColor = "#ffffff",
    } = options;

    // 1. 创建隐藏容器
    const exportContainer = document.createElement("div");
    exportContainer.style.cssText = `
      position: absolute;
      left: -9999px;
      top: -9999px;
      width: ${width}px;
      min-height: ${height}px;
      background-color: ${backgroundColor};
      padding: 20px;
      box-sizing: border-box;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    `;

    document.body.appendChild(exportContainer);

    try {
      // 2. 渲染React组件到隐藏容器
      ReactDOM.render(renderContent(), exportContainer);

      // 3. 等待渲染完成
      await new Promise((resolve) => setTimeout(resolve, 200));

      // 4. 使用html2canvas截图
      const canvas = await html2canvas(exportContainer, {
        backgroundColor,
        scale,
        useCORS: true,
        allowTaint: true,
        logging: false,
        windowWidth: width,
        windowHeight: height,
      });

      // 5. 下载图片
      canvas.toBlob((blob) => {
        if (blob) {
          const url = URL.createObjectURL(blob);
          const link = document.createElement("a");
          link.download = filename;
          link.href = url;
          link.click();

          // 清理URL
          setTimeout(() => {
            URL.revokeObjectURL(url);
          }, 100);
        }
      }, "image/png");

      // 6. 清理React组件
      ReactDOM.unmountComponentAtNode(exportContainer);
    } finally {
      // 7. 移除DOM容器
      document.body.removeChild(exportContainer);
    }
  };

  // 支持异步数据加载的导出
  const exportWithAsyncData = async (
    dataLoader: () => Promise<any>,
    renderContent: (data: any) => JSX.Element,
    options: ExportOptions = {}
  ) => {
    const exportContainer = document.createElement("div");
    exportContainer.style.cssText = `
      position: absolute;
      left: -9999px;
      top: -9999px;
      width: ${options.width || 800}px;
      background-color: ${options.backgroundColor || "#fff"};
    `;

    document.body.appendChild(exportContainer);

    try {
      // 1. 加载数据
      const data = await dataLoader();

      // 2. 渲染组件
      ReactDOM.render(renderContent(data), exportContainer);

      // 3. 等待渲染和图片加载
      await new Promise((resolve) => setTimeout(resolve, 500));

      // 4. 确保所有图片都加载完成
      const images = exportContainer.querySelectorAll("img");
      await Promise.all(
        Array.from(images).map((img) => {
          return new Promise((resolve, reject) => {
            if (img.complete) {
              resolve(img);
            } else {
              img.onload = () => resolve(img);
              img.onerror = reject;
            }
          });
        })
      );

      // 5. 截图
      const canvas = await html2canvas(exportContainer, {
        backgroundColor: options.backgroundColor || "#fff",
        scale: options.scale || 2,
        useCORS: true,
        allowTaint: true,
      });

      // 6. 导出
      canvas.toBlob((blob) => {
        if (blob) {
          const url = URL.createObjectURL(blob);
          const link = document.createElement("a");
          link.download = options.filename || "export.png";
          link.href = url;
          link.click();
          setTimeout(() => URL.revokeObjectURL(url), 100);
        }
      }, "image/png");

      ReactDOM.unmountComponentAtNode(exportContainer);
    } finally {
      document.body.removeChild(exportContainer);
    }
  };

  return { exportCustomContent, exportWithAsyncData };
};

