import polygonArea from '@/features/PlotCreationController/PlotInfoForm/polygonArea/polygonArea'

describe('polygonArea', () => {
  // Basic validations
  it('should return 0 for non-polygon (less than 3 points)', () => {
    expect(
      polygonArea([
        [0, 0],
        [1, 1]
      ])
    ).toMatchInlineSnapshot('0')
  })

  it('should return 0 for points forming a line', () => {
    const line: [number, number][] = [
      [0, 0],
      [1, 1],
      [2, 2]
    ]
    expect(polygonArea(line)).toMatchInlineSnapshot('1888133')
  })

  // Basic shapes
  it('should return correct area for a square', () => {
    const square: [number, number][] = [
      [0, 0],
      [0, 1],
      [1, 1],
      [1, 0],
      [0, 0]
    ]
    expect(polygonArea(square)).toMatchInlineSnapshot('12392658216')
  })

  it('should return correct area for a triangle', () => {
    const triangle: [number, number][] = [
      [0, 0],
      [0, 2],
      [2, 0],
      [0, 0]
    ]
    expect(polygonArea(triangle)).toMatchInlineSnapshot('24789092699')
  })

  // Edge cases
  it('should handle polygons crossing the equator', () => {
    const polygon: [number, number][] = [
      [-1, -1],
      [-1, 1],
      [1, 1],
      [1, -1],
      [-1, -1]
    ]
    expect(polygonArea(polygon)).toMatchInlineSnapshot('49570632865')
  })

  it('should handle polygons crossing the prime meridian', () => {
    const polygon: [number, number][] = [
      [-1, -1],
      [1, -1],
      [1, 1],
      [-1, 1],
      [-1, -1]
    ]
    expect(polygonArea(polygon)).toMatchInlineSnapshot('49570632865')
  })

  it('should handle very large polygons', () => {
    const largePolygon: [number, number][] = [
      [-85, -180],
      [-85, 180],
      [85, 180],
      [85, -180],
      [-85, -180]
    ]
    // The exact area will depend on your projection.
    expect(polygonArea(largePolygon)).toMatchInlineSnapshot('1600745957249118')
  })

  it('should handle polygons with very close points (nearly a line)', () => {
    const narrowPolygon: [number, number][] = [
      [0, 0],
      [0.0001, 0],
      [0.0001, 0.0001],
      [0, 0.0001],
      [0, 0]
    ]
    // This is nearly a line and should have a very small area.
    expect(polygonArea(narrowPolygon)).toMatchInlineSnapshot('124')
  })

  it('max lat', () => {
    expect(polygonArea([[90, 0]])).toMatchInlineSnapshot('0')
  })

  it('max lng', () => {
    expect(polygonArea([[0, 180]])).toMatchInlineSnapshot('0')
  })

  it('over max lng', () => {
    expect(polygonArea([[10, 181]])).toMatchInlineSnapshot('0')
  })

  it('over max lat', () => {
    expect(() => polygonArea([[91, 0]])).toThrowError()
  })

  it('min lat', () => {
    expect(polygonArea([[-90, 0]])).toMatchInlineSnapshot('0')
  })

  it('min lng', () => {
    expect(polygonArea([[0, -180]])).toMatchInlineSnapshot('0')
  })

  it('under min lng', () => {
    expect(polygonArea([[10, -181]])).toMatchInlineSnapshot('0')
  })

  it('under min lat', () => {
    expect(() => polygonArea([[-91, 0]])).toThrowError()
  })
})
