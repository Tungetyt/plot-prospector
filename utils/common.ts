import {z} from 'zod'
import {Email} from '@/utils/types'

export const isNumeric = (input: number | string): input is number =>
  typeof input === 'number'

export const isEmail = (input: string | null | undefined): input is Email =>
  z.string().email().safeParse(input).success
