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
} from '@/features/PlotCreationController/Property/common'

const emptySchema = z.literal('')

const toNullInCaseOfAbsence = (x: string | undefined) => x || null

const propertyFormSchema = (errMsg?: {
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

export default propertyFormSchema

export type PropertyFormSchema = z.infer<ReturnType<typeof propertyFormSchema>>

type PriceKey = keyof Pick<PropertyFormSchema, 'price'>
type PriceValue = Simplify<{
  value: string | undefined
}>
type PriceCurrency = Simplify<Pick<PropertyFormSchema['price'], 'currency'>>
type RestKeys = keyof Pick<
  PropertyFormSchema,
  'description' | 'address' | 'email' | 'tel'
>
type TransactionType = Pick<PropertyFormSchema, 'transactionType'>
type PicturesKey = keyof Pick<PropertyFormSchema, 'pictures'>
type PicturesType = Record<PicturesKey, ImageListType>

export type PropertyFormData = Simplify<
  ReadonlyDeep<
    Record<PriceKey, Simplify<PriceValue & PriceCurrency>> &
      Record<RestKeys, string> &
      TransactionType &
      PicturesType
  >
>
