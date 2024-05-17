import prisma from '@/prismaClient'
import {Email} from '@/utils/types'

abstract class UserRepository {
  public static async userIdByEmail(email: Email) {
    const {id} = await prisma.user.findUniqueOrThrow({
      where: {email},
      select: {
        id: true
      }
    })

    return id
  }
}

export default UserRepository
