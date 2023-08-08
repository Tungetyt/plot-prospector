import { Point } from '@/app/store/draftPlot/common'
import { isPolygon } from '@/app/components/PlotCreationController'

describe('isPolygon', () => {
  it('bad if fewer than 3 points', () => {
    const points: Point[] = [{ id: '1', lat: 0, lng: 0 }]

    expect(isPolygon(points)).toBe(false)
  })

  it('bad if fewer than 3 points', () => {
    const points: Point[] = [
      { id: '1', lat: 0, lng: 0 },
      { id: '2', lat: 10, lng: 10 },
    ]

    expect(isPolygon(points)).toBe(false)
  })

  it('bad if collinear points', () => {
    const collinearPoints: Point[] = [
      { id: '1', lat: 0, lng: 0 },
      { id: '2', lat: 10, lng: 10 },
      { id: '3', lat: 20, lng: 20 },
    ]

    expect(isPolygon(collinearPoints)).toBe(false)
  })

  it('OK if valid triangle', () => {
    const triangle: Point[] = [
      { id: '1', lat: 0, lng: 0 },
      { id: '2', lat: 10, lng: 10 },
      { id: '3', lat: 0, lng: 20 },
    ]

    expect(isPolygon(triangle)).toBe(true)
  })

  it('OK if valid rectangle', () => {
    const rectangle: Point[] = [
      { id: '1', lat: 0, lng: 0 },
      { id: '2', lat: 10, lng: 0 },
      { id: '3', lat: 10, lng: 20 },
      { id: '4', lat: 0, lng: 20 },
    ]

    expect(isPolygon(rectangle)).toBe(true)
  })

  it('should return false if any of the points have invalid coordinates', () => {
    const mixedPoints: Point[] = [
      { id: '1', lat: '', lng: '-' },
      { id: '2', lat: 10, lng: 10 },
      { id: '3', lat: 0, lng: 20 },
    ]

    expect(isPolygon(mixedPoints)).toBe(false)
  })

  it('should return false for nearly collinear points with one outlier', () => {
    const nearlyCollinearPoints: Point[] = [
      { id: '1', lat: 0, lng: 0 },
      { id: '2', lat: 10, lng: 10 },
      { id: '3', lat: 20, lng: 20 },
      { id: '4', lat: 15, lng: 50 },
    ]

    expect(isPolygon(nearlyCollinearPoints)).toBe(false) // because of the outlier
  })

  it('should handle non-sequential collinear points', () => {
    const nonSequentialCollinear: Point[] = [
      { id: '1', lat: 0, lng: 0 },
      { id: '2', lat: 15, lng: 50 },
      { id: '3', lat: 10, lng: 10 },
      { id: '4', lat: 20, lng: 20 },
    ]

    expect(isPolygon(nonSequentialCollinear)).toBe(true) // because not all points are collinear
  })
})
