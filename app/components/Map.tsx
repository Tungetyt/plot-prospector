'use client'

import 'leaflet/dist/leaflet.css'
import 'leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css'
import 'leaflet-defaulticon-compatibility'
import { MapContainer, Polygon, TileLayer } from 'react-leaflet'
import { useDraftPlot, usePhase } from '@/app/store/draftPlot/draftPlotStore'
import isNumeric from '@/app/utils/common'
import { Point } from '@/app/store/draftPlot/common'

export type LeafPoint = [number, number]

const center: LeafPoint = [51.505, -0.09]
// [52.0979030011665, 21.03239659105818]

const purpleOptions = { color: 'blue' }

export const formatPlot = (plot: readonly Point[]) =>
  plot
    .filter(({ lat, lng }) => isNumeric(lat) && isNumeric(lng))
    .map(({ lat, lng }) => [lat, lng] as LeafPoint)

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
        center={center}
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
              // Directly manipulate the DOM to set a custom data attribute
              target._path.setAttribute('data-id', crypto.randomUUID())
            },
            click: ({ target }) => {
              // Access the custom data attribute from the SVG element
              const id = target._path.getAttribute('data-id')
              console.log('Polygon with id: ', id, ' clicked')
            },
          }}
        />
      </MapContainer>
    </div>
  )
}

export default Map
