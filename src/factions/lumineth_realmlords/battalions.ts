import { tagAs } from 'factions/metatagger'
import { COMBAT_PHASE, SAVES_PHASE, START_OF_COMBAT_PHASE, WOUND_ALLOCATION_PHASE } from 'types/phases'

const Battalions = {
  'Alarith Temple': {
    effects: [
      {
        name: `Skin to Stone`,
        desc: `Any friendly STONEGUARD units from this battalion that are wholly within 12" of a friendly HERO from the same battalion can turn their skin to stone until the end of the phase. Reroll save rolls for attacks that target a unit that has turned its skin to stone. Models in the unit that has turned its skin to stone can only move 1" when they pile in.`,
        when: [START_OF_COMBAT_PHASE],
      },
      {
        name: `Skin to Stone`,
        desc: `Reroll save rolls for attacks that target a unit that has turned its skin to stone.`,
        when: [SAVES_PHASE],
      },
    ],
  },
  'Auralan Legion': {
    effects: [
      {
        name: `Shield of Light`,
        desc: `You can reroll save rolls of 1 for attacks that target a friendly unit from this battalion whilst it is within 3" of any other friendly unit from the same battalion.`,
        when: [SAVES_PHASE],
      },
    ],
  },
  'Dawnrider Lance': {
    effects: [
      {
        name: `Shafts of Light`,
        desc: `Reroll hit rolls of 1 for attacks made with melee weapons by friendly units from this battalion that made a charge move in the same turn.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  'Teclian Vanguard': {
    effects: [
      {
        name: `Blessing of Teclis`,
        desc: `Roll a D6 each time you allocate a wound or mortal wound to a friendly unit from this battalion while it is wholly within its own territory. On a 6, that wound or mortal wound is negated.`,
        when: [WOUND_ALLOCATION_PHASE],
      },
    ],
  },
}

// Always export using tagAs
export default tagAs(Battalions, 'battalion')
