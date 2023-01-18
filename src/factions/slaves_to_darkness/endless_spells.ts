import { tagAs } from 'factions/metatagger'
import { GenericEffects } from 'generic_rules'
import {
  COMBAT_PHASE,
  END_OF_HERO_PHASE,
  END_OF_TURN,
  HERO_PHASE,
  MOVEMENT_PHASE,
  WOUND_ALLOCATION_PHASE,
} from 'types/phases'
import rule_sources from './rule_sources'

const Summoning_Casting7_Range9_Effect = {
  name: `Summoning`,
  desc: `Casting value of 7 and range of 9". If successfully cast, set up this endless spell wholly within range and visible to the caster, and more than 1" from all models, other endless spells and invocations. Only SLAVES TO DARKNESS WIZARDS can attempt to summon this endless spell.`,
  when: [HERO_PHASE],
  rule_sources: [rule_sources.BATTLETOME_SLAVES_TO_DARKNESS],
  shared: true,
}

const EndlessSpells = {
  'Eightfold Doom-Sigil': {
    effects: [
      {
        name: `Summoning`,
        desc: `Casting value of 5 and range of 6". If successfully cast, set up this endless spell wholly within range and visible to the caster, and more than 1" from all models, other endless spells and invocations. Only SLAVES TO DARKNESS WIZARDS can attempt to summon this endless spell.`,
        when: [HERO_PHASE],
        rule_sources: [rule_sources.BATTLETOME_SLAVES_TO_DARKNESS],
      },
      {
        name: `Empowered by Atrocity`,
        desc: `Keep track of the number of models that are slain within 12" of this endless spell each turn.`,
        when: [WOUND_ALLOCATION_PHASE],
        rule_sources: [rule_sources.BATTLETOME_SLAVES_TO_DARKNESS],
      },
      {
        name: `Empowered by Atrocity`,
        desc: `At the end of each turn, roll a dice for each model that was slain within 12" of this endless spell during that turn. For each 3+, the player whose turn is taking place must pick 1 SLAVES TO DARKNESS unit wholly within 18" of this endless spell. Add 1 to the Attacks characteristic of that unit's melee weapons (excluding those of its mounts) until that player's next hero phase. A unit cannot benefit from this ability more than once per turn.`,
        when: [END_OF_TURN],
        rule_sources: [rule_sources.BATTLETOME_SLAVES_TO_DARKNESS],
      },
      {
        name: `Empowered by Atrocity`,
        desc: `If the unit is effected add 1 to attacks with melee weapons.`,
        when: [COMBAT_PHASE],
        rule_sources: [rule_sources.BATTLETOME_SLAVES_TO_DARKNESS],
      },
    ],
  },
  'Darkfire Daemonrift': {
    effects: [
      GenericEffects.Predatory.Nine_Inches,
      Summoning_Casting7_Range9_Effect,
      {
        name: `Billowing Energies`,
        desc: `After this endless spell has moved, roll a dice for each unit that has any models it passed across and for each other unit within 1" of it at the end of its move. On a 2+, that unit suffers D3 mortal wounds.`,
        when: [END_OF_HERO_PHASE],
        rule_sources: [rule_sources.BATTLETOME_SLAVES_TO_DARKNESS],
      },
      {
        name: `Fuelled by Sorcery`,
        desc: `Add 1 to the number of mortal wounds caused by this endless spell for each other endless spell within 12" of this endless spell after it has moved.`,
        when: [END_OF_HERO_PHASE],
        rule_sources: [rule_sources.BATTLETOME_SLAVES_TO_DARKNESS],
      },
    ],
  },
  'Realmscourge Rupture': {
    effects: [
      {
        name: `Predatory`,
        desc: `This endless spell is a predatory endless spell. It can be moved up to 9" and can fly. When this endless spell is moved, it must move in a straight line in the direction in which its spikes are pointing.`,
        when: [END_OF_HERO_PHASE],
        rule_sources: [rule_sources.BATTLETOME_SLAVES_TO_DARKNESS],
      },
      Summoning_Casting7_Range9_Effect,
      {
        name: `Debilitating Shockwave`,
        desc: `After this endless spell has moved, roll a dice for each unit that has any models it passed across and for each other unit within 1" of it at the end of its move. On a 2+, that unit suffers D3 mortal wounds and its Move characteristic is halved until the end of the battle round.`,
        when: [END_OF_HERO_PHASE],
        rule_sources: [rule_sources.BATTLETOME_SLAVES_TO_DARKNESS],
      },
      {
        name: `Debilitating Shockwave`,
        desc: `If a unit was affected, halve the movement characteristic until the end of the battle round.`,
        when: [MOVEMENT_PHASE],
        rule_sources: [rule_sources.BATTLETOME_SLAVES_TO_DARKNESS],
      },
    ],
  },
}

export default tagAs(EndlessSpells, 'endless_spell')
