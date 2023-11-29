import {latSchema} from '@/features/PlotCreationController/PlotInfoForm/polygonArea/polygonArea'
import {ZodType, z} from 'zod'

export type DraftPointType = Readonly<{id: string; lat: number; lng: number}>
// TODO: This should come from Prisma types!

export class DraftPoint implements DraftPointType {
  private readonly _id: DraftPointType['id']

  private readonly _lat: DraftPointType['lat']

  private readonly _lng: DraftPointType['lng']

  constructor(private readonly data: DraftPointType) {
    DraftPoint.validate(data)

    this._id = crypto.randomUUID()
    this._lat = data.lat
    this._lng = data.lng
  }

  public static schema() {
    const result: ZodType<DraftPointType, z.ZodTypeDef, unknown> =
      z.strictObject({
        id: z.string().uuid(),
        lat: latSchema,
        lng: z.number()
      })

    return result
  }

  private static validate(data: DraftPointType) {
    DraftPoint.schema().parse(data)
  }

  get id(): DraftPointType['id'] {
    return this._id
  }

  get lat(): DraftPointType['lat'] {
    return this._lat
  }

  get lng(): DraftPointType['lng'] {
    return this._lng
  }
}
