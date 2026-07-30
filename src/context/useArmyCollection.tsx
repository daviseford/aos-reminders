import { useAuth0 } from '@auth0/auth0-react'
import { ArmyApi, ArmyApiError, type CreatedShare, type RemoteArmy } from '../api/armyApi'
import type { Aos4ArmyDocument } from '../aos4/state'
import React, { useCallback, useMemo, useState } from 'react'
import { useApiAccessToken } from 'utils/authToken'

interface ArmyCollectionContextValue {
  armies: RemoteArmy[]
  collectionError: string | null
  collectionLoading: boolean
  configured: boolean
  createArmy: (document: Aos4ArmyDocument) => Promise<RemoteArmy>
  createShare: (document: Aos4ArmyDocument) => Promise<CreatedShare>
  deleteArmy: (id: string) => Promise<void>
  refreshArmies: () => Promise<void>
  updateArmy: (id: string, document: Aos4ArmyDocument) => Promise<RemoteArmy>
}

const ArmyCollectionContext = React.createContext<ArmyCollectionContextValue | undefined>(undefined)

const messageForError = (error: unknown): string => {
  if (error instanceof ArmyApiError && error.status === 401) return 'Please log in again to continue.'
  if (error instanceof Error) return error.message
  return 'Cloud armies are temporarily unavailable.'
}

export const ArmyCollectionProvider = ({ children }: React.PropsWithChildren<object>) => {
  const { isAuthenticated, user } = useAuth0()
  const getAccessToken = useApiAccessToken()
  const [armies, setArmies] = useState<RemoteArmy[]>([])
  const [collectionError, setCollectionError] = useState<string | null>(null)
  const [collectionLoading, setCollectionLoading] = useState(false)

  const refreshArmies = useCallback(async () => {
    if (!isAuthenticated || !user?.sub) {
      setArmies([])
      setCollectionError(null)
      return
    }
    setCollectionLoading(true)
    setCollectionError(null)
    try {
      const token = await getAccessToken()
      setArmies(await ArmyApi.listArmies(user.sub, token))
    } catch (error) {
      setCollectionError(messageForError(error))
    } finally {
      setCollectionLoading(false)
    }
  }, [getAccessToken, isAuthenticated, user?.sub])

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
      collectionLoading,
      configured: ArmyApi.isConfigured,
      createArmy,
      createShare,
      deleteArmy,
      refreshArmies,
      updateArmy,
    }),
    [
      armies,
      collectionError,
      collectionLoading,
      createArmy,
      createShare,
      deleteArmy,
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
