import {useFormContext, useWatch} from 'react-hook-form'
import {Area} from '@/features/PlotCreationController/Property/polygonArea/polygonArea'
import {PropertyFormData} from '@/features/PlotCreationController/Property/propertyFormDTOSchema/propertyFormSchema'
import getIntlConfig from '@/features/PlotCreationController/Property/getInitConfig/getInitConfig'
import getPricePerM2 from '@/features/PlotCreationController/Property/PricePerM2/getPricePerM2/getPricePerM2'
import M2 from '../M2'

function PricePerM2({area}: {area: Area}) {
  const {control} = useFormContext<PropertyFormData>()

  const {value, currency} =
    useWatch({
      control,
      name: 'price'
    }) ?? 0

  const {locale} = getIntlConfig(currency)

  return (
    <>
      {getPricePerM2(locale, area, value)}{' '}
      {currency === 'Other' ? (
        ''
      ) : (
        <>
          {currency}/<M2 />
        </>
      )}
    </>
  )
}

export default PricePerM2
