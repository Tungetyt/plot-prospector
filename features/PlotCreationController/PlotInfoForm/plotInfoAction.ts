'use server'

import {z} from 'zod'
import {isValidPhoneNumber} from 'libphonenumber-js'
import {ReadonlyDeep} from 'type-fest'

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
import {latSchema} from '@/features/PlotCreationController/PlotInfoForm/polygonArea/polygonArea'

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
  pictures: z.array(dataURLSchema),
  draftPlot: z.array(
    z.strictObject({
      id: z.string().uuid(),
      lat: latSchema,
      lng: z.number()
    })
  )
})

type Data = ReadonlyDeep<z.infer<typeof schema>>

const plotInfoAction = async (data: Data) => {
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
