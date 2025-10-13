// types.ts
export interface ListItem {
  id: string
  content: string
  title: string
  timestamp: number
}

export interface DataChunk {
  startIndex: number
  endIndex: number
  data: ListItem[]
  isLoading: boolean
  error?: string
  timestamp: number
}

export interface VirtualListProps {
  totalCount: number
  chunkSize?: number
  bufferSize?: number
  estimateSize?: number
}

