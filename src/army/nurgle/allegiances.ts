import { TAllegiances } from 'types/army'
import {
  CHARGE_PHASE,
  COMBAT_PHASE,
  DURING_GAME,
  END_OF_COMBAT_PHASE,
  END_OF_SETUP,
  HERO_PHASE,
  MOVEMENT_PHASE,
  START_OF_COMBAT_PHASE,
  WOUND_ALLOCATION_PHASE,
} from 'types/phases'

const LocusOfCorrosionEffect = {
  name: `Locus of Corrosion`,
  desc: `While an enemy unit is within 3" of any friendly Munificent Wanderers/Droning Guard daemon units, worsen the rend characteristic of that units melee weapons by 1 (to a minimum of '-'). Nurgle units are unaffected by this ability.`,
  when: [COMBAT_PHASE],
}

const NurglesEmbraceEffect = {
  name: `Nurgle's Embrace`,
  desc: `Roll a D6 each time a friendly Blessed Sons/Drowned Men Rotbringer model is slain in this phase. On a 2+ the attacking unit suffers 1 mortal wound. If the attacking unit has the Nurgle keyword, heal 1 wound allocated to the unit instead.`,
  when: [COMBAT_PHASE],
}

// This is where we store sub-allegiances such as
// Grand Courts, Hosts, Clans, Glades, Lodges, etc
const Allegiances: TAllegiances = [
  {
    name: `Munificent Wanderers`,
    effects: [
      LocusOfCorrosionEffect,
      {
        name: `Infested with Wonders`,
        desc: `Pick 1 friendly Munificent Wanderers daemon unit wholly within 14" of a friendly Munificent Wanderers hero with this command ability. Until the start of your next hero phase, if an enemy unit ends a charge move within 3" of the target, that enemy unit suffers D3 mortal wounds. A unit cannot benefit from this ability more than once per turn.`,
        when: [HERO_PHASE],
        command_ability: true,
      },
      {
        name: `Infested with Wonders`,
        desc: `If an enemy unit ends a charge move within 3" of the buffed unit, that enemy unit suffers D3 mortal wounds.`,
        when: [CHARGE_PHASE],
      },
      {
        name: `One Last Gift`,
        desc: `Unmodified melee hit rolls of 6 targeting a Munificent Wanderers daemon unit wholly within 12" of this general cause the attacking unit to suffer 1 mortal wound after all its attacks have resolved.`,
        when: [COMBAT_PHASE],
        command_trait: true,
      },
      {
        name: `Mucktalon`,
        desc: `Add 1 to hit rolls for attacks made with this weapon if the target is a hero.`,
        when: [COMBAT_PHASE],
        artifact: true,
      },
    ],
  },
  {
    name: `Droning Guard`,
    effects: [
      LocusOfCorrosionEffect,
      {
        name: `Twice-blessed Rotspawn`,
        desc: `Pick 1 friendly Droning Guard Plague Drones unit wholly within 12" of a friendly Droning Guard daemon hero with this ability. Until the end of the phase, add 1 to Disgustingly Resilient rolls made for that unit.`,
        when: [COMBAT_PHASE],
        command_ability: true,
      },
      {
        name: `Rotwing Commander`,
        desc: `After armies have been setup before the first battle round, friendly Droning Guard Plague Drones units can move up to 4".`,
        when: [END_OF_SETUP],
        command_trait: true,
      },
      {
        name: `Cloak of Flies`,
        desc: `Subtract 1 from melee hit rolls made against the bearer.`,
        when: [COMBAT_PHASE],
        artifact: true,
      },
    ],
  },
  {
    name: `Blessed Sons`,
    effects: [
      NurglesEmbraceEffect,
      {
        name: `Degraded and Defiled`,
        desc: `Pick 1 friendly Blessed Sons Rotbringer unit wholly within 14" of a friendly Blessed Sons Rotbringer hero with this ability. At the end of the phase, pick 1 enemy unit that suffered any wounds or mortal wounds inflicted by the selected friendly unit in this phase. If the combined wounds/mortal wounds is greater than the bravery characteristic of the enemy unit, that unit suffers 3 additional mortal wounds.`,
        when: [START_OF_COMBAT_PHASE],
        command_ability: true,
      },
      {
        name: `Degraded and Defiled`,
        desc: `If active on a friendly unit at the end of the phase, pick 1 enemy unit that suffered any wounds or mortal wounds inflicted by the buffed friendly unit in this phase. If the combined wounds/mortal wounds is greater than the bravery characteristic of the enemy unit, that unit suffers 3 additional mortal wounds.`,
        when: [END_OF_COMBAT_PHASE],
      },
      {
        name: `Foul Conqueror`,
        desc: `Once per turn you can use the At the Double command ability on a friendly Blessed Sons Rotbringer unit within 12" of this general without spending any command points.`,
        when: [MOVEMENT_PHASE],
        command_trait: true,
      },
      {
        name: `Blotshell Bileplate`,
        desc: `You can reroll save rolls for attacks targeting the bearer.`,
        when: [DURING_GAME],
        artifact: true,
      },
    ],
  },
  {
    name: `Drowned Men`,
    effects: [
      NurglesEmbraceEffect,
      {
        name: `Kneel Before the Plague`,
        desc: `Pick 1 friendly Drowned Men Pusgoyle Blightlord unit wholly within 12" of a friendly Drowned Men Rotbringer hero. Until your next hero phase, if the unmodified wound roll for an attack made with that unit's Blighted Weapons is a 6, improve the rend characteristic for that attack by 1.`,
        when: [START_OF_COMBAT_PHASE],
        command_ability: true,
      },
      {
        name: `Kneel Before the Plague`,
        desc: `Improve the rend characteristic by 1 for unmodified Blighted Weapons wound rolls of 6 on the buffed unit.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Bloated Raider`,
        desc: `You can reroll charge rolls for friendly Drowned Men Pusgoyle Blightlords units wholly within 14" of this general.`,
        when: [CHARGE_PHASE],
        command_trait: true,
      },
      {
        name: `Rot-kraken Hide`,
        desc: `Add 1 to the bearer's wounds characteristic.`,
        when: [WOUND_ALLOCATION_PHASE],
        artifact: true,
      },
    ],
  },
]

export default Allegiances
