import {
  Currency,
  intlConfigs,
  sortedCurrencies
} from '@/features/PlotCreationController/Property/sortedCurrencies/sortedCurrencies'
import {OTHER} from '@/features/PlotCreationController/Property/common'

describe('sortedCurrencies', () => {
  it('should sort currencies based on default currency', () => {
    const locale = 'en-US'
    const defaultCurrency: Currency = 'USD'
    const result = sortedCurrencies(locale, defaultCurrency)
    expect(result[0]).toBe(defaultCurrency)
  })

  it('should sort "Other" to the end', () => {
    const locale = 'en-US'
    const defaultCurrency: Currency = 'PLN'
    const result = sortedCurrencies(locale, defaultCurrency)
    expect(result[result.length - 1]).toBe(OTHER)
  })

  it('should sort currencies related to the locale towards the beginning', () => {
    const locale = 'en-GB'
    const defaultCurrency: Currency = 'PLN'
    const result = sortedCurrencies(locale, defaultCurrency)
    expect(result[1]).toBe('GBP')
  })

  it('should sort currencies not related to the locale towards the end', () => {
    const locale = 'en-US'
    const defaultCurrency: Currency = 'USD'
    const result = sortedCurrencies(locale, defaultCurrency)
    const unrelatedCurrencies = result.slice(2, -1) // Exclude default and 'Other'
    const lastUnrelatedCurrency =
      unrelatedCurrencies[unrelatedCurrencies.length - 1]

    // Find the last currency that is not related to the locale
    const lastUnrelatedConfig = intlConfigs.find(
      config => !config.locale.startsWith(locale)
    )
    expect(lastUnrelatedCurrency).toBe(lastUnrelatedConfig?.currency)
  })

  it('should handle an empty locale', () => {
    const locale = ''
    const defaultCurrency: Currency = 'PLN'
    const result = sortedCurrencies(locale, defaultCurrency)
    expect(result).toEqual(
      expect.arrayContaining(['PLN', 'EUR', 'USD', 'GBP', OTHER])
    )
  })

  it('should sort remaining currencies alphabetically', () => {
    const locale = 'en-US'
    const defaultCurrency: Currency = 'USD'
    const result = sortedCurrencies(locale, defaultCurrency)
    const remainingCurrencies = result.slice(1, -1).filter(currency => {
      const relatedConfig = intlConfigs.find(
        config => config.currency === currency
      )
      return !relatedConfig?.locale.startsWith(locale)
    })

    const sortedRemainingCurrencies = [...remainingCurrencies].sort((a, b) =>
      a.localeCompare(b)
    )
    expect(remainingCurrencies).toEqual(sortedRemainingCurrencies)
  })
})
