import CurrencyInput from 'react-currency-input-field'
import {useController, useFormContext, useWatch} from 'react-hook-form'
import {useTranslations} from 'next-intl'
import getIntlConfig from '@/features/PlotCreationController/Property/getInitConfig/getInitConfig'
import {PropertyFormData} from '@/features/PlotCreationController/Property/propertyFormDTOSchema/propertyFormSchema'

const priceId = 'priceInput'

function PriceInput() {
  const t = useTranslations('Index')
  const {control} = useFormContext<PropertyFormData>()

  const {
    field: {onChange, ...rest},
    fieldState: {error}
  } = useController({
    name: 'price.value',
    control,
    rules: {required: true}
  })

  const currency = useWatch({
    control,
    name: 'price.currency'
  })

  const intlConfig = getIntlConfig(currency)

  return (
    <>
      <label htmlFor={priceId} className="label">
        <span className="label-text">{t('Property_Price')}</span>
      </label>
      <CurrencyInput
        {...rest}
        id={priceId}
        {...(intlConfig.currency === 'Other' ? {} : {intlConfig})}
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
