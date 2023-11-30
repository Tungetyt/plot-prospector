import invariant from 'tiny-invariant'
import {
  Currency,
  intlConfigs
} from '@/features/PlotCreationController/Property/sortedCurrencies/sortedCurrencies'

const getIntlConfig = (currentCurrency: Currency) => {
  const result = intlConfigs.find(({currency}) => currency === currentCurrency)
  invariant(result, 'Expected intlConfig to be defined')
  return result
}

export default getIntlConfig
