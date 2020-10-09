export const stopEvents = <T extends React.SyntheticEvent>(e?: T) => {
  e?.preventDefault?.()
  e?.stopPropagation?.()
  return true // Makes this chainable e.g. `stopEvents(e) && foo()`
}
