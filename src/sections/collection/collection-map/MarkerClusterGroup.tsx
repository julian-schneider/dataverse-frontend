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
      const marker = L.marker([item.pinLat, item.pinLon])
      const datasetUrl = `${baseUrl}/dataset.xhtml?persistentId=${item.persistentId}`

      let rects: L.Rectangle[] = []
      let inCluster = true

      marker.on('click', () => {
        if (inCluster) {
          // while a pin's popup is open, clustering logic shouldn't mess with it
          cluster.removeLayer(marker)
          map.addLayer(marker)
          inCluster = false

          rects = item.bboxes.map((bounds) =>
            L.rectangle(bounds, { color: '#0d6efd', weight: 0.5, fillOpacity: 0.1 })
          )
          rects.forEach((r) => map.addLayer(r))
          const combined = L.featureGroup(rects).getBounds()
          if (!map.getBounds().contains(combined)) {
            map.fitBounds(combined, { padding: [20, 20] })
          }
        }
      })

      marker.bindPopup(
        `<a href="${datasetUrl}">${item.name}</a><br>` +
          `${item.authors}; ${item.publicationDate}<br>` +
          `${item.persistentId}`
      )

      marker.on('popupclose', () => {
        rects.forEach((r) => map.removeLayer(r))
        rects = []
        if (!inCluster) {
          inCluster = true
          map.removeLayer(marker)
          cluster.addLayer(marker)
        }
      })

      return marker
    })

    cluster.addLayers(markerList)
    map.addLayer(cluster)

    if (markerList.length > 0) {
      map.fitBounds(cluster.getBounds())
    }

    return () => {
      for (const m of markerList) {
        if (map.hasLayer(m)) map.removeLayer(m)
      }
      map.removeLayer(cluster)
    }
  }, [map, items])

  return null
}
