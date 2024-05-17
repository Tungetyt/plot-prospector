'use server'

import {ZodError} from 'zod'
import Property from '@/entities/Property/Property'
import {StatusCodes} from 'http-status-codes'
import PropertyService from '@/entities/Property/PropertyService'
import {PropertyAction} from '@/entities/Property/common/types'
import pino from 'pino'

abstract class PropertyController {
  public static async propertyAction(data: PropertyAction) {
    try {
      const property = Property.instanceFromActionObject(data)

      await PropertyService.saveProperty(property)

      return StatusCodes.CREATED
    } catch (err) {
      if (err instanceof ZodError) return StatusCodes.BAD_REQUEST
      throw new Error(StatusCodes.INTERNAL_SERVER_ERROR.toString())
    }
  }
}
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function propertyAction(data: PropertyAction) {
  try {
    const property = Property.instanceFromActionObject(data)

    await PropertyService.saveProperty(property)

    return StatusCodes.CREATED
  } catch (err) {
    pino().error(err)

    if (err instanceof ZodError) return StatusCodes.BAD_REQUEST

    throw new Error(StatusCodes.INTERNAL_SERVER_ERROR.toString())
  }
}

export default PropertyController
