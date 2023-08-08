import {
  initialCoord,
  Point,
  PointFromTextInput,
  State,
} from '@/app/store/draftPlot/common'
import { isValidCoordinate } from '@/app/store/draftPlot/isValidCoordinate'

const endsWithDecimal = (input: string | number): input is `${number}.` =>
  input.toString().at(-1) === '.'

const tryConvertToNum = (input: string | number) => {
  if (endsWithDecimal(input)) return input
  if (input === '-') return '-'
  if (input === '') return ''
  return +input
}

const removeEmptyPoints = (updatedPlot: Point[]) => {
  const idsToRemove: string[] = []
  for (let i = updatedPlot.length - 1; i >= 0; i--) {
    const currentPoint = updatedPlot[i]

    if (!currentPoint) throw new Error('Expected currentPoint to be present')

    const isLatNumeric = typeof currentPoint.lat === 'number'
    const isLngNumeric = typeof currentPoint.lng === 'number'
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

const updatePoints = (
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
    console.error('Expected last point to be found.') //TODO: Send log to server
    return plot
  }

  if (typeof lastPoint.lat !== 'number' || typeof lastPoint.lng !== 'number')
    return plot

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

export const changePointReducer = (updatedPoint: PointFromTextInput) => {
  return (state: State) => {
    if (!isValidPoint(updatedPoint)) return state

    const updatedPlot = updatePoints(state.plot, updatedPoint)

    if (removeEmptyPoints(updatedPlot)) return { plot: updatedPlot }

    return { plot: plotWithMaybeNewPoint(updatedPlot) }
  }
}
