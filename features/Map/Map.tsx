'use client'

import 'leaflet/dist/leaflet.css'
import 'leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css'
import 'leaflet-defaulticon-compatibility'
import { MapContainer, Polygon, TileLayer } from 'react-leaflet'
import { useDraftPlot, usePhase } from '@/store/draftPlot/draftPlotStore'
import { Point } from '@/store/draftPlot/common'
import MapURLEvents from '@/features/Map/MapURLEvents'
import { Mutable } from '@/utils/utilityTypes'

export type LeafPoint = [number, number]

const isCorrectCoord = (coord: Point['lng']) => !(coord === '' || coord === '-')

export const formatPlot = (plot: readonly Point[]) =>
  plot
    .filter(({ lng, lat }) => isCorrectCoord(lng) || isCorrectCoord(lat))
    .map(({ lat, lng }) => [+lat || 0, +lng || 0] as LeafPoint)

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
              console.log('Polygon with id: ', id, ' clicked', target)
            },
          }}
        />
        <MapURLEvents />
      </MapContainer>
    </div>
  )
}

export default Map
