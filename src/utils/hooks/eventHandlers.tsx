type TGenericFn = (e: React.MouseEvent) => any
type TClickHandler = <Method extends TGenericFn>(
  method: Method
) => (e: React.MouseEvent) => ReturnType<Method>

/**
 * This handler automatically calls preventDefault() and stopPropagation() for you
 * and wraps your method in useCallback
 *
 * Use this instead of writing e.preventDefault() everywhere
 * @param method
 */
export const stopClickEvents: TClickHandler = method => {
  console.log('CLICKED')
  return e => {
    e?.preventDefault?.()
    e?.stopPropagation?.()
    console.log('What up, CLICKED!')
    return method(e)
  }
}

type TGenericKeyFn = (e: React.ChangeEvent<HTMLInputElement> | React.KeyboardEvent<HTMLInputElement>) => any
type TStopInputEvents = <Method extends TGenericKeyFn>(
  method: Method
) => (e: React.ChangeEvent<HTMLInputElement>) => ReturnType<Method>

/**
 * This handler automatically calls preventDefault() and stopPropagation() for you
 * and wraps your method in useCallback
 *
 * Use this instead of writing e.preventDefault() everywhere
 * @param method
 */
export const stopInputEvents: TStopInputEvents = method => {
  console.log('INPUT EVENTS')
  return e => {
    e?.preventDefault?.()
    e?.stopPropagation?.()
    console.log('What up, INPUT EVENTS!')
    return method(e)
  }
}

type TGenericGn = (e: any) => any

type A = 'mouse'
type B = 'key'
type C = 'input'

export const stopEvents = <M extends TGenericGn, S = A | B>(method: M, source: S) => {
  console.log('INPUT EVENTS', source)
  // const res = <X extends S extends A ? React.MouseEvent : React.KeyboardEvent>(e: X) => {
  const res = (
    e: S extends A
      ? React.MouseEvent
      : S extends B
      ? React.KeyboardEvent
      : S extends C
      ? React.ChangeEvent<HTMLInputElement>
      : any
  ) => {
    e?.preventDefault?.()
    e?.stopPropagation?.()
    console.log('What up, INPUT EVENTS!', source)
    return method(e)
  }
  return res
}
