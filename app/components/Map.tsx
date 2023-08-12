'use client'

import 'leaflet/dist/leaflet.css'
import 'leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css'
import 'leaflet-defaulticon-compatibility'
import { MapContainer, Polygon, TileLayer, useMap } from 'react-leaflet'
import { useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { MapOptions } from 'leaflet'
import { useDraftPlot, usePhase } from '@/app/store/draftPlot/draftPlotStore'
import isNumeric from '@/app/utils/common'
import { Point } from '@/app/store/draftPlot/common'
import { Mutable } from '@/app/utils/types'

export type LeafPoint = [number, number]

export const formatPlot = (plot: readonly Point[]) =>
  plot
    .filter(({ lat, lng }) => isNumeric(lat) && isNumeric(lng))
    .map(({ lat, lng }) => [lat, lng] as LeafPoint)

type Lng = keyof Pick<Point, 'lng'>
type Lat = keyof Pick<Point, 'lat'>
type Zoom = keyof Pick<MapOptions, 'zoom'>

const urlParams = {
  lat: 'lat',
  lng: 'lng',
  zoom: 'zoom',
} as const satisfies Readonly<
  Record<Lng, Lng> & Record<Lat, Lat> & Record<Zoom, Zoom>
>

const useMapInitialization = (
  map: ReturnType<typeof useMap>,
  searchParams: URLSearchParams,
) => {
  const mapInitialized = useRef(false)

  useEffect(() => {
    if (mapInitialized.current) return

    mapInitialized.current = true

    const lat = searchParams.get(urlParams.lat)
    const lng = searchParams.get(urlParams.lng)
    const zoom = searchParams.get(urlParams.zoom)

    if (!lat || !lng || !zoom) return

    map.setView(
      [parseFloat(lat as string), parseFloat(lng as string)],
      parseInt(zoom as string, 10),
    )
  }, [searchParams, map])
}

const searchParams = () => new URLSearchParams(window.location.search)

function MapEvents() {
  const map = useMap()
  const router = useRouter()

  useMapInitialization(map, searchParams())

  useEffect(() => {
    const updateUrl = () => {
      const { lng, lat } = map.getCenter()
      const zoom = map.getZoom()

      const queryString = new URLSearchParams({
        ...Array.from(searchParams().entries()).reduce(
          (obj, [key, val]) => ({ ...obj, [key]: val }),
          {},
        ),
        [urlParams.lat]: lat.toString(),
        [urlParams.lng]: lng.toString(),
        [urlParams.zoom]: zoom.toString(),
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

const PWJozefoslawObservatoryCoordinates: Readonly<[number, number]> = [
  52.0979030011665, 21.03239659105818,
] as const

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
        center={
          PWJozefoslawObservatoryCoordinates as Mutable<
            typeof PWJozefoslawObservatoryCoordinates
          >
        }
        zoom={13}
        className="flex-1"
        attributionControl={false}
        zoomControl={false}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <Polygon
          pathOptions={{ color: 'blue' }}
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
