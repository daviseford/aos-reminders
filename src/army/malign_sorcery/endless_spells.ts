import { IEntry } from 'types/data'
import {
  BATTLESHOCK_PHASE,
  CHARGE_PHASE,
  COMBAT_PHASE,
  DURING_GAME,
  DURING_ROUND,
  END_OF_ROUND,
  HERO_PHASE,
  MOVEMENT_PHASE,
  SHOOTING_PHASE,
  START_OF_TURN,
} from 'types/phases'

const EndlessSpells: IEntry[] = [
  {
    name: `Balewind Vortex`,
    effects: [
      {
        name: `Summon Balewind Vortex`,
        desc: `Summon Balewind Vortex has a casting value of 6. Wizards with a Wounds characteristic of 9 or more, that are part of a unit of two or more models, or that are already on a Balewind Vortex, cannot attempt to cast this spell. If successfully cast, set up a Balewind Vortex model within 1" of the caster and more than 3" from any enemy models, and then place the caster on the upper platform.`,
        when: [HERO_PHASE],
      },
      {
        name: `Against the Aetheric Wind`,
        desc: `Add 1 to save rolls for a Wizard on a Balewind Vortex.`,
        when: [COMBAT_PHASE, SHOOTING_PHASE],
      },
      {
        name: `Arcane Invigoration`,
        desc: `A Wizard on a Balewind Vortex can attempt to cast an additional spell in each of their hero phases (including the turn in which the Summon Balewind Vortex spell was cast), and you can add 6" to the range of any spells that the Wizard casts.`,
        when: [HERO_PHASE],
      },
    ],
  },
  {
    name: `Emerald Lifeswarm`,
    effects: [
      {
        name: `Summon Emerald Lifeswarm`,
        desc: `Summon Emerald Lifeswarm has a casting value of 6. If successfully cast, set up an Emerald Lifeswarm model wholly within 15" of the caster.`,
        when: [HERO_PHASE],
      },
      {
        name: `Predatory`,
        desc: `An Emerald Lifeswarm is a predatory endless spell. Emerald Lifeswarms can move up to 10" and can fly.`,
        when: [HERO_PHASE],
      },
      {
        name: `Bounteous Healing`,
        desc: `After this model is set up or after it has moved, pick 1 unit within 1" of it. You can either heal D3 wounds that have been allocated to that unit or, if no wounds are currently allocated to the unit, you may return a number of slain models to it that have a combined Wounds characteristic equal to or less than the roll of a D3.`,
        when: [HERO_PHASE],
      },
      {
        name: `Empowered by Ghyran`,
        desc: `If your battle is taking place in the Realm of Life, roll a D6 to determine the number of wounds healed or wounds worth of slain models returned by the Emerald Lifeswarm's Bounteous Healing ability.`,
        when: [HERO_PHASE],
      },
    ],
  },
  {
    name: `Geminids of Uhl-Gysh`,
    effects: [
      {
        name: `Summon Geminids of Uhl-Gysh`,
        desc: `Summon Geminids of Uhl-Gysh has a casting value of 7. If successfully cast, set up both models within 6" of each other and both wholly within 18" of the caster. You must then nominate one model to be the Light Geminid and the other to be the Shadow Geminid.`,
        when: [HERO_PHASE],
      },
      {
        name: `Predatory`,
        desc: `Geminids of Uhl-Gysh is a predatory endless spell. They can move up to 8" and can fly. When you move this endless spell, the second model must finish its move within 6" of the first. If this is impossible, this spell is dispelled.`,
        when: [HERO_PHASE],
      },
      {
        name: `Unleashed`,
        desc: `When this model is set up, the player who set it up can immediately make a move with it.`,
        when: [HERO_PHASE],
      },
      {
        name: `Tendrils of Shadow and Light`,
        desc: `After the Shadow Geminid model has moved, each unit that has any models it passed across suffers D3 mortal wounds. In addition, subtract 1 (to a minimum of 1) from the Attacks characteristic of melee weapons used by each unit that has any models it passed across until the end of the battle round. After the Light Geminid model has moved, each unit that has any models it passed across suffers D3 mortal wounds. In addition, subtract 1 from hit rolls for each unit that has any models it passed across until the end of the battle round.`,
        when: [HERO_PHASE],
      },
      {
        name: `Empowered by Hysh`,
        desc: `If your battle is taking place in the Realm of Light, you can re-roll the dice to determine the number of mortal wounds suffered by a unit that has any models passed across by the Light Geminid.`,
        when: [HERO_PHASE],
      },
      {
        name: `Empowered by Ulgu`,
        desc: `If your battle is taking place in the Realm of Shadow, you can re-roll the dice to determine the number of mortal wounds suffered by a unit that has any models passed across by the Shadow Geminid.`,
        when: [HERO_PHASE],
      },
    ],
  },
  {
    name: `Malevolent Maelstrom`,
    effects: [
      {
        name: `Summon Malevolent Maelstrom`,
        desc: `Summon Malevolent Maelstrom has a casting value of 7. If successfully cast, set up a Malevolent Maelstrom model wholly within 18" of the caster.`,
        when: [HERO_PHASE],
      },
      {
        name: `Predatory`,
        desc: `A Malevolent Maelstrom is a predatory endless spell. It can move up to 8" and can fly.`,
        when: [HERO_PHASE],
      },
      {
        name: `Devourer of Sorcery and Souls`,
        desc: `If a WIZARD successfully casts a spell within 12" of a Malevolent Maelstrom, and that spell is not unbound, the Malevolent Maelstrom will attempt to steal the energies of the spell. Make an additional unbinding roll for that spell. If this unbinding roll is successful, the spell is unbound and 1 energy point is allocated to this model.In addition, 1 energy point is allocated to this model for each unit destroyed within 6" of this model.`,
        when: [HERO_PHASE],
      },
      {
        name: `Morbid Detonation`,
        desc: `At the end of each battle round, roll a dice for each Malevolent Maelstrom and add the number of energy points allocated to that model to the roll. On a 7+ that Malevolent Maelstrom explodes. Each unit within 3D6" of the model that exploded suffers D3 mortal wounds. The model that exploded is then dispelled.`,
        when: [END_OF_ROUND],
      },
      {
        name: `Empowered by Shyish`,
        desc: `If your battle is taking place in the Realm of Death, allocate 1 additional energy point to this model at the start of each battle round.`,
        when: [HERO_PHASE],
      },
    ],
  },
  {
    name: `Prismatic Palisade`,
    effects: [
      {
        name: `Summon Prismatic Palisade`,
        desc: `Summon Prismatic Palisade has a casting value of 5. If successfully cast, set up a Prismatic Palisade model wholly within 18" of the caster.`,
        when: [HERO_PHASE],
      },
      {
        name: `Blinding Light`,
        desc: `At the start of each turn, roll a dice for each unit within 6" of this model. On a 5+ subtract 1 from hit rolls for attacks made by that unit until the end of the turn.`,
        when: [START_OF_TURN],
      },
      {
        name: `Dazzling Brilliance`,
        desc: `A model cannot see another model if an imaginary straight line, 1mm wide, drawn from the centre of its base to the centre of the other model's base passes over this model.`,
        when: [DURING_GAME],
      },
      {
        name: `Empowered by Hysh`,
        desc: `If your battle is taking place in the Realm of Light, add 1 to rolls made to determine if a unit is affected by this model's Blinding Light ability.`,
        when: [HERO_PHASE],
      },
    ],
  },
  {
    name: `Purple Sun of Shyish`,
    effects: [
      {
        name: `Summon Purple Sun of Shyish`,
        desc: `Summon Purple Sun of Shyish has a casting value of 8. If successfully cast, set up a Purple Sun of Shyish model wholly within 6" of the caster.`,
        when: [HERO_PHASE],
      },
      {
        name: `Predatory`,
        desc: `The Purple Sun of Shyish is a predatory endless spell. It can move up to 9" and can fly.`,
        when: [HERO_PHASE],
      },
      {
        name: `Swirling Death`,
        desc: `When this model is set up, the player who set it up can immediately make a move with it.`,
        when: [HERO_PHASE],
      },
      {
        name: `End Given Form`,
        desc: `After this model has moved, each unit that has any models it passed across, and each other unit that is within 1" of it at the end of its move, is subjected to the Purple Sun's baleful energies. For each unit subjected to the baleful energies, roll a number of dice equal to the number of models in that unit. For each 6+ one model in that unit is slain. If the unit has Wounds characteristic of 6 or more, it suffers 2D6 mortal wounds instead.`,
        when: [HERO_PHASE],
      },
      {
        name: `Visage of Xereus`,
        desc: `Subtract 1 from the Bravery characteristic of all units while they are within 6" of this model.`,
        when: [BATTLESHOCK_PHASE],
      },
      {
        name: `Empowered by Shyish`,
        desc: `If your battle is taking place in the Realm of Death, this model can move 12" instead of 9".`,
        when: [HERO_PHASE],
      },
    ],
  },
  {
    name: `Quicksilver Swords`,
    effects: [
      {
        name: `Summon Quicksilver Swords`,
        desc: `Summon Quicksilver Swords has a casting value of 6. If successfully cast, set up a Quicksilver Swords model wholly within 10" of the caster.`,
        when: [HERO_PHASE],
      },
      {
        name: `Predatory`,
        desc: `Quicksilver Swords is a predatory endless spell. It can move up to 8" and can fly.`,
        when: [HERO_PHASE],
      },
      {
        name: `Volley of Blades`,
        desc: `When this model is set up, the player who set it up can immediately make a move with it.`,
        when: [HERO_PHASE],
      },
      {
        name: `Dancing Blades`,
        desc: `After this model has moved, you can pick 1 unit within 6" of it and roll 12 dice. For each roll of 6+ that unit suffers 1 mortal wound. If the unit being rolled for is a CHAOS unit, it suffers 1 mortal wound for each roll of 5+ instead.`,
        when: [HERO_PHASE],
      },
      {
        name: `Empowered by Chamon`,
        desc: `If your battle is taking place in the Realm of Metal, you can roll 15 dice for this model's Dancing Blades ability instead of 12.`,
        when: [HERO_PHASE],
      },
    ],
  },
  {
    name: `Ravenak's Gnashing Jaws`,
    effects: [
      {
        name: `Summon Ravenak's Gnashing Jaws`,
        desc: `Summon Ravenak's Gnashing Jaws has a casting value of 8. If successfully cast, set up a Ravenak's Gnashing Jaws model wholly within 6" of the caster.`,
        when: [HERO_PHASE],
      },
      {
        name: `Predatory`,
        desc: `Ravenak's Gnashing Jaws is a predatory endless spell. It can move up to 12" and can fly.`,
        when: [HERO_PHASE],
      },
      {
        name: `Endless Appetite`,
        desc: `When this model is set up, the player who set it up can immediately make a move with it.`,
        when: [HERO_PHASE],
      },
      {
        name: `Ravening Hunger`,
        desc: `After this model has moved, each unit that has any models it passed across, and each other unit that is within 1" of it at the end of its move, suffers D3 mortal wounds.`,
        when: [HERO_PHASE],
      },
      {
        name: `Ravening Hunger`,
        desc: `Subtract 1 from the Bravery characteristic of each unit that has any models it passed across until the end of the battle round.`,
        when: [BATTLESHOCK_PHASE],
      },
      {
        name: `Empowered by Ghur`,
        desc: `If your battle is taking place in the Realm of Beasts, this model can move up to D6+12" instead of 12".`,
        when: [HERO_PHASE],
      },
    ],
  },
  {
    name: `Soulsnare Shackles`,
    effects: [
      {
        name: `Summon Soulsnare Shackles`,
        desc: `Summon Soulsnare Shackles has a casting value of 5. If successfully cast, set up a Soulsnare Shackles model wholly within 12" of the caster, then set up the second and third Soulsnare Shackles models wholly within 6" of the first.`,
        when: [HERO_PHASE],
      },
      {
        name: `Bound for the Great Oubliette`,
        desc: `At the start of the movement phase, roll a dice for each unit within 6" of any Soulsnare Shackles models. On a 3+ halve the move characteristic of that unit until the end of that phase. On a 6 that unit also suffers D3 mortal wounds.`,
        when: [MOVEMENT_PHASE],
      },
      {
        name: `Empowered by Shyish`,
        desc: `If your battle is taking place in the Realm of Death, the second and third Soulsnare Shackles models can be set up wholly within 9" of the first, instead of 6"`,
        when: [HERO_PHASE],
      },
    ],
  },
  {
    name: `Suffocating Gravetide`,
    effects: [
      {
        name: `Summon Suffocating Gravetide`,
        desc: `Summon Suffocating Gravetide has a casting value of 6. If successfully cast, set up a Suffocating Gravetide model wholly within 4" of the caster.`,
        when: [HERO_PHASE],
      },
      {
        name: `Predatory`,
        desc: `A Suffocating Gravetide is a predatory endless spell. It can move up to 8" and can fly.`,
        when: [HERO_PHASE],
      },
      {
        name: `Necrotic Tide`,
        desc: `When this model is set up, the player who set it up can immediately make a move with it.`,
        when: [HERO_PHASE],
      },
      {
        name: `Pulled to the Grave`,
        desc: `After this model has moved, each unit that has any models it passed across suffers D3 mortal wounds.`,
        when: [HERO_PHASE],
      },
      {
        name: `Pulled to the Grave`,
        desc: `Subtract 1 from the Bravery characteristic of each unit that has any models the Suffocating Gravetide passed across until the end of the battle round.`,
        when: [BATTLESHOCK_PHASE],
      },
      {
        name: `Roiling Barricade`,
        desc: `When a missile weapon targets a unit that has all of its models within 1" of this model, the target unit receives the benefit of cover if the attacking unit is closer to this model than it is to the target unit.`,
        when: [SHOOTING_PHASE],
      },
      {
        name: `Empowered by Shyish`,
        desc: `If your battle is taking place in the Realm of Death, this model can move up to 12" instead of 8".`,
        when: [HERO_PHASE],
      },
    ],
  },
  {
    name: `Burning Head`,
    effects: [
      {
        name: `Summon Burning Head`,
        desc: `Summon Burning Head has a casting value of 7. If successfully cast, set up a Burning Head model wholly within 3" of the caster.`,
        when: [HERO_PHASE],
      },
      {
        name: `Predatory`,
        desc: `The Burning Head is a predatory endless spell. It can move up to 9" and can fly.`,
        when: [HERO_PHASE],
      },
      {
        name: `Fiery Missile`,
        desc: `When this model is set up, the player who set it up can immediately make a move with it.`,
        when: [HERO_PHASE],
      },
      {
        name: `Flaming Skull`,
        desc: `After this model has moved, each unit that has any models it passed across, and each other unit that is within 1" of it at the end of its move, suffers D3 mortal wounds.`,
        when: [HERO_PHASE],
      },
      {
        name: `Wrathful Aura`,
        desc: `Re-roll hit rolls of 1 for attacks made by units while they are wholly within 9" of this model.`,
        when: [SHOOTING_PHASE, COMBAT_PHASE],
      },
      {
        name: `Empowered by Aqshy`,
        desc: `Re-roll hit rolls of 1 for attacks made by units while they are wholly within 9" of this model.`,
        when: [HERO_PHASE],
      },
    ],
  },
  {
    name: `Umbral Spellportal`,
    effects: [
      {
        name: `Summon Umbral Spellportal`,
        desc: `Summon Umbral Spellportal has a casting value of 5. If successfully cast, set up the first Umbral Spellportal model wholly within 12" of the caster, and then set up the second Umbral Spellportal model wholly within 18" of the first.`,
        when: [HERO_PHASE],
      },
      {
        name: `Arcane Passage`,
        desc: `If a WIZARD successfully casts a spell while they are within 1" of an Umbral Spellportal model, the range and visibility of the spell can be measured from the other Umbral Spellportal model from this endless spell. If a predatory endless spell finishes a move within 6" of an Umbral Spellportal model, remove it from the battlefield and set it up again anywhere within 6" of the other Umbral Spellportal model from this endless spell.`,
        when: [HERO_PHASE],
      },
      {
        name: `Empowered by Ulgu`,
        desc: `If your battle is taking place in the Realm of Shadow, the second Umbral Spellportal model can be set up anywhere on the battlefield, instead of within 18" of the first.`,
        when: [HERO_PHASE],
      },
    ],
  },
  {
    name: `Aethervoid Pendulum`,
    effects: [
      {
        name: `Summon Aethervoid Pendulum`,
        desc: `Summon Aethervoid Pendulum has a casting value of 6. If successfully cast, set up an Aethervoid Pendulum model wholly within 6" of the caster so that it points lengthways in the direction you wish it to move.`,
        when: [HERO_PHASE],
      },
      {
        name: `Predatory`,
        desc: `Aethervoid Pendulum.`,
        when: [HERO_PHASE],
      },
      {
        name: `Slicing into Reality`,
        desc: `When this model is set up, the player who set it up can immediately make a move with it.`,
        when: [HERO_PHASE],
      },
      {
        name: `Scything Blade`,
        desc: `After this model has moved, each unit that has any models it passed across, and each other unit that is within 1" of it at the end of its move, suffers D6 mortal wounds.`,
        when: [HERO_PHASE],
      },
      {
        name: `Unstoppable Mechanism`,
        desc: `Whenever you set up an Aethervoid Pendulum, you must place it lengthways in the direction you wish it to move. Whenever it moves, move it in a straight line in that direction.`,
        when: [HERO_PHASE],
      },
    ],
  },
  {
    name: `Chronomantic Cogs`,
    effects: [
      {
        name: `Summon Chronomantic Cogs`,
        desc: `Summon Chronomantic Cogs has a casting value of 7. If successfully cast, set up a Chronomantic Cogs model wholly within 12" of the caster.`,
        when: [HERO_PHASE],
      },
      {
        name: `Mechanisms of Time`,
        desc: `In their controlling player's hero phase, a single WIZARD within 9" of this model may manipulate the cogs to increase or decrease the flow of time. They may do this in the same phase as the Chronomantic Cogs are set up. If they do so, choose one of the effects opposite. The effect lasts until their next hero phase, or until an enemy WIZARD chooses to manipulate the cogs.`,
        when: [HERO_PHASE],
      },
      {
        name: `Speed Up Time`,
        desc: `Add 2" to the Move characteristic of all units on the battlefield. In addition, add 2 to charge rolls for all units on the battlefield.`,
        when: [MOVEMENT_PHASE, CHARGE_PHASE],
      },
      {
        name: `Slow Down Time`,
        desc: `The wizard manipulating the cogs can cast 1 additional spell in this hero phase. In addition, re-roll failed save rolls for that wizard.`,
        when: [HERO_PHASE, DURING_ROUND],
      },
    ],
  },
]

export default EndlessSpells
