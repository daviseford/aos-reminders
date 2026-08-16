import { useAuth0 } from '@auth0/auth0-react'
import { ArmyApi, ArmyApiError, type CreatedShare, type RemoteArmy } from '../api/armyApi'
import type { Aos4ArmyDocument } from '../aos4/state'
import React, { useCallback, useMemo, useRef, useState } from 'react'
import { useApiAccessToken } from 'utils/authToken'

/*
 * Exported so a test double can be constrained to it. An untyped hand-rolled double silently
 * returns `undefined` for a member added later, which fails at runtime instead of at compile time.
 */
export interface ArmyCollectionContextValue {
  armies: RemoteArmy[]
  collectionError: string | null
  /**
   * Whether `armies` is a list the account actually returned, rather than the empty array it starts
   * as. An account can legitimately hold no armies, so emptiness cannot stand in for this: a caller
   * that reads absence from the list — "the record I am linked to is gone" — would read the same
   * absence from a list nobody has fetched, and from one whose fetch failed.
   */
  collectionLoaded: boolean
  collectionLoading: boolean
  configured: boolean
  createArmy: (document: Aos4ArmyDocument) => Promise<RemoteArmy>
  createShare: (document: Aos4ArmyDocument) => Promise<CreatedShare>
  deleteArmy: (id: string) => Promise<void>
  /**
   * Load the collection once, for a caller that needs it to answer a question rather than to show
   * it. Unlike `refreshArmies` this is a no-op when the list is already loaded or already asked
   * for, so it can sit in an effect without turning a failed fetch into a retry loop.
   */
  ensureArmiesLoaded: () => Promise<void>
  refreshArmies: () => Promise<void>
  updateArmy: (id: string, document: Aos4ArmyDocument) => Promise<RemoteArmy>
}

const ArmyCollectionContext = React.createContext<ArmyCollectionContextValue | undefined>(undefined)

export const messageForError = (error: unknown): string => {
  if (error instanceof ArmyApiError && error.status === 401) return 'Please log in again to continue.'
  if (error instanceof Error) return error.message
  return 'Cloud armies are temporarily unavailable.'
}

