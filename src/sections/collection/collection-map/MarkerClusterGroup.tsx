import { useEffect } from 'react'
import { useMap } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet.markercluster'
import { GeoDatasetItem } from './useCollectionMapData'

interface Props {
  items: GeoDatasetItem[]
}

export function MarkerClusterGroup({ items }: Props) {
  const map = useMap()

  useEffect(() => {
    const cluster = L.markerClusterGroup()
    const baseUrl = window.location.origin

    const markerList = items.map((item) => {
      const marker = L.marker([item.lat, item.lon])
      const datasetUrl = `${baseUrl}/dataset.xhtml?persistentId=${item.persistentId}`
      marker.bindPopup(
        `<a href="${datasetUrl}">${item.name}</a><br>` +
          `${item.authors}; ${item.publicationDate}<br>` +
          `${item.persistentId}`
      )
      return marker
    })

    cluster.addLayers(markerList)
    map.addLayer(cluster)

    if (markerList.length > 0) {
      map.fitBounds(cluster.getBounds())
    }

    return () => {
      map.removeLayer(cluster)
    }
  }, [map, items])

  return null
}
