import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { createPortal } from 'react-dom'
import { useForm } from 'react-hook-form'
import { DevTool } from '@hookform/devtools'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import PhoneInput from 'react-phone-number-input/react-hook-form-input'
import { isValidPhoneNumber } from 'react-phone-number-input'
import { Point } from '@/store/draftPlot/common'
import { useDraftPlot } from '@/store/draftPlot/draftPlotStore'
import { displayModal, isNumeric } from '@/utils/common'
import { Email, Tel } from '@/utils/types'
import body from '@/utils/clientCommon'

const isCollinear = (p1: Point, p2: Point, p3: Point): boolean => {
  if (
    isNumeric(p1.lat) &&
    isNumeric(p1.lng) &&
    isNumeric(p2.lat) &&
    isNumeric(p2.lng) &&
    isNumeric(p3.lat) &&
    isNumeric(p3.lng)
  ) {
    const area =
      p1.lat * (p2.lng - p3.lng) +
      p2.lat * (p3.lng - p1.lng) +
      p3.lat * (p1.lng - p2.lng)
    return area === 0
  }

  return false
}

const isEmptyPoint = ({ lat, lng }: Point): boolean => !lat && !lng

export const isPolygon = (draftPlot: ReadonlyArray<Point>): boolean => {
  if (draftPlot.length < 3) return false // Can't form a polygon with less than 3 points

  const lastPoint = draftPlot[draftPlot.length - 1]

  if (!lastPoint) throw new Error('Expected last point to be defined')

  const plot = isEmptyPoint(lastPoint) ? draftPlot.slice(0, -1) : draftPlot

  const hasInvalidPoint = plot.some(
    (point) => !isNumeric(point.lat) || !isNumeric(point.lng),
  )
  if (hasInvalidPoint) return false

  const collinearFound = plot.slice(0, -2).some((_, i) => {
    const p1 = plot[i]
    const p2 = plot[i + 1]
    const p3 = plot[i + 2]

    if (!p1 || !p2 || !p3) throw new Error('Expected points to be defined')

    return isCollinear(p1, p2, p3)
  })

  return !collinearFound
}

const dialogId = 'infoFormModal'
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

function NextButton({ email }: { email: Email | null }) {
  if (!body) throw new Error('Expected body to be in DOM')

  const [showError, setShowError] = useState(false)
  const draftPoints = useDraftPlot()
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
      <button
        type="button"
        className="btn btn-primary w-full"
        onClick={() => {
          if (isPolygon(draftPoints)) {
            setShowError(false)
            displayModal(dialogId)
            return
          }

          setShowError(true)
          setTimeout(() => setShowError(false), 1000)
        }}
      >
        {t('Next')}
      </button>
      <div className="h-20">
        {showError && (
          <div className="alert alert-warning">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="stroke-current shrink-0 h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
            <span>{t('Invalid_plot')}</span>
          </div>
        )}
      </div>
      {createPortal(
        <dialog id={dialogId} className="modal">
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
              <button className="btn btn-outline btn-primary" type="submit">
                {t('Back')}
              </button>
              <button className="btn btn-primary" type="submit">
                {t('Finish')}
              </button>
            </div>
          </form>
          <DevTool control={control} />
        </dialog>,
        body,
      )}
    </>
  )
}

export default NextButton
