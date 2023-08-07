export interface Point {
  id: string
  coords: Readonly<[number | '', number | '']>
}

export interface PointFromTextInput {
  id: Point['id']
  coords: Readonly<[number | string, number | string]>
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
const initialCoords = [initialCoord, initialCoord] as const

export const initialState: State = {
  plot: [
    {
      id: crypto.randomUUID(),
      coords: initialCoords,
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

const tryConvertToNum = (input: string | number) => {
  const result = input.toString().at(-1) === '.' ? +`${input}0` : +input
  if (Number.isNaN(result) || input === '') return input
  return result
}

const removeEmptyPoints = (updatedPlot: Point[]) => {
  const idsToRemove: string[] = []
  for (let i = updatedPlot.length - 1; i >= 0; i--) {
    const currentPoint = updatedPlot[i]

    if (!currentPoint) throw new Error('Expected currentPoint to be present')

    if (!currentPoint.coords.every((c) => c === '')) {
      if (currentPoint.coords.every((c) => c)) idsToRemove.pop()

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
): Point[] => {
  return plot.map((point) =>
    point.id === updatedPoint.id
      ? {
          ...updatedPoint,
          coords: [
            tryConvertToNum(updatedPoint.coords[0]),
            tryConvertToNum(updatedPoint.coords[1]),
          ] as [number, number],
        }
      : point,
  )
}

const plotWithMaybeNewPoint = (plot: Point[]): Point[] => {
  const lastPoint = plot.at(-1)
  if (!lastPoint) {
    console.error('Expected last point to be found.') //TODO: Send log to server
    return plot
  }

  if (lastPoint.coords.some((c) => typeof c !== 'number')) return plot

  return [
    ...plot,
    {
      id: crypto.randomUUID(),
      coords: initialCoords,
    },
  ]
}

const isValidPoint = (updatedPoint: PointFromTextInput) => {
  const isValidLatitude = isValidCoordinate(updatedPoint.coords[0], 'latitude')
  const isValidLongitude = isValidCoordinate(
    updatedPoint.coords[1],
    'longitude',
  )
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
