import { TBattleRealms, SUPPORTED_BATTLE_REALMS } from 'types/realmscapes'

export const getRealmscape = (val: string): TBattleRealms | null => {
  return SUPPORTED_BATTLE_REALMS.find(realm => val.includes(realm)) || null
}
