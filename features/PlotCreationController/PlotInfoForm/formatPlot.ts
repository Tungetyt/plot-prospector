import { Point } from '@/store/draftPlot/common'

export type LeafPoint = [number, number]

const isCorrectCoord = (coord: Point['lng']) => coord !== '' && coord !== '-'
const formatPlot = (plot: ReadonlyArray<Point>) =>
  plot
    .filter(({ lng, lat }) => isCorrectCoord(lng) && isCorrectCoord(lat))
    .map(({ lat, lng }) => [+lat || 0, +lng || 0] as LeafPoint)

export default formatPlot
