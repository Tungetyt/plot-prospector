import {useDraftPlot} from '@/store/draftPlot/draftPlotStore'
import {Email} from '@/utils/types'
import {DevTool} from '@hookform/devtools'
import {zodResolver} from '@hookform/resolvers/zod'
import {useLocale, useTranslations} from 'next-intl'
import {FormProvider, useForm} from 'react-hook-form'
import PhoneInput from 'react-phone-number-input/react-hook-form-input'
import {propertyFormDialogId} from '@/features/PlotCreationController/NextButtonWithWarning/NextButton'
import {closeModal} from '@/utils/modal'
import {useState} from 'react'
import ImageUploading from 'react-images-uploading'
import Image from 'next/image'
import invariant from 'tiny-invariant'
import toast from 'react-hot-toast'
import {
  ExistingImageListType,
  removeDuplicateImages
} from '@/features/PlotCreationController/Property/removeDuplicateImages/removeDuplicateImages'
import getDefaultCurrency from '@/features/PlotCreationController/Property/getDefaultCurrency/getDefaultCurrency'
import propertyFormSchema, {
  PropertyFormData,
  PropertyFormSchema
} from '@/features/PlotCreationController/Property/propertyFormDTOSchema/propertyFormSchema'
import {
  oneTrillion,
  transactionTypeOptions
} from '@/features/PlotCreationController/Property/common'
import propertyAction from '@/features/PlotCreationController/Property/server/propertyAction'
import polygonArea from '@/features/PlotCreationController/Property/polygonArea/polygonArea'
import formatPlot from '@/features/PlotCreationController/Property/formatPlot/formatPlot'
import M2 from '@/features/PlotCreationController/Property/M2'
import {sortedCurrencies} from '@/features/PlotCreationController/Property/sortedCurrencies/sortedCurrencies'
import PriceInput from '@/features/PlotCreationController/Property/PriceInput'
import PricePerM2 from '@/features/PlotCreationController/Property/PricePerM2/PricePerM2'

const descriptionId = 'descriptionInput'
const addressId = 'addressInput'
const priceId = 'priceInput'
const currencyId = 'currencyId'
const emailId = 'emailInput'
const telId = 'telInput'

