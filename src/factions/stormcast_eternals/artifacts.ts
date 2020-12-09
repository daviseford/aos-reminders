import { tagAs } from 'factions/metatagger'
import {
  BATTLESHOCK_PHASE,
  CHARGE_PHASE,
  COMBAT_PHASE,
  DURING_GAME,
  END_OF_COMBAT_PHASE,
  HERO_PHASE,
  MOVEMENT_PHASE,
  SAVES_PHASE,
  SHOOTING_PHASE,
  START_OF_COMBAT_PHASE,
  START_OF_HERO_PHASE,
  WOUND_ALLOCATION_PHASE,
} from 'types/phases'

// Add individual artifacts here, and access them in other files!
const Artifacts = {
  'God-forged Blade': {
    effects: [
      {
        name: `God-forged Blade`,
        desc: `Pick one of the bearer's melee weapons. If the unmodified hit roll for an attack made with the God-forged Blade is 6, add 1 to the Damage characteristic of that attack.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  'Parchment of Purity': {
    effects: [
      {
        name: `Parchment of Purity`,
        desc: `In your hero phase, heal 1 wound allocated to the bearer.`,
        when: [HERO_PHASE],
      },
    ],
  },
  'Stormrage Blade': {
    effects: [
      {
        name: `Stormrage Blade`,
        desc: `Pick one of the bearer's melee weapons. At the start of the combat phase, you can add 2 to the Attacks of this weapon until the end of that phase. If you do so, subtract 1 from save rolls for attacks that target the bearer until the end of that phase.`,
        when: [START_OF_COMBAT_PHASE],
      },
    ],
  },
  Soulthief: {
    effects: [
      {
        name: `Soulthief`,
        desc: `Pick one of the bearer's melee weapons. At the end of the combat phase, roll a D6 for each enemy model that was allocated any wounds caused by this weapon in that combat phase. On a 3+ that model suffers 1 mortal wound.`,
        when: [END_OF_COMBAT_PHASE],
      },
    ],
  },
  'Chains of Celestial Lightning': {
    effects: [
      {
        name: `Chains of Celestial Lightning`,
        desc: `Once per battle, in your hero phase, the bearer can attempt to bind an enemy HERO or MONSTER model within 3". If they do so roll 3D6. Your opponent rolls 2D6 if the target is a HERO or 3D6 if it is a MONSTER or HERO MONSTER. If your roll is higher, until your next hero phase, halve the Move characteristic, run rolls and charge rolls for that enemy model, and halve the Attacks characteristic of its melee weapons. Round any fractions up.`,
        when: [HERO_PHASE],
      },
    ],
  },
  'Hammers of Augury': {
    effects: [
      {
        name: `Hammers of Augury`,
        desc: `Pick 1 enemy unit within 3" of the bearer and roll a D6. On a 3+, that unit suffers 1 mortal wound and you can roll another dice. On a 4+, that unit suffers 1 extra mortal wound.`,
        when: [END_OF_COMBAT_PHASE],
      },
    ],
  },
  "Patrician's Helm": {
    effects: [
      {
        name: `Patrician's Helm`,
        desc: `If the bearer is on the battlefield, each time you spend a command point, roll a D6. On a 5+ you receive 1 extra command point.`,
        when: [DURING_GAME],
      },
    ],
  },
  'Godbeast Plate': {
    effects: [
      {
        name: `Godbeast Plate`,
        desc: `Subtract 1 from wound rolls for attacks made by a MONSTER that target the bearer.`,
        when: [COMBAT_PHASE, SHOOTING_PHASE],
      },
    ],
  },

  'Strife-ender': {
    effects: [
      {
        name: `Strife-ender`,
        desc: `Pick one of the bearer's melee weapons. Add 1 to the attacks characteristic of that weapon. Add 2 while all of that weapon's attacks target a CHAOS unit.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  'Blade of Heroes': {
    effects: [
      {
        name: `Blade of Heroes`,
        desc: `Pick one of the bearer's melee weapons. You can reroll failed hit rolls for attacks made with that weapon that target a HERO or MONSTER.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  'Hammer of Might': {
    effects: [
      {
        name: `Hammer of Might`,
        desc: `Pick one of the bearer's melee weapons. If the unmodified wound roll for an attack made with that weapon is 6, double the damage characteristic for that attack.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  'Fang of Dracothion': {
    effects: [
      {
        name: `Fang of Dracothion`,
        desc: `Pick one of the bearer's melee weapons. You can reroll wound rolls of 1 for attacks made with that weapon.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  'Obsidian Blade': {
    effects: [
      {
        name: `Obsidian Blade`,
        desc: `Pick one of the bearer's melee weapons. Improve the rend characterstic of that weapon by 1.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  'Gift of the Six Smiths': {
    effects: [
      {
        name: `Gift of the Six Smiths`,
        desc: `Pick one of the bearer's melee weapons. Once per turn you can reroll one failed hit roll or one failed wound roll with that weapon.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  'Armour of Destiny': {
    effects: [
      {
        name: `Armour of Destiny`,
        desc: `On a 6+, an allocated wound or mortal wound is negated.`,
        when: [DURING_GAME],
      },
    ],
  },
  'Armour of Silvered Sigmarite': {
    effects: [
      {
        name: `Armour of Silvered Sigmarite`,
        desc: `Subtract 1 from hit rolls for melee attacks that target the bearer.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  'Drakescale Armour': {
    effects: [
      {
        name: `Drakescale Armour`,
        desc: `You can reroll failed save rolls for attacks that target the bearer with a Damage characteristic greater than 1 (i.e. 2, D3 etc).`,
        when: [SAVES_PHASE],
      },
    ],
  },
  Mirrorshield: {
    effects: [
      {
        name: `Mirrorshield`,
        desc: `Subtract 2 from hit rolls for missile attacks that target the bearer.`,
        when: [SHOOTING_PHASE],
      },
    ],
  },
  Spellshield: {
    effects: [
      {
        name: `Spellshield`,
        desc: `The bearer can attempt to unbind 1 spell in each enemy hero phase. If the bearer is already a WIZARD they can attempt to unbind 1 extra spell.`,
        when: [HERO_PHASE],
      },
    ],
  },
  'Featherfoe Torc': {
    effects: [
      {
        name: `Featherfoe Torc`,
        desc: `Reroll successful hit rolls for attacks that target the bearer made by models that can fly.`,
        when: [DURING_GAME],
      },
    ],
  },
  'Talisman of Endurance': {
    effects: [
      {
        name: `Talisman of Endurance`,
        desc: `Add 1 to the bearer's Wounds.`,
        when: [DURING_GAME],
      },
    ],
  },
  'Obsidian Amulet': {
    effects: [
      {
        name: `Obsidian Amulet`,
        desc: `On a 4+ ignore the effects of spells/endless spells on the bearer.`,
        when: [HERO_PHASE],
      },
    ],
  },
  Luckstone: {
    effects: [
      {
        name: `Luckstone`,
        desc: `Once per battle, you can change one hit, wound or save roll, or one roll that randomly determines Damage, to the roll of your choice. The roll must be for an attack made by the bearer, or a save roll for an attack that targets the bearer.`,
        when: [DURING_GAME],
      },
    ],
  },
  'Seed of Rebirth': {
    effects: [
      {
        name: `Seed of Rebirth`,
        desc: `On a 4+ heal 1 wound allocated to the bearer.`,
        when: [HERO_PHASE],
      },
    ],
  },
  'Sigmarite Pendant': {
    effects: [
      {
        name: `Sigmarite Pendant`,
        desc: `If the bearer is slain by wounds or mortal wounds inflicted by an enemy unit, roll a D6. On a 4+ that enemy unit suffers D6 mortal wounds.`,
        when: [WOUND_ALLOCATION_PHASE],
      },
    ],
  },
  'Quicksilver Draught': {
    effects: [
      {
        name: `Quicksilver Draught`,
        desc: `Once per battle, the bearer can drink this potion. If they do, they fight at the start of the coombat phase, before the players start picking any other units.`,
        when: [START_OF_COMBAT_PHASE],
      },
    ],
  },
  'Hurricane Standard': {
    effects: [
      {
        name: `Hurricane Standard`,
        desc: `You can reroll run and charge rolls for friendly STORMCAST ETERNAL units wholly within 12" of the bearer at the start of the phase in which the roll is made.`,
        when: [MOVEMENT_PHASE, CHARGE_PHASE],
      },
    ],
  },
  'Lichebone Standard': {
    effects: [
      {
        name: `Lichebone Standard`,
        desc: `You can heal 1 wound allocated to each friendly STORMCAST ETERNAL unit wholly within 9".`,
        when: [START_OF_HERO_PHASE],
      },
    ],
  },
  'Pennant of Sigmaron': {
    effects: [
      {
        name: `Pennant of Sigmaron`,
        desc: `If a friendly STORMCAST ETERNAL unit wholly within 24" fails a battleshock test, roll a D6. On a 2+ only one model flees.`,
        when: [BATTLESHOCK_PHASE],
      },
    ],
  },
  'Shriving Light': {
    effects: [
      {
        name: `Shriving Light`,
        desc: `Subtract 1 from the Bravery characteristic of enemy units while they are within 6". Subtract 2 if it has the CHAOS keyword.`,
        when: [DURING_GAME],
      },
    ],
  },
  'Fury Brand': {
    effects: [
      {
        name: `Fury Brand`,
        desc: `Pick 1 melee weapon used by a STORMCAST ETERNAL HERO within 6" of the bearer. Add 1 to its Attacks until your next hero phase.`,
        when: [HERO_PHASE, COMBAT_PHASE],
      },
    ],
  },
  'Lantern of the Tempest': {
    effects: [
      {
        name: `Lantern of the Tempest`,
        desc: `Reroll unmodified hit rolls of 6 for missile attacks that target friendly STORMCAST ETERNAL units wholly within 12".`,
        when: [HERO_PHASE],
      },
    ],
  },
  'Staff of Focus': {
    effects: [
      {
        name: `Staff of Focus`,
        desc: `Once per battle, add 1 to casting rolls for the bearer until the end of that phase. In addition, if the bearer casts a spell that inflicts any mortal wounds during that phase, add 1 to the number of mortal wounds inflicted on each unit.`,
        when: [HERO_PHASE],
      },
    ],
  },
  'Mindlock Staff': {
    effects: [
      {
        name: `Mindlock Staff`,
        desc: `Once per battle, you can pick an enemy WIZARD within 12". That WIZARD cannot cast any spells that phase.`,
        when: [START_OF_HERO_PHASE],
      },
    ],
  },
  'Staff of Azyr': {
    effects: [
      {
        name: `Staff of Azyr`,
        desc: `In any hero phase, if the bearer successfully casts any spells that are not unbound, subtract 1 from hit rolls for attacks that target the bearer until your next hero phase.`,
        when: [DURING_GAME],
      },
    ],
  },
  'Scroll of Unravelling': {
    effects: [
      {
        name: `Scroll of Unravelling`,
        desc: `Once per battle, at the start of the enemy hero phase, enemy casting rolls that are equal to the spell's casting value are unsuccesful and the caster suffers D3 mortal wounds.`,
        when: [START_OF_HERO_PHASE],
      },
    ],
  },
  'Scroll of Condemnation': {
    effects: [
      {
        name: `Scroll of Condemnation`,
        desc: `Once per battle, in your hero phase, pick an enemy HERO within 12". Until the end of that turn, add 1 to wound rolls for attacks made by friendly STORMCAST ETERNALS that target that model.`,
        when: [HERO_PHASE],
      },
    ],
  },
  'Storm Scroll': {
    effects: [
      {
        name: `Storm Scroll`,
        desc: `Once per battle, pick up to 6 different enemy units, and give each of them a different number from 1 to 6. Then roll a D6. The unit whose number is the same as the roll, suffers D6 mortal wounds.`,
        when: [HERO_PHASE],
      },
    ],
  },
}

// Always export using tagAs
export default tagAs(Artifacts, 'artifact')
