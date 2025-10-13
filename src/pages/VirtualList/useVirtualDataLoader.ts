// useVirtualDataLoader.ts
import { useState, useCallback } from 'react'
import { ListItem, DataChunk } from './types'

export const useVirtualDataLoader = (totalCount: number, chunkSize = 40) => {
  const [loadedChunks, setLoadedChunks] = useState<Map<string, DataChunk>>(new Map())
  const [loadingChunks, setLoadingChunks] = useState<Set<string>>(new Set())
  
  // 生成数据块的key
  const getChunkKey = useCallback((startIndex: number) => {
    return `${Math.floor(startIndex / chunkSize) * chunkSize}`
  }, [chunkSize])

  // 真实API请求
  const fetchChunkData = useCallback(async (startIndex: number): Promise<ListItem[]> => {
    const chunkStart = Math.floor(startIndex / chunkSize) * chunkSize
    
    try {
      const response = await fetch(
        `http://localhost:3001/api/virtual-list/data?start=${chunkStart}&limit=${chunkSize}`
      )
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const result = await response.json()
      
      if (!result.success) {
        throw new Error('API returned error')
      }
      
      return result.data
    } catch (error) {
      console.error('Failed to fetch data:', error)
      throw error
    }
  }, [chunkSize])

  // 加载指定范围的数据块
  const loadChunks = useCallback(async (startIndex: number, endIndex: number) => {
    const startChunk = Math.floor(startIndex / chunkSize) * chunkSize
    const endChunk = Math.ceil(endIndex / chunkSize) * chunkSize
    
    const chunksToLoad: number[] = []
    const currentLoadingChunks = new Set(loadingChunks)
    
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
      try {
        const data = await fetchChunkData(chunkStart)
        const chunkKey = getChunkKey(chunkStart)
        
        const newChunk: DataChunk = {
          startIndex: chunkStart,
          endIndex: chunkStart + chunkSize,
          data,
          isLoading: false,
          timestamp: Date.now()
        }
        
        setLoadedChunks(prev => new Map(prev).set(chunkKey, newChunk))
      } catch (error) {
        console.error(`Failed to load chunk ${chunkStart}:`, error)
        const chunkKey = getChunkKey(chunkStart)
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
        setLoadingChunks(prev => {
          const newSet = new Set(prev)
          newSet.delete(getChunkKey(chunkStart))
          return newSet
        })
      }
    })
    
    await Promise.all(loadPromises)
  }, [loadedChunks, loadingChunks, chunkSize, fetchChunkData, getChunkKey])

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

