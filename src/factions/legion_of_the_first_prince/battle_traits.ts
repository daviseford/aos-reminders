import { tagAs } from 'factions/metatagger'
import {
  COMBAT_PHASE,
  END_OF_BATTLESHOCK_PHASE,
  END_OF_MOVEMENT_PHASE,
  WOUND_ALLOCATION_PHASE,
} from 'types/phases'

const BattleTraits = {
  // Legion of the First Prince
  'Servants of the Dark Master': {
    effects: [
      {
        name: `First-Damned Prince`,
        desc: `You can reroll hit rolls for attacks made by Be'lakor while he is within 18" of at least 1 of each of the following friendly Legion of the First Prince units: Bloodletters, Plaguebearers, Daemonettes, and Horrors of Tzeentch.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `First-Damned Prince`,
        desc: `Before you allocate a wound or mortal wound to Be'lakor, pick 1 friendly Bloodletters, Plaguebearers, Daemonettes, or Horrors of Tzeentch unit within 9" of him and roll a D6. On a 4+ that wound/mortal wound is allocated to the selected unit instead.`,
        when: [WOUND_ALLOCATION_PHASE],
      },
      {
        name: `The Cursed Skies`,
        desc: `Roll a D6 for each friendly unit of Bloodletters, Horrors of Tzeentch, Plaguebearers, Daemonettes, or Furies. On a 3+ you can return D3 slain models to the unit (only 1 for Horrors).`,
        when: [END_OF_BATTLESHOCK_PHASE],
      },
      {
        name: `Infernal Realmwalkers`,
        desc: `Roll a D6 each time a Legion of the First Prince unit suffers a wound or mortal wound. On a 6+ it is negated.`,
        when: [WOUND_ALLOCATION_PHASE],
      },
      {
        name: `Unyielding Legions`,
        desc: `Pick 1 friendly Legion of the First Prince Daemon hero that is on the battlefield and roll 3D6. On a 10+ you can summon either 10 Bloodletters, 10 Plaguebearers, 10 Daemonettes, or 5 Horrors of Tzeentch. The unit's god keyword must match a god keyword from the summoning hero. Be'lakor can summon any of the above or 6 Furies. The summoned unit must be setup within 12" of the hero and more than 9" from enemy units.
               If the unmodified summoning roll contained any doubles, the hero suffers 1 mortal wound. If the unmodified summoning roll was a triple, the hero suffers D3 mortal wounds instead.`,
        when: [END_OF_MOVEMENT_PHASE],
      },
    ],
  },
}

export default tagAs(BattleTraits, 'battle_trait')
