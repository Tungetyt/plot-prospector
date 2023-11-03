import CurrencyInput from 'react-currency-input-field'
import { PlotInfoFormData } from '@/features/PlotCreationController/PlotInfoForm/plotInfoFormDTOSchema/plotInfoFormDTOSchema'
import { useController, useFormContext, useWatch } from 'react-hook-form'
import getIntlConfig from '@/features/PlotCreationController/PlotInfoForm/getInitConfig/getInitConfig'
import { useTranslations } from 'next-intl'

const priceId = 'priceInput'

function PriceInput() {
  const t = useTranslations('Index')
  const { control } = useFormContext<PlotInfoFormData>()

  const {
    field: { onChange, ...rest },
    fieldState: { error }
  } = useController({
    name: 'price.value',
    control,
    rules: { required: true }
  })

  const currency = useWatch({
    control,
    name: 'price.currency'
  })

  const intlConfig = getIntlConfig(currency)

  return (
    <>
      <label htmlFor={priceId} className="label">
        <span className="label-text">{t('Plot_Price')}</span>
      </label>
      <CurrencyInput
        {...rest}
        id={priceId}
        {...(intlConfig.currency === 'Other' ? {} : { intlConfig })}
        allowNegativeValue={false}
        className={`input input-bordered max-w-[10rem] ${
          error ? 'input-error' : ''
        }`}
        aria-invalid={error ? 'true' : 'false'}
        onValueChange={onChange}
      />
    </>
  )
}

export default PriceInput
