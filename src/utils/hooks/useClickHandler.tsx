type TGenericFn = (e?: React.MouseEvent) => any
type TClickHandler = <Method extends TGenericFn>(
  method: Method
) => (e?: React.MouseEvent) => ReturnType<Method>

/**
 * This handler automatically calls preventDefault() and stopPropagation() for you
 * and wraps your method in useCallback
 *
 * Use this instead of writing e.preventDefault() everywhere
 * @param method
 */
const clickEvtHandler: TClickHandler = method => {
  return e => {
    e?.preventDefault?.()
    e?.stopPropagation?.()
    console.log('What up, clicked!')
    return method(e)
  }
}

export default clickEvtHandler
