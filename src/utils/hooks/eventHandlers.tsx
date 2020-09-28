/**
 * This handler automatically calls preventDefault() and stopPropagation() for you
 * and wraps your method in useCallback
 *
 * Use this instead of writing e.preventDefault() everywhere
 *
 * @param method
 * @param eventType
 */
export const stopEvents: TStopEvents = (method, eventType) => {
  return e => {
    e?.preventDefault?.()
    e?.stopPropagation?.()
    console.log('What up, EVENTS!', eventType, e)
    return method(e)
  }
}

interface IEvents {
  mouse: React.MouseEvent
  key: React.KeyboardEvent<HTMLInputElement>
  input: React.ChangeEvent<HTMLInputElement>
}

type TEvent<EventType extends keyof IEvents, Res> = (e?: IEvents[EventType]) => Res

type TStopEvents = <M extends TEvent<S, ReturnType<M>>, S extends keyof IEvents>(
  method: M,
  eventType: S
) => (e?: IEvents[S]) => ReturnType<M>
// ) => TEvent<S, ReturnType<M>>
