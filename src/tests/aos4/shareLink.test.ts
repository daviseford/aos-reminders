// @vitest-environment jsdom

import { capturePendingShareId, consumePendingShareId } from 'utils/shareLink'
import { describe, expect, it, vi } from 'vitest'

describe('public share-link handoff', () => {
  it('captures and removes the opaque token while preserving other query state', () => {
    const values = new Map<string, string>()
    const storage = {
      getItem: (key: string) => values.get(key) ?? null,
      removeItem: (key: string) => values.delete(key),
      setItem: (key: string, value: string) => values.set(key, value),
    }
    const history = { replaceState: vi.fn() }
    const shareId = 'abcdefghijklmnopqrstuvwx'

    expect(
      capturePendingShareId(
        {
          href: `https://aosreminders.com/?army=${shareId}&subscribed=true#top`,
          pathname: '/',
          search: `?army=${shareId}&subscribed=true`,
          hash: '#top',
        },
        history,
        storage
      )
    ).toBe(shareId)
    expect(history.replaceState).toHaveBeenCalledWith({}, document.title, '/?subscribed=true#top')
    expect(consumePendingShareId(storage)).toBe(shareId)
    expect(consumePendingShareId(storage)).toBeUndefined()
  })

  it('removes malformed tokens without storing or fetching them', () => {
    const storage = { setItem: vi.fn() }
    const history = { replaceState: vi.fn() }
    expect(
      capturePendingShareId(
        {
          href: 'https://aosreminders.com/?army=not-valid',
          pathname: '/',
          search: '?army=not-valid',
          hash: '',
        },
        history,
        storage
      )
    ).toBeUndefined()
    expect(history.replaceState).toHaveBeenCalledWith({}, document.title, '/')
    expect(storage.setItem).not.toHaveBeenCalled()
  })
})
