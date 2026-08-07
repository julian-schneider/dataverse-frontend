import 'leaflet.markercluster/dist/MarkerCluster.css'
import 'leaflet.markercluster/dist/MarkerCluster.Default.css'
import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { MapContainer, TileLayer, useMap } from 'react-leaflet'
import { FilterQuery } from '@/collection/domain/models/CollectionSearchCriteria'
import { useCollectionMapData } from './useCollectionMapData'
import { MarkerClusterGroup } from './MarkerClusterGroup'
import styles from './CollectionMap.module.scss'
import { Button } from '@iqss/dataverse-design-system'
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton'

function MapSizeInvalidator({ isVisible }: { isVisible: boolean }) {
  // causes a tile grid update after the map is reopened, in case it was stale due to a window size change
  const map = useMap()
  useEffect(() => {
    if (isVisible) {
      setTimeout(() => map.invalidateSize(), 0)
    }
  }, [isVisible, map])
  return null
}

interface CollectionMapProps {
  collectionId: string
  searchText?: string
  filterQueries?: FilterQuery[]
  isVisible: boolean
}

export function CollectionMap({
  collectionId,
  searchText,
  filterQueries,
  isVisible
}: CollectionMapProps) {
  const { t } = useTranslation('shared')
  const { items, totalCount, isLoading, error, hasMore, loadMore } = useCollectionMapData(
    collectionId,
    searchText,
    filterQueries
  )

  return (
    <div className={styles['map-wrapper']}>
      <div className={styles['map-status']}>
        {isLoading ? (
          <SkeletonTheme>
            <Skeleton height={19} width={190} />
          </SkeletonTheme>
        ) : (
          <span className={styles['results']}>
            {t('pagination.accumulated.moreThanPageSize', {
              accumulated: items.length,
              formattedCount: new Intl.NumberFormat().format(totalCount),
              item: 'result'
            })}
          </span>
        )}
        {hasMore && (
          <Button variant="link" type="button" size="sm" onClick={loadMore} disabled={isLoading}>
            More...
          </Button>
        )}
      </div>

      {error && <div className={styles.error}>Error: {error}</div>}

      <MapContainer
        center={[51.1, 10.382]}
        zoom={3}
        scrollWheelZoom={false}
        className={styles['map-container']}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          maxZoom={19}
        />
        <MarkerClusterGroup items={items} />
        <MapSizeInvalidator isVisible={isVisible} />
      </MapContainer>
    </div>
  )
}
