export interface GeoDatasetItem {
  persistentId: string
  name: string
  url: string
  authors: string
  publicationDate: string
  pinLat: number
  pinLon: number
  bboxes: [[number, number], [number, number]][]
}

export interface CollectionMapData {
  items: GeoDatasetItem[]
  totalCount: number
  isLoading: boolean
  error: string | null
  hasMore: boolean
  loadMore: () => void
}
