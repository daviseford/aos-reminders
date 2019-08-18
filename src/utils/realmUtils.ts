import { TRealms, SUPPORTED_REALMSCAPES } from 'types/realmscapes'

export const getRealmscape = (val: string): TRealms | null => {
  return SUPPORTED_REALMSCAPES.find(realm => val.includes(realm)) || null
}
