type Coord = number | '' | `${number}.`

export interface Point {
  id: string
  x: Coord
  y: Coord
}

export type PointFromTextInput = Pick<Point, 'id'> & {
  x: number | string
  y: number | string
}

export interface Store {
  plot: ReadonlyArray<Point>
  actions: {
    changePoint: (updatedPoint: PointFromTextInput) => void
    confirmPlot: () => void
  }
}

type State = Readonly<Omit<Store, 'actions'>>

const initialCoord = ''

export const initialState: State = {
  plot: [
    {
      id: crypto.randomUUID(),
      x: initialCoord,
      y: initialCoord,
    },
  ],
} as const

const isValidCoordinate = (
  value: string | number,
  type: 'latitude' | 'longitude',
): boolean => {
  const stringValue = typeof value === 'number' ? value.toString() : value

  // Special check for standalone minus sign
  if (stringValue === '-') return true

  // Check for any characters other than numbers, dot, and minus sign
  if (/[^0-9.-]/.test(stringValue)) return false

  // Check for multiple dots or minus signs
  if ((stringValue.match(/\./g) || []).length > 1) return false
  if ((stringValue.match(/-/g) || []).length > 1) return false

  // Ensure minus is at the start if it exists
  if (stringValue.includes('-') && stringValue.indexOf('-') !== 0) return false

  // Ensure no leading zeros unless the value is '0' or a fraction < 1 (e.g., '0.123')
  if (/^0[0-9]+/.test(stringValue)) return false

  // Precision Control: Ensure no more than 6 decimal places
  if ((stringValue.split('.')[1] || '').length > 6) return false

  // Convert back to number for range checks
  const numValue = Number(stringValue)

  // Ensure it's a valid number
  if (isNaN(numValue)) return false

  // Special checks for exact 90 or 180
  if (numValue === 90 && type === 'latitude' && stringValue.endsWith('.'))
    return false
  if (numValue === 180 && type === 'longitude' && stringValue.endsWith('.'))
    return false

  // Range Restrictions
  if (type === 'longitude' && (numValue < -180 || numValue > 180)) return false
  if (type === 'latitude' && (numValue < -90 || numValue > 90)) return false

  return true
}

const endsWithDecimal = (input: string | number): input is `${number}.` =>
  input.toString().at(-1) === '.'

const tryConvertToNum = (input: string | number) => {
  if (endsWithDecimal(input)) return input
  if (Number.isNaN(+input) || input === '') return ''
  return +input
}

const removeEmptyPoints = (updatedPlot: Point[]) => {
  const idsToRemove: string[] = []
  for (let i = updatedPlot.length - 1; i >= 0; i--) {
    const currentPoint = updatedPlot[i]

    if (!currentPoint) throw new Error('Expected currentPoint to be present')

    const isOneCoordPresent = currentPoint.x !== '' || currentPoint.y !== ''
    const areBothCoordsPresent = currentPoint.x !== '' && currentPoint.y !== ''
    const isFirstRow = i === 0

    if (isOneCoordPresent || isFirstRow) {
      if (areBothCoordsPresent) idsToRemove.pop()

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
          x: tryConvertToNum(updatedPoint.x),
          y: tryConvertToNum(updatedPoint.y),
        }
      : point,
  )

const plotWithMaybeNewPoint = (plot: Point[]): Point[] => {
  const lastPoint = plot.at(-1)
  if (!lastPoint) {
    console.error('Expected last point to be found.') //TODO: Send log to server
    return plot
  }

  if (typeof lastPoint.x !== 'number' || typeof lastPoint.y !== 'number')
    return plot

  return [
    ...plot,
    {
      id: crypto.randomUUID(),
      x: initialCoord,
      y: initialCoord,
    },
  ]
}

const isValidPoint = ({ x, y }: PointFromTextInput) => {
  const isValidLatitude = isValidCoordinate(x, 'latitude')
  const isValidLongitude = isValidCoordinate(y, 'longitude')
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
