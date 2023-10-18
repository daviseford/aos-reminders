import { tagAs } from 'factions/metatagger'
import { KHORNE } from 'meta/factions'
import meta_rule_sources from 'meta/rule_sources'
import {
  END_OF_HERO_PHASE,
  END_OF_MOVEMENT_PHASE,
  HERO_PHASE,
  START_OF_HERO_PHASE,
  WARDS_PHASE,
  WOUND_ALLOCATION_PHASE,
} from 'types/phases'

const BattleTraits = {
  [KHORNE]: {
    effects: [
      {
        name: `Locus of Fury`,
        desc: `While a friendly BLADES OF KHORNE DAEMON unit is more than 8" from all enemy units, it benefits from the Locus of Fury. Units have a ward of 5+ while they benefit from the Locus of Fury. If a friendly BLADES OF KHORNE DAEMON unit retreats, it does not benefit from the Locus of Fury for the rest of the battle.`,
        when: [WARDS_PHASE],
      },
      {
        name: `Murderous to the Last`,
        desc: `Each time a friendly BLOODBOUND model is slain by an attack made with a melee weapon, you can pick 1 enemy unit within 3" of that model and make a murder roll by rolling a dice. On a 5+, that unit suffers 1 mortal wound. If the slain BLOODBOUND model was a HERO, make 3 murder rolls instead of 1.`,
        when: [WOUND_ALLOCATION_PHASE],
      },
      {
        name: `Hatred of Sorcery`,
        desc: `Each time a friendly BLADES OF KHORNE unit is affected by a spell cast by an enemy unit or the abilities of an endless spell summoned by an enemy unit, make a Hatred of Sorcery roll by rolling a dice. On a 5+, ignore the effects of that spell or endless spell's abilities on that unit and you receive 1 Blood Tithe point.`,
        when: [HERO_PHASE],
      },
    ],
  },
  'The Blood Tithe': {
    effects: [
      {
        name: `The Blood Tithe`,
        desc: `When commanding a Blades of Khorne army, you can earn Blood Tithe points (BP) and spend them to use the Blood Tithe Reward abilities below and to summon units to the battlefield.

        You begin the battle with 0 Blood Tithe points. Each time a unit is destroyed, you earn 1 Blood Tithe point.
        
        Once at the end of each hero phase, you can spend your Blood Tithe points on 1 of the Blood Tithe Reward abilities from the list below. Each ability costs the number of Blood Tithe points shown next to its entry, and you can only spend Blood Tithe points on a Reward if you have enough Blood Tithe points to do so.
        
        'Rising Hatred' and 'Slaughter Triumphant' can be picked multiple times in the same battle, and they are cumulative.`,
        when: [END_OF_HERO_PHASE],
      },
      {
        name: `Blood Tithe: Murderlust`,
        desc: `Cost: 1 BTP. Pick 1 friendly Blades of Khorne unit that is more than 3" from all enemy units. That unit can make a D6" move, and it can finish that move within 3" of any enemy units. You can spend Blood Tithe points on this Reward up to 3 times at the end of each hero phase instead of only once, but you cannot pick the same unit to benefit from this ability more than once per phase.`,
        when: [END_OF_HERO_PHASE],
        rule_sources: [meta_rule_sources.BATTLESCROLL_ANDTOR_SEPTEMBER_2023],
      },
      {
        name: `Blood Tithe: Spelleater Curse`,
        desc: `Cost: 2 BTP. You can spend Blood Tithe points on this Reward in your opponent's hero phase immediately after an enemy WIZARD has cast a spell but before an unbinding attempt is made. That spell is automatically unbound (do not make an unbinding roll). If you spend Blood Tithe points on this Reward, you cannot spend any Blood Tithe points at the end of the same hero phase.`,
        when: [END_OF_HERO_PHASE],
      },
      {
        name: `Blood Tithe: Brass Skull Meteor`,
        desc: `Cost: 3 BTP. Pick 1 enemy unit on the battlefield and roll 8 dice. For each 5+, that unit suffers 1 mortal wound. Add 2 to each roll if the enemy unit has a Wounds characteristic of 10 or more or has 10 or more models.`,
        when: [END_OF_HERO_PHASE],
      },
      {
        name: `Blood Tithe: Apoplectic Frenzy`,
        desc: `Cost: 4 BTP. Pick 1 friendly BLADES OF KHORNE unit within 3" of an enemy unit. That BLADES OF KHORNE unit can fight.`,
        when: [END_OF_HERO_PHASE],
      },
      {
        name: `Blood Tithe: Rising Hatred`,
        desc: `Cost: 5 BTP. Add 1 to Hatred of Sorcery rolls until the end of the battle.`,
        when: [END_OF_HERO_PHASE],
      },
      {
        name: `Blood Tithe: Heads Must Roll`,
        desc: `Cost: 6 BTP. Improve the Rend characteristic of melee weapons used by friendly BLADES OF KHORNE units by 1 until the end of the turn.`,
        when: [END_OF_HERO_PHASE],
      },
      {
        name: `Blood Tithe: Let the Blood Flow`,
        desc: `Cost: 7 BTP. Roll 1 dice for each enemy unit on the battlefield that is within 3" of any friendly BLADES OF KHORNE units. On a 2+, that unit suffers D3 mortal wounds.`,
        when: [END_OF_HERO_PHASE],
      },
      {
        name: `Blood Tithe: Slaughter Triumphant`,
        desc: `Cost: 8 BTP. Add 1 to the Attacks characteristic of melee weapons used by friendly BLADES OF KHORNE units until the end of the battle.`,
        when: [END_OF_HERO_PHASE],
      },
      {
        name: `Summon Daemons of Khorne`,
        desc: `If you have any Blood Tithe points at the end of your movement phase, you can summon 1 unit from the list below to the battlefield and add it to your army. Each unit you summon costs the number of Blood Tithe points shown next to its entry, and you can only summon it if you have enough Blood Tithe points to do so. Units must be set up more than 9" from all enemy units and either wholly within 8" of a friendly KHORNE HERO or wholly within 16" of a Skull Altar in your army.`,
        when: [END_OF_MOVEMENT_PHASE],
      },
      {
        name: `Summon Daemons of Khorne`,
        desc: `Summoning Costs:
               1 Exalted Greater Daemon of Khorne - 16 BTP
               1 Wrath of Khorne Bloodthirster -    10 BTP
               1 Bloodthirster of Insensate Rage -  10 BTP
               1 Bloodthirster of Unfettered Fury - 10 BTP
               20 Bloodletters -                    8 BTP
               10 Flesh Hounds -                    6 BTP
               10 Bloodletters -                    5 BTP
               1 Skull Cannon -                     5 BTP
               3 Bloodcrushers -                    5 BTP
               1 Herald of Khorne on Blood Throne - 5 BTP
               1 Skullmaster, Herald of Khorne -    4 BTP
               5 Flesh Hounds -                     3 BTP
               1 Bloodmaster, Herald of Khorne -    3 BTP`,
        when: [END_OF_MOVEMENT_PHASE],
      },
    ],
  },
  'Battle Tactics': {
    effects: [
      {
        name: `Battle Tactics: Blood for the Altar`,
        desc: `Pick 1 enemy unit within 8" of your Skull Altar. You complete this battle tactic if that enemy unit is destroyed during this turn.`,
        when: [START_OF_HERO_PHASE],
      },
      {
        name: `Battle Tactics: Slay the Sorcerer`,
        desc: `Pick 1 enemy WIZARD HERO on the battlefield. You complete this battle tactic if that HERO is slain during this turn.`,
        when: [START_OF_HERO_PHASE],
      },
      {
        name: `The Trial of Skulls`,
        desc: `Pick 1 friendly unit. You complete this battle tactic if 8 or more enemy models are slain by attacks made by that unit during this turn.`,
        when: [START_OF_HERO_PHASE],
      },
      {
        name: `No Cowards Among Us`,
        desc: `You complete this battle tactic at the end of this turn if all friendly BLADES OF KHORNE units on the battlefield are within 8" of any enemy units.`,
        when: [START_OF_HERO_PHASE],
      },
      {
        name: `Leave None Standing`,
        desc: `Pick 1 friendly unit within 3" of any enemy units. You complete this battle tactic if that unit fights in the combat phase of this turn and at the end of that phase there are no enemy units within 3" of that unit.`,
        when: [START_OF_HERO_PHASE],
      },
      {
        name: `The Battlefield Runs Red`,
        desc: `You complete this battle tactic if 4 or more units were destroyed during this turn.`,
        when: [START_OF_HERO_PHASE],
      },
    ],
  },
}

export default tagAs(BattleTraits, 'battle_trait')
