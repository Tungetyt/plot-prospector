import proj4 from 'proj4'
import {
  Lat,
  LeafPoint,
  Lng
} from '@/features/PlotCreationController/PlotInfoForm/formatPlot/formatPlot'
import {z} from 'zod'

type Proj4Point = [Lng, Lat] & {
  __brand: 'Proj4Point'
}

const MERCATOR_MAX_LATITUDE = 85.06

const polygonArea = (coords: ReadonlyArray<LeafPoint>): number => {
  const WGS84 = 'EPSG:4326'
  const Mercator = 'EPSG:3857'

  // Project coordinates to Mercator
  const projectedCoords = coords.map(coord => {
    const lng = coord[1]
    let lat = coord[0]
    z.number().min(-90).max(90).parse(lat)
    if (lat > MERCATOR_MAX_LATITUDE) lat = MERCATOR_MAX_LATITUDE
    if (lat < -MERCATOR_MAX_LATITUDE) lat = -MERCATOR_MAX_LATITUDE
    return proj4(WGS84, Mercator, [lng, lat] as Proj4Point)
  })

  const proj4PointSchema = z.array(
    z.tuple([z.number().finite(), z.number().finite()])
  )
  proj4PointSchema.parse(projectedCoords)

  let area = 0
  const numPoints = projectedCoords.length

  // Calculate area using the shoelace formula
  for (let i = 0; i < numPoints; ++i) {
    const [x1, y1] = projectedCoords[i] as Proj4Point
    const [x2, y2] = projectedCoords[(i + 1) % numPoints] as Proj4Point // Wrap around for the last point

    area += x1 * y2 - x2 * y1
  }

  // Divide by 2 and return the absolute value
  return +Math.abs(area / 2).toFixed(0)
}

export type Area = ReturnType<typeof polygonArea>

export default polygonArea
