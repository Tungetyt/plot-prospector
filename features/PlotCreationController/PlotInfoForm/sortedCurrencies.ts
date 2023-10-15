import invariant from 'tiny-invariant'
import {
  currencies,
  IntlConfig,
  OTHER,
} from '@/features/PlotCreationController/PlotInfoForm/plotInfoFormDTOSchema'

export type Currency = (typeof currencies)[number]
type CurrencyKey = keyof Pick<IntlConfig, 'currency'>
export type CurrencyRecord = Record<CurrencyKey, Currency>
export type LocaleRecord = Pick<IntlConfig, 'locale'>

export const intlConfigs = [
  {
    locale: 'pl-PL',
    currency: 'PLN',
  },
  {
    locale: 'de-DE',
    currency: 'EUR',
  },
  {
    locale: 'en-US',
    currency: 'USD',
  },
  {
    locale: 'en-GB',
    currency: 'GBP',
  },
  {
    locale: '',
    currency: 'Other',
  },
] as const satisfies ReadonlyArray<LocaleRecord & CurrencyRecord>

const isRelatedToLocale = (locale: string, currency: Currency) => {
  const relatedConfig = intlConfigs.find(
    (config) => config.currency === currency,
  )
  invariant(relatedConfig, 'Expected relatedConfig to be defined')
  return relatedConfig.locale.startsWith(locale)
}

export const sortedCurrencies = (locale: string, defaultCurrency: Currency) =>
  [...currencies].sort((a, b) => {
    if (a === defaultCurrency) return -1
    if (b === defaultCurrency) return 1

    if (a === OTHER) return 1
    if (b === OTHER) return -1

    const isARelated = isRelatedToLocale(locale, a)
    const isBRelated = isRelatedToLocale(locale, b)

    if (isARelated && !isBRelated) return -1
    if (!isARelated && isBRelated) return 1
    return a.localeCompare(b)
  })
