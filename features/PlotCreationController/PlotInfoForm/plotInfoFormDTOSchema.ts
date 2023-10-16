import { Email, Tel } from '@/utils/types'
import { CurrencyInputProps } from 'react-currency-input-field'
import { isValidPhoneNumber } from 'react-phone-number-input'
import { Simplify } from 'type-fest'
import { z } from 'zod'

const hasTwoDecimalPlaces = (num: number) => {
  const numStr = num.toString()
  const decimalIndex = numStr.indexOf('.')
  if (decimalIndex === -1) return true // No decimal places
  return numStr.slice(decimalIndex + 1).length <= 2
}

export type IntlConfig = Exclude<CurrencyInputProps['intlConfig'], undefined>
export const OTHER = 'Other'
export const currencies = [
  'PLN',
  'EUR',
  'USD',
  'GBP',
  OTHER
] as const satisfies ReadonlyArray<Exclude<IntlConfig['currency'], undefined>>

export const oneTrillion = 1_000_000_000_000

const plotInfoFormDTOSchema = (errMsg?: {
  priceValueMax: string
  telIsValidPhoneNumber: string
  emailIsEmail: string
}) =>
  z.strictObject({
    description: z
      .string()
      .trim()
      .transform((x) => x || null),
    address: z
      .string()
      .trim()
      .transform((x) => x || null),
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
        .transform((x) => x || null),
      currency: z.enum(currencies)
    }),
    email: z
      .string()
      .trim()
      .email({
        message: errMsg?.emailIsEmail ?? ''
      })
      .or(z.literal(''))
      .transform((x) => (x ? (x as Email) : null)),
    tel: z
      .string()
      .trim()
      .refine(isValidPhoneNumber, {
        message: errMsg?.telIsValidPhoneNumber ?? ''
      })
      .or(z.literal(''))
      .nullable()
      .transform((x) => (x ? (x as Tel) : null))
  })

export default plotInfoFormDTOSchema

export type PlotInfoFormDTOSchema = z.infer<
  ReturnType<typeof plotInfoFormDTOSchema>
>

type PriceKey = keyof Pick<PlotInfoFormDTOSchema, 'price'>
type PriceValue = Simplify<{
  value: string | undefined
}>
type PriceCurrency = Simplify<Pick<PlotInfoFormDTOSchema['price'], 'currency'>>
type RestKeys = keyof Pick<
  PlotInfoFormDTOSchema,
  'description' | 'address' | 'email' | 'tel'
>

export type PlotInfoFormData = Simplify<
  Record<PriceKey, Simplify<PriceValue & PriceCurrency>> &
    Record<RestKeys, string>
>
