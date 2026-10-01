import { deriveAos4OverlayFlags } from '../aos4/runtime/armyStorage'
import type { RulesContextId } from '../aos4/domain'
import {
  deserializeAos4ArmyDocument,
  deserializeAos4ArmyDocumentStructure,
  toWireAos4ArmyDocument,
  unknownAos4RulesContextId,
  type Aos4ArmyDocument,
} from '../aos4/state'

export interface RemoteArmy {
  id: string
  createdAt: number
  updatedAt: number
  document: Aos4ArmyDocument
  /**
   * Set when the army uses a ruleset this release does not carry, which is what an army saved by a
   * newer release looks like (#2055). `document` is then read structurally only: it names the army
   * but cannot be loaded, and writing anything back over it would destroy what this release cannot
   * read. The record itself is untouched on the account.
   */
  requiresUpdate?: { rulesContextId: RulesContextId }
}

export interface SharedArmy {
  id: string
  createdAt: number
  document: Aos4ArmyDocument
}

export interface CreatedShare extends SharedArmy {
  url: string
}

export class ArmyApiError extends Error {
  readonly status: number

  constructor(message: string, status = 0) {
    super(message)
    this.name = 'ArmyApiError'
    this.status = status
  }
}

/**
 * The document is well formed but uses a ruleset this release does not know, so the fix is an app
 * update rather than anything wrong with the army or the service (#2055).
 */
export class ArmyRequiresUpdateError extends ArmyApiError {
  readonly rulesContextId: RulesContextId

  constructor(message: string, rulesContextId: RulesContextId) {
    super(message)
    this.name = 'ArmyRequiresUpdateError'
    this.rulesContextId = rulesContextId
  }
}

type Fetcher = typeof fetch

const configuredEndpoint = (import.meta.env.VITE_ARMY_API_URL || '').replace(/\/+$/, '')

/*
 * Structural validation only. A stored army can hold a selection that no longer resolves in its
 * rules context — a catalog update superseding an enhancement table does this to every army that
 * picked from the replaced table — and the builder already tolerates such picks by ignoring them.
 * Rejecting them here instead bricked saving and, worse, one stale army poisoned the whole cloud
 * list. So a well-formed document always parses; selection resolution is the builder's concern.
 */
const parseDocument = async (value: unknown): Promise<Aos4ArmyDocument> => {
  // The catalog is loaded here rather than imported: every caller is already behind a network round
  // trip, and a static import would put the whole corpus in the graph of anything holding a cloud
  // army — the shell included, since the collection provider wraps the page.
  //
  // Every call site sits under HomeCatalogBound, which statically imports the catalog, so the module
  // is in the registry before any cloud call runs and the catch normally never fires. It stays
  // because the registry is only primed when the catalog chunk itself loaded: a first visit whose
  // cached chunk went stale, or a future caller outside that subtree, makes this a real network
  // fetch that can fail on a rotated hash or a cold cache offline — and an unwrapped module-loading
  // error would reach messageForError as "Failed to fetch dynamically imported module ...". Same
  // message and default status as the fetch failure above, because to a caller it is the same class
  // of outage.
  let generated: typeof import('../aos4/generated')
  try {
    generated = await import('../aos4/generated')
  } catch (error) {
    // Logged before wrapping, because the wrapped message erases the one distinction that matters
    // when this fires: a network failure and an eval-time defect in the catalog chunk both land
    // here, and only the console can tell them apart. "Temporarily" is also browser-dependent — a
    // module map that cached the rejection re-throws without refetching until a reload; see
    // aos4/generated/corpus/sources for the same caveat on the sources chunk.
    console.error(error)
    throw new ArmyApiError('Cloud armies are temporarily unavailable.')
  }
  const restored = deserializeAos4ArmyDocument(JSON.stringify(value), generated.AOS4_CATALOG)
  const unknownRulesContextId = restored.document
    ? undefined
    : unknownAos4RulesContextId(restored.diagnostics)
  if (unknownRulesContextId) {
    throw new ArmyRequiresUpdateError(
      'This army uses rules that this version of AoS Reminders does not have yet. Refresh the page to update, then try again.',
      unknownRulesContextId
    )
  }
  if (!restored.document || restored.diagnostics.some(diagnostic => diagnostic.severity === 'error')) {
    throw new ArmyApiError('The service returned an incompatible army document.', 502)
  }
  // Saved and shared armies predate later rules updates, so a selection that has since moved into
  // an overlay context needs its flag re-derived, exactly as a locally stored army does (#1757).
  return deriveAos4OverlayFlags(generated.AOS4_CATALOG, restored.document)
}

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value)

const numberField = (value: unknown, key: string): number => {
  if (!isRecord(value) || typeof value[key] !== 'number') {
    throw new ArmyApiError('The service returned an invalid army response.', 502)
  }
  return value[key] as number
}

