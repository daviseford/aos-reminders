import { deserializeAos4ArmyDocument, type Aos4ArmyDocument } from '../aos4/state'

export interface RemoteArmy {
  id: string
  createdAt: number
  updatedAt: number
  document: Aos4ArmyDocument
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
  // The catch is not currently reachable: Home imports the catalog statically, so the module is
  // always in the registry before any cloud call runs. It becomes live once Home loads the catalog
  // lazily (#1845), at which point this is a real network fetch that can fail on a rotated hash or a
  // cold cache offline — and an unwrapped module-loading error would reach messageForError as
  // "Failed to fetch dynamically imported module ...". Same message and default status as the fetch
  // failure above, because to a caller it is the same class of outage.
  let generated: typeof import('../aos4/generated')
  try {
    generated = await import('../aos4/generated')
  } catch {
    throw new ArmyApiError('Cloud armies are temporarily unavailable.')
  }
  const restored = deserializeAos4ArmyDocument(JSON.stringify(value), generated.AOS4_CATALOG)
  if (!restored.document || restored.diagnostics.some(diagnostic => diagnostic.severity === 'error')) {
    throw new ArmyApiError('The service returned an incompatible army document.', 502)
  }
  return restored.document
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
      return Promise.all(value.map(army => parseRemoteArmy(army)))
    },
    async createArmy(document: Aos4ArmyDocument, token: string): Promise<RemoteArmy> {
      return parseRemoteArmy(
        await request(
          '/items',
          {
            method: 'POST',
            body: JSON.stringify({ document }),
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
          body: JSON.stringify({ document }),
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
          body: JSON.stringify({ document }),
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
