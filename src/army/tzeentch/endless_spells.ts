import { END_OF_MOVEMENT_PHASE, HERO_PHASE, START_OF_ROUND } from 'types/phases'
import { TEndlessSpells } from 'types/army'

// Endless spells go here
const EndlessSpells: TEndlessSpells = [
  {
    name: `Daemonic Simulacrum`,
    effects: [
      {
        name: `Summon Daemonic Simulacrum`,
        desc: `Casting value 7. Only Tzeentch Wizards can attempt to cast this spell. If successfully cast, set up 1 Daemonic Simulacrum model wholly within 12" of the caster.`,
        when: [HERO_PHASE],
      },
      {
        name: `Twisting Mirage`,
        desc: `When this model is set up, the player who set it up can immediately make a move with it. A Daemonic Simulacrum is a predatory endless spell. It can move up to 9" and can fly.`,
        when: [HERO_PHASE],
      },
      {
        name: `Snapping Jaws`,
        desc: `After this model has moved, roll 9 dice for the closest other unit within 6". If more than 1 other unit is equally close, the player that moved this model can choose which unit to roll the 9 dice for. For each 5+, that unit suffers 1 mortal wound. If that unit is a Wizard, that unit suffers 1 mortal wound for each 4+ instead.`,
        when: [HERO_PHASE, START_OF_ROUND],
      },
    ],
  },
  {
    name: `Tome of Eyes`,
    effects: [
      {
        name: `Summon Tome of Eyes`,
        desc: `Casting value 5. Only Tzeentch Wizards can attempt to cast this spell. If successfully cast, set up 1 Tome of Eyes model within 1" of the caster.

        As long as the Tome of Eyes is on the battlefield, the caster and the Tome of Eyes are treated as being a single model from the caster's army that uses the caster's warscroll as well as the Endless Spells rules. The Tome of Eyes must remain within 1" of the caster. If the caster is slain, then the Tome of Eyes is immediately dispelled and removed from play along with the caster.`,
        when: [HERO_PHASE],
      },
      {
        name: `The Parchment Curse`,
        desc: `Casting Value 8. Only the caster of the Tome of Eyes can attempt to cast this spell. If successfully cast, pick 1 enemy unit within 18" of the caster that is visible to them and roll a D6. On a 3+, that unit suffers D3 mortal wounds. In addition, for each model that is slain by mortal wounds inflicted by this spell, subtract 1 from the Bravery characteristic of that unit for the rest of the battle.`,
        when: [HERO_PHASE],
        spell: true,
      },
      {
        name: `Transfixed by Countless Eyes`,
        desc: `If the Tome of Eyes is on the battlefield, you can re-roll casting rolls for the caster.

        In addition, if the unmodified casting roll for a spell attempted by the caster is a 2 or a 12, the spell is automatically cast (regardless of the result) and cannot be unbound. However, the caster suffers D3 mortal wounds after the effects of that spell have been resolved.`,
        when: [HERO_PHASE],
      },
    ],
  },
  {
    name: `Burning Sigil of Tzeentch`,
    effects: [
      {
        name: `Summon Burning Sigil of Tzeentch`,
        desc: `Casting Value 5. Only Tzeentch Wizards can attempt to cast this spell. If successfully cast, set up 1 Burning Sigil of Tzeentch model wholly within 18" of the caster.`,
        when: [HERO_PHASE],
      },
      {
        name: `Radiant Transmogrification`,
        desc: `At the end of your movement phase, if the Burning Sigil of Tzeentch is on the battlefield, you must roll a D6 on the following table:

        1 - Dismembered by Change: Pick 1 unit within 12" of this model and visible to it. That unit suffers D3 mortal wounds. If any models were slain by this spell, before removing the first slain model, you can add 1 Tzeentch Chaos S paw n to your army and set it up within 3" of the slain model's unit.
        2 - Crippling  Appendages: Pick 1 unit within 12" of this model and visible to it. Halve the Move characteristic of that unit until the start of your next hero phase.
        3/4 - Mutative  Flux: Pick 1 unit within 12" of this model and visible to it. That unit can move D6" even if it ran in the same turn.
        5 - Spawning  Limbs: Pick 1 unit within 12" of this model and visible to it. Add 1 to the Attacks characteristic of that unit's melee weapons until the start of your next hero phase.
        6 - Shifting  Aura: Pick 1 unit within 12" of this model and visible to it. Subtract 1 from hit rolls for attacks that target that unit until the start of your next hero phase.`,
        when: [END_OF_MOVEMENT_PHASE],
      },
    ],
  },
]

export default EndlessSpells
