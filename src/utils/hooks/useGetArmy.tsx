import { selectRealmscapeSlice } from 'ducks/selectors'
import { TSupportedFaction } from 'meta/factions'
import { useMemo } from 'react'
import { useSelector } from 'react-redux'
import { IArmy } from 'types/army'
import { getArmy } from 'utils/getArmy/getArmy'

const useGetArmy = (factionName: TSupportedFaction, subFactionName?: string) => {
  const { origin_realm, realmscape } = useSelector(selectRealmscapeSlice)
  const army = useMemo(() => getArmy(factionName, subFactionName || null, origin_realm, realmscape), [
    factionName,
    origin_realm,
    realmscape,
    subFactionName,
  ])
  return army as IArmy
}

export default useGetArmy
