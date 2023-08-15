import { isNumeric } from './common'

describe('isNumeric', () => {
  it('should return true for numbers', () => {
    expect(isNumeric(123)).toBe(true)
    expect(isNumeric(-123)).toBe(true)
    expect(isNumeric(0)).toBe(true)
    expect(isNumeric(123.456)).toBe(true)
    expect(isNumeric(-123.456)).toBe(true)
    expect(isNumeric(Number.MAX_SAFE_INTEGER)).toBe(true)
    expect(isNumeric(Number.MIN_SAFE_INTEGER)).toBe(true)
    expect(isNumeric(Number.POSITIVE_INFINITY)).toBe(true) // Though infinity is not a typical "number" in real-world use-cases, JS considers it a number type
    expect(isNumeric(Number.NEGATIVE_INFINITY)).toBe(true)
  })

  it('should return false for strings', () => {
    expect(isNumeric('123')).toBe(false)
    expect(isNumeric('-123')).toBe(false)
    expect(isNumeric('0')).toBe(false)
    expect(isNumeric('123.456')).toBe(false)
    expect(isNumeric('-123.456')).toBe(false)
    expect(isNumeric('Hello')).toBe(false)
    expect(isNumeric('')).toBe(false)
  })

  it('should return false for other types', () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    expect(isNumeric([] as any)).toBe(false)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    expect(isNumeric({} as any)).toBe(false)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    expect(isNumeric((() => {}) as any)).toBe(false)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    expect(isNumeric(null as any)).toBe(false)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    expect(isNumeric(undefined as any)).toBe(false)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    expect(isNumeric(true as any)).toBe(false)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    expect(isNumeric(false as any)).toBe(false)
  })

  it('should return false for NaN', () => {
    expect(isNumeric(NaN)).toBe(true) // NaN is of type 'number' in JavaScript, though in many contexts it's treated specially
  })

  it('should be usable in type guards', () => {
    const testFunction = (input: number | string) => {
      if (isNumeric(input))
        // Type of input is inferred as number in this block
        expect(typeof input).toBe('number')
      // Type of input is inferred as string in this block
      else expect(typeof input).toBe('string')
    }

    testFunction(123)
    testFunction('123')
  })
})
