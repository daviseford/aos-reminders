import { clearCloudArmyLink, readCloudArmyLink, writeCloudArmyLink } from 'utils/cloudArmyLink'
import { describe, expect, it } from 'vitest'

const createStorage = (initial: Record<string, string> = {}) => {
  const values = new Map(Object.entries(initial))
  return {
    getItem: (key: string) => values.get(key) ?? null,
    setItem: (key: string, value: string) => void values.set(key, value),
    removeItem: (key: string) => void values.delete(key),
    entries: () => Object.fromEntries(values),
  }
}

const throwingStorage = {
  getItem: () => {
    throw new Error('storage disabled')
  },
  setItem: () => {
    throw new Error('storage disabled')
  },
  removeItem: () => {
    throw new Error('storage disabled')
  },
}

describe('cloud army link', () => {
  it('survives a reload, which is the whole point of writing it down', () => {
    const storage = createStorage()
    writeCloudArmyLink({ id: 'cloud-1', name: 'Kruleboyz Tourney' }, storage)

    // A second read models the next page load: the document comes back from storage, and so must
    // the record it is a copy of. In memory alone, every refresh forked a duplicate on the next save.
    expect(readCloudArmyLink(storage)).toEqual({ id: 'cloud-1', name: 'Kruleboyz Tourney' })
  })

  it('reads nothing when no link was written', () => {
    expect(readCloudArmyLink(createStorage())).toBeUndefined()
  })

  it('clears the link so an unlinked document never claims a cloud army', () => {
    const storage = createStorage()
    writeCloudArmyLink({ id: 'cloud-1', name: 'Kruleboyz Tourney' }, storage)
    clearCloudArmyLink(storage)

    expect(readCloudArmyLink(storage)).toBeUndefined()
    expect(storage.entries()).toEqual({})
  })

  it('ignores stored values that are not a link rather than trusting a partial one', () => {
    const key = 'aos-reminders:aos4:cloud-army-link:v1'
    expect(readCloudArmyLink(createStorage({ [key]: 'not json' }))).toBeUndefined()
    expect(readCloudArmyLink(createStorage({ [key]: '{"name":"No id"}' }))).toBeUndefined()
    expect(readCloudArmyLink(createStorage({ [key]: '{"id":"","name":"Empty id"}' }))).toBeUndefined()
    expect(readCloudArmyLink(createStorage({ [key]: '{"id":"cloud-1"}' }))).toBeUndefined()
  })

  it('stays quiet when browser storage is unavailable, as it is in some privacy modes', () => {
    expect(() => writeCloudArmyLink({ id: 'cloud-1', name: 'Any' }, throwingStorage)).not.toThrow()
    expect(() => clearCloudArmyLink(throwingStorage)).not.toThrow()
    expect(readCloudArmyLink(throwingStorage)).toBeUndefined()
  })
})
