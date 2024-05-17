import {isEmail} from '@/utils/common'
import UserDAO from '@/entities/User/UserRepository'
import {getServerSession} from 'next-auth'
import {StatusCodes} from 'http-status-codes'
import pino from 'pino'

abstract class UserService {
  public static async getUserId() {
    const session = await getServerSession()
    const email = session?.user?.email

    if (!isEmail(email)) {
      pino().error('Unexpected Error! Email validation failed.')

      throw new Error(StatusCodes.INTERNAL_SERVER_ERROR.toString())
    }

    return UserDAO.userIdByEmail(email)
  }
}

export default UserService
