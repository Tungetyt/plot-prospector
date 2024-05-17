import {PointEntity, WithOptionalId} from '@/utils/entityTypes'
import {latSchema} from '@/features/PlotCreationController/Property/polygonArea/polygonArea'
import {z, ZodType} from 'zod'

class Point implements PointEntity {
  private readonly _id: PointEntity['id']

  private readonly _lat: PointEntity['lat']

  private readonly _lng: PointEntity['lng']

  constructor(private readonly data: WithOptionalId<PointEntity>) {
    const {id, lat, lng} = Point.validate(data)
    this._id = id
    this._lat = lat
    this._lng = lng
  }

  public static schema() {
    const schema: ZodType<PointEntity, z.ZodTypeDef, unknown> = z.strictObject({
      id: z.string().uuid().default(crypto.randomUUID()),
      lat: latSchema,
      lng: z.number()
    })

    return schema
  }

  private static validate(data: WithOptionalId<PointEntity>) {
    return Point.schema().parse(data)
  }

  get id() {
    return this._id
  }

  get lat() {
    return this._lat
  }

  get lng() {
    return this._lng
  }
}

export default Point
