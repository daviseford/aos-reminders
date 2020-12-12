import { tagAs } from 'factions/metatagger'
import { COMBAT_PHASE, DURING_GAME, SAVES_PHASE } from 'types/phases'

const Artifacts = {
  // Legion of Chaos Ascendant
  'Fourfold Blade': {
    effects: [
      {
        name: `Fourfold Blade`,
        desc: `If the unmodified hit roll for an attack made with this weapon is a 5+, that attack inflicts D3 mortal wounds on the target and the attack sequence ends.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  'Armour of the Pact': {
    effects: [
      {
        name: `Armour of the Pact`,
        desc: `You can reroll save rolls for attacks made with melee weapons that target the bearer.`,
        when: [SAVES_PHASE],
      },
    ],
  },
  'Saintskin Banner': {
    effects: [
      {
        name: `Saintskin Banner`,
        desc: `Subtract 1 from the bravery characteristic of enemy units while they are within 9" of the bearer.`,
        when: [DURING_GAME],
      },
    ],
  },
}

export default tagAs(Artifacts, 'artifact')
