'use client'

import 'leaflet/dist/leaflet.css'
import 'leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css'
import 'leaflet-defaulticon-compatibility'
import { MapContainer, Polygon, TileLayer, useMap } from 'react-leaflet'
import { useEffect, useRef } from 'react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useDraftPlot, usePhase } from '@/app/store/draftPlot/draftPlotStore'
import isNumeric from '@/app/utils/common'
import { Point } from '@/app/store/draftPlot/common'

export type LeafPoint = [number, number]

const purpleOptions = { color: 'blue' }

export const formatPlot = (plot: readonly Point[]) =>
  plot
    .filter(({ lat, lng }) => isNumeric(lat) && isNumeric(lng))
    .map(({ lat, lng }) => [lat, lng] as LeafPoint)

function Map() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const phase = usePhase()
  const draftPlot = useDraftPlot()
  const pathname = usePathname()
  const newPlot = formatPlot(draftPlot)
  const mapInitialized = useRef(false)

  function MapEvents() {
    const map = useMap()

    useEffect(() => {
      // If the map has already been initialized with the URL parameters, don't do it again
      if (mapInitialized.current) {
        return
      }

      const lat = searchParams.get('lat')
      const lng = searchParams.get('lng')
      const zoom = searchParams.get('zoom')

      if (lat && lng && zoom) {
        map.setView(
          [parseFloat(lat as string), parseFloat(lng as string)],
          parseInt(zoom as string, 10),
        )

        // Indicate that the map has been initialized
        mapInitialized.current = true
      }
    }, [map])

    useEffect(() => {
      const updateUrl = () => {
        const center = map.getCenter()
        const zoom = map.getZoom()
        const query = new URLSearchParams({
          ...Object.fromEntries(searchParams.entries()),
          lat: String(center.lat),
          lng: String(center.lng),
          zoom: String(zoom),
        }).toString()
        const newRoute = `${pathname}?${query}`
        router.push(newRoute)
      }

      map.on('moveend', updateUrl)
      return () => {
        map.off('moveend', updateUrl)
      }
    }, [map])

    return null
  }

  return (
    <div
      className={`flex-1 flex relative ${
        phase === 'PLOT_CREATION' ? 'highlight' : ''
      }`}
    >
      <MapContainer
        center={[52.0979030011665, 21.03239659105818]}
        zoom={13}
        className="flex-1"
        attributionControl={false}
        zoomControl={false}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <Polygon
          pathOptions={purpleOptions}
          positions={newPlot}
          eventHandlers={{
            add: ({ target }) => {
              target._path.setAttribute('data-id', crypto.randomUUID())
            },
            click: ({ target }) => {
              const id = target._path.getAttribute('data-id')
              console.log('Polygon with id: ', id, ' clicked')
            },
          }}
        />
        <MapEvents />
      </MapContainer>
    </div>
  )
}

export default Map
