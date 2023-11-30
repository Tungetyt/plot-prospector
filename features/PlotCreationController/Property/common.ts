import {CurrencyInputProps} from 'react-currency-input-field'
import {z} from 'zod'
import {Email, Tel} from '@/utils/types'

export const OTHER = 'Other'
export const hasTwoDecimalPlaces = (num: number) => {
  const numStr = num.toString()
  const decimalIndex = numStr.indexOf('.')
  if (decimalIndex === -1) return true // No decimal places
  return numStr.slice(decimalIndex + 1).length <= 2
}
export const oneTrillion = 1_000_000_000_000
export type IntlConfig = Exclude<CurrencyInputProps['intlConfig'], undefined>
export const currencies = [
  'PLN',
  'EUR',
  'USD',
  'GBP',
  OTHER
] as const satisfies ReadonlyArray<Exclude<IntlConfig['currency'], undefined>>
export const transactionTypeOptions = ['buy', 'sell', 'lease'] as const

export const textSchema = z.string().trim()

export const emailSchema = (message = '') =>
  textSchema.email({
    message
  })

export const dataURLSchema = z.string()

export const currencySchema = z.enum(currencies)

export const transactionTypeSchema = z.array(z.enum(transactionTypeOptions))

export const telSchema = (
  isValidPhoneNumber: (text: string) => boolean,
  message = ''
) =>
  textSchema.refine(isValidPhoneNumber, {
    message
  })

export const toEmail = (x: string | null) => (x ? (x as Email) : null)

export const toTel = (x: string | null) => (x ? (x as Tel) : null)
