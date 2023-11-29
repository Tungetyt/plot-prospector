'use server'

import {z, ZodError, ZodType} from 'zod'
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
import {latSchema} from '@/features/PlotCreationController/PlotInfoForm/polygonArea/polygonArea'

type Data = {
  description: string | null
  address: string | null
  price: {
    value: number | null
    currency: 'PLN' | 'EUR' | 'USD' | 'GBP' | 'Other'
  }
  transactionType: ('buy' | 'sell' | 'lease')[]
  email: `${string}@${string}.${string}` | null
  tel: `+${number}` | null
  pictures: string[]
  draftPlot: {id: string; lat: number; lng: number}[]
}
// TODO: This should come from Prisma types!

class PlotInfo implements Data {
  private readonly _description: Data['description']

  private readonly _address: Data['address']

  private readonly _price: Data['price']

  private readonly _transactionType: Data['transactionType']

  private readonly _email: Data['email']

  private readonly _tel: Data['tel']

  private readonly _pictures: Data['pictures']

  private readonly _draftPlot: Data['draftPlot'] // TODO: To separate class

  constructor(private readonly data: Data) {
    PlotInfo.validate(data)

    const {
      description,
      tel,
      address,
      pictures,
      email,
      price,
      draftPlot,
      transactionType
    } = data

    this._description = description
    this._tel = tel
    this._address = address
    this._pictures = pictures
    this._email = email
    this._price = price
    this._draftPlot = PlotInfo.draftPlotWithRegeneratedIds(draftPlot)
    this._transactionType = transactionType
  }

  private static draftPlotWithRegeneratedIds(draftPlot: Data['draftPlot']) {
    return draftPlot.map(x => ({
      ...x,
      id: crypto.randomUUID()
    }))
  }

  private static validate(data: Data) {
    const schema: ZodType<Data, z.ZodTypeDef, unknown> = z.strictObject({
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

    schema.parse(data)
  }

  get description(): Data['description'] {
    return this._description
  }

  get address(): Data['address'] {
    return this._address
  }

  get price(): Data['price'] {
    return this._price
  }

  get transactionType(): Data['transactionType'] {
    return this._transactionType
  }

  get email(): Data['email'] {
    return this._email
  }

  get tel(): Data['tel'] {
    return this._tel
  }

  get pictures(): Data['pictures'] {
    return this._pictures
  }

  get draftPlot(): Data['draftPlot'] {
    return this._draftPlot
  }
}

const plotInfoAction = async (data: Data) => {
  try {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const plotInfo = new PlotInfo(data)

    return 201
  } catch (err) {
    if (err instanceof ZodError) return 400
    return 500
  }
}

export default plotInfoAction
