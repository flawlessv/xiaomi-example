// VirtualListWithLoading.tsx
import React, { useRef, useEffect, useState, useCallback } from 'react'
import { useVirtualizer } from '@tanstack/react-virtual'
import { useVirtualDataLoader } from './useVirtualDataLoader'
import './VirtualListWithLoading.css'

interface VirtualListWithLoadingProps {
  totalCount: number
  chunkSize?: number
  bufferSize?: number
  estimateSize?: number
}

export const VirtualListWithLoading: React.FC<VirtualListWithLoadingProps> = ({
  totalCount = 10000,
  chunkSize = 40,
  bufferSize = 80, // 预加载缓冲区
  estimateSize = 80
}) => {
  const scrollElementRef = useRef<HTMLDivElement>(null)
  const [lastLoadedRange, setLastLoadedRange] = useState({ start: 0, end: 0 })
  
  const {
    loadedChunks,
    loadingChunks,
    loadChunks,
    getItem,
    chunkSize: actualChunkSize
  } = useVirtualDataLoader(totalCount, chunkSize)

  // 虚拟化器配置
  const virtualizer = useVirtualizer({
    count: totalCount,
    getScrollElement: () => scrollElementRef.current,
    estimateSize: () => estimateSize,
    overscan: 5 // 少量overscan保证流畅滚动
  })

  const virtualItems = virtualizer.getVirtualItems()

  // 加载数据逻辑
  useEffect(() => {
    if (virtualItems.length === 0) return

    const visibleStart = virtualItems[0].index
    const visibleEnd = virtualItems[virtualItems.length - 1].index
    
    // 计算需要加载的范围（包含缓冲区）
    const loadStart = Math.max(0, visibleStart - bufferSize)
    const loadEnd = Math.min(totalCount - 1, visibleEnd + bufferSize)
    
    // 只有当范围变化较大时才重新加载
    if (
      Math.abs(loadStart - lastLoadedRange.start) > actualChunkSize / 2 ||
      Math.abs(loadEnd - lastLoadedRange.end) > actualChunkSize / 2
    ) {
      loadChunks(loadStart, loadEnd)
      setLastLoadedRange({ start: loadStart, end: loadEnd })
    }
  }, [virtualItems, bufferSize, totalCount, loadChunks, lastLoadedRange, actualChunkSize])

  // 渲染单个列表项
  const renderItem = useCallback((index: number) => {
    const item = getItem(index)
    const chunkKey = Math.floor(index / actualChunkSize) * actualChunkSize
    const isLoading = loadingChunks.has(chunkKey.toString())

    if (isLoading) {
      return (
        <div className="list-item loading">
          <div className="loading-skeleton">
            <div className="skeleton-title"></div>
            <div className="skeleton-content"></div>
          </div>
          <div className="loading-text">加载中...</div>
        </div>
      )
    }

    if (!item) {
      return (
        <div className="list-item not-loaded">
          <div>数据未加载: {index}</div>
        </div>
      )
    }

    return (
      <div className="list-item loaded">
        <div className="item-header">
          <h3 className="item-title">{item.title}</h3>
          <span className="item-id">#{index + 1}</span>
        </div>
        <p className="item-content">{item.content}</p>
        <div className="item-footer">
          <span className="item-timestamp">
            {new Date(item.timestamp).toLocaleTimeString()}
          </span>
        </div>
      </div>
    )
  }, [getItem, loadingChunks, actualChunkSize])

  // 计算加载统计
  const loadedCount = Array.from(loadedChunks.values())
    .reduce((total, chunk) => total + chunk.data.length, 0)
  const loadingCount = loadingChunks.size

  return (
    <div className="virtual-list-container">
      {/* 统计信息 */}
      <div className="stats-bar">
        <div className="stat">
          总项目: <strong>{totalCount.toLocaleString()}</strong>
        </div>
        <div className="stat">
          已加载: <strong>{loadedCount}</strong>
        </div>
        <div className="stat">
          加载中: <strong>{loadingCount}</strong>
        </div>
        <div className="stat">
          内存块: <strong>{loadedChunks.size}</strong>
        </div>
      </div>

      {/* 虚拟列表容器 */}
      <div
        ref={scrollElementRef}
        className="scroll-container"
        style={{
          height: '600px',
          overflow: 'auto',
          border: '1px solid #e1e5e9',
          borderRadius: '8px'
        }}
      >
        <div
          style={{
            height: `${virtualizer.getTotalSize()}px`,
            width: '100%',
            position: 'relative'
          }}
        >
          {virtualItems.map(virtualItem => (
            <div
              key={virtualItem.index}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: `${virtualItem.size}px`,
                transform: `translateY(${virtualItem.start}px)`
              }}
            >
              {renderItem(virtualItem.index)}
            </div>
          ))}
        </div>
      </div>

      {/* 调试信息 */}
      <div className="debug-info">
        <details>
          <summary>调试信息 (点击展开)</summary>
          <div className="chunks-list">
            <h4>已加载的数据块:</h4>
            {Array.from(loadedChunks.entries()).map(([key, chunk]) => (
              <div key={key} className="chunk-info">
                {key}: {chunk.startIndex}-{chunk.endIndex} 
                ({chunk.data.length} items)
              </div>
            ))}
          </div>
        </details>
      </div>
    </div>
  )
}

