export const isNumeric = (input: number | string): input is number =>
  typeof input === 'number'

export const body = document.getElementsByTagName('body')[0]

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
