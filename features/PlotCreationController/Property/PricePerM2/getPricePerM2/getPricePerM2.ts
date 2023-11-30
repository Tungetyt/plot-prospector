import {z} from 'zod'
import {intlConfigs} from '@/features/PlotCreationController/Property/sortedCurrencies/sortedCurrencies'
import {PropertyFormData} from '@/features/PlotCreationController/Property/propertyFormDTOSchema/propertyFormSchema'
import {Area} from '@/features/PlotCreationController/Property/polygonArea/polygonArea'

type Locale = (typeof intlConfigs)[number]['locale']
type PriceValue = PropertyFormData['price']['value']

const getPricePerM2 = (locale: Locale, area: Area, value: PriceValue = '') => {
  const defaultLocale: Locale = 'en-US'

  z.number().nonnegative().finite().parse(area)
  const priceValue = z.coerce.number().nonnegative().finite().parse(value)

  return area
    ? new Intl.NumberFormat(locale || defaultLocale, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      }).format(priceValue / area)
    : ''
}

export default getPricePerM2
