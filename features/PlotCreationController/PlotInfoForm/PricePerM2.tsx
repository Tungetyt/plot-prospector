import { useFormContext, useWatch } from 'react-hook-form'
import { PlotInfoFormData } from '@/features/PlotCreationController/PlotInfoForm/plotInfoFormDTOSchema'
import polygonArea from '@/features/PlotCreationController/PlotInfoForm/polygonArea'

type Area = ReturnType<typeof polygonArea>

function PricePerM2({ area }: { area: Area }) {
  const { control } = useFormContext<PlotInfoFormData>()

  const price =
    useWatch({
      control,
      name: 'price.value',
    }) ?? 0

  return <>{Math.round(+price / area).toFixed(2)}</>
}

export default PricePerM2
