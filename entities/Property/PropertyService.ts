import Property from '@/entities/Property/Property'
import PropertyRepository from '@/entities/Property/PropertyRepository'
import UserService from '@/entities/User/UserService'

abstract class PropertyService {
  public static async saveProperty(property: Property) {
    const userId = await UserService.getUserId()

    await PropertyRepository.saveProperty(property, userId)
  }
}

export default PropertyService
