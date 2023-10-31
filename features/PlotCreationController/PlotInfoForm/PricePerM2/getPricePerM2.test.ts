import getPricePerM2 from '@/features/PlotCreationController/PlotInfoForm/PricePerM2/getPricePerM2'
import { z } from 'zod'

describe('getPricePerM2', () => {
  it('returns the correct price per square meter for a given locale', () => {
    expect(getPricePerM2('en-US', 4, '200')).toEqual('50.00')
  })

  it('returns the correct price for decimal value and whole number area', () => {
    expect(getPricePerM2('en-US', 4, '200.5')).toEqual('50.13')
  })

  it('returns the correct price for whole number value and decimal area', () => {
    expect(getPricePerM2('en-US', 4.5, '200')).toEqual('44.44')
  })

  it('returns the correct price for both value and area as decimals', () => {
    expect(getPricePerM2('en-US', 4.5, '200.5')).toEqual('44.56')
  })

  it('returns "Infinity" for decimal value and zero area', () => {
    expect(getPricePerM2('en-US', 0, '200.5')).toEqual('')
  })

  it('handles empty locale by using the default en-US', () => {
    expect(getPricePerM2('', 4, '200')).toEqual('50.00')
  })

  it('returns "Infinity" for area zero', () => {
    expect(getPricePerM2('en-US', 0, '200')).toEqual('')
  })

  it('returns "NaN" for undefined value', () => {
    expect(getPricePerM2('en-US', 4, undefined)).toEqual('0.00')
  })

  it('returns "NaN" for empty value', () => {
    expect(getPricePerM2('en-US', 4, '')).toEqual('0.00')
  })

  it('returns "NaN" for incorrect number format in value', () => {
    expect(() => getPricePerM2('en-US', 4, '200abc')).toThrow(z.ZodError)
  })

  it('returns "NaN" for value as "NaN"', () => {
    expect(() => getPricePerM2('en-US', 4, 'NaN')).toThrow(z.ZodError)
  })

  it('returns "NaN" for area as NaN', () => {
    expect(() => getPricePerM2('en-US', NaN, '200')).toThrow(z.ZodError)
  })

  it('returns "NaN" for both value and area as "NaN"', () => {
    expect(() => getPricePerM2('en-US', NaN, 'NaN')).toThrow(z.ZodError)
  })

  it('throws an error for negative area', () => {
    expect(() => {
      getPricePerM2('en-US', -4, '200')
    }).toThrow(z.ZodError)
  })

  it('throws an error for negative value', () => {
    expect(() => {
      getPricePerM2('en-US', 4, '-200')
    }).toThrow(z.ZodError)
  })
})
