import { keyPicker, tagAs } from 'factions/metatagger'
import {
  END_OF_HERO_PHASE,
  END_OF_MOVEMENT_PHASE,
  HERO_PHASE,
  MOVEMENT_PHASE,
  WOUND_ALLOCATION_PHASE,
} from 'types/phases'
import rule_sources from './rule_sources'
import Spells from './spells'

// Endless prayers.
const EndlessSpells = {
  'Daemonic Simulacrum': {
    effects: [
      {
        name: `Summoning`,
        desc: `Casting value of 7 and a range of 12". If successfully cast, set up this endless spell wholly within range and visible to the caster, and more than 1" from all models, other endless spells and invocations. Only DISCIPLES OF TZEENTCH WIZARDS can attempt to summon this endless spell.`,
        when: [HERO_PHASE],
        rule_sources: [rule_sources.BATTLETOME_TZEENTCH, rule_sources.ERRATA_TZEENTCH_JULY_2021],
      },
      {
        name: `Predatory`,
        desc: `This endless spell is a predatory endless spell. It can be moved up to 9" and can fly.`,
        when: [END_OF_HERO_PHASE],
        rule_sources: [rule_sources.BATTLETOME_TZEENTCH, rule_sources.ERRATA_TZEENTCH_JULY_2021],
      },
      {
        name: `Snapping Jaws`,
        desc: `After this endless spell has moved, roll 9 dice for the closest unit within 6" of it. If more than 1 such unit is equally close, the commanding player can choose which unit to roll for. For each 5+, that unit suffers 1 mortal wound. If that unit is a Wizard, it suffers 1 mortal wound for each 4+ instead.`,
        when: [END_OF_HERO_PHASE],
        rule_sources: [rule_sources.BATTLETOME_TZEENTCH, rule_sources.ERRATA_TZEENTCH_JULY_2021],
      },
    ],
  },
  'Tome of Eyes': {
    mandatory: {
      spells: [keyPicker(Spells, ['The Parchment Curse'])],
    },
    effects: [
      {
        name: `Summoning`,
        desc: `This endless spell is summoned with a spell that has a casting value of 5 and a range of 1". If successfully cast, set up this endless spell within range and visible to the caster, and more than 1" from all other models, other endless spells and invocations. Only DISCIPLES OF TZEENTCH WIZARDS can attempt to summon this endless spell.

        A WIZARD in a garrison cannot attempt to summon this endless spell, and if this endless spell is summoned, the WIZARD that summoned it cannot join a garrison until this endless spell has been removed from play.`,
        when: [HERO_PHASE],
        rule_sources: [rule_sources.BATTLETOME_TZEENTCH, rule_sources.ERRATA_TZEENTCH_JULY_2021],
      },
      {
        name: `Linked`,
        desc: `After the model that summoned this endless spell has moved, remove this endless spell from the battlefield and set it up again within 1" of that model and more than 1" from all other models, other endless spells and invocations.`,
        when: [MOVEMENT_PHASE],
        rule_sources: [rule_sources.BATTLETOME_TZEENTCH, rule_sources.ERRATA_TZEENTCH_JULY_2021],
      },
      {
        name: `Linked`,
        desc: `If the model that summoned this endless spell is removed from play, then this endless spell is removed from play.`,
        when: [WOUND_ALLOCATION_PHASE],
        rule_sources: [rule_sources.BATTLETOME_TZEENTCH, rule_sources.ERRATA_TZEENTCH_JULY_2021],
      },
      {
        name: `Transfixed by Countless Eyes`,
        desc: `You can reroll casting rolls for the model that summoned this endless spell while this endless spell is on the battlefield.`,
        when: [HERO_PHASE],
        rule_sources: [rule_sources.BATTLETOME_TZEENTCH, rule_sources.ERRATA_TZEENTCH_JULY_2021],
      },
    ],
  },
  'Burning Sigil of Tzeentch': {
    effects: [
      {
        name: `Summoning`,
        desc: `Casting value of 5 and a range of 18". If successfully cast, set up this endless spell wholly within range and visible to the caster, and more than 1" from all models, other endless spells and invocations. Only DISCIPLES OF TZEENTCH WIZARDS can attempt to summon this endless spell.`,
        when: [HERO_PHASE],
        rule_sources: [rule_sources.BATTLETOME_TZEENTCH, rule_sources.ERRATA_TZEENTCH_JULY_2021],
      },
      {
        name: `Radiant Transmogrification`,
        desc: `At the end of their movement phase, if this endless spell is on the battlefield, the commanding player must roll a dice on the following table:

        1 Dismembered by Change: Pick 1 unit within 9" of this endless spell and visible to it, and roll a dice. On a 4+, that unit suffers D3 mortal wounds. If any models are slain by those mortal wounds, before removing the first slain model, you can add 1 TZEENTCH CHAOS SPAWN to your army and set it up within 3" of the slain model's unit.

        2 Crippling Appendages: Pick 1 unit within 9" of this endless spell and visible to it. Halve the Move characteristic of that unit until the start of your next hero phase.

        3-4 Mutative Flux: Pick 1 unit within 9" of this endless spell and visible to it. That unit can move D6" even if it ran in the same turn.

        5 Spawning Limbs: Pick 1 unit within 9" of this endless spell and visible to it. Add 1 to the Attacks characteristic of that unit's melee weapons until the start of your next hero phase.

        6 Shifting Aura: Pick 1 unit within 12" of this endless spell and visible to it. Subtract 1 from hit rolls for attacks that target that unit until the start of your next hero phase.`,
        when: [END_OF_MOVEMENT_PHASE],
        rule_sources: [rule_sources.BATTLETOME_TZEENTCH, rule_sources.ERRATA_TZEENTCH_JULY_2021],
      },
    ],
  },
}

export default tagAs(EndlessSpells, 'endless_spell')
