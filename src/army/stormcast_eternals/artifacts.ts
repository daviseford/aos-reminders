import { TArtifacts } from 'types/army'
import { HERO_PHASE, CHARGE_PHASE, START_OF_HERO_PHASE, COMBAT_PHASE, SHOOTING_PHASE, DURING_GAME, MOVEMENT_PHASE, BATTLESHOCK_PHASE } from 'types/phases'

const Artifacts: TArtifacts = [
  {
    name: `Strife-ender (Storm-forged Weapons)`,
    effects: [
      {
        name: `Strife-ender (Storm-forged Weapons)`,
        desc: `Pick one of the bearer's melee weapons. Add 1 to the attacks characteristic of that weapon. Add 2 instead while all of that weapon's attacks target a CHAOS unit.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Blade of Heroes (Storm-forged Weapons)`,
    effects: [
      {
        name: `Blade of Heroes (Storm-forged Weapons)`,
        desc: `Pick one of the bearer's melee weapons. You can reroll failed hit rolls for attacks made with that weapon that target a HERO or MONSTER.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Hammer of Might (Storm-forged Weapons)`,
    effects: [
      {
        name: `Hammer of Might (Storm-forged Weapons)`,
        desc: `Pick one of the bearer's melee weapons. If the unmodified wound roll for an attack made with that weapon is 6, double the damage characteristic of that weapon for that attack.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Fang of Dracothion (Storm-forged Weapons)`,
    effects: [
      {
        name: `Fang of Dracothion (Storm-forged Weapons)`,
        desc: `Pick one of the bearer's melee weapons. You can reroll wound rolls of 1 for attacks made with that weapon.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Obsidian Blade (Storm-forged Weapons)`,
    effects: [
      {
        name: `Obsidian Blade (Storm-forged Weapons)`,
        desc: `Pick one of the bearer's melee weapons. Improve the rend characterstic of that weapon by 1.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Gift of the Six Smiths (Storm-forged Weapons)`,
    effects: [
      {
        name: `Gift of the Six Smiths (Storm-forged Weapons)`,
        desc: `Pick one of the bearer's melee weapons. Once per turn you can re-roll one failed hit roll or one failed wound roll for attacks made with that weapon.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Armour of Destiny (Heaven-Wrought Armour)`,
    effects: [
      {
        name: `Armour of Destiny (Heaven-Wrought Armour)`,
        desc: `Roll a dice each time you allocate a wound or mortal wound to the bearer. On a 6+, that wound or mortal wound is negated.`,
        when: [DURING_GAME],
      },
    ],
  },
  {
    name: `Armour of Silvered Sigmarite (Heaven-Wrought Armour)`,
    effects: [
      {
        name: `Armour of Silvered Sigmarite (Heaven-Wrought Armour)`,
        desc: `Subtract 1 from hit rolls for attacks made with melee weapons that target the bearer.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Drakescale Armour (Heaven-Wrought Armour)`,
    effects: [
      {
        name: `Drakescale Armour (Heaven-Wrought Armour)`,
        desc: `You can re-roll failed save rolls for attacks that target the bearer that have a Damage characteristic greater than 1 (i.e. 2, D3 etc).`,
        when: [DURING_GAME],
      },
    ],
  },
  {
    name: `Mirror Shield (Heaven-Wrought Armour)`,
    effects: [
      {
        name: `Mirror Shield (Heaven-Wrought Armour)`,
        desc: `Subtract 2 from hit rolls for attacks made with missile weapons that target the bearer.`,
        when: [SHOOTING_PHASE],
      },
    ],
  },
  {
    name: `Spellshield (Heaven-Wrought Armour)`,
    effects: [
      {
        name: `Spellshield (Heaven-Wrought Armour)`,
        desc: `The bearer can attempt to unbind 1 spell in each enemy hero phase in the same manner as a WIZARD. If the bearer is already a WIZARD they can attempt to unbind 1 extra spell in each enemy hero phase.`,
        when: [HERO_PHASE],
      },
    ],
  },
  {
    name: `Featherfoe Torc (Heaven-Wrought Armour)`,
    effects: [
      {
        name: `Featherfoe Torc (Heaven-Wrought Armour)`,
        desc: `Re-roll successful hit rolls for attacks that target the bearer made by models that can fly.`,
        when: [DURING_GAME],
      },
    ],
  },
  {
    name: `Talisman of Endurance (Artefacts of the Tempest)`,
    effects: [
      {
        name: `Talisman of Endurance (Artefacts of the Tempest)`,
        desc: `Add 1 to the bearer's Wounds characteristic.`,
        when: [DURING_GAME],
      },
    ],
  },
  {
    name: `Obsidian Amulet (Artefacts of the Tempest)`,
    effects: [
      {
        name: `Obsidian Amulet (Artefacts of the Tempest)`,
        desc: `Each time the bearer is affected by a spell or endless spell, roll a dice. On a 4+ ignore the effects of that spell on the bearer.`,
        when: [HERO_PHASE],
      },
    ],
  },
  {
    name: `Luckstone (Artefacts of the Tempest)`,
    effects: [
      {
        name: `Luckstone (Artefacts of the Tempest)`,
        desc: `Once per battle, you can change one hit, wound or save roll, or one roll that randomly determines a Damage characteristic, to the roll of your choice. The roll must be for an attack made by the bearer, or a save roll for an attack that targets the bearer.`,
        when: [DURING_GAME],
      },
    ],
  },
  {
    name: `Seed of Rebirth (Artefacts of the Tempest)`,
    effects: [
      {
        name: `Seed of Rebirth (Artefacts of the Tempest)`,
        desc: `In your hero phase, roll a dice for the bearer. On a 4+ heal 1 wound allocated to the bearer.`,
        when: [HERO_PHASE],
      },
    ],
  },
  {
    name: `Sigmarite Pendant (Artefacts of the Tempest)`,
    effects: [
      {
        name: `Sigmarite Pendant (Artefacts of the Tempest)`,
        desc: `If the bearer is slain by wounds or mortal wounds inflicted by an enemy unit, roll a dice. On a 4+ that enemy unit suffers D6 mortal wounds.`,
        when: [DURING_GAME],
      },
    ],
  },
  {
    name: `Quicksilver Draught (Artefacts of the Tempest)`,
    effects: [
      {
        name: `Quicksilver Draught (Artefacts of the Tempest)`,
        desc: `Once per battle, at the start of the combat phase, the bearer can drink this potion. If they do so, the bearer fights at the start of the coombat phase, before the players start picking any other units to fight in that combat phase.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Hurricane Standard (Treasured Standards)`,
    effects: [
      {
        name: `Hurricane Standard (Treasured Standards)`,
        desc: `You can re-roll run and charge rolls for friendly STORMCAST ETERNAL units wholly within 12" of the bearer at the start of the phase in which the roll is made.`,
        when: [MOVEMENT_PHASE, CHARGE_PHASE],
      },
    ],
  },
  {
    name: `Lichebone Standard (Treasured Standards)`,
    effects: [
      {
        name: `Lichebone Standard (Treasured Standards)`,
        desc: `At the start of your hero phase, you can heal 1 wound allocated to each friendly STORMCAST ETERNAL unit wholly within 9" of the bearer.`,
        when: [START_OF_HERO_PHASE],
      },
    ],
  },
  {
    name: `Pennant of Sigmaron (Treasured Standards)`,
    effects: [
      {
        name: `Pennant of Sigmaron (Treasured Standards)`,
        desc: `If a friendly STORMCAST ETERNAL unit wholly within 24" of the bearer fails a battleshock test, roll a dice. On a 2+ only one model flees from that unit.`,
        when: [BATTLESHOCK_PHASE],
      },
    ],
  },
  {
    name: `Shriving Light (Mystic Lights)`,
    effects: [
      {
        name: `Shriving Light (Mystic Lights)`,
        desc: `Subtract 1 from the Bravery characteristic of enemy units while they are within 6" of the bearer. Subtract 2 instead if it has the CHAOS keyword.`,
        when: [DURING_GAME],
      },
    ],
  },
  {
    name: `Fury Brand (Mystic Lights)`,
    effects: [
      {
        name: `Fury Brand (Mystic Lights)`,
        desc: `In your hero phase, you can pick 1 melee weapon used by a STORMCAST ETERNAL HERO within 6" of the bearer. Add 1 to the Attacks characteristic of that melee weapon until your next hero phase.`,
        when: [HERO_PHASE, COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Lantern of the Tempest (Mystic Lights)`,
    effects: [
      {
        name: `Lantern of the Tempest (Mystic Lights)`,
        desc: `Re-roll unmodified hit rolls of 6 for attacks made with missile weapons that target friendly STORMCAST ETERNAL units wholly within 12" of the bearer.`,
        when: [HERO_PHASE],
      },
    ],
  },
  {
    name: `Staff of Focus (Celestial Staves)`,
    effects: [
      {
        name: `Staff of Focus (Celestial Staves)`,
        desc: `Once per battle, in your hero phase, the bearer can use this artefact. If they do so, add 1 to casting rolls for the bearer until the end of that phase. In addition, if the bearer casts a spell that inflicts any mortal wounds during that phase, add 1 to the number of mortal wounds inflicted on each unit that the spell affects.`,
        when: [HERO_PHASE],
      },
    ],
  },
  {
    name: `Mindlock Staff (Celestial Staves)`,
    effects: [
      {
        name: `Mindlock Staff (Celestial Staves)`,
        desc: `Once per battle, at the start of the enemy hero phase, you can pick an enemy WIZARD within 12" of the bearer. That WIZARD cannot cast any spells that phase.`,
        when: [START_OF_HERO_PHASE],
      },
    ],
  },
  {
    name: `Staff of Azyr (Celestial Staves)`,
    effects: [
      {
        name: `Staff of Azyr (Celestial Staves)`,
        desc: `In your hero phase, if the bearer successfully casts any spells that are not unbound, subtract 1 from hit rolls for attacks that target the bearer until your next hero phase.`,
        when: [START_OF_HERO_PHASE, DURING_GAME],
      },
    ],
  },
  {
    name: `Scroll of Unravelling (Scrolls of Power)`,
    effects: [
      {
        name: `Scroll of Unravelling (Scrolls of Power)`,
        desc: `Once per battle, at the start of the enemy hero phase, the bearer can use this artefact. If they do so, in that hero phase, enemy casting rolls that are equal to the spell's casting value are unsuccesful and the caster suffers D3 mortal wounds.`,
        when: [START_OF_HERO_PHASE],
      },
    ],
  },
  {
    name: `Scroll of Condemnation (Scrolls of Power)`,
    effects: [
      {
        name: `Scroll of Condemnation (Scrolls of Power)`,
        desc: `Once per battle, in your hero phase, the bearer can use this artefact. If they do so, pick an enemy HERO within 12" of the bearer. Until the end of that turn, add 1 to wound rolls for attacks made by friendly STORMCAST ETERNALS that target that model.`,
        when: [HERO_PHASE],
      },
    ],
  },
  {
    name: `Storm Scroll (Scrolls of Power)`,
    effects: [
      {
        name: `Storm Scroll (Scrolls of Power)`,
        desc: `Once per battle, at the start of the enemy hero phase, the bearer can use this artefact. If they do so, pick up to 6 different enemy units on the battlefield, and give each of them a different number from 1 to 6. Then roll a dice. If there is a unit whose number is the same as the roll, that unit suffers D6 mortal wounds.`,
        when: [START_OF_HERO_PHASE],
      },
    ],
  },
]

export default Artifacts