const stringField = (value: unknown, key: string): string => {
  if (!isRecord(value) || typeof value[key] !== 'string' || !value[key]) {
    throw new ArmyApiError('The service returned an invalid army response.', 502)
  }
  return value[key] as string
}

const parseRemoteArmy = async (value: unknown): Promise<RemoteArmy> => {
  if (!isRecord(value)) throw new ArmyApiError('The service returned an invalid army response.', 502)
  return {
    id: stringField(value, 'id'),
    createdAt: numberField(value, 'createdAt'),
    updatedAt: numberField(value, 'updatedAt'),
    document: await parseDocument(value.document),
  }
}

/*
 * One army this release cannot read must not cost the player the rest of their list, which is what
 * a throw here used to do. An unknown ruleset is kept as a marked, read-only row instead; anything
 * else wrong with a record is still a broken response and still fails the list.
 */
const parseListedArmy = async (value: unknown): Promise<RemoteArmy> => {
  try {
    return await parseRemoteArmy(value)
  } catch (error) {
    if (!(error instanceof ArmyRequiresUpdateError) || !isRecord(value)) throw error
    const structural = deserializeAos4ArmyDocumentStructure(JSON.stringify(value.document)).document
    if (!structural) throw error
    return {
      id: stringField(value, 'id'),
      createdAt: numberField(value, 'createdAt'),
      updatedAt: numberField(value, 'updatedAt'),
      document: structural,
      requiresUpdate: { rulesContextId: error.rulesContextId },
    }
  }
}

const parseSharedArmy = async (value: unknown): Promise<SharedArmy> => {
  if (!isRecord(value)) throw new ArmyApiError('The service returned an invalid share response.', 502)
  return {
    id: stringField(value, 'id'),
    createdAt: numberField(value, 'createdAt'),
    document: await parseDocument(value.document),
  }
}

const responseMessage = async (response: Response): Promise<string> => {
  try {
    const value = await response.json()
    return typeof value === 'string' ? value : 'The army service could not complete the request.'
  } catch {
    return 'The army service could not complete the request.'
  }
}

export const createArmyApi = (endpoint: string, fetcher: Fetcher = fetch) => {
  const baseUrl = endpoint.replace(/\/+$/, '')

  const request = async (path: string, options: RequestInit = {}, token?: string): Promise<unknown> => {
    if (!baseUrl) throw new ArmyApiError('Cloud armies are not configured for this build.', 503)
    const headers = new Headers(options.headers)
    headers.set('Accept', 'application/json')
    if (options.body) headers.set('Content-Type', 'application/json')
    if (token) headers.set('Authorization', `Bearer ${token}`)

    let response: Response
    try {
      response = await fetcher(`${baseUrl}${path}`, {
        ...options,
        headers,
        signal: options.signal ?? AbortSignal.timeout(10_000),
      })
    } catch {
      throw new ArmyApiError('Cloud armies are temporarily unavailable.')
    }
    if (!response.ok) throw new ArmyApiError(await responseMessage(response), response.status)
    return response.json()
  }

  return {
    isConfigured: Boolean(baseUrl),
    async listArmies(token: string): Promise<RemoteArmy[]> {
      const value = await request('/items', {}, token)
      if (!Array.isArray(value)) throw new ArmyApiError('The service returned an invalid army list.', 502)
      return Promise.all(value.map(army => parseListedArmy(army)))
    },
    async createArmy(document: Aos4ArmyDocument, token: string): Promise<RemoteArmy> {
      return parseRemoteArmy(
        await request(
          '/items',
          {
            method: 'POST',
            body: JSON.stringify({ document: toWireAos4ArmyDocument(document) }),
          },
          token
        )
      )
    },
    async updateArmy(id: string, document: Aos4ArmyDocument, token: string): Promise<RemoteArmy> {
      const value = await request(
        `/items/${encodeURIComponent(id)}`,
        {
          method: 'PATCH',
          body: JSON.stringify({ document: toWireAos4ArmyDocument(document) }),
        },
        token
      )
      if (!isRecord(value)) throw new ArmyApiError('The service returned an invalid army response.', 502)
      return {
        id: stringField(value, 'id'),
        createdAt: 0,
        updatedAt: numberField(value, 'updatedAt'),
        document: await parseDocument(value.document),
      }
    },
    async deleteArmy(id: string, token: string): Promise<void> {
      await request(`/items/${encodeURIComponent(id)}`, { method: 'DELETE' }, token)
    },
    async createShare(document: Aos4ArmyDocument, token: string): Promise<CreatedShare> {
      const value = await request(
        '/links',
        {
          method: 'POST',
          body: JSON.stringify({ document: toWireAos4ArmyDocument(document) }),
        },
        token
      )
      const shared = await parseSharedArmy(value)
      return {
        ...shared,
        url: stringField(value, 'url'),
      }
    },
    async getShare(id: string): Promise<SharedArmy> {
      return parseSharedArmy(await request(`/links/${encodeURIComponent(id)}`))
    },
  }
}

export const ArmyApi = createArmyApi(configuredEndpoint)
