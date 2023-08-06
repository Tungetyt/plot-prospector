import create from 'zustand'
import { storeActionsSelector } from '@/app/utils/zustand'

interface Point {
  id: string
  point: Readonly<[number | string, number | string]>
}

interface IStore {
  plot: ReadonlyArray<Point>
  actions: {
    changePoint: (updatedPoint: Point) => void
    confirmPlot: () => void
  }
}

const initialCoord = ''
const initialPoint = [initialCoord, initialCoord] as const

const initialState: Readonly<Omit<IStore, 'actions'>> = {
  plot: [
    {
      id: crypto.randomUUID(),
      point: initialPoint,
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
  const result = +input
  if (Number.isNaN(result) || input === '' || input.toString().at(-1) === '.')
    return input
  return result
}

const removeTrailingPoints = (updatedPlot: Point[]) => {
  const idsToRemove: string[] = []
  for (let i = updatedPlot.length - 1; i >= 0; i--) {
    const currentPoint = updatedPlot[i]

    if (currentPoint?.point.every((coord) => coord === '')) {
      idsToRemove.push(currentPoint.id)
      continue
    }

    idsToRemove.pop()
    break
  }

  updatedPlot.splice(
    updatedPlot.length - idsToRemove.length,
    idsToRemove.length,
  )

  return Boolean(idsToRemove.length)
}

const updatePoints = (
  plot: ReadonlyArray<Point>,
  updatedPoint: Point,
): Point[] => {
  return plot.map((point) =>
    point.id === updatedPoint.id
      ? {
          ...updatedPoint,
          point: [
            tryConvertToNum(updatedPoint.point[0]),
            tryConvertToNum(updatedPoint.point[1]),
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

  if (lastPoint.point.some((coord) => typeof coord !== 'number')) return plot

  return [
    ...plot,
    {
      id: crypto.randomUUID(),
      point: initialPoint,
    },
  ]
}

const isValidPoint = (updatedPoint: Point) => {
  const isValidLatitude = isValidCoordinate(updatedPoint.point[0], 'latitude')
  const isValidLongitude = isValidCoordinate(updatedPoint.point[1], 'longitude')
  return isValidLatitude && isValidLongitude
}

const useDraftPlotStore = create<IStore>((set) => ({
  ...initialState,
  actions: {
    changePoint: (updatedPoint: Point) => {
      set((state) => {
        if (!isValidPoint(updatedPoint)) return state

        const updatedPlot = updatePoints(state.plot, updatedPoint)

        if (removeTrailingPoints(updatedPlot)) return { plot: updatedPlot }

        return { plot: plotWithMaybeNewPoint(updatedPlot) }
      })
    },
    confirmPlot: () => set(() => initialState),
  },
}))

const draftPlotSelector = ({ plot }: IStore) => plot
export const useDraftPlot = () => useDraftPlotStore(draftPlotSelector)
export const useDraftPlotActions = () => useDraftPlotStore(storeActionsSelector)
