import {
  Currency,
  intlConfigs,
} from '@/features/PlotCreationController/PlotInfoForm/sortedCurrencies'
import invariant from 'tiny-invariant'

const getIntlConfig = (currentCurrency: Currency) => {
  const result = intlConfigs.find(
    ({ currency }) => currency === currentCurrency,
  )
  invariant(result, 'Expected intlConfig to be defined')
  return result
}

export default getIntlConfig
