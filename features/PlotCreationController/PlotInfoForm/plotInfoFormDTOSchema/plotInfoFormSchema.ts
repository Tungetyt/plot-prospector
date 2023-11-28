import {ImageListType} from 'react-images-uploading'
import {isValidPhoneNumber} from 'react-phone-number-input'
import {ReadonlyDeep, Simplify} from 'type-fest'
import {z} from 'zod'
import {
  currencySchema,
  dataURLSchema,
  emailSchema,
  hasTwoDecimalPlaces,
  oneTrillion,
  telSchema,
  textSchema,
  toEmail,
  toTel,
  transactionTypeSchema
} from '@/features/PlotCreationController/PlotInfoForm/common'

const emptySchema = z.literal('')

const toNullInCaseOfAbsence = (x: string | undefined) => x || null

const plotInfoFormSchema = (errMsg?: {
  priceValueMax: string
  telIsValidPhoneNumber: string
  emailIsEmail: string
}) =>
  z.strictObject({
    description: textSchema.transform(toNullInCaseOfAbsence),
    address: textSchema.transform(toNullInCaseOfAbsence),
    price: z.strictObject({
      value: z.coerce
        .number()
        .positive()
        .finite()
        .max(oneTrillion, {
          message: errMsg?.priceValueMax ?? ''
        })
        .refine(hasTwoDecimalPlaces, {
          message: 'Value must have at most 2 digits after the decimal point'
        })
        .or(z.undefined())
        .transform(x => x || null),
      currency: currencySchema
    }),
    transactionType: transactionTypeSchema,
    email: emailSchema(errMsg?.emailIsEmail)
      .or(emptySchema)
      .transform(toEmail),
    tel: telSchema(isValidPhoneNumber, errMsg?.telIsValidPhoneNumber)
      .or(emptySchema)
      .nullable()
      .transform(toTel),
    pictures: z.array(
      z.object({
        dataURL: dataURLSchema,
        file: z.instanceof(File).optional()
      })
    )
  })

export default plotInfoFormSchema

export type PlotInfoFormSchema = z.infer<ReturnType<typeof plotInfoFormSchema>>

type PriceKey = keyof Pick<PlotInfoFormSchema, 'price'>
type PriceValue = Simplify<{
  value: string | undefined
}>
type PriceCurrency = Simplify<Pick<PlotInfoFormSchema['price'], 'currency'>>
type RestKeys = keyof Pick<
  PlotInfoFormSchema,
  'description' | 'address' | 'email' | 'tel'
>
type TransactionType = Pick<PlotInfoFormSchema, 'transactionType'>
type PicturesKey = keyof Pick<PlotInfoFormSchema, 'pictures'>
type PicturesType = Record<PicturesKey, ImageListType>

export type PlotInfoFormData = Simplify<
  ReadonlyDeep<
    Record<PriceKey, Simplify<PriceValue & PriceCurrency>> &
      Record<RestKeys, string> &
      TransactionType &
      PicturesType
  >
>
