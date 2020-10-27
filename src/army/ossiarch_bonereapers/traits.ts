import { TTraits } from 'types/army'
import {
  BATTLESHOCK_PHASE,
  COMBAT_PHASE,
  DURING_GAME,
  END_OF_COMBAT_PHASE,
  HERO_PHASE,
  START_OF_ROUND,
  WOUND_ALLOCATION_PHASE,
} from 'types/phases'

const CommandTraits: TTraits = [
  {
    name: `Ancient Knowledge`,
    effects: [
      {
        name: `Ancient Knowledge`,
        desc: `You receive 1 additional relentless discipline point at the start of the battle round if this general is on the battlefield.`,
        when: [START_OF_ROUND],
      },
    ],
  },
  {
    name: `Immortal Ruler`,
    effects: [
      {
        name: `Immortal Ruler`,
        desc: `The Deathless Warriors battle trait negates a wound or mortal wound allocated to this general on a roll of a 5+ instead of 6.`,
        when: [WOUND_ALLOCATION_PHASE],
      },
    ],
  },
  {
    name: `Dark Acolyte`,
    effects: [
      {
        name: `Dark Acolyte`,
        desc: `This general is a WIZARD that knows 1 spell from the Lore of the Mortisans. They can attempt to cast that spell in your hero phase, and attempt to unbind 1 spell in the enemy hero phase.`,
        when: [HERO_PHASE],
      },
    ],
  },
  {
    name: `Peerless Warrior`,
    effects: [
      {
        name: `Peerless Warrior`,
        desc: `If the unmodified wound roll for an attack made with a melee weapon by this general is 6, that attack inflicts 1 mortal wound on the target in addition to any normal damage.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Hatred of the Living`,
    effects: [
      {
        name: `Hatred of the Living`,
        desc: `Add 1 to hit rolls for attacks made with melee weapons by this general and their mount unless the target has the DEATH keyword.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Life-stealer`,
    effects: [
      {
        name: `Life-stealer`,
        desc: `At the end of the combat phase, if any enemy models were slain by wounds inflicted by this general's attacks in that combat phase, you can heal up to D3 wounds allocated to this general.`,
        when: [END_OF_COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Dire Ultimatum`,
    effects: [
      {
        name: `Dire Ultimatum`,
        desc: `Subtract 2 from the Bravery characteristic of enemy units while they are within 12" of this general.`,
        when: [BATTLESHOCK_PHASE],
      },
    ],
  },
  {
    name: `Grave-sand Bones`,
    effects: [
      {
        name: `Grave-sand Bones`,
        desc: `This general knows 1 extra spell from the Lore of the Mortisans.`,
        when: [HERO_PHASE],
      },
    ],
  },
  {
    name: `Oathbreaker Curse`,
    effects: [
      {
        name: `Oathbreaker Curse`,
        desc: `Roll a D6 each time your opponent receives a command point while this general is on the battlefield. On a 6, that command point is lost.`,
        when: [DURING_GAME],
      },
    ],
  },
  {
    name: `Soul Energy`,
    effects: [
      {
        name: `Soul Energy`,
        desc: `You can reroll casting, dispelling and unbinding rolls for this general. If you do so, this general suffers 1 mortal wound after the effects of the spell (if any) are carried out.`,
        when: [HERO_PHASE],
      },
    ],
  },
]

export default CommandTraits