function PropertyForm({email}: {email: Email | null}) {
  const t = useTranslations('Index')
  const draftPlot = useDraftPlot()
  const locale = useLocale()
  const [images, setImages] = useState<ExistingImageListType>([])

  const defaultCurrency = getDefaultCurrency(locale)

  const defaultValues = {
    tel: '',
    price: {
      value: undefined,
      currency: defaultCurrency
    },
    email: email ?? '',
    address: '',
    description: '',
    transactionType: [],
    pictures: []
  } as const satisfies PropertyFormData

  const methods = useForm<PropertyFormData>({
    resolver: zodResolver(
      propertyFormSchema({
        priceValueMax: `${t(
          'Validation.Value_cannot_exceed'
        )} ${oneTrillion.toLocaleString(locale)}`,
        telIsValidPhoneNumber: t('Validation.Invalid_phone'),
        emailIsEmail: t('Validation.Invalid_email')
      })
    ),
    defaultValues
  })

  const {
    register,
    control,
    handleSubmit,
    formState: {errors}
  } = methods

  const onSubmit = handleSubmit(async (formData: PropertyFormData) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const {pictures, ...restData} = formData as unknown as PropertyFormSchema
    const data = await propertyAction({
      ...restData,
      pictures: images.map(({dataURL}) => dataURL),
      draftPlot: draftPlot.map(({lat, lng, ...rest}) => ({
        lat: +lat,
        lng: +lng,
        ...rest
      }))
    })
    if (data && data >= 500) toast.error(t('toast.Unexpected_server_error'))
    else if (data && data >= 400)
      toast.error(t('toast.Wrong_form_data_provided'))
    else toast.success(t('toast.The_property_has_been_created'))
  })

  const area = polygonArea(formatPlot(draftPlot))

  return (
    <FormProvider {...methods}>
      <form
        method="dialog"
        className="modal-box max-w-fit backdrop-blur-md bg-opacity-75 scrollbar-gutter-stable"
        onSubmit={onSubmit}
      >
        <div className="flex">
          <h3 className="font-bold text-lg">{t('Property')}</h3>
          <div className="ml-auto">
            {area} <M2 />
          </div>
        </div>
        <div className="flex gap-6">
          <section className="mt-4 mb-6">
            <div className="form-control">
              <label htmlFor={descriptionId} className="label">
                <span className="label-text">{t('Property_Description')}</span>
              </label>
              <textarea
                {...register('description')}
                id={descriptionId}
                className="textarea textarea-bordered textarea-lg min-h-[7rem]"
              />
              <label htmlFor={descriptionId} className="label">
                <span className="label-text-alt text-red-700">
                  {errors.description?.message}
                </span>
              </label>
            </div>
            <div className="form-control">
              <label htmlFor={addressId} className="label">
                <span className="label-text">{t('Property_Address')}</span>
              </label>
              <input
                {...register('address')}
                id={addressId}
                type="text"
                className="input input-bordered"
                autoComplete="street-address"
              />
              <label className="label" htmlFor={addressId}>
                <span className="label-text-alt text-red-700">
                  {errors.address?.message}
                </span>
              </label>
            </div>
            <div className="form-control w-fit">
              {transactionTypeOptions.map(tt => (
                <label className="label cursor-pointer gap-8" key={tt}>
                  <span className="label-text">
                    {t(`Transaction_Type.${tt}`)}
                  </span>
                  <input
                    {...register('transactionType')}
                    type="checkbox"
                    className="checkbox"
                    value={tt}
                  />
                </label>
              ))}
            </div>
            <div className="grid grid-cols-[repeat(3,auto)] gap-3">
              <div className="form-control w-full max-w-xs">
                <label htmlFor={currencyId} className="label">
                  <span className="label-text">{t('Currency')}</span>
                </label>
                <select
                  {...register('price.currency')}
                  id={currencyId}
                  className="select select-bordered"
                >
                  {sortedCurrencies(locale, defaultCurrency).map(c => (
                    <option key={c}>{c}</option>
                  ))}
                </select>
                <label className="label" htmlFor={currencyId}>
                  <span className="label-text-alt text-red-700">
                    {errors.price?.currency?.message}
                  </span>
                </label>
              </div>
              <div className="form-control">
                <PriceInput />
                <label className="label" htmlFor={priceId}>
                  <span className="label-text-alt text-red-700">
                    {errors.price?.value?.message}
                  </span>
                </label>
              </div>
              <div>
                <div className="mt-2 mb-5 label-text select-none">
                  {t('Price_per')} <M2 />
                </div>
                <div className="mb-3 min-w-[12rem]">
                  <PricePerM2 area={area} />
                </div>
              </div>
            </div>
            <ImageUploading
              multiple
              value={images}
              onChange={imageList =>
                setImages(removeDuplicateImages(imageList))
              }
              maxNumber={10}
            >
              {({
                imageList,
                onImageUpload,
                onImageRemove,
                isDragging,
                dragProps
              }) => (
                <section
                  className={isDragging ? 'drag-n-drop' : undefined}
                  {...dragProps}
                >
                  <button
                    className="btn mb-2"
                    type="button"
                    onClick={onImageUpload}
                  >
                    {t('Click_or_Drop_here_property_pictures')}
                  </button>
                  <div className="flex flex-wrap gap-1">
                    {imageList
                      .map(({dataURL}) => dataURL)
                      .filter((dataURL): dataURL is string => {
                        invariant(dataURL, 'Expected dataURL to exist')
                        return true
                      })
                      .map((dataURL, i) => (
                        <div key={dataURL}>
                          <Image
                            src={dataURL}
                            alt={t('A_property_picture')}
                            height="100"
                            width="100"
                            quality={100}
                            className="aspect-ratio-1"
                          />
                          <button
                            type="button"
                            className="btn btn-xs block mx-auto"
                            onClick={() => onImageRemove(i)}
                          >
                            {t('Remove')}
                          </button>
                        </div>
                      ))}
                  </div>
                </section>
              )}
            </ImageUploading>
          </section>
          <section className="mt-4 pl-6">
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
              <label className="label" htmlFor={emailId}>
                <span className="label-text-alt text-red-700">
                  {errors.email?.message}
                </span>
              </label>
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
              <label className="label" htmlFor={telId}>
                <span className="label-text-alt text-red-700">
                  {errors.tel?.message}
                </span>
              </label>
            </div>
          </section>
        </div>
        <div className="modal-action">
          <button
            type="button"
            className="btn btn-outline btn-primary bg-[revert]"
            onClick={() => closeModal(propertyFormDialogId)}
          >
            {t('Back')}
          </button>
          <button className="btn btn-primary" type="submit">
            {t('Finish')}
          </button>
        </div>
      </form>
      <DevTool control={control} />
    </FormProvider>
  )
}

export default PropertyForm
