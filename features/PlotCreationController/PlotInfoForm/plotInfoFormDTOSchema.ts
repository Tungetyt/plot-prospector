import { currencies } from '@/features/PlotCreationController/PlotInfoForm/sortedCurrencies'
import { Email, Tel } from '@/utils/types'
import { isValidPhoneNumber } from 'react-phone-number-input'
import { z } from 'zod'

const hasTwoDecimalPlaces = (num: number) => {
  const numStr = num.toString()
  const decimalIndex = numStr.indexOf('.')
  if (decimalIndex === -1) return true // No decimal places
  return numStr.slice(decimalIndex + 1).length <= 2
}

const plotInfoFormDTOSchema = z.strictObject({
  description: z.string().trim(),
  address: z.string().trim(),
  price: z.strictObject({
    value: z.coerce.number().positive().refine(hasTwoDecimalPlaces, {
      message: 'Value must have at most 2 digits after the decimal point',
    }),
    currency: z.enum(currencies),
  }),
  email: z
    .string()
    .trim()
    .email()
    .transform((x) => x as Email),
  tel: z
    .string()
    .trim()
    .refine(isValidPhoneNumber)
    .transform((x) => x as Tel),
})

export default plotInfoFormDTOSchema
