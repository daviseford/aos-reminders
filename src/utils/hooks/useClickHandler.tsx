import { useCallback } from 'react'

type TGenericFn = (e?: React.MouseEvent) => any
type TClickHandler = <Method extends TGenericFn>(method: Method, dependencies?: any[]) => TGenericFn

/**
 * This handler automatically calls preventDefault() and stopPropagation() for you
 * and wraps your method in useCallback
 *
 * Use this instead of writing e.preventDefault() everywhere
 * @param method
 */
const useClickHandler: TClickHandler = (method, dependencies = []) => {
  console.log('asadasdsad')
  return useCallback(
    e => {
      e?.preventDefault?.()
      e?.stopPropagation?.()
      console.log('What up, clicked!')
      return method(e)
    },
    [method]
  )
}

export default useClickHandler
