import { TItemDescriptions } from 'factions/factionTypes'
import { tagAs } from 'factions/metatagger'
import {
  COMBAT_PHASE,
  END_OF_CHARGE_PHASE,
  END_OF_MOVEMENT_PHASE,
  HERO_PHASE,
  MOVEMENT_PHASE,
} from 'types/phases'

const MountTraits = {
  'Aetheric Swiftness': {
    effects: [
      {
        name: `Aetheric Swiftness`,
        desc: `GRYPH-CHARGER, DRACOTH or DRACOLINE only. This unit is eligible to fight in the combat phase if it is within 6" of an enemy unit instead of 3", and it can move an extra 3" when it piles in.`,
        when: [COMBAT_PHASE],
      },
    ],
  },

  'Light of the Young Stars': {
    effects: [
      {
        name: `Light of the Young Stars`,
        desc: `STARDRAKE only. You can choose this ability instead of carrying out a monstrous rampage (core rules, 21.1) with this unit. Pick 1 enemy unit within 1" of this unit and roll a dice. On a 3+, subtract 1 from hit rolls for attacks made by that unit in the following combat phase.`,
        when: [END_OF_CHARGE_PHASE],
      },
    ],
  },

  'Celestial Instincts': {
    effects: [
      {
        name: `Celestial Instincts`,
        desc: `This unit can retreat and still either shoot or charge in the same turn.`,
        when: [MOVEMENT_PHASE],
      },
    ],
  },

  'Envoy of Lightning': {
    effects: [
      {
        name: `Envoy of Lightning`,
        desc: `If this unit is set up on the battlefield using the Scions of the Storm battle trait (pg 106), you can roll a dice for each enemy unit within 10" of this unit after it is set up. On a 4+, that unit suffers D3 mortal wounds.`,
        when: [END_OF_MOVEMENT_PHASE],
      },
    ],
  },

  'Scintillating Trail': {
    effects: [
      {
        name: `Scintillating Trail`,
        desc: `Subtract 1 from unbinding rolls for enemy WIZARDS for spells cast by friendly STORMCAST ETERNALS WIZARDS wholly within 12" of this unit.`,
        when: [HERO_PHASE],
      },
    ],
  },

  'Thunderous Presence': {
    effects: [
      {
        name: `Thunderous Presence`,
        desc: `DRACONITH only. You can choose this ability instead of carrying out a monstrous rampage (core rules, 21.1) with this unit. Pick 1 enemy unit within 1" of this unit and roll a dice. On a 3+, that unit cannot receive commands in the following battleshock phase.`,
        when: [END_OF_CHARGE_PHASE],
      },
    ],
  },
} satisfies TItemDescriptions

export default tagAs(MountTraits, 'mount_trait')
