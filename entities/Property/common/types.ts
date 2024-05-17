import {PropertyFormSchema} from '@/features/PlotCreationController/Property/propertyFormDTOSchema/propertyFormSchema'
import {PropertyEntity} from '@/utils/entityTypes'
import {Simplify} from 'type-fest'

type PicturesKey = keyof Pick<PropertyFormSchema, 'pictures'>
type DataURL = ReadonlyArray<PropertyFormSchema['pictures'][number]['dataURL']>
export type PropertyAction = Simplify<
  Simplify<
    Simplify<Omit<PropertyFormSchema, 'pictures'>> &
      Simplify<Record<PicturesKey, DataURL>>
  > &
    Simplify<Pick<PropertyEntity, 'plot'>>
>
