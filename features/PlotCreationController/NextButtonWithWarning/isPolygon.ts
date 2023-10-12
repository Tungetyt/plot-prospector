import { Point } from '@/store/draftPlot/common'
import { isNumeric } from '@/utils/common'
import invariant from 'tiny-invariant'

const isCollinear = (p1: Point, p2: Point, p3: Point): boolean => {
  if (
    isNumeric(p1.lat) &&
    isNumeric(p1.lng) &&
    isNumeric(p2.lat) &&
    isNumeric(p2.lng) &&
    isNumeric(p3.lat) &&
    isNumeric(p3.lng)
  ) {
    const area =
      p1.lat * (p2.lng - p3.lng) +
      p2.lat * (p3.lng - p1.lng) +
      p3.lat * (p1.lng - p2.lng)
    return area === 0
  }

  return false
}
const isEmptyPoint = ({ lat, lng }: Point): boolean => !lat && !lng
const isPolygon = (draftPlot: ReadonlyArray<Point>): boolean => {
  if (draftPlot.length < 3) return false // Can't form a polygon with less than 3 points

  const lastPoint = draftPlot[draftPlot.length - 1]
  invariant(lastPoint, 'Expected last point to be defined')

  const plot = isEmptyPoint(lastPoint) ? draftPlot.slice(0, -1) : draftPlot

  const hasInvalidPoint = plot.some(
    (point) => !isNumeric(point.lat) || !isNumeric(point.lng),
  )
  if (hasInvalidPoint) return false

  const collinearFound = plot.slice(0, -2).some((_, i) => {
    const p1 = plot[i]
    const p2 = plot[i + 1]
    const p3 = plot[i + 2]
    invariant(p1, 'Expected p1 to be defined')
    invariant(p2, 'Expected p2 to be defined')
    invariant(p3, 'Expected p3 to be defined')

    return isCollinear(p1, p2, p3)
  })

  return !collinearFound
}

export default isPolygon
