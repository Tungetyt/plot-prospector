import { intlConfigs } from '@/features/PlotCreationController/PlotInfoForm/sortedCurrencies'
import { OTHER } from '@/features/PlotCreationController/PlotInfoForm/plotInfoFormDTOSchema'

const getDefaultCurrency = (locale: string) =>
  intlConfigs.find((config) => config.locale.startsWith(locale))?.currency ||
  OTHER

export default getDefaultCurrency
