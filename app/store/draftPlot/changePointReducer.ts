type Coord = number | '' | `${number}.` | '-'

export interface Point {
  id: string
  lat: Coord
  lng: Coord
}

export type PointFromTextInput = Pick<Point, 'id'> & {
  lat: number | string
  lng: number | string
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
      lat: initialCoord,
      lng: initialCoord,
    },
  ],
} as const

export const isValidCoordinate = (
  value: string | number,
  type: 'lat' | 'lng',
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
  if (numValue === 90 && type === 'lat' && stringValue.endsWith('.'))
    return false
  if (numValue === 180 && type === 'lng' && stringValue.endsWith('.'))
    return false

  // Range Restrictions
  if (type === 'lng' && (numValue < -180 || numValue > 180)) return false
  if (type === 'lat' && (numValue < -90 || numValue > 90)) return false

  return true
}

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
