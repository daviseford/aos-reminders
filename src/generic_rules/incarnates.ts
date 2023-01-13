import meta_rule_sources from 'meta/rule_sources'
import { TEntry } from 'types/data'
import {
  CHARGE_PHASE,
  COMBAT_PHASE,
  DURING_GAME,
  END_OF_CHARGE_PHASE,
  HERO_PHASE,
  SHOOTING_PHASE,
  WOUND_ALLOCATION_PHASE,
} from 'types/phases'

const GenericIncarnates: TEntry[] = [
  {
    name: `Krondspine Incarnate of Ghur`,
    effects: [
      {
        name: `Bonding`,
        desc: `This incarnate can only receive commands issued by the HERO it is bonded to.`,
        when: [DURING_GAME],
      },
      {
        name: `Bonding`,
        desc: `If the All-out Attack command is received by this incarnate, the command is also received by all friendly units that are wholly within domination range of this incarnate, that are within 3" of an enemy unit, and that have not already received a command in that phase.`,
        when: [SHOOTING_PHASE, COMBAT_PHASE],
      },
      {
        name: `Bonding`,
        desc: `Add 1 to casting dispelling and unbinding rolls for a WIZARD that is within domination range of an incarnate they are bonded to.`,
        when: [HERO_PHASE],
      },

      {
        name: `Empowerment`,
        desc: `If a MONSTER is slain by wounds inflicted by this incarnate's attacks, increase this incarnate's level by 1.`,
        when: [WOUND_ALLOCATION_PHASE],
      },

      {
        name: `Wild Form`,
        desc: `Add 1 to hit rolls for attacks made by this incarnate while it is in its wild form. This incarnate can run and still charge in the same turn while it is in its wild form. If this incarnate is in its wild form, is within 12" of another unit or an endless spell, and is not within 3" of another unit at the start of your charge phase, it must attempt a charge and must make a charge move if it is possible for it to do so.`,
        when: [COMBAT_PHASE],
        rule_sources: [meta_rule_sources.ERRATA_SEASON_OF_WAR_THONDIA],
      },

      {
        name: `Inflamed Savagery`,
        desc: `The following effects apply to all units that are wholly within domination range of this incarnate: 
        
        - The unit's command player can reroll run rolls and charge rolls for the unit.
        - The unit cannot retreat.
        - If the unit is a WIZARD that is not bonded to this incarnate, subtract 1 from casting, dispelling, and unbinding rolls for that WIZARD.`,
        when: [DURING_GAME],
      },

      {
        name: `Arcane Predator`,
        desc: `In your charge phase if this incarnate is within 12" of an endless spell that summoned by an enemy WIZARD, it can attempt a charge, and it can make a charge move as long that charge move finishes within 1/2" of an enemy model or endless spell that was summoned by an enemy WIZARD.`,
        when: [CHARGE_PHASE],
      },
      {
        name: `Arcane Predator`,
        desc: `This incarnate can carry out the Devour Endless Spell monstrous rampage instead of any other monstrous rampage it can carry out.`,
        when: [END_OF_CHARGE_PHASE],
      },
      {
        name: `Devour Endless Spell`,
        desc: `Pick 1 endless spell that was summoned by an enemy WIZARD and that is within 3" of this incarnate, and roll 2D6. Add this incarnate's level to the roll. If the roll is greater than the casting value of the spell used to summon that endless spell, that endless spell is dispelled and the level of this incarnate is increased by 1. On any other roll, the level of this incarnate is reduced by 1.`,
        when: [END_OF_CHARGE_PHASE],
        monstrous_rampage: true,
      },
    ],
  },
]

export default GenericIncarnates
