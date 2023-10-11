import getIntlConfig from '@/features/PlotCreationController/PlotInfoForm/getInitConfig'
import {
  Currency,
  intlConfigs,
} from '@/features/PlotCreationController/PlotInfoForm/sortedCurrencies'

describe('getIntlConfig', () => {
  it('should return the correct intlConfig for each currency', () => {
    const testCases: Set<Currency> = new Set([
      'PLN',
      'EUR',
      'USD',
      'GBP',
      'Other',
    ])

    testCases.forEach((currency) => {
      const result = getIntlConfig(currency)
      const expected = intlConfigs.find(
        (config) => config.currency === currency,
      )
      expect(result).toEqual(expected)
    })
  })

  it('should throw an error for an undefined currency', () => {
    const invalidCurrency = 'INVALID_CURRENCY' as Currency
    expect(() => getIntlConfig(invalidCurrency)).toThrow(
      'Expected intlConfig to be defined',
    )
  })
})
