import { LeafPoint } from '@/features/Map/Map'
import proj4 from 'proj4'

const polygonArea = (coords: ReadonlyArray<LeafPoint>): number => {
  const WGS84 = 'EPSG:4326'
  const Mercator = 'EPSG:3857'

  // Project coordinates to Mercator
  const projectedCoords = coords.map((coord) => proj4(WGS84, Mercator, coord))

  let area = 0
  const numPoints = projectedCoords.length

  for (let i = 0; i < numPoints; ++i) {
    const [x1, y1] = projectedCoords[i] as LeafPoint
    const [x2, y2] = projectedCoords[(i + 1) % numPoints] as LeafPoint // Wrap around for the last point

    area += x1 * y2 - x2 * y1
  }

  // Divide by 2 and return the absolute value
  return +Math.abs(area / 2).toFixed(0)
}

export default polygonArea
