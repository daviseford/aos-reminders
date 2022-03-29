import { tagAs } from 'factions/metatagger'
import { DURING_GAME, HERO_PHASE, START_OF_HERO_PHASE, START_OF_SHOOTING_PHASE } from 'types/phases'

const EndlessSpells = {
  'Molten Infernoth': {
    effects: [
      {
        name: `Summoning`,
        desc: `This invocation is summoned with a prayer that has an answer value of 4 and a range of 12". If answered, set up the invocation wholly within range and visible to the chanter, and more than 1" from all models, terrain features, other invocations and endless spells.`,
        when: [HERO_PHASE],
      },
      {
        name: `Burning Tide`,
        desc: `After this invocation is set up, the commanding player can immediately move it up to 2D6". In addition, at the start of each of their subsequent hero phases, if this invocation is still on the battlefield, the commanding player can move it up to 2D6".`,
        when: [HERO_PHASE, START_OF_HERO_PHASE],
      },
      {
        name: `Erupting Inferno`,
        desc: `After this invocation has moved, the commanding player rolls 12 dice for each unit within 3" of it. For each 6, that unit suffers 1 mortal wound. If the roll to determine how far this invocation moved in this phase was a double, that unit suffers D3 mortal wounds for each 6 instead of 1 and at the end of the phase, this invocation is removed from play. FYRESLAYERS units are not affected by this ability.`,
        when: [HERO_PHASE, START_OF_HERO_PHASE],
      },
    ],
  },
  'Runic Fyrewall': {
    effects: [
      {
        name: `Summoning`,
        desc: `This invocation is summoned with a prayer that has an answer value of 3 and a range of 18". If answered, set up the invocation wholly within range and visible to the chanter, and more than 1" from all models, terrain features, other invocations and endless spells.`,
        when: [HERO_PHASE],
      },
      {
        name: `Roaring Rune-fire`,
        desc: `Models cannot move across or through this invocation unless they have the MAGMADROTH keyword or can fly.`,
        when: [DURING_GAME],
      },
      {
        name: `Awakened Runes`,
        desc: `At the start of each phase, the commanding player can pick 1 friendly FYRESLAYERS unit wholly within 12" of this invocation to draw upon its power. If they do so, the commanding player rolls a dice. On a 1-5, that unit has a ward of 6+ until the end of the phase. On a 6, that unit has a ward of 4+ until the end of the phase and this invocation is removed from play at the end of the phase.`,
        when: [DURING_GAME],
      },
    ],
  },
  'Zharrgron Flame-spitter': {
    effects: [
      {
        name: `Summoning`,
        desc: `This invocation is summoned with a prayer that has an answer value of 3 and a range of 6". If answered, set up the invocation wholly within range and visible to the chanter, and more than 1" from all models, terrain features, other invocations and endless spells.`,
        when: [HERO_PHASE],
      },
      {
        name: `Magma Blast`,
        desc: `At the start of the commanding player's shooting phase, if there are any friendly FYRESLAYERS PRIESTS within 6" of this invocation, the commanding player can pick 1 enemy unit within 24" of this invocation and roll 12 dice. Add 1 to the roll if that unit has 10 or more models. Add 2 to the roll instead if that unit has 20 or more models. For each 6+, that unit suffers 1 mortal wound. If the commanding player rolls 4 or more unmodified 6s, after the mortal wounds have been allocated to that unit, this invocation is removed from play.`,
        when: [START_OF_SHOOTING_PHASE],
      },
    ],
  },
}

export default tagAs(EndlessSpells, 'endless_spell')
