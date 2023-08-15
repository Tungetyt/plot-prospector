import { z } from 'zod'
import { Email } from '@/utils/types'

export const isNumeric = (input: number | string): input is number =>
  typeof input === 'number'

export const displayModal = <T extends string>(dialogId: T) => {
  ;(
    window as Window &
      typeof globalThis & {
        [K in T]: {
          showModal: () => void
        }
      }
  )[dialogId].showModal()
}

export const isEmail = (input: string | null | undefined): input is Email =>
  z.string().email().safeParse(input).success
