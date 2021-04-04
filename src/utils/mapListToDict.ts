export const mapListToDict = (names: string[]) => {
  return names.reduce((a, b) => {
    a[b] = b
    return a
  }, {} as Record<string, string>)
}
