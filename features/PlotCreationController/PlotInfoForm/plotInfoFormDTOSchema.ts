import { currencies } from '@/features/PlotCreationController/PlotInfoForm/sortedCurrencies'
import { Email, Tel } from '@/utils/types'
import { isValidPhoneNumber } from 'react-phone-number-input'
import { Simplify } from 'type-fest'
import { z } from 'zod'

const hasTwoDecimalPlaces = (num: number) => {
  const numStr = num.toString()
  const decimalIndex = numStr.indexOf('.')
  if (decimalIndex === -1) return true // No decimal places
  return numStr.slice(decimalIndex + 1).length <= 2
}

const plotInfoFormDTOSchema = z.strictObject({
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
      .max(1_000_000_000_000)
      .refine(hasTwoDecimalPlaces, {
        message: 'Value must have at most 2 digits after the decimal point',
      })
      .or(z.undefined())
      .transform((x) => x || null),
    currency: z.enum(currencies),
  }),
  email: z
    .string()
    .trim()
    .email()
    .or(z.literal(''))
    .transform((x) => (x ? (x as Email) : null)),
  tel: z
    .string()
    .trim()
    .refine(isValidPhoneNumber)
    .or(z.literal(''))
    .transform((x) => (x ? (x as Tel) : null)),
})

export default plotInfoFormDTOSchema

export type PlotInfoFormDTOSchema = z.infer<typeof plotInfoFormDTOSchema>

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
