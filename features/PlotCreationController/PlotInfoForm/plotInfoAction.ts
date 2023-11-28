'use server'

import {z} from 'zod'
import {isValidPhoneNumber} from 'libphonenumber-js'

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

const schema = z.strictObject({
  description: textSchema.nullable(),
  address: textSchema.nullable(),
  price: z.strictObject({
    value: z
      .number()
      .positive()
      .finite()
      .max(oneTrillion)
      .refine(hasTwoDecimalPlaces)
      .nullable(),
    currency: currencySchema
  }),
  transactionType: transactionTypeSchema,
  email: emailSchema().nullable().transform(toEmail),
  tel: telSchema(isValidPhoneNumber).nullable().transform(toTel),
  pictures: z.array(dataURLSchema)
})

type Schema = z.infer<typeof schema>

const plotInfoAction = async (data: Schema) => {
  try {
    const validationResult = schema.safeParse(data)
    if (!validationResult.success) return 400

    return 201
  } catch {
    return 500
  }
}

export default plotInfoAction

// TODO: common / common, validation
