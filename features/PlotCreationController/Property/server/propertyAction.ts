'use server'

import {ZodError} from 'zod'
// import prisma from "@/prismaClient";
import {
  Data,
  Property
} from '@/features/PlotCreationController/Property/server/Property/Property'

const propertyAction = async (data: Data) => {
  try {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const property = new Property(data)
    // prisma.property
    return 201
  } catch (err) {
    if (err instanceof ZodError) return 400
    return 500
  }
}

export default propertyAction
