import {intlConfigs} from '@/features/PlotCreationController/Property/sortedCurrencies/sortedCurrencies'
import {OTHER} from '@/features/PlotCreationController/Property/common'

const getDefaultCurrency = (currLocale: string) =>
  intlConfigs.find(({locale}) => locale.startsWith(currLocale))?.currency ||
  OTHER

export default getDefaultCurrency
