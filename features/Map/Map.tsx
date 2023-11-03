'use client'

import dynamic from 'next/dynamic'
import { useDraftPlot, usePhase } from '@/store/draftPlot/draftPlotStore'
import MapURLEvents from '@/features/Map/MapURLEvents/MapURLEvents'
import formatPlot from '@/features/PlotCreationController/PlotInfoForm/formatPlot'
import type { WritableDeep } from 'type-fest'
import MapNewPlotEvents from '@/features/Map/MapNewPlotEvents'

export const MapContainer = dynamic(
  async () => (await import('react-leaflet')).MapContainer,
  {
    ssr: false
  }
)
export const Polygon = dynamic(
  async () => (await import('react-leaflet')).Polygon,
  {
    ssr: false
  }
)
export const TileLayer = dynamic(
  async () => (await import('react-leaflet')).TileLayer,
  {
    ssr: false
  }
)

const PWJozefoslawObservatoryCoordinates: Readonly<[number, number]> = [
  52.0979030011665, 21.03239659105818
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
          PWJozefoslawObservatoryCoordinates as WritableDeep<
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
            }
          }}
        />
        <MapNewPlotEvents newPlot={newPlot} />
        <MapURLEvents />
      </MapContainer>
    </div>
  )
}

export default Map
