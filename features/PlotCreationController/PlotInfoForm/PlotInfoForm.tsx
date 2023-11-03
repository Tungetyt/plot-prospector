import { useDraftPlot } from '@/store/draftPlot/draftPlotStore'
import { Email } from '@/utils/types'
import { DevTool } from '@hookform/devtools'
import { zodResolver } from '@hookform/resolvers/zod'
import { useLocale, useTranslations } from 'next-intl'
import { FormProvider, useForm } from 'react-hook-form'
import PhoneInput from 'react-phone-number-input/react-hook-form-input'
import { sortedCurrencies } from '@/features/PlotCreationController/PlotInfoForm/sortedCurrencies'
import polygonArea from '@/features/PlotCreationController/PlotInfoForm/polygonArea'
import getDefaultCurrency from '@/features/PlotCreationController/PlotInfoForm/getDefaultCurrency'
import plotInfoFormDTOSchema, {
  oneTrillion,
  PlotInfoFormData,
  transactionTypeOptions
} from '@/features/PlotCreationController/PlotInfoForm/plotInfoFormDTOSchema'
import { plotInfoFormDialogId } from '@/features/PlotCreationController/NextButtonWithWarning/NextButton'
import { closeModal } from '@/utils/modal'
import PriceInput from '@/features/PlotCreationController/PlotInfoForm/PriceInput'
import M2 from '@/features/PlotCreationController/PlotInfoForm/M2'
import PricePerM2 from '@/features/PlotCreationController/PlotInfoForm/PricePerM2/PricePerM2'
import { useState } from 'react'
import ImageUploading, {
  ImageListType,
  ImageType
} from 'react-images-uploading'
import { z } from 'zod'
import Image from 'next/image'
import invariant from 'tiny-invariant'
import formatPlot from './formatPlot'

const descriptionId = 'descriptionInput'
const addressId = 'addressInput'
const priceId = 'priceInput'
const currencyId = 'currencyId'
const emailId = 'emailInput'
const telId = 'telInput'

type DataURLValue = Exclude<ImageType['dataURL'], undefined>
type DataURLKey = keyof Pick<ImageType, 'dataURL'>
type ExistingImageType = Omit<ImageType, 'dataURL'> & Record<DataURLKey, string>
export type ExistingImageListType = Array<ExistingImageType>

const removeDuplicateImages = (
  imageList: ImageListType
): ExistingImageListType => {
  const uniqueDataURLs = new Set<string>()

  const filteredList: ExistingImageListType = []

  imageList.forEach((image) => {
    const isValid = z.string().safeParse(image.dataURL)

    if (isValid.success) {
      const { data } = isValid

      if (!uniqueDataURLs.has(data)) {
        uniqueDataURLs.add(data)

        const existingImage: ExistingImageType = {
          ...image,
          dataURL: data // Make dataURL mandatory
        }

        filteredList.push(existingImage)
      }
    }
  })

  return filteredList
}

function PlotInfoForm({ email }: { email: Email | null }) {
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
  } as const satisfies PlotInfoFormData

  const methods = useForm<PlotInfoFormData>({
    resolver: zodResolver(
      plotInfoFormDTOSchema({
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
    setValue,
    formState: { errors }
  } = methods

  const onSubmit = handleSubmit(({ pictures, ...restData }: PlotInfoFormData) =>
    console.log({ ...restData, pictures: images.map(({ dataURL }) => dataURL) })
  )

  const area = polygonArea(formatPlot(draftPlot))

  return (
    <FormProvider {...methods}>
      <form
        method="dialog"
        className="modal-box max-w-fit backdrop-blur-md bg-opacity-75"
        onSubmit={onSubmit}
      >
        <div className="flex">
          <h3 className="font-bold text-lg">{t('Plot_Info')}</h3>
          <div className="ml-auto">
            {area} <M2 />
          </div>
        </div>
        <div className="flex gap-6 divide-x border-b">
          <section className="mt-4  mb-6">
            <div className="form-control">
              <label htmlFor={descriptionId} className="label">
                <span className="label-text">{t('Plot_Description')}</span>
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
                <span className="label-text">{t('Plot_Address')}</span>
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
              {transactionTypeOptions.map((tt) => (
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
                  {sortedCurrencies(locale, defaultCurrency).map((c) => (
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
                <div className="mb-3">
                  <PricePerM2 area={area} />
                </div>
              </div>
            </div>
            <ImageUploading
              multiple
              value={images}
              onChange={(imageList) =>
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
                  className={isDragging ? 'dragNDrop' : undefined}
                  {...dragProps}
                >
                  <button
                    className="btn mb-2"
                    type="button"
                    onClick={onImageUpload}
                  >
                    {t('Click_or_Drop_here_plot_pictures')}
                  </button>
                  <div className="flex flex-wrap gap-1">
                    {imageList
                      .map(({ dataURL }) => dataURL)
                      .filter((dataURL): dataURL is string => {
                        invariant(dataURL, 'Expected dataURL to exist')
                        return true
                      })
                      .map((dataURL, index) => (
                        <div key={dataURL}>
                          <Image
                            src={dataURL}
                            alt={t('A_plot_picture')}
                            height="100"
                            width="100"
                            quality={100}
                            style={{ height: 100, width: 100 }}
                          />
                          <button
                            type="button"
                            className="btn btn-xs block mx-auto"
                            onClick={() => onImageRemove(index)}
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
    </FormProvider>
  )
}

export default PlotInfoForm

// TODO: Automatically go to the point after providing correct one. Scale so all points visible
