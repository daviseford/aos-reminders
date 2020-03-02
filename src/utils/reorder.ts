interface WithId {
  id: string
}

export const reorderViaIndex = <T extends WithId>(list: T[], ids: string[]) => {
  return ids.reduce((a, id) => {
    const entry = list.find(l => l.id && l.id === id)
    if (entry) a.push(entry)
    return a
  }, [] as any[])
}

// Used for drag and drop by react-beautful-dnd
export const reorder = <T>(list: T[], startIndex: number, endIndex: number) => {
  const result = Array.from(list)
  const [removed] = result.splice(startIndex, 1)
  result.splice(endIndex, 0, removed)

  return result
}
