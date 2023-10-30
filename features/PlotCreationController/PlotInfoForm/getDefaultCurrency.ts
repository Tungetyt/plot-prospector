import { intlConfigs } from '@/features/PlotCreationController/PlotInfoForm/sortedCurrencies'
import { OTHER } from '@/features/PlotCreationController/PlotInfoForm/plotInfoFormDTOSchema'

const getDefaultCurrency = (currLocale: string) =>
  intlConfigs.find(({ locale }) => locale.startsWith(currLocale))?.currency ||
  OTHER

export default getDefaultCurrency
