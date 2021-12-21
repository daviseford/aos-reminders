import { tagAs } from 'factions/metatagger'
import { GenericEffects } from 'generic_rules'
import {
  BATTLESHOCK_PHASE,
  COMBAT_PHASE,
  DURING_GAME,
  END_OF_BATTLESHOCK_PHASE,
  END_OF_CHARGE_PHASE,
  END_OF_COMBAT_PHASE,
  END_OF_HERO_PHASE,
  END_OF_MOVEMENT_PHASE,
  END_OF_SHOOTING_PHASE,
  HERO_PHASE,
  SHOOTING_PHASE,
} from 'types/phases'
import rule_sources from './rule_sources'

const EndlessSpells = {
  'Bone-tithe Shrieker': {
    effects: [
      {
        name: `Summoning`,
        desc: `Casting value of 5 and a range of 12". If successfully cast, set up this endless spell wholly within range and visible to the caster, and more than 1" from all models, other endless spells and invocations. Only OSSIARCH BONEREAPERS WIZARDS can attempt to summon this endless spell.`,
        when: [HERO_PHASE],
        rule_sources: [rule_sources.BATTLETOME_OSSIARCH_BONEREAPERS, rule_sources.ERRATA_JULY_2021],
      },
      GenericEffects.Predatory.Eight_Inches,
      ...GenericEffects.Bonded,
      {
        name: `Portent of Doom`,
        desc: `Units cannot receive the Inspiring Presence or Rally command while they are within 12" of this endless spell. This ability has no effect on OSSIARCH BONEREAPERS units.`,
        when: [BATTLESHOCK_PHASE],
        rule_sources: [rule_sources.BATTLETOME_OSSIARCH_BONEREAPERS, rule_sources.ERRATA_JULY_2021],
      },
      {
        name: `No Escape`,
        desc: `Add 1 to hit rolls for attacks made by OSSIARCH BONEREAPERS units that target a unit that is within 12" of this endless spell.`,
        when: [COMBAT_PHASE, SHOOTING_PHASE],
        rule_sources: [rule_sources.BATTLETOME_OSSIARCH_BONEREAPERS, rule_sources.ERRATA_JULY_2021],
      },
    ],
  },
  'Nightmare Predator': {
    effects: [
      GenericEffects.Predatory.Two_D6,
      ...GenericEffects.Bonded,
      {
        name: `Summoning`,
        desc: `Casting value of 7 and a range of 6". If successfully cast, set up this endless spell wholly within range and visible to the caster, and more than 1" from all models, other endless spells and invocations. Only OSSIARCH BONEREAPERS WIZARDS can attempt to summon this endless spell.`,
        when: [HERO_PHASE],
        rule_sources: [rule_sources.BATTLETOME_OSSIARCH_BONEREAPERS, rule_sources.ERRATA_JULY_2021],
      },
      {
        name: `Perpetual Hunter`,
        desc: `When this endless spell is set up, the player who set it up can pick 1 HERO as its prey. If this endless spell's prey is destroyed, this endless spell is removed from play.`,
        when: [HERO_PHASE],
        rule_sources: [rule_sources.BATTLETOME_OSSIARCH_BONEREAPERS, rule_sources.ERRATA_JULY_2021],
      },
      {
        name: `Death Incarnate`,
        desc: `After this endless spell has moved, roll a dice for each unit within 3" of it. On a 2+, that unit suffers D3 mortal wounds. If that unit was this endless spell's prey, on a 2+, it suffers D6 mortal wounds instead of D3. This ability has no effect on OSSIARCH BONEREAPERS units.`,
        when: [END_OF_HERO_PHASE],
        rule_sources: [rule_sources.BATTLETOME_OSSIARCH_BONEREAPERS, rule_sources.ERRATA_JULY_2021],
      },
    ],
  },
  'Soulstealer Carrion': {
    effects: [
      GenericEffects.Predatory.Eight_Inches,
      ...GenericEffects.Bonded,
      {
        name: `Summoning`,
        desc: `Casting value of 7. If successfully cast, set up this endless spell anywhere on the battlefield and visible to the caster, and more than 1" from all models, other endless spells and invocations. Only OSSIARCH BONEREAPERS WIZARDS can attempt to summon this endless spell.`,
        when: [HERO_PHASE],
        rule_sources: [rule_sources.BATTLETOME_OSSIARCH_BONEREAPERS, rule_sources.ERRATA_JULY_2021],
      },
      {
        name: `Soul Thief`,
        desc: `At the end of each phase, the commanding player must roll a dice if any CHAOS, DESTRUCTION or ORDER models were slain within 6" of this endless spell during that phase. On a 1-2, they can heal 1 wound allocated to the model bonded to this endless spell. On a 3-4, each CHAOS, DESTRUCTION and ORDER unit within 6" of this endless spell suffers 1 mortal wound. On a 5-6, both of these effects apply.`,
        when: [DURING_GAME],
        rule_sources: [rule_sources.BATTLETOME_OSSIARCH_BONEREAPERS, rule_sources.ERRATA_JULY_2021],
      },
      {
        name: `Soul Thief`,
        desc: `See "Soul Thief - During Game"`,
        when: [
          END_OF_BATTLESHOCK_PHASE,
          END_OF_CHARGE_PHASE,
          END_OF_COMBAT_PHASE,
          END_OF_HERO_PHASE,
          END_OF_MOVEMENT_PHASE,
          END_OF_SHOOTING_PHASE,
        ],
        rule_sources: [rule_sources.BATTLETOME_OSSIARCH_BONEREAPERS, rule_sources.ERRATA_JULY_2021],
      },
      {
        name: `Second Sight`,
        desc: `Anything visible to this endless spell is also visible to the model that is bonded to this endless spell.`,
        when: [DURING_GAME],
        rule_sources: [rule_sources.BATTLETOME_OSSIARCH_BONEREAPERS, rule_sources.ERRATA_JULY_2021],
      },
    ],
  },
}

export default tagAs(EndlessSpells, 'endless_spell')
