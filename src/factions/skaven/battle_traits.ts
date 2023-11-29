import { TItemDescriptions } from 'factions/factionTypes'
import { tagAs } from 'factions/metatagger'
import { SKAVEN } from 'meta/factions'
import { COMBAT_PHASE } from 'types/phases'

const BattleTraits = {
  [SKAVEN]: {
    effects: [
      {
        name: `Lead From The Back`,
        desc: `Subtract 1 from hit rolls for attacks made with melee weapons if the target is a friendly SKAVEN HERO that is not a MONSTER and is within 3" of any friendly SKAVEN units that have 3 or more models.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Scurry Away`,
        desc: `In the combat phase, when you pick a friendly SKAVEN HERO that does not have a mount to fight, you can say that it will scurry away instead. If you do so, that HERO can retreat.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Strength in Numbers`,
        desc: `Add 1" to the range of melee weapons used by friendly SKAVEN units for every 10 models in the attacking unit (to a maximum of 3").`,
        when: [COMBAT_PHASE],
      },
    ],
  },
} satisfies TItemDescriptions

export default tagAs(BattleTraits, 'battle_trait')
