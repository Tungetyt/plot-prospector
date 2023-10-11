import {
  intlConfigs,
  OTHER,
} from '@/features/PlotCreationController/PlotInfoForm/sortedCurrencies'

const getDefaultCurrency = (locale: string) =>
  intlConfigs.find((config) => config.locale.startsWith(locale))?.currency ||
  OTHER

export default getDefaultCurrency
