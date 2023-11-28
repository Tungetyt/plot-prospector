import {intlConfigs} from '@/features/PlotCreationController/PlotInfoForm/sortedCurrencies/sortedCurrencies'
import {PlotInfoFormData} from '@/features/PlotCreationController/PlotInfoForm/plotInfoFormDTOSchema/plotInfoFormSchema'
import {Area} from '@/features/PlotCreationController/PlotInfoForm/polygonArea/polygonArea'
import {z} from 'zod'

type Locale = (typeof intlConfigs)[number]['locale']
type PriceValue = PlotInfoFormData['price']['value']

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
