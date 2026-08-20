/**
 * An in-memory `Storage` implementation for tests that stand in `window.localStorage`.
 *
 * jsdom's real `localStorage` persists across tests run in the same worker, so a suite that reads
 * `theme` or a saved army in a `beforeEach` needs a fresh store per test rather than jsdom's shared
 * one. Seven Home test suites carried an identical copy of this class before it moved here; see
 * `reactTestHelpers.ts` for the same precedent applied to the React 19 render helpers.
 */
export class MemoryStorage implements Storage {
  private readonly values = new Map<string, string>()

  get length() {
    return this.values.size
  }

  clear() {
    this.values.clear()
  }

  getItem(key: string) {
    return this.values.get(key) ?? null
  }

  key(index: number) {
    return Array.from(this.values.keys())[index] ?? null
  }

  removeItem(key: string) {
    this.values.delete(key)
  }

  setItem(key: string, value: string) {
    this.values.set(key, value)
  }
}
