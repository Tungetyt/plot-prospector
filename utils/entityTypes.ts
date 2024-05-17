import {Property as PrismaProperty, Point as PrismaPoint} from '@prisma/client'
import {ReadonlyDeep, Simplify} from 'type-fest'

export type WithOptionalId<T extends {id: string}> = Omit<T, 'id'> & {
  id?: T['id']
}

export type PointEntity = Simplify<Omit<PrismaPoint, 'propertyId'>>

export type PropertyEntity = Simplify<
  ReadonlyDeep<
    Omit<PrismaProperty, 'userId'> & {
      plot: ReadonlyArray<PointEntity>
    }
  >
>
