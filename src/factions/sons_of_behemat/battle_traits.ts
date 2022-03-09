import { tagAs } from 'factions/metatagger'
import { SONS_OF_BEHEMAT } from 'meta/factions'
import { DURING_GAME, SHOOTING_PHASE, START_OF_HERO_PHASE } from 'types/phases'

const BattleTraits = {
  [SONS_OF_BEHEMAT]: {
    effects: [
      {
        name: `Mightier Makes Rightier`,
        desc: `When determining control of an objective, each friendly MANCRUSHER GARGANT model counts as 10 models instead of 1 and each friendly MEGA-GARGANT counts as 20 models instead of 1.`,
        when: [DURING_GAME],
      },
      {
        name: `Chuck Rocks`,
        desc: `In your shooting phase, you can pick 1 friendly MANCRUSHER GARGANT unit wholly within 18" of your general. Each model in that unit can make a shooting attack with the Chuck Rocks missile weapon.`,
        when: [SHOOTING_PHASE],
      },
    ],
  },

  'Battle Tactics': {
    effects: [
      {
        name: `That's Mine!`,
        desc: `Pick 1 objective on the battlefield wholly outside of your territory. You complete this tactic if that objective marker is kicked away and is wholly within your territory at the end of this turn.`,
        when: [START_OF_HERO_PHASE],
      },
      {
        name: `Wrecking Crew`,
        desc: `You complete this tactic if a faction terrain feature in your opponent's army is demolished this turn.`,
        when: [START_OF_HERO_PHASE],
      },
      {
        name: `Manskittles`,
        desc: `You complete this tactic if a friendly WARSTOMPER MEGA-GARGANT uses its 'Hurled Body' ability, the enemy model you pick for the first part of this ability is slain, and an enemy Battleline unit is picked as the target for the second part of the ability and suffers any mortal wounds as a result.`,
        when: [START_OF_HERO_PHASE],
      },
    ],
  },
}

export default tagAs(BattleTraits, 'battle_trait')
