import prisma from '@/prismaClient'
import Property from '@/entities/Property/Property'

abstract class PropertyRepository {
  public static async saveProperty(property: Property, userId: string) {
    console.log('AAAAAAAAAAAAAAAAAAAAAAAAAAAAa\n\n\n\n\n\n', property)
    console.log('BBBBBBBBBBBBBBBBBBBBBBBBBBBBBB\n\n\n\n\n\n', {...property})
    console.log('CCCCCCCCCCCCCCCCCCCCCCCCCCCC\n\n\n\n\n\n', {
      ...property,
      plot: property.plot.map(x => ({...x}))
    })

    await prisma.property.create({
      data: {
        ...property,
        userId
      }
    })
  }
}

export default PropertyRepository
