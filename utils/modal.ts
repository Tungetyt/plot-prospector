export const showModal = <T extends string>(dialogId: T) => {
  ;(
    window as Window &
      typeof globalThis & {
        [K in T]: {
          showModal: () => void
        }
      }
  )[dialogId].showModal()
}

export const closeModal = <T extends string>(dialogId: T) => {
  ;(
    window as Window &
      typeof globalThis & {
        [K in T]: {
          close: () => void
        }
      }
  )[dialogId].close()
}
