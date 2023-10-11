import {
  intlConfigs,
  OTHER,
} from '@/features/PlotCreationController/sortedCurrencies'

const getDefaultCurrency = (locale: string) =>
  intlConfigs.find((config) => config.locale.startsWith(locale))?.currency ||
  OTHER

export default getDefaultCurrency
