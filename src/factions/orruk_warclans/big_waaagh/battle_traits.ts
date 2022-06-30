import { tagAs } from 'factions/metatagger'
import {
  CHARGE_PHASE,
  COMBAT_PHASE,
  DURING_GAME,
  END_OF_COMBAT_PHASE,
  HERO_PHASE,
  MOVEMENT_PHASE,
  START_OF_COMBAT_PHASE,
  START_OF_HERO_PHASE,
} from 'types/phases'

const BigWaaaghBattleTraits = {
  "'Ere We Go, 'Ere We Go, 'Ere We Go!": {
    effects: [
      {
        name: `'Ere We Go, 'Ere We Go, 'Ere We Go!`,
        desc: `This is a heroic action that you can carry out with 1 friendly ORRUK WARCLANS HERO instead of picking 1 from the table in the core rules. If you do so, roll a dice. If the roll is greater than the number of the current battle round, you receive a number of Waaagh! points equal to the number of the current battle round. For example, in the third battle round, on a roll of 4+, you would receive 3 Waaagh! points.`,
        when: [START_OF_HERO_PHASE],
      },
    ],
  },
  'Battle Tactics': {
    effects: [
      {
        name: `Wait For It, Ladz...`,
        desc: `You can pick this battle tactic only if your army has at least 24 Waaagh! points (pg 88). You complete this tactic if your army has at least 30 Waaagh! points at the end of this turn.`,
        when: [START_OF_HERO_PHASE],
      },
    ],
  },
  'The Power of the Waaagh!': {
    effects: [
      {
        name: `The Power of the Waaagh!`,
        desc: `During the battle, you receive Waaagh! points (pts) as shown in the table. When you have received enough Waaagh! points (pts), your army gains the corresponding ability, referred to as a Waaagh! power, shown in the table below. Waaagh! powers are cumulative, which means that when your army gains the next one in the table, it can still use those it gained earlier in the battle.
        
        D6 pts - At the start of your hero phase, if your general is on the battlefield.
        2 pts - At the start of your hero phase, if there are any friendly WARCHANTERS on the battlefield.
        1 pt - At the start of your hero phase, if there are any friendly BONESPLITTERZ WIZARDS on the battlefield.
        1 pt - In your charge phase, for each friendly ORRUK unit that finishes a charge move.
        1 pt - At the end of the combat phase, for each friendly ORRUK unit that is within 3" of an enemy unit. `,
        when: [DURING_GAME],
      },
      {
        name: `Waaagh! Points`,
        desc: `You receive Waaagh! points (pts) as shown below.
        
        D6 pts - At the start of your hero phase, if your general is on the battlefield.
        2 pts - At the start of your hero phase, if there are any friendly WARCHANTERS on the battlefield.
        1 pt - At the start of your hero phase, if there are any friendly BONESPLITTERZ WIZARDS on the battlefield. `,
        when: [START_OF_HERO_PHASE],
      },
      {
        name: `Waaagh! Points`,
        desc: `You receive Waaagh! points (pts) as shown below.
        
        1 pt - In your charge phase, for each friendly ORRUK unit that finishes a charge move. `,
        when: [CHARGE_PHASE],
      },
      {
        name: `Waaagh! Points`,
        desc: `You receive Waaagh! points (pts) as shown below.
        
        1 pt - At the end of the combat phase, for each friendly ORRUK unit that is within 3" of an enemy unit. `,
        when: [END_OF_COMBAT_PHASE],
      },
      {
        name: `Waaagh! Power - Zog 'Em - 8+ points`,
        desc: `You can add 1 to run rolls for friendly ORRUK units.`,
        when: [MOVEMENT_PHASE],
      },
      {
        name: `Waaagh! Power - Get 'Em - 10+ points`,
        desc: `Add 1 to charge rolls for friendly ORRUK units.`,
        when: [CHARGE_PHASE],
      },
      {
        name: `Waaagh! Power - Zap 'Em - 12+ points`,
        desc: `Add 1 to casting, dispelling and unbinding rolls for friendly ORRUK WIZARDS.`,
        when: [HERO_PHASE],
      },
      {
        name: `Waaagh! Power - Smash 'Em - 16+ points`,
        desc: `Add 1 to hit rolls for attacks made with melee weapons by friendly ORRUK units.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Waaagh! Power - Bash 'Em - 20+ points`,
        desc: `Add 1 to wound rolls for attacks made with melee weapons used by friendly ORRUK units.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Waaagh! Power - WAAAGH! - 24+ points`,
        desc: `At the start of the combat phase, you can say you will release the power of the Waaagh!. If you do so, add 1 to the Attacks characteristic of melee weapons used by friendly ORRUK units for the rest of that phase. At the end of that phase, you lose all the Waaagh! points you have received so far, and your army loses all the Waaagh! powers it has gained so far.`,
        when: [START_OF_COMBAT_PHASE],
      },
    ],
  },
}

export default tagAs(BigWaaaghBattleTraits, 'battle_trait')
