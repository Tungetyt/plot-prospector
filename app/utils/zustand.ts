export const storeActionsSelector = <
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  T extends { actions: Record<string, (...args: any) => void> },
>({
  actions,
}: T): T['actions'] => actions
