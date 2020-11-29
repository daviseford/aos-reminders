import { IInitialArmy } from 'types/army'
import { SlaaneshFaction } from './slaanesh'

/**
 * To see how a new data-structure army might feel in the UI as-is
 */
export const temporaryAdapter = (
  newFaction: typeof SlaaneshFaction,
  whichSubFaction: keyof typeof SlaaneshFaction['subFactions']
): IInitialArmy => {
  const thisSubFactionsData = newFaction.subFactions[whichSubFaction]

  const Units = thisSubFactionsData

  const initialArmy: IInitialArmy = {
    AllegianceType: newFaction.flavorLabel,
    // Units:
  }

  return initialArmy
}

const toArr = () => {}
