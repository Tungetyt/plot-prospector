import {
  initialCoord,
  NumberWithTrailingDecimal,
  Point,
  PointFromTextInput,
  State,
} from '@/store/draftPlot/common'
import isValidCoordinate from '@/store/draftPlot/isValidCoordinate'
import { isNumeric } from '@/utils/common'
import invariant from 'tiny-invariant'

const endsWithDecimal = (
  input: PointFromTextInput['lng'],
): input is NumberWithTrailingDecimal => input.toString().at(-1) === '.'

const hasTrailingZero = (input: string): input is `${number}.${number}0` => {
  if (!input.includes('.')) return false

  return input.endsWith('0')
}

const tryConvertToNum = (input: PointFromTextInput['lng']) => {
  if (endsWithDecimal(input)) return input
  if (!isNumeric(input) && hasTrailingZero(input)) return input
  if (input === '-') return '-'
  if (input === '') return ''
  return +input
}

const removeEmptyPoints = (updatedPlot: Point[]) => {
  const idsToRemove: string[] = []
  for (let i = updatedPlot.length - 1; i >= 0; i--) {
    const currentPoint = updatedPlot[i]
    invariant(currentPoint, 'Expected currentPoint to be defined')

    const isLatNumeric = isNumeric(currentPoint.lat)
    const isLngNumeric = isNumeric(currentPoint.lng)
    const isFirstRow = i === 0

    if (isLatNumeric || isLngNumeric || isFirstRow) {
      if (isLatNumeric && isLngNumeric) idsToRemove.pop()

      break
    }

    idsToRemove.push(currentPoint.id)
  }

  updatedPlot.splice(
    updatedPlot.length - idsToRemove.length,
    idsToRemove.length,
  )

  return Boolean(idsToRemove.length)
}

const updatePlot = (
  plot: ReadonlyArray<Point>,
  updatedPoint: PointFromTextInput,
): Point[] =>
  plot.map((point) =>
    point.id === updatedPoint.id
      ? {
          ...updatedPoint,
          lat: tryConvertToNum(updatedPoint.lat),
          lng: tryConvertToNum(updatedPoint.lng),
        }
      : point,
  )

const plotWithMaybeNewPoint = (plot: Point[]): Point[] => {
  const lastPoint = plot.at(-1)

  if (!lastPoint) {
    console.error('Expected last point to be found.') // TODO: Send log to server
    return plot
  }

  if (!isNumeric(lastPoint.lat) || !isNumeric(lastPoint.lng)) return plot

  return [
    ...plot,
    {
      id: crypto.randomUUID(),
      lat: initialCoord,
      lng: initialCoord,
    },
  ]
}

const isValidPoint = ({ lat, lng }: PointFromTextInput) => {
  const isValidLatitude = isValidCoordinate(lat, 'lat')
  const isValidLongitude = isValidCoordinate(lng, 'lng')
  return isValidLatitude && isValidLongitude
}

const formatCoord = (coord: PointFromTextInput['lng']) => {
  const cleanedCoord = coord.toString().replace(/\s/g, '') // remove whitespace

  const parts = cleanedCoord.split('.')
  let decimal = parts[1]

  if (!decimal) return cleanedCoord

  if (decimal.length > 6) {
    // limit decimal to 6 places
    decimal = decimal.substring(0, 6)
    return `${parts[0]}.${decimal}`
  }

  return cleanedCoord
}

const formatPoint = (updatedPoint: PointFromTextInput): PointFromTextInput => ({
  ...updatedPoint,
  lat: formatCoord(updatedPoint.lat),
  lng: formatCoord(updatedPoint.lng),
})

const changePointReducer =
  (updatedPoint: PointFromTextInput) => (state: State) => {
    const formattedPoint = formatPoint(updatedPoint)

    if (!isValidPoint(formattedPoint)) return state

    const updatedPlot = updatePlot(state.plot, formattedPoint)

    if (removeEmptyPoints(updatedPlot)) return { plot: updatedPlot }

    return { plot: plotWithMaybeNewPoint(updatedPlot) }
  }

export default changePointReducer
