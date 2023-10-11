import { formatPlot } from '@/features/Map/Map'
import { plotInfoFormDialogId } from '@/features/PlotCreationController/NextButton'
import { useDraftPlot } from '@/store/draftPlot/draftPlotStore'
import { closeModal } from '@/utils/common'
import { Email } from '@/utils/types'
import { DevTool } from '@hookform/devtools'
import { zodResolver } from '@hookform/resolvers/zod'
import { useLocale, useTranslations } from 'next-intl'
import CurrencyInput from 'react-currency-input-field'
import { Controller, useForm } from 'react-hook-form'
import PhoneInput from 'react-phone-number-input/react-hook-form-input'
import { z } from 'zod'
import { sortedCurrencies } from '@/features/PlotCreationController/sortedCurrencies'
import polygonArea from '@/features/PlotCreationController/polygonArea'
import getDefaultCurrency from '@/features/PlotCreationController/defaultCurrency'
import getIntlConfig from '@/features/PlotCreationController/getInitConfig'
import plotInfoFormDTOSchema from '@/features/PlotCreationController/plotInfoFormDTOSchema'

const descriptionId = 'descriptionInput'
const addressId = 'addressInput'
const priceId = 'priceInput'
const currencyId = 'currencyId'
const emailId = 'emailInput'
const telId = 'telInput'

type DTO = z.infer<typeof plotInfoFormDTOSchema>

type FormData = Pick<DTO, 'description' | 'address'> &
  Record<
    keyof Pick<DTO, 'price'>,
    {
      value: string
    } & Pick<DTO['price'], 'currency'>
  > &
  Record<keyof Pick<DTO, 'email'>, string> &
  Record<keyof Pick<DTO, 'tel'>, string>

function M2() {
  return (
    <>
      m<sup>2</sup>
    </>
  )
}

function PlotInfoForm({ email }: { email: Email | null }) {
  const t = useTranslations('Index')
  const draftPlot = useDraftPlot()
  const locale = useLocale()

  const defaultCurrency = getDefaultCurrency(locale)

  const defaultValues = {
    tel: '',
    price: {
      value: '',
      currency: defaultCurrency,
    },
    email: email ?? '',
    address: '',
    description: '',
  } as const satisfies FormData

  const {
    register,
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<typeof defaultValues>({
    resolver: zodResolver(plotInfoFormDTOSchema),
    defaultValues,
  })

  const onSubmit = handleSubmit((data: FormData) => console.log(data))

  const area = polygonArea(formatPlot(draftPlot))

  const intlConfig = getIntlConfig(watch('price.currency'))

  return (
    <>
      <form method="dialog" className="modal-box" onSubmit={onSubmit}>
        <div className="flex">
          <h3 className="font-bold text-lg">{t('Plot_Info')}</h3>
          <div className="ml-auto">
            {area} <M2 />
          </div>
        </div>
        <div className="form-control pt-4">
          <label htmlFor={descriptionId} className="label">
            <span className="label-text">{t('Plot_Description')}</span>
          </label>
          <textarea
            {...register('description')}
            id={descriptionId}
            className="textarea textarea-bordered textarea-lg min-h-[7rem]"
          />
        </div>
        <div className="form-control">
          <label htmlFor={addressId} className="label">
            <span className="label-text">{t('Plot_Address')}</span>
          </label>
          <input
            {...register('address')}
            id={addressId}
            type="text"
            className="input input-bordered"
            autoComplete="street-address"
          />
        </div>
        <div className="grid grid-cols-[repeat(2,_minmax(0,_1fr))_auto] gap-3">
          <div className="form-control w-full max-w-xs">
            <label htmlFor={currencyId} className="label mt-[auto]">
              <span className="label-text">{t('Currency')}</span>
            </label>
            <select
              {...register('price.currency')}
              id={currencyId}
              className="select select-bordered"
            >
              {sortedCurrencies(locale, defaultCurrency).map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
          </div>
          <div className="form-control">
            <label htmlFor={priceId} className="label mt-[auto]">
              <span className="label-text">{t('Plot_Price')}</span>
            </label>
            <Controller
              control={control}
              name="price.value"
              render={({ field: { onChange, ...rest } }) => (
                <CurrencyInput
                  {...rest}
                  id={priceId}
                  {...(intlConfig.currency === 'Other' ? {} : { intlConfig })}
                  allowNegativeValue={false}
                  className={`input input-bordered ${
                    errors.price?.value ? 'input-error' : ''
                  }`}
                  aria-invalid={errors.price?.value ? 'true' : 'false'}
                  onValueChange={onChange}
                />
              )}
            />
          </div>
          <div className="self-end">
            <div className="mb-5 label-text select-none">
              {t('Price_per')} <M2 />
            </div>
            <div className="mb-3">{area}</div>
          </div>
        </div>
        <div className="form-control">
          <label htmlFor={emailId} className="label">
            <span className="label-text">{t('Contact_Email')}</span>
          </label>
          <input
            {...register('email')}
            id={emailId}
            type="email"
            className={`input input-bordered ${
              errors.email ? 'input-error' : ''
            }`}
            aria-invalid={errors.email ? 'true' : 'false'}
            autoComplete="email"
          />
        </div>
        <div className="form-control">
          <label htmlFor={telId} className="label">
            <span className="label-text">{t('Contact_Phone')}</span>
          </label>
          <PhoneInput
            id={telId}
            name="tel"
            className={`input input-bordered ${
              errors.tel ? 'input-error' : ''
            }`}
            aria-invalid={errors.tel ? 'true' : 'false'}
            control={control}
          />
        </div>
        <div className="modal-action">
          <button
            type="button"
            className="btn btn-outline btn-primary"
            onClick={() => closeModal(plotInfoFormDialogId)}
          >
            {t('Back')}
          </button>
          <button className="btn btn-primary" type="submit">
            {t('Finish')}
          </button>
        </div>
      </form>
      <DevTool control={control} />
    </>
  )
}

export default PlotInfoForm
