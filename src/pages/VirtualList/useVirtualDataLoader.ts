// useVirtualDataLoader.ts
import { useState, useCallback, useRef, useMemo } from 'react'
import { debounce } from 'lodash'
import { ListItem, DataChunk } from './types'

export const useVirtualDataLoader = (totalCount: number, chunkSize = 40) => {
  const [loadedChunks, setLoadedChunks] = useState<Map<string, DataChunk>>(new Map())
  const [loadingChunks, setLoadingChunks] = useState<Set<string>>(new Set())
  
  // 用于取消过时的请求
  const abortControllersRef = useRef<Map<string, AbortController>>(new Map())
  
  // 生成数据块的key
  const getChunkKey = useCallback((startIndex: number) => {
    return `${Math.floor(startIndex / chunkSize) * chunkSize}`
  }, [chunkSize])

  // 真实API请求（支持取消）
  const fetchChunkData = useCallback(async (
    startIndex: number, 
    signal: AbortSignal
  ): Promise<ListItem[]> => {
    const chunkStart = Math.floor(startIndex / chunkSize) * chunkSize
    
    try {
      const response = await fetch(
        `http://localhost:3001/api/virtual-list/data?start=${chunkStart}&limit=${chunkSize}`,
        { signal } // 传入signal以支持请求取消
      )
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const result = await response.json()
      
      if (!result.success) {
        throw new Error('API returned error')
      }
      
      return result.data
    } catch (error: any) {
      // 如果是取消错误，不打印日志
      if (error.name === 'AbortError') {
        console.log(`请求已取消: chunk ${chunkStart}`)
        throw error
      }
      console.error('Failed to fetch data:', error)
      throw error
    }
  }, [chunkSize])

  // 实际加载数据的函数
  const loadChunksImmediate = useCallback(async (startIndex: number, endIndex: number) => {
    const startChunk = Math.floor(startIndex / chunkSize) * chunkSize
    const endChunk = Math.ceil(endIndex / chunkSize) * chunkSize
    
    const chunksToLoad: number[] = []
    const currentLoadingChunks = new Set(loadingChunks)
    
    // 取消所有完全不在当前可视范围内的请求
    // 关键修复：只有当数据块完全不在范围内时才取消
    abortControllersRef.current.forEach((controller, key) => {
      const chunkStart = parseInt(key)
      const chunkEnd = chunkStart + chunkSize
      
      // 判断数据块是否与当前可视范围有交集
      // 如果 chunkEnd <= startIndex 或 chunkStart >= endIndex，说明完全不在范围内
      const isOutOfRange = chunkEnd <= startIndex || chunkStart >= endIndex
      
      if (isOutOfRange) {
        console.log(`✂️ 取消无用请求: chunk ${key} (范围: ${chunkStart}-${chunkEnd}, 可视: ${startIndex}-${endIndex})`)
        controller.abort()
        abortControllersRef.current.delete(key)
        currentLoadingChunks.delete(key)
      } else {
        console.log(`✓ 保留请求: chunk ${key} (与可视范围有交集)`)
      }
    })
    
    // 找出需要加载的数据块
    for (let chunkStart = startChunk; chunkStart < endChunk; chunkStart += chunkSize) {
      const chunkKey = getChunkKey(chunkStart)
      
      if (!loadedChunks.has(chunkKey) && !currentLoadingChunks.has(chunkKey)) {
        chunksToLoad.push(chunkStart)
        currentLoadingChunks.add(chunkKey)
      }
    }
    
    if (chunksToLoad.length === 0) return
    
    setLoadingChunks(currentLoadingChunks)
    
    // 并行加载所有需要的数据块
    const loadPromises = chunksToLoad.map(async (chunkStart) => {
      const chunkKey = getChunkKey(chunkStart)
      
      // 创建新的 AbortController
      const controller = new AbortController()
      abortControllersRef.current.set(chunkKey, controller)
      
      try {
        const data = await fetchChunkData(chunkStart, controller.signal)
        
        const newChunk: DataChunk = {
          startIndex: chunkStart,
          endIndex: chunkStart + chunkSize,
          data,
          isLoading: false,
          timestamp: Date.now()
        }
        
        setLoadedChunks(prev => new Map(prev).set(chunkKey, newChunk))
      } catch (error: any) {
        // 忽略被取消的请求错误
        if (error.name === 'AbortError') {
          return
        }
        
        console.error(`Failed to load chunk ${chunkStart}:`, error)
        const errorChunk: DataChunk = {
          startIndex: chunkStart,
          endIndex: chunkStart + chunkSize,
          data: [],
          isLoading: false,
          error: '加载失败',
          timestamp: Date.now()
        }
        setLoadedChunks(prev => new Map(prev).set(chunkKey, errorChunk))
      } finally {
        // 清理 AbortController
        abortControllersRef.current.delete(chunkKey)
        
        setLoadingChunks(prev => {
          const newSet = new Set(prev)
          newSet.delete(chunkKey)
          return newSet
        })
      }
    })
    
    await Promise.all(loadPromises)
  }, [loadedChunks, loadingChunks, chunkSize, fetchChunkData, getChunkKey])

  // 使用 lodash 的 debounce 包装加载函数
  const loadChunks = useMemo(
    () => debounce(loadChunksImmediate, 150, {
      leading: false,  // 不在开始时立即执行
      trailing: true,  // 在结束时执行
      maxWait: 300     // 最多等待300ms，防止一直滚动导致永远不加载
    }),
    [loadChunksImmediate]
  )

  // 获取指定索引的数据
  const getItem = useCallback((index: number): ListItem | null => {
    const chunkKey = getChunkKey(index)
    const chunk = loadedChunks.get(chunkKey)
    
    if (!chunk) return null
    
    const localIndex = index - chunk.startIndex
    return chunk.data[localIndex] || null
  }, [loadedChunks, getChunkKey])

  // 检查数据是否已加载
  const isItemLoaded = useCallback((index: number): boolean => {
    const chunkKey = getChunkKey(index)
    return loadedChunks.has(chunkKey)
  }, [loadedChunks, getChunkKey])

  return {
    loadedChunks,
    loadingChunks,
    loadChunks,
    getItem,
    isItemLoaded,
    chunkSize
  }
}

