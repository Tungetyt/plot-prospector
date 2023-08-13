import { formatPlot, LeafPoint } from '@/features/Map/Map'
import { Point } from '@/store/draftPlot/common'

describe('formatPlot', () => {
  it('should format numeric points correctly', () => {
    const input: Point[] = [
      { id: '1', lat: 10, lng: 20 },
      { id: '2', lat: -30, lng: 40.5 },
    ]

    const expected: LeafPoint[] = [
      [10, 20],
      [-30, 40.5],
    ]

    expect(formatPlot(input)).toEqual(expected)
  })

  it('should ignore points with non-numeric lat or lng', () => {
    const input: Point[] = [
      { id: '1', lat: 10, lng: '20.' },
      { id: '2', lat: '-30.', lng: 40.5 },
      { id: '3', lat: '', lng: 50 },
      { id: '4', lat: 60, lng: '-' },
      { id: '5', lat: 70.3, lng: 80.4 },
    ]

    const expected: LeafPoint[] = [[70.3, 80.4]]

    expect(formatPlot(input)).toEqual(expected)
  })

  it('should handle empty arrays', () => {
    const input: Point[] = []
    const expected: LeafPoint[] = []

    expect(formatPlot(input)).toEqual(expected)
  })

  it('should handle arrays with all non-numeric points', () => {
    const input: Point[] = [
      { id: '1', lat: '10.', lng: '20.' },
      { id: '2', lat: '-', lng: '-30.' },
      { id: '3', lat: '', lng: '' },
    ]
    const expected: LeafPoint[] = []

    expect(formatPlot(input)).toEqual(expected)
  })

  it('should not modify the original array', () => {
    const input: Point[] = [
      { id: '1', lat: 10, lng: 20 },
      { id: '2', lat: '30.', lng: 40 },
    ]

    const originalInput = [...input]
    formatPlot(input)
    expect(input).toEqual(originalInput)
  })
})
