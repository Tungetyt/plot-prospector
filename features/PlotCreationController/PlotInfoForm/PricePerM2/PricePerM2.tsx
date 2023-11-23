import {useFormContext, useWatch} from 'react-hook-form'
import {PlotInfoFormData} from '@/features/PlotCreationController/PlotInfoForm/plotInfoFormDTOSchema/plotInfoFormDTOSchema'
import getIntlConfig from '@/features/PlotCreationController/PlotInfoForm/getInitConfig/getInitConfig'
import M2 from '@/features/PlotCreationController/PlotInfoForm/M2'
import getPricePerM2 from '@/features/PlotCreationController/PlotInfoForm/PricePerM2/getPricePerM2/getPricePerM2'
import {Area} from '@/features/PlotCreationController/PlotInfoForm/polygonArea/polygonArea'

function PricePerM2({area}: {area: Area}) {
  const {control} = useFormContext<PlotInfoFormData>()

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
