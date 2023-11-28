import getDefaultCurrency from '@/features/PlotCreationController/PlotInfoForm/getDefaultCurrency/getDefaultCurrency'
import {intlConfigs} from '@/features/PlotCreationController/PlotInfoForm/sortedCurrencies/sortedCurrencies'
import {OTHER} from '@/features/PlotCreationController/PlotInfoForm/common'

describe('getDefaultCurrency', () => {
  it('should return the correct currency for a given locale', () => {
    const testCases = [
      {locale: 'pl', expected: 'PLN'},
      {locale: 'de', expected: 'EUR'},
      {locale: 'en-US', expected: 'USD'},
      {locale: 'en-GB', expected: 'GBP'}
    ] as const

    testCases.forEach(({locale, expected}) => {
      expect(getDefaultCurrency(locale)).toBe(expected)
    })
  })

  it('should return "Other" for an unknown locale', () => {
    const unknownLocales = ['es', 'fr', 'it'] as const

    unknownLocales.forEach(locale => {
      expect(getDefaultCurrency(locale)).toBe(OTHER)
    })
  })

  it('should handle edge cases', () => {
    expect(getDefaultCurrency(null as unknown as string)).toBe(OTHER)
    expect(getDefaultCurrency(undefined as unknown as string)).toBe(OTHER)
  })

  it('should return the first matching currency if multiple configurations start with the same locale', () => {
    const customIntlConfigs = [
      ...intlConfigs,
      {locale: 'en-AU', currency: 'AUD'}
    ] as const

    const customGetDefaultCurrency = (locale: string) =>
      customIntlConfigs.find(config => config.locale.startsWith(locale))
        ?.currency || OTHER

    expect(customGetDefaultCurrency('en')).toBe('USD')
  })
})
