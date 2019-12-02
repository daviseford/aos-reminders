export const mapTwoListsToDict = (keys: string[], vals: (boolean | undefined)[]) => {
  return keys.reduce((a, b, i) => {
    a[b] = vals[i]
    return a
  }, {})
}
