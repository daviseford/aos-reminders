import { keyPicker, tagAs } from 'factions/metatagger'
import { CHARGE_PHASE, COMBAT_PHASE, DURING_GAME, HERO_PHASE, SHOOTING_PHASE } from 'types/phases'
import Units from './units'

const RegularBattalions = {
  'Marauding Brayherd': {
    mandatory: {
      units: [keyPicker(Units, ['Beastlord', 'Great Bray-Shaman'])],
    },
    effects: [
      {
        name: `Ferocious Despoilers`,
        desc: `Add 1 to charge rolls for friendly BRAYHERD units from this battalion that were set up on the battlefield during the same turn.`,
        when: [CHARGE_PHASE],
      },
    ],
  },
  'Hungering Warherd': {
    mandatory: {
      units: [keyPicker(Units, ['Doombull', 'Bullgors'])],
    },
    effects: [
      {
        name: `Bloodscent`,
        desc: `Units from this battalion can move an extra 3" when they pile in.`,
        when: [CHARGE_PHASE],
      },
    ],
  },
  'Thunderscorn Stormherd': {
    mandatory: {
      units: [keyPicker(Units, ['Dragon Ogor Shaggoth', 'Dragon Ogors'])],
    },
    effects: [
      {
        name: `Raging Storm`,
        desc: `In your hero phase, you can roll a D6 for each unit from this battalion that is on the battlefield. On a 4+ you can heal 1 wound allocated to that unit. After rolling a dice for each unit from this battalion, roll a D6 for each enemy unit within 1" of any models from this battalion. On a 4+ that enemy unit suffers 1 mortal wound.`,
        when: [HERO_PHASE],
      },
    ],
  },
  'Desolating Beastherd': {
    mandatory: {
      units: [keyPicker(Units, ['Great Bray-Shaman'])],
    },
    effects: [
      {
        name: `Bringers of the Wild`,
        desc: `If the unmodified hit roll for an attack made by a unit from this battalion that is wholly within enemy territory is 6, that attack scores 2 hits on that target instead of 1. Make a wound and save roll for each hit.`,
        when: [COMBAT_PHASE, SHOOTING_PHASE],
      },
    ],
  },
  'Brass Despoilers': {
    effects: [
      {
        name: `Martial Ferocity`,
        desc: `You can reroll hit rolls of 1 for attacks made by units from this battalion while they are wholly within 9" of another unit from the same battalion. In addition, once per battle, in your hero phase, you can choose to unleash this battalion's bestial rage. If you do so, until your next hero phase you can reroll failed wound rolls for attacks made by units from this battalion while they are wholly within 9" of another unit from the same battalion.`,
        when: [COMBAT_PHASE, SHOOTING_PHASE],
      },
    ],
  },
  'Phantasmagoria of Fate': {
    effects: [
      {
        name: `Devourers of the Arcane`,
        desc: `Units from this battalion that do not have the WIZARD keyword can attempt to unbind one spell in the enemy hero phase in the same manner as a WIZARD if they are within 9" of the caster.`,
        when: [HERO_PHASE],
      },
    ],
  },
  'Pestilent Throng': {
    effects: [
      {
        name: `Entropic Deluge`,
        desc: `If a unit from this battalion is destroyed, roll a D6 for each enemy unit within 7". On a 2+ that enemy unit suffers 1 mortal wound.`,
        when: [DURING_GAME],
      },
    ],
  },
  'Depraved Drove': {
    effects: [
      {
        name: `Covetous Fury`,
        desc: `You can reroll failed charge rolls made for units from this battalion while they are within 12" of an enemy HERO with an artifact of power. In addition, you can reroll hit rolls for attacks made with melee weapons by models from this battalion that target an enemy HERO with an artifact of power.`,
        when: [CHARGE_PHASE],
      },
    ],
  },
}

const Battalions = { ...RegularBattalions }
export default tagAs(Battalions, 'battalion')
