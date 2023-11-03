import { Point } from '@/store/draftPlot/common'

export type Lat = number
export type Lng = number
export type LeafPoint = [Lat, Lng]

const isCorrectCoord = (coord: Point['lng']) => coord !== '' && coord !== '-'

const formatPlot = (plot: ReadonlyArray<Point>) =>
  plot
    .filter(({ lat, lng }) => isCorrectCoord(lat) && isCorrectCoord(lng))
    .map(({ lat, lng }) => [+lat || 0, +lng || 0] as LeafPoint)

export default formatPlot
