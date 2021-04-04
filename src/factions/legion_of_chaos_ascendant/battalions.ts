import KhorneUnits from 'factions/khorne/units'
import { keyPicker, tagAs } from 'factions/metatagger'
import NurgleUnits from 'factions/nurgle/units'
import SlaaneshUnits from 'factions/slaanesh/units'
import TzeentchUnits from 'factions/tzeentch/units'
import { CHARGE_PHASE, COMBAT_PHASE, HERO_PHASE } from 'types/phases'

const RegularBattalions = {
  'Host of Rage': {
    mandatory: {
      units: [keyPicker(KhorneUnits, ['Bloodletters'])],
    },
    effects: [
      {
        name: `First Blood`,
        desc: `You can reroll charge rolls for friendly units from this battalion.`,
        when: [CHARGE_PHASE],
      },
    ],
  },
  'Host of Corruption': {
    mandatory: {
      units: [keyPicker(NurgleUnits, ['Plaguebearers'])],
    },
    effects: [
      {
        name: `Plague-smeared Blades`,
        desc: `If the unmodified hit roll for an attack made with a melee weapon by a friendly unit from this battalion is a 6, add 1 to the damage inflicted.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  'Host of the Arcane': {
    mandatory: {
      units: [keyPicker(TzeentchUnits, ['Horrors of Tzeentch'])],
    },
    effects: [
      {
        name: `Agents of the Change God`,
        desc: `Add 1 to casting, unbinding, and dispelling rolls made for friendly Chaos Ascendant Daemon wizards from this battalion. They must be wholly within 9" of 2 or more other friendly units from the same battalion to use this ability.`,
        when: [HERO_PHASE],
      },
    ],
  },
  'Host of the Depraved': {
    mandatory: {
      units: [keyPicker(SlaaneshUnits, ['Daemonettes'])],
    },
    effects: [
      {
        name: `Sadistic Exemplars`,
        desc: `Add 1 to wound rolls for attacks made with melee units from friendly units in this battalion if they made a charge move this turn.`,
        when: [CHARGE_PHASE, COMBAT_PHASE],
      },
    ],
  },
}

const SuperBattalions = {}

const Battalions = { ...RegularBattalions, ...SuperBattalions }
export default tagAs(Battalions, 'battalion')
