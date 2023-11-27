import { tagAs } from 'factions/metatagger'
import { GenericEffects } from 'generic_rules'
import {
  CHARGE_PHASE,
  COMBAT_PHASE,
  DURING_GAME,
  END_OF_COMBAT_PHASE,
  END_OF_MOVEMENT_PHASE,
  HERO_PHASE,
  MOVEMENT_PHASE,
  SAVES_PHASE,
  SHOOTING_PHASE,
  START_OF_MOVEMENT_PHASE,
} from 'types/phases'
import rule_sources from './rule_sources'

const EndlessSpells = {
  'Hyshian Twinstones': {
    effects: [
      {
        name: `Summoning`,
        desc: `Casting value of 5 and range of 6". If successfully cast, set up this endless spell wholly within range and visible to the caster, and more than 1" from all models, terrain features, other endless spells, invocations and objectives. Only Lumineth Realm-Lords Wizards can attempt to summon this endless spell.`,
        when: [HERO_PHASE],
      },
      {
        name: `Reservoir of Power`,
        desc: `After this endless spell is summoned, place a dice beside it with the '1' facing up. Each time a spell is successfully cast by a Wizard that is within 12" of this endless spell and not unbound, increase the value of the dice beside this endless spell by 1, to a maximum of 6.

        Before a Lumineth Realm-Lords Wizard that is within 12" of this endless spell attempts to cast a spell, that Wizard's commanding player can say that they will draw on the power of the Twinstones. If they do so, they can add the value of the dice beside this endless spell to the casting roll. Then, after the effects of that spell have been resolved, this endless spell is removed from play.`,
        when: [HERO_PHASE],
      },
    ],
  },
  'Sanctum of Amyntok': {
    effects: [
      {
        name: `Summoning`,
        desc: `This endless spell is summoned with a spell that has a casting value of 7 and range of 3". If successfully cast, set up this endless spell wholly within range and visible to the caster, and more than 3" from all other models, terrain features, other endless spells, invocations and objectives. The parts of the endless spell must be set up touching each other so that they form a ring with the caster inside. Only Lumineth Realm-Lords Wizards can attempt to summon this endless spell.

        A Wizard in a garrison cannot attempt to summon this endless spell, and if this endless spell is summoned, the Wizard that summoned it cannot join a garrison until this endless spell has been removed from play`,
        when: [HERO_PHASE],
      },
      GenericEffects.Linked,
      {
        name: `Stationery`,
        desc: `While this endless spell is on the battlefield, the model that summoned this endless spell cannot move.`,
        when: [MOVEMENT_PHASE],
        rule_sources: [rule_sources.ERRATA_JULY_2021],
      },
      {
        name: `Barrier`,
        desc: `While this endless spell is on the battlefield, range and visibility to and from the model that summoned this endless spell is measured to and from this endless spell instead.`,
        when: [DURING_GAME],
        rule_sources: [rule_sources.ERRATA_JULY_2021],
      },
      {
        name: `Sigil of Yngra`,
        desc: `Subtract 1 from hit rolls and add 1 to save rolls for attacks that target the model that summoned this endless spell while this endless spell is on the battlefield.`,
        when: [SHOOTING_PHASE, COMBAT_PHASE, SAVES_PHASE],
        rule_sources: [rule_sources.BATTLETOME_LUMINETH, rule_sources.ERRATA_JULY_2021],
      },
      {
        name: `Sigil of Yngra`,
        desc: `At the end of the combat phase, if the model that summoned this endless spell was targeted by any attacks in that phase, roll a dice for each enemy unit within 3" of this endless spell. On a 1-3, nothing happens. On a 4-5, that enemy unit suffers 1 mortal wound. On a 6, that enemy unit suffers D3 mortal wounds.`,
        when: [END_OF_COMBAT_PHASE],
      },
    ],
  },
  'Rune of Petrification': {
    effects: [
      {
        name: `Summoning`,
        desc: `Casting value of 8 and a range of 18". If successfully cast, set up this endless spell wholly within range and visible to the caster, and more than 1" from all models, terrain features, other endless spells, invocations and objectives. Only Lumineth Realm-Lords Wizards can attempt to summon this endless spell.`,
        when: [HERO_PHASE],
      },
      {
        name: `Turn to Stone`,
        desc: `At the start of the movement phase and at the end of the movement phase, roll a dice for each unit within 6" of this endless spell. On a 4+, that unit suffers D3 mortal wounds. This ability has no effect on Lumineth Realm-Lords units.`,
        when: [START_OF_MOVEMENT_PHASE, END_OF_MOVEMENT_PHASE],
      },
      {
        name: `Turn to Stone`,
        desc: `Subtract 1 from run rolls and charge rolls for units within 6" of this endless spell. This ability has no effect on Lumineth Realm-Lords units.`,
        when: [MOVEMENT_PHASE, CHARGE_PHASE],
      },
    ],
  },
}

export default tagAs(EndlessSpells, 'endless_spell')
