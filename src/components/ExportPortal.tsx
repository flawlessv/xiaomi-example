import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import html2canvas from "html2canvas";
import { ExportOptions } from "../hooks/useExportImage";

// 创建Portal容器
const createExportContainer = (width: number = 800, height: number = 1000) => {
  const container = document.createElement("div");
  container.id = "export-portal-container";
  container.style.cssText = `
    position: absolute;
    left: -9999px;
    top: -9999px;
    width: ${width}px;
    min-height: ${height}px;
    background-color: #fff;
    padding: 20px;
    box-sizing: border-box;
  `;
  document.body.appendChild(container);
  return container;
};

// Portal导出组件 - 方案二：React Portal
export const ExportPortal: React.FC<{
  isVisible: boolean;
  onExportComplete: () => void;
  children: React.ReactNode;
  exportOptions?: ExportOptions;
}> = ({ isVisible, onExportComplete, children, exportOptions = {} }) => {
  const [portalContainer, setPortalContainer] = useState<HTMLElement | null>(
    null
  );

  useEffect(() => {
    if (isVisible) {
      const container = createExportContainer(
        exportOptions.width || 800,
        exportOptions.height || 1000
      );
      setPortalContainer(container);

      // 延迟执行导出，确保内容渲染完成
      setTimeout(async () => {
        try {
          const canvas = await html2canvas(container, {
            backgroundColor: exportOptions.backgroundColor || "#fff",
            scale: exportOptions.scale || 2,
            useCORS: true,
            allowTaint: true,
          });

          canvas.toBlob((blob) => {
            if (blob) {
              const url = URL.createObjectURL(blob);
              const link = document.createElement("a");
              link.download = exportOptions.filename || "export.png";
              link.href = url;
              link.click();
              setTimeout(() => URL.revokeObjectURL(url), 100);
            }
          }, "image/png");
        } finally {
          onExportComplete();
        }
      }, 300);
    }

    return () => {
      if (portalContainer) {
        document.body.removeChild(portalContainer);
        setPortalContainer(null);
      }
    };
  }, [isVisible, onExportComplete, exportOptions]);

  if (!isVisible || !portalContainer) return null;

  return createPortal(children, portalContainer);
};

// 高级Portal：可视化调试
export const DebugableExportPortal: React.FC<{
  isVisible: boolean;
  debugMode?: boolean;
  onExportComplete: () => void;
  children: React.ReactNode;
  exportOptions?: ExportOptions;
}> = ({ isVisible, debugMode = false, onExportComplete, children, exportOptions = {} }) => {
  const [portalContainer, setPortalContainer] = useState<HTMLElement | null>(null);

  useEffect(() => {
    if (isVisible) {
      const container = createExportContainer(
        exportOptions.width || 800,
        exportOptions.height || 1000
      );

      // 调试模式：显示导出内容
      if (debugMode) {
        container.style.left = "50px";
        container.style.top = "50px";
        container.style.border = "2px solid red";
        container.style.zIndex = "9999";
      }

      setPortalContainer(container);

      if (!debugMode) {
        // 非调试模式自动导出
        setTimeout(async () => {
          const canvas = await html2canvas(container, {
            backgroundColor: exportOptions.backgroundColor || "#fff",
            scale: exportOptions.scale || 2,
            useCORS: true,
            allowTaint: true,
          });

          canvas.toBlob((blob) => {
            if (blob) {
              const url = URL.createObjectURL(blob);
              const link = document.createElement("a");
              link.download = exportOptions.filename || "debug-export.png";
              link.href = url;
              link.click();
              setTimeout(() => URL.revokeObjectURL(url), 100);
            }
          }, "image/png");

          onExportComplete();
        }, 300);
      }
    }

    return () => {
      if (portalContainer) {
        document.body.removeChild(portalContainer);
        setPortalContainer(null);
      }
    };
  }, [isVisible, debugMode, onExportComplete, exportOptions]);

  if (!isVisible || !portalContainer) return null;

  return createPortal(
    <div>
      {children}
      {debugMode && (
        <div style={{ marginTop: "20px" }}>
          <button onClick={onExportComplete}>关闭调试</button>
        </div>
      )}
    </div>,
    portalContainer
  );
};

