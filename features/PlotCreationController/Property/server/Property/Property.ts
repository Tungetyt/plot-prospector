import {ZodType, z} from 'zod'
import {isValidPhoneNumber} from 'libphonenumber-js/min'
import {ReadonlyDeep} from 'type-fest'
import {
  DraftPoint,
  DraftPointType
} from '@/features/PlotCreationController/Property/server/Property/DraftPoint'
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

export type Data = ReadonlyDeep<{
  description: string | null
  address: string | null
  price: {
    value: number | null
    currency: 'PLN' | 'EUR' | 'USD' | 'GBP' | 'Other'
  }
  transactionType: Array<'buy' | 'sell' | 'lease'>
  email: `${string}@${string}.${string}` | null
  tel: `+${number}` | null
  pictures: string[]
  draftPlot: Array<DraftPointType>
}>
// TODO: This should come from Prisma types!

export class Property implements Data {
  private readonly _description: Data['description']

  private readonly _address: Data['address']

  private readonly _price: Data['price']

  private readonly _transactionType: Data['transactionType']

  private readonly _email: Data['email']

  private readonly _tel: Data['tel']

  private readonly _pictures: Data['pictures']

  private readonly _draftPlot: Data['draftPlot']

  constructor(private readonly data: Data) {
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

    this._draftPlot = draftPlot.map(x => new DraftPoint(x))

    Property.validate(data)

    this._description = description
    this._tel = tel
    this._address = address
    this._pictures = pictures
    this._email = email
    this._price = price
    this._transactionType = transactionType
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
      draftPlot: z.array(DraftPoint.schema())
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
