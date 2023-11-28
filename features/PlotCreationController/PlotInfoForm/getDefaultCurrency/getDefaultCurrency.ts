import {intlConfigs} from '@/features/PlotCreationController/PlotInfoForm/sortedCurrencies/sortedCurrencies'
import {OTHER} from '@/features/PlotCreationController/PlotInfoForm/common'

const getDefaultCurrency = (currLocale: string) =>
  intlConfigs.find(({locale}) => locale.startsWith(currLocale))?.currency ||
  OTHER

export default getDefaultCurrency
