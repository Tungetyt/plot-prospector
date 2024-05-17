import {z, ZodType} from 'zod'
import {isValidPhoneNumber} from 'libphonenumber-js/min'
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
import {PropertyEntity, WithOptionalId} from '@/utils/entityTypes'
import Point from '@/entities/Point/Point'

import {PropertyAction} from '@/entities/Property/common/types'

// Use the below pattern, to get rid of the issue about the inconvinece of changing plain objs to class instances and vice versa.
// Or maybe not, actually, the creation of the instance is the same lvl of tedious. Only accessing seems eaiser. toObject may help in that regard
// const PropertyA = (data: WithOptionalId<PropertyEntity>) => {
//     const _description: PropertyEntity['description'] = data.description
//
//     const description = () => _description
//
//     return {
//         description
//     }
// }

function hasToObjectMethod<T>(obj: any): obj is T & {toObject: () => object} {
  return obj && typeof obj.toObject === 'function'
}

interface Serializable {
  toObject(): Record<string, any>
}

function toObject(instance: object): Record<string, any> {
  const plainObject: Record<string, any> = {}

  Object.getOwnPropertyNames(instance)
    .filter(prop => prop.startsWith('_')) // Assuming private properties start with '_'
    .forEach(prop => {
      const key = prop.substring(1) // Remove '_' prefix
      const value = (instance as any)[prop]

      if (Array.isArray(value)) {
        plainObject[key] = value.map(item =>
          hasToObjectMethod(item) ? item.toObject() : item
        )
      } else if (hasToObjectMethod(value)) {
        plainObject[key] = value.toObject()
      } else {
        plainObject[key] = value
      }
    })

  return plainObject
}

class Property {
  // implements PropertyEntity, Serializable
  private readonly _id: PropertyEntity['id']

  private readonly _description: PropertyEntity['description']

  private readonly _address: PropertyEntity['address']

  private readonly _tel: PropertyEntity['tel']

  private readonly _email: PropertyEntity['email']

  private readonly _price: PropertyEntity['price']

  private readonly _priceCurrency: PropertyEntity['priceCurrency']

  private readonly _transactionType: PropertyEntity['transactionType']

  private readonly _pictures: PropertyEntity['pictures']

  private readonly _plot: PropertyEntity['plot']

  constructor(private readonly data: WithOptionalId<PropertyEntity>) {
    const {
      id,
      description,
      tel,
      address,
      pictures,
      email,
      price,
      priceCurrency,
      plot,
      transactionType
    } = Property.validate(data)

    this._id = id
    this._description = description
    this._tel = tel
    this._address = address
    this._pictures = pictures
    this._email = email
    this._price = price
    this._priceCurrency = priceCurrency
    this._transactionType = transactionType
    // this._plot = Property.omitPointsIds(plot)
    this._plot = plot
  }

  public construct() {}

  private static omitPointsIds(plot: PropertyEntity['plot']) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    return plot.map(({id, ...rest}) => new Point({...rest}))
  }

  private static validate(data: WithOptionalId<PropertyEntity>) {
    const schema: ZodType<PropertyEntity, z.ZodTypeDef, unknown> =
      z.strictObject({
        id: z.string().uuid().default(crypto.randomUUID()),
        description: textSchema.nullable(),
        address: textSchema.nullable(),
        price: z
          .number()
          .positive()
          .finite()
          .max(oneTrillion)
          .refine(hasTwoDecimalPlaces)
          .nullable(),
        priceCurrency: currencySchema,
        transactionType: transactionTypeSchema,
        email: emailSchema().nullable().transform(toEmail),
        tel: telSchema(isValidPhoneNumber).nullable().transform(toTel),
        pictures: z.array(dataURLSchema),
        plot: z.array(Point.schema())
      })

    return schema.parse(data)
  }

  public static instanceFromActionObject({
    price: {value: price, currency: priceCurrency},
    ...rest
  }: PropertyAction): Property {
    return new Property({
      ...rest,
      price,
      priceCurrency
    })
  }

  get id() {
    return this._id
  }

  get description() {
    return this._description
  }

  get address() {
    return this._address
  }

  get price() {
    return this._price
  }

  get priceCurrency() {
    return this._priceCurrency
  }

  get transactionType() {
    return this._transactionType
  }

  get email() {
    return this._email
  }

  get tel() {
    return this._tel
  }

  get pictures() {
    return this._pictures
  }

  get plot() {
    return this._plot
  }
}

export default Property
