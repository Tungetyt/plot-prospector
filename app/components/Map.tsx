'use client'

import 'leaflet/dist/leaflet.css'
import 'leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css'
import 'leaflet-defaulticon-compatibility'
import { MapContainer, Polygon, TileLayer, useMap } from 'react-leaflet'
import { useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { useDraftPlot, usePhase } from '@/app/store/draftPlot/draftPlotStore'
import isNumeric from '@/app/utils/common'
import { Point } from '@/app/store/draftPlot/common'

export type LeafPoint = [number, number]

const purpleOptions = { color: 'blue' }

export const formatPlot = (plot: readonly Point[]) =>
  plot
    .filter(({ lat, lng }) => isNumeric(lat) && isNumeric(lng))
    .map(({ lat, lng }) => [lat, lng] as LeafPoint)

function useMapInitialization(
  map: ReturnType<typeof useMap>,
  searchParams: URLSearchParams,
) {
  const mapInitialized = useRef(false)

  useEffect(() => {
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
      mapInitialized.current = true
    }
  }, [searchParams, map])
}

const searchParams = () => new URLSearchParams(window.location.search)

function MapEvents() {
  const map = useMap()
  const router = useRouter()

  useMapInitialization(map, searchParams())

  useEffect(() => {
    const updateUrl = () => {
      const center = map.getCenter()
      const zoom = map.getZoom()

      const queryString = new URLSearchParams({
        ...Array.from(searchParams().entries()).reduce(
          (obj, [key, val]) => ({ ...obj, [key]: val }),
          {},
        ),
        lat: center.lat.toString(),
        lng: center.lng.toString(),
        zoom: zoom.toString(),
      }).toString()

      const newPath = `${window.location.pathname}?${queryString}`

      router.push(newPath)
    }

    map.on('moveend', updateUrl)

    return () => {
      map.off('moveend', updateUrl)
    }
  }, [map, router])

  return null
}

function Map() {
  const phase = usePhase()
  const draftPlot = useDraftPlot()
  const newPlot = formatPlot(draftPlot)

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
