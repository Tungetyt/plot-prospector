import type {WritableDeep} from 'type-fest'
import L from 'leaflet' // Make sure to import L if it's not already in scope
import {useEffect, useRef} from 'react'
import {useMap} from 'react-leaflet'
import {LeafPoint} from '@/features/PlotCreationController/Property/formatPlot/formatPlot'

function MapNewPlotEvents({newPlot}: {newPlot: ReadonlyArray<LeafPoint>}) {
  const map = useMap()
  const userHasInteracted = useRef(false)

  // Listen to map events to set interaction flag
  useEffect(() => {
    const onMove = () => {
      userHasInteracted.current = true
    }

    map.on('move', onMove)
    map.on('zoom', onMove)

    return () => {
      map.off('move', onMove)
      map.off('zoom', onMove)
    }
  }, [map])

  useEffect(() => {
    if (newPlot.length > 0 && !userHasInteracted.current) {
      const bounds = L.latLngBounds(newPlot as WritableDeep<typeof newPlot>)
      map.fitBounds(bounds, {padding: [50, 50]}) // Adjust padding as needed
    }
  }, [newPlot, map])

  // Reset the interaction flag whenever newPlot changes
  useEffect(() => {
    userHasInteracted.current = false
  }, [newPlot])

  return null
}

export default MapNewPlotEvents
