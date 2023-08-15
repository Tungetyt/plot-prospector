import PhoneInput from 'react-phone-number-input/react-hook-form-input'
import { DevTool } from '@hookform/devtools'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { isValidPhoneNumber } from 'react-phone-number-input'
import { useTranslations } from 'next-intl'
import { Email, Tel } from '@/utils/types'
import { closeModal } from '@/utils/common'
import { plotInfoFormDialogId } from '@/features/PlotCreationController/NextButton'

const descriptionId = 'descriptionInput'
const addressId = 'addressInput'
const priceId = 'priceInput'
const emailId = 'emailInput'
const telId = 'telInput'

const DTOSchema = z.object({
  description: z.string(),
  address: z.string(),
  price: z.coerce.number().positive(),
  email: z
    .string()
    .email()
    .transform((x) => x as Email),
  tel: z
    .string()
    .refine(isValidPhoneNumber)
    .transform((x) => x as Tel),
})

type DTO = z.infer<typeof DTOSchema>

type FormData = Pick<z.infer<typeof DTOSchema>, 'description' | 'address'> &
  Record<keyof Pick<DTO, 'price'>, string> &
  Record<keyof Pick<DTO, 'email'>, string> &
  Record<keyof Pick<DTO, 'tel'>, string>

function PlotInfoForm({ email }: { email: Email | null }) {
  const t = useTranslations('Index')

  const defaultValues = {
    tel: '',
    price: '',
    email: email ?? '',
    address: '',
    description: '',
  } as const satisfies FormData

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(DTOSchema),
    defaultValues,
  })

  const onSubmit = handleSubmit((data: FormData) => console.log(data))

  return (
    <>
      <form method="dialog" className="modal-box" onSubmit={onSubmit}>
        <h3 className="font-bold text-lg">{t('Plot_Info')}</h3>
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
          />
        </div>
        <div className="grid grid-cols-2">
          <div className="form-control">
            <label htmlFor={priceId} className="label">
              <span className="label-text">{t('Plot_Price')}</span>
            </label>
            <input
              {...register('price')}
              id={priceId}
              type="text"
              className={`input input-bordered ${
                errors.price ? 'input-error' : ''
              }`}
            />
          </div>
          <div>
            <span>{t('Price_per_m2')}</span>
            <div>{null}</div>
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
