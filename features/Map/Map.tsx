'use client'

import 'leaflet/dist/leaflet.css'
import 'leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css'
import 'leaflet-defaulticon-compatibility'
import { MapContainer, Polygon, TileLayer } from 'react-leaflet'
import { useDraftPlot, usePhase } from '@/store/draftPlot/draftPlotStore'
import { Point } from '@/store/draftPlot/common'
import { Mutable } from '@/utils/types'
import MapEvents from '@/features/Map/MapEvents'
import { isNumeric } from '@/utils/common'

export type LeafPoint = [number, number]

export const formatPlot = (plot: readonly Point[]) =>
  plot
    .filter(({ lat, lng }) => isNumeric(lat) && isNumeric(lng))
    .map(({ lat, lng }) => [lat, lng] as LeafPoint)

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
