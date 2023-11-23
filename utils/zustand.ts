// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyFunction = (...args: any) => void

const storeActionsSelector = <
  T extends {actions: Record<string, AnyFunction>}
>({
  actions
}: T): T['actions'] => actions

export default storeActionsSelector