export const ArmyCollectionProvider = ({ children }: React.PropsWithChildren<object>) => {
  const { isAuthenticated } = useAuth0()
  const getAccessToken = useApiAccessToken()
  const [armies, setArmies] = useState<RemoteArmy[]>([])
  const [collectionError, setCollectionError] = useState<string | null>(null)
  const [collectionLoaded, setCollectionLoaded] = useState(false)
  const [collectionLoading, setCollectionLoading] = useState(false)
  /*
   * Whether `ensureArmiesLoaded` has already spent its one attempt. A ref rather than state: it must
   * not re-render anything, and it must be readable by the very call that sets it.
   */
  const loadRequestedRef = useRef(false)
  /*
   * Which answer about the account is newest. A list request captures this before it starts and
   * throws its own result away if anything newer landed first — a later refresh, or a mutation that
   * already wrote the truth into `armies`.
   *
   * Without it, the Save Army modal's on-open refresh can still be in flight when the save itself
   * succeeds: the pre-save list then resolves last, overwrites the created army out of `armies`, and
   * reports the collection loaded. The reconciler is handed a list that is authoritative and missing
   * a record that exists, so it unlinks a live army and the next save forks the duplicate this whole
   * feature exists to prevent.
   */
  const collectionGenerationRef = useRef(0)

  const supersedeCollection = useCallback(() => {
    collectionGenerationRef.current += 1
    return collectionGenerationRef.current
  }, [])

  /*
   * `reportErrors` separates the two callers. A refresh the player asked for (a modal opening) owes
   * them a message when it fails; the background load behind `ensureArmiesLoaded` does not, and
   * publishing to the shared channel would surface its failure inside an unrelated modal — Share
   * Army reads `collectionError` but never refreshes, so it would show an error about a fetch the
   * player never triggered.
   */
  const loadArmies = useCallback(
    async ({ reportErrors }: { reportErrors: boolean }) => {
      if (!isAuthenticated) {
        setArmies([])
        setCollectionError(null)
        // Signing out invalidates the list rather than emptying it. Anything asking whether a record
        // is still on the account must go back to not knowing.
        setCollectionLoaded(false)
        loadRequestedRef.current = false
        supersedeCollection()
        return
      }
      const generation = supersedeCollection()
      setCollectionLoading(true)
      if (reportErrors) setCollectionError(null)
      try {
        const token = await getAccessToken()
        const listed = await ArmyApi.listArmies(token)
        if (collectionGenerationRef.current !== generation) return
        setArmies(listed)
        setCollectionLoaded(true)
      } catch (error) {
        if (reportErrors && collectionGenerationRef.current === generation) {
          setCollectionError(messageForError(error))
        }
        // `collectionLoaded` is deliberately not cleared: a failed refresh leaves the last good list
        // in place, and that list is still a real answer. Only signing out takes the answer away.
      } finally {
        setCollectionLoading(false)
      }
    },
    [getAccessToken, isAuthenticated, supersedeCollection]
  )

  const refreshArmies = useCallback(() => loadArmies({ reportErrors: true }), [loadArmies])

  /*
   * The collection is deliberately not fetched on mount — most visits never touch cloud armies, and
   * the fetch costs a token round-trip. This is the one exception: a caller holding a question that
   * only the list can answer. The authentication guard sits before the ref so an early call, made
   * while Auth0 is still resolving the session, does not burn the attempt.
   */
  const ensureArmiesLoaded = useCallback(async () => {
    if (!isAuthenticated || !ArmyApi.isConfigured) return
    if (collectionLoaded || loadRequestedRef.current) return
    loadRequestedRef.current = true
    await loadArmies({ reportErrors: false })
  }, [collectionLoaded, isAuthenticated, loadArmies])

  const createArmy = useCallback(
    async (document: Aos4ArmyDocument) => {
      setCollectionError(null)
      try {
        const created = await ArmyApi.createArmy(document, await getAccessToken())
        // This write is newer than any list already in flight; see `collectionGenerationRef`.
        supersedeCollection()
        setArmies(current => [created, ...current.filter(army => army.id !== created.id)])
        return created
      } catch (error) {
        setCollectionError(messageForError(error))
        throw error
      }
    },
    [getAccessToken, supersedeCollection]
  )

  const updateArmy = useCallback(
    async (id: string, document: Aos4ArmyDocument) => {
      setCollectionError(null)
      try {
        const updated = await ArmyApi.updateArmy(id, document, await getAccessToken())
        supersedeCollection()
        setArmies(current =>
          current.map(army =>
            army.id === id
              ? {
                  ...army,
                  ...updated,
                  createdAt: army.createdAt,
                }
              : army
          )
        )
        return updated
      } catch (error) {
        setCollectionError(messageForError(error))
        throw error
      }
    },
    [getAccessToken, supersedeCollection]
  )

  const deleteArmy = useCallback(
    async (id: string) => {
      setCollectionError(null)
      try {
        await ArmyApi.deleteArmy(id, await getAccessToken())
        supersedeCollection()
        setArmies(current => current.filter(army => army.id !== id))
      } catch (error) {
        setCollectionError(messageForError(error))
        throw error
      }
    },
    [getAccessToken, supersedeCollection]
  )

  const createShare = useCallback(
    async (document: Aos4ArmyDocument) => {
      setCollectionError(null)
      try {
        return await ArmyApi.createShare(document, await getAccessToken())
      } catch (error) {
        setCollectionError(messageForError(error))
        throw error
      }
    },
    [getAccessToken]
  )

  const value = useMemo(
    () => ({
      armies,
      collectionError,
      collectionLoaded,
      collectionLoading,
      configured: ArmyApi.isConfigured,
      createArmy,
      createShare,
      deleteArmy,
      ensureArmiesLoaded,
      refreshArmies,
      updateArmy,
    }),
    [
      armies,
      collectionError,
      collectionLoaded,
      collectionLoading,
      createArmy,
      createShare,
      deleteArmy,
      ensureArmiesLoaded,
      refreshArmies,
      updateArmy,
    ]
  )

  return <ArmyCollectionContext.Provider value={value}>{children}</ArmyCollectionContext.Provider>
}

export const useArmyCollection = (): ArmyCollectionContextValue => {
  const context = React.useContext(ArmyCollectionContext)
  if (!context) throw new Error('useArmyCollection must be used within an ArmyCollectionProvider')
  return context
}
