import { useAuth0 } from '@auth0/auth0-react'
import { ArmyApi, ArmyApiError, type CreatedShare, type RemoteArmy } from '../api/armyApi'
import type { Aos4ArmyDocument } from '../aos4/state'
import React, { useCallback, useMemo, useRef, useState } from 'react'
import { useApiAccessToken } from 'utils/authToken'

interface ArmyCollectionContextValue {
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

  const refreshArmies = useCallback(async () => {
    if (!isAuthenticated) {
      setArmies([])
      setCollectionError(null)
      // Signing out invalidates the list rather than emptying it. Anything asking whether a record
      // is still on the account must go back to not knowing.
      setCollectionLoaded(false)
      loadRequestedRef.current = false
      return
    }
    setCollectionLoading(true)
    setCollectionError(null)
    try {
      const token = await getAccessToken()
      setArmies(await ArmyApi.listArmies(token))
      setCollectionLoaded(true)
    } catch (error) {
      setCollectionError(messageForError(error))
      // Deliberately not cleared: a failed refresh leaves the last good list in place, and that list
      // is still a real answer. Only signing out takes the answer away.
    } finally {
      setCollectionLoading(false)
    }
  }, [getAccessToken, isAuthenticated])

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
    await refreshArmies()
  }, [collectionLoaded, isAuthenticated, refreshArmies])

  const createArmy = useCallback(
    async (document: Aos4ArmyDocument) => {
      setCollectionError(null)
      try {
        const created = await ArmyApi.createArmy(document, await getAccessToken())
        setArmies(current => [created, ...current.filter(army => army.id !== created.id)])
        return created
      } catch (error) {
        setCollectionError(messageForError(error))
        throw error
      }
    },
    [getAccessToken]
  )

  const updateArmy = useCallback(
    async (id: string, document: Aos4ArmyDocument) => {
      setCollectionError(null)
      try {
        const updated = await ArmyApi.updateArmy(id, document, await getAccessToken())
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
    [getAccessToken]
  )

  const deleteArmy = useCallback(
    async (id: string) => {
      setCollectionError(null)
      try {
        await ArmyApi.deleteArmy(id, await getAccessToken())
        setArmies(current => current.filter(army => army.id !== id))
      } catch (error) {
        setCollectionError(messageForError(error))
        throw error
      }
    },
    [getAccessToken]
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
