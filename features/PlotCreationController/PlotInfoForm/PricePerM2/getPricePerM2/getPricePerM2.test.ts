import getPricePerM2 from '@/features/PlotCreationController/PlotInfoForm/PricePerM2/getPricePerM2/getPricePerM2'
import { z } from 'zod'

describe('getPricePerM2', () => {
  it('returns the correct price per square meter when value and area are integers', () => {
    expect(getPricePerM2('en-US', 4, '200')).toEqual('50.00')
  })

  it('calculates the price per square meter correctly when value is an integer and area is a decimal', () => {
    expect(getPricePerM2('en-US', 4, '200.5')).toEqual('50.13')
  })

  it('calculates the price per square meter correctly when value is a decimal and area is an integer', () => {
    expect(getPricePerM2('en-US', 4.5, '200')).toEqual('44.44')
  })

  it('calculates the price per square meter correctly when both value and area are decimals', () => {
    expect(getPricePerM2('en-US', 4.5, '200.5')).toEqual('44.56')
  })

  it('handles zero area with a non-zero value by returning an empty string', () => {
    expect(getPricePerM2('en-US', 0, '200.5')).toEqual('')
  })

  it('uses "en-US" as the default locale when an empty string is provided', () => {
    expect(getPricePerM2('', 4, '200')).toEqual('50.00')
  })

  it('handles zero value with non-zero area by returning an empty string', () => {
    expect(getPricePerM2('en-US', 0, '200')).toEqual('')
  })

  it('returns "0.00" when the area is undefined', () => {
    expect(getPricePerM2('en-US', 4, undefined)).toEqual('0.00')
  })

  it('returns "0.00" when the area is an empty string', () => {
    expect(getPricePerM2('en-US', 4, '')).toEqual('0.00')
  })

  it('throws a ZodError when the area has an incorrect number format', () => {
    expect(() => getPricePerM2('en-US', 4, '200abc')).toThrow(z.ZodError)
  })

  it('throws a ZodError when the area is the string "NaN"', () => {
    expect(() => getPricePerM2('en-US', 4, 'NaN')).toThrow(z.ZodError)
  })

  it('throws a ZodError when the value is NaN', () => {
    expect(() => getPricePerM2('en-US', NaN, '200')).toThrow(z.ZodError)
  })

  it('throws a ZodError when both value and area are NaN', () => {
    expect(() => getPricePerM2('en-US', NaN, 'NaN')).toThrow(z.ZodError)
  })

  it('throws a ZodError when the area is negative', () => {
    expect(() => {
      getPricePerM2('en-US', -4, '200')
    }).toThrow(z.ZodError)
  })

  it('throws a ZodError when the value is negative', () => {
    expect(() => {
      getPricePerM2('en-US', 4, '-200')
    }).toThrow(z.ZodError)
  })
})
