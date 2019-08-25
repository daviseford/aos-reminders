import { TArtifacts } from 'types/army'
import {
  BATTLESHOCK_PHASE,
  CHARGE_PHASE,
  COMBAT_PHASE,
  DURING_GAME,
  HERO_PHASE,
  MOVEMENT_PHASE,
  SHOOTING_PHASE,
  START_OF_COMBAT_PHASE,
  START_OF_HERO_PHASE,
} from 'types/phases'

const Artifacts: TArtifacts = [
  {
    name: `Strife-ender`,
    effects: [
      {
        name: `Strife-ender`,
        desc: `Pick one of the bearer's melee weapons. Add 1 to the attacks characteristic of that weapon. Add 2 while all of that weapon's attacks target a CHAOS unit.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Blade of Heroes`,
    effects: [
      {
        name: `Blade of Heroes`,
        desc: `Pick one of the bearer's melee weapons. You can reroll failed hit rolls for attacks made with that weapon that target a HERO or MONSTER.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Hammer of Might`,
    effects: [
      {
        name: `Hammer of Might`,
        desc: `Pick one of the bearer's melee weapons. If the unmodified wound roll for an attack made with that weapon is 6, double the damage characteristic for that attack.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Fang of Dracothion`,
    effects: [
      {
        name: `Fang of Dracothion`,
        desc: `Pick one of the bearer's melee weapons. You can reroll wound rolls of 1 for attacks made with that weapon.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Obsidian Blade`,
    effects: [
      {
        name: `Obsidian Blade`,
        desc: `Pick one of the bearer's melee weapons. Improve the rend characterstic of that weapon by 1.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Gift of the Six Smiths`,
    effects: [
      {
        name: `Gift of the Six Smiths`,
        desc: `Pick one of the bearer's melee weapons. Once per turn you can re-roll one failed hit roll or one failed wound roll with that weapon.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Armour of Destiny`,
    effects: [
      {
        name: `Armour of Destiny`,
        desc: `On a 6+, an allocated wound or mortal wound is negated.`,
        when: [DURING_GAME],
      },
    ],
  },
  {
    name: `Armour of Silvered Sigmarite`,
    effects: [
      {
        name: `Armour of Silvered Sigmarite`,
        desc: `Subtract 1 from hit rolls for melee attacks that target the bearer.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Drakescale Armour`,
    effects: [
      {
        name: `Drakescale Armour`,
        desc: `You can re-roll failed save rolls for attacks that target the bearer with a Damage characteristic greater than 1 (i.e. 2, D3 etc).`,
        when: [DURING_GAME],
      },
    ],
  },
  {
    name: `Mirror Shield`,
    effects: [
      {
        name: `Mirror Shield`,
        desc: `Subtract 2 from hit rolls for missile attacks that target the bearer.`,
        when: [SHOOTING_PHASE],
      },
    ],
  },
  {
    name: `Spellshield`,
    effects: [
      {
        name: `Spellshield`,
        desc: `The bearer can attempt to unbind 1 spell in each enemy hero phase. If the bearer is already a WIZARD they can attempt to unbind 1 extra spell.`,
        when: [HERO_PHASE],
      },
    ],
  },
  {
    name: `Featherfoe Torc`,
    effects: [
      {
        name: `Featherfoe Torc`,
        desc: `Re-roll successful hit rolls for attacks that target the bearer made by models that can fly.`,
        when: [DURING_GAME],
      },
    ],
  },
  {
    name: `Talisman of Endurance`,
    effects: [
      {
        name: `Talisman of Endurance`,
        desc: `Add 1 to the bearer's Wounds.`,
        when: [DURING_GAME],
      },
    ],
  },
  {
    name: `Obsidian Amulet`,
    effects: [
      {
        name: `Obsidian Amulet`,
        desc: `On a 4+ ignore the effects of spells/endless spells on the bearer.`,
        when: [HERO_PHASE],
      },
    ],
  },
  {
    name: `Luckstone`,
    effects: [
      {
        name: `Luckstone`,
        desc: `Once per battle, you can change one hit, wound or save roll, or one roll that randomly determines Damage, to the roll of your choice. The roll must be for an attack made by the bearer, or a save roll for an attack that targets the bearer.`,
        when: [DURING_GAME],
      },
    ],
  },
  {
    name: `Seed of Rebirth`,
    effects: [
      {
        name: `Seed of Rebirth`,
        desc: `On a 4+ heal 1 wound allocated to the bearer.`,
        when: [HERO_PHASE],
      },
    ],
  },
  {
    name: `Sigmarite Pendant`,
    effects: [
      {
        name: `Sigmarite Pendant`,
        desc: `If the bearer is slain by wounds or mortal wounds inflicted by an enemy unit, roll a D6. On a 4+ that enemy unit suffers D6 mortal wounds.`,
        when: [DURING_GAME],
      },
    ],
  },
  {
    name: `Quicksilver Draught`,
    effects: [
      {
        name: `Quicksilver Draught`,
        desc: `Once per battle, the bearer can drink this potion. If they do, they fight at the start of the coombat phase, before the players start picking any other units.`,
        when: [START_OF_COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Hurricane Standard`,
    effects: [
      {
        name: `Hurricane Standard`,
        desc: `You can re-roll run and charge rolls for friendly STORMCAST ETERNAL units wholly within 12" of the bearer at the start of the phase in which the roll is made.`,
        when: [MOVEMENT_PHASE, CHARGE_PHASE],
      },
    ],
  },
  {
    name: `Lichebone Standard`,
    effects: [
      {
        name: `Lichebone Standard`,
        desc: `You can heal 1 wound allocated to each friendly STORMCAST ETERNAL unit wholly within 9".`,
        when: [START_OF_HERO_PHASE],
      },
    ],
  },
  {
    name: `Pennant of Sigmaron`,
    effects: [
      {
        name: `Pennant of Sigmaron`,
        desc: `If a friendly STORMCAST ETERNAL unit wholly within 24" fails a battleshock test, roll a D6. On a 2+ only one model flees.`,
        when: [BATTLESHOCK_PHASE],
      },
    ],
  },
  {
    name: `Shriving Light`,
    effects: [
      {
        name: `Shriving Light`,
        desc: `Subtract 1 from the Bravery characteristic of enemy units while they are within 6". Subtract 2 if it has the CHAOS keyword.`,
        when: [DURING_GAME],
      },
    ],
  },
  {
    name: `Fury Brand`,
    effects: [
      {
        name: `Fury Brand`,
        desc: `Pick 1 melee weapon used by a STORMCAST ETERNAL HERO within 6" of the bearer. Add 1 to its Attacks until your next hero phase.`,
        when: [HERO_PHASE, COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Lantern of the Tempest`,
    effects: [
      {
        name: `Lantern of the Tempest`,
        desc: `Re-roll unmodified hit rolls of 6 for missile attacks that target friendly STORMCAST ETERNAL units wholly within 12".`,
        when: [HERO_PHASE],
      },
    ],
  },
  {
    name: `Staff of Focus`,
    effects: [
      {
        name: `Staff of Focus`,
        desc: `Once per battle. Add 1 to casting rolls for the bearer until the end of that phase. In addition, if the bearer casts a spell that inflicts any mortal wounds during that phase, add 1 to the number of mortal wounds inflicted on each unit.`,
        when: [HERO_PHASE],
      },
    ],
  },
  {
    name: `Mindlock Staff`,
    effects: [
      {
        name: `Mindlock Staff`,
        desc: `Once per battle, you can pick an enemy WIZARD within 12". That WIZARD cannot cast any spells that phase.`,
        when: [START_OF_HERO_PHASE],
      },
    ],
  },
  {
    name: `Staff of Azyr`,
    effects: [
      {
        name: `Staff of Azyr`,
        desc: `In any hero phase, if the bearer successfully casts any spells that are not unbound, subtract 1 from hit rolls for attacks that target the bearer until your next hero phase.`,
        when: [DURING_GAME],
      },
    ],
  },
  {
    name: `Scroll of Unravelling`,
    effects: [
      {
        name: `Scroll of Unravelling`,
        desc: `Once per battle, at the start of the enemy hero phase, enemy casting rolls that are equal to the spell's casting value are unsuccesful and the caster suffers D3 mortal wounds.`,
        when: [START_OF_HERO_PHASE],
      },
    ],
  },
  {
    name: `Scroll of Condemnation`,
    effects: [
      {
        name: `Scroll of Condemnation`,
        desc: `Once per battle, in your hero phase, pick an enemy HERO within 12". Until the end of that turn, add 1 to wound rolls for attacks made by friendly STORMCAST ETERNALS that target that model.`,
        when: [HERO_PHASE],
      },
    ],
  },
  {
    name: `Storm Scroll`,
    effects: [
      {
        name: `Storm Scroll`,
        desc: `Once per battle, pick up to 6 different enemy units, and give each of them a different number from 1 to 6. Then roll a D6. The unit whose number is the same as the roll, suffers D6 mortal wounds.`,
        when: [HERO_PHASE],
      },
    ],
  },
]

export default Artifacts
