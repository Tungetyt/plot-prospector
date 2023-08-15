/* eslint-disable dot-notation */
import { newSearchParams, urlParams } from '@/features/Map/MapURLEvents'

describe('newSearchParams', () => {
  // Standard Test Cases
  it('should correctly assign lat, lng, and zoom', () => {
    const result = newSearchParams(40, 50, 10, [])
    expect(result[urlParams.lat]).toBe('40')
    expect(result[urlParams.lng]).toBe('50')
    expect(result[urlParams.zoom]).toBe('10')
  })

  it('should merge existing parameters with lat, lng, and zoom', () => {
    const existingParams: [string, string][] = [
      ['query1', 'value1'],
      ['query2', 'value2'],
    ]
    const result = newSearchParams(40, 50, 10, existingParams)
    expect(result['query1']).toBe('value1')
    expect(result['query2']).toBe('value2')
    expect(result[urlParams.lat]).toBe('40')
    expect(result[urlParams.lng]).toBe('50')
    expect(result[urlParams.zoom]).toBe('10')
  })

  // Edge Cases
  it('should handle NaN or Infinity for lat, lng, or zoom', () => {
    const resultNaN = newSearchParams(NaN, 50, 10, [])
    expect(resultNaN[urlParams.lat]).toBe('NaN')

    const resultInfinity = newSearchParams(Infinity, 50, 10, [])
    expect(resultInfinity[urlParams.lat]).toBe('Infinity')
  })

  it('should handle non-string values in searchParams', () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const existingParams: any = [
      ['query1', null],
      ['query2', 12345],
      ['query3', {}],
    ]
    const result = newSearchParams(40, 50, 10, existingParams)
    expect(result['query1']).toBe(null)
    expect(result['query2']).toBe(12345)
    expect(result['query3']).toEqual({})
  })

  it('should handle duplicate keys in searchParams', () => {
    const existingParams: [string, string][] = [
      ['duplicate', 'firstValue'],
      ['duplicate', 'secondValue'],
    ]
    const result = newSearchParams(40, 50, 10, existingParams)
    expect(result['duplicate']).toBe('secondValue')
  })

  it('should handle negative values for lat, lng, or zoom', () => {
    const result = newSearchParams(-40, -50, -10, [])
    expect(result[urlParams.lat]).toBe('-40')
    expect(result[urlParams.lng]).toBe('-50')
    expect(result[urlParams.zoom]).toBe('-10')
  })
})
