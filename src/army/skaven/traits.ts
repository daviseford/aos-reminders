import { TTraits } from 'types/army'
import {
  BATTLESHOCK_PHASE,
  COMBAT_PHASE,
  DURING_GAME,
  HERO_PHASE,
  MOVEMENT_PHASE,
  SHOOTING_PHASE,
  START_OF_COMBAT_PHASE,
  START_OF_HERO_PHASE,
  START_OF_SHOOTING_PHASE,
} from 'types/phases'

const CommandTraits: TTraits = [
  {
    name: `Malevolent (Masterclan)`,
    effects: [
      {
        name: `Malevolent (Masterclan)`,
        desc: `You can re-roll wound rolls of 1 for attacks made with melee weapons by this general.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Verminous Valour (Masterclan)`,
    effects: [
      {
        name: `Verminous Valour (Masterclan)`,
        desc: `Before you allocate a wound or mortal wound to this general, you can roll a D6. Subtract 1 from the roll if this general is a MONSTER or WAR MACHINE. On a 4+, instead of allocating the wound or mortal wound to this general, you can allocate it to a friendly SKAVENTIDE unit within 3" of this general.`,
        when: [DURING_GAME],
      },
    ],
  },
  {
    name: `Savage Overlord (Masterclan)`,
    effects: [
      {
        name: `Savage Overlord (Masterclan)`,
        desc: `Add 1 to the Bravery characteristic of friendly SKAVENTIDE units while they are wholly within 18" of this general.`,
        when: [BATTLESHOCK_PHASE],
      },
    ],
  },
  {
    name: `Supreme Manipulator (Masterclan)`,
    effects: [
      {
        name: `Supreme Manipulator (Masterclan)`,
        desc: `You can re-roll the dice that determines if you receive 1 extra command point when you use the Skilled Manipulators battle trait after this general uses a command ability.`,
        when: [DURING_GAME],
      },
    ],
  },
  {
    name: `Master of Magic (Masterclan)`,
    effects: [
      {
        name: `Master of Magic (Masterclan)`,
        desc: `Once per hero phase, you can add 1 to a casting, dispelling or unbinding roll for this general.`,
        when: [HERO_PHASE],
      },
    ],
  },
  {
    name: `Cunning (Masterclan)`,
    effects: [
      {
        name: `Cunning (Masterclan)`,
        desc: `After the battle has started, roll a D6 each time your opponent receives a command point. On a 6 you receive the command point instead of them.`,
        when: [DURING_GAME],
      },
    ],
  },
  {
    name: `Malevolent (Skryre)`,
    effects: [
      {
        name: `Malevolent (Skryre)`,
        desc: `You can re-roll wound rolls of 1 for attacks made with melee weapons by this general.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Verminous Valour (Skryre)`,
    effects: [
      {
        name: `Verminous Valour (Skryre)`,
        desc: `Before you allocate a wound or mortal wound to this general, you can roll a D6. Subtract 1 from the roll if this general is a MONSTER or WAR MACHINE. On a 4+, instead of allocating the wound or mortal wound to this general, you can allocate it to a friendly SKAVENTIDE unit within 3" of this general.`,
        when: [DURING_GAME],
      },
    ],
  },
  {
    name: `Savage Overlord (Skryre)`,
    effects: [
      {
        name: `Savage Overlord (Skryre)`,
        desc: `Add 1 to the Bravery characteristic of friendly SKAVENTIDE units while they are wholly within 18" of this general.`,
        when: [BATTLESHOCK_PHASE],
      },
    ],
  },
  {
    name: `Masterful Scavenger (Skryre)`,
    effects: [
      {
        name: `Masterful Scavenger (Skryre)`,
        desc: `Add 2 to the number of warpstone sparks this general's army can use during a battle.`,
        when: [DURING_GAME],
      },
    ],
  },
  {
    name: `Deranged Inventor (Skryre)`,
    effects: [
      {
        name: `Deranged Inventor (Skryre)`,
        desc: `At the start of your shooting phase, you can pick 1 friendly CLANS SKRYRE unit that is wholly within 13" of this general. You can re-roll hit rolls for attacks made with missile weapons by that unit until the end of that phase.`,
        when: [START_OF_SHOOTING_PHASE],
      },
    ],
  },
  {
    name: `Overseer of Destruction (Skryre)`,
    effects: [
      {
        name: `Overseer of Destruction (Skryre)`,
        desc: `At the start of your shooting phase, you can pick up to 3 friendly WEAPON TEAM units that are wholly within 13" of this general. You can re-roll hit rolls for attacks made by those units until the end of that phase.`,
        when: [START_OF_SHOOTING_PHASE],
      },
    ],
  },
  {
    name: `Malevolent (Pestilens)`,
    effects: [
      {
        name: `Malevolent (Pestilens)`,
        desc: `You can re-roll wound rolls of 1 for attacks made with melee weapons by this general.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Verminous Valour (Pestilens)`,
    effects: [
      {
        name: `Verminous Valour (Pestilens)`,
        desc: `Before you allocate a wound or mortal wound to this general, you can roll a D6. Subtract 1 from the roll if this general is a MONSTER or WAR MACHINE. On a 4+, instead of allocating the wound or mortal wound to this general, you can allocate it to a friendly SKAVENTIDE unit within 3" of this general.`,
        when: [DURING_GAME],
      },
    ],
  },
  {
    name: `Savage Overlord (Pestilens)`,
    effects: [
      {
        name: `Savage Overlord (Pestilens)`,
        desc: `Add 1 to the Bravery characteristic of friendly SKAVENTIDE units while they are wholly within 18" of this general.`,
        when: [BATTLESHOCK_PHASE],
      },
    ],
  },
  {
    name: `Master of Rot and Ruin (Pestilens)`,
    effects: [
      {
        name: `Master of Rot and Ruin (Pestilens)`,
        desc: `You can re-roll the dice that determines if a prayer chanted by this general is answered.`,
        when: [HERO_PHASE],
      },
    ],
  },
  {
    name: `Architect of Death (Pestilens)`,
    effects: [
      {
        name: `Architect of Death (Pestilens)`,
        desc: `You can re-roll wound rolls for attacks made with missile weapons by friendly CLANS PESTILENS units while they are wholly within 18" of this general.`,
        when: [SHOOTING_PHASE],
      },
    ],
  },
  {
    name: `Diseased (Pestilens)`,
    effects: [
      {
        name: `Diseased (Pestilens)`,
        desc: `At the start of your hero phase, roll a D6 if this general is within 3" of any enemy units. On a 4+ inflict D3 mortal wounds on 1 enemy unit within 3" of this general.`,
        when: [START_OF_HERO_PHASE],
      },
    ],
  },
  {
    name: `Malevolent (Verminus)`,
    effects: [
      {
        name: `Malevolent (Verminus)`,
        desc: `You can re-roll wound rolls of 1 for attacks made with melee weapons by this general.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Verminous Valour (Verminus)`,
    effects: [
      {
        name: `Verminous Valour (Verminus)`,
        desc: `Before you allocate a wound or mortal wound to this general, you can roll a D6. Subtract 1 from the roll if this general is a MONSTER or WAR MACHINE. On a 4+, instead of allocating the wound or mortal wound to this general, you can allocate it to a friendly SKAVENTIDE unit within 3" of this general.`,
        when: [DURING_GAME],
      },
    ],
  },
  {
    name: `Savage Overlord (Verminus)`,
    effects: [
      {
        name: `Savage Overlord (Verminus)`,
        desc: `Add 1 to the Bravery characteristic of friendly SKAVENTIDE units while they are wholly within 18" of this general.`,
        when: [BATTLESHOCK_PHASE],
      },
    ],
  },
  {
    name: `Brutal Fury (Verminus)`,
    effects: [
      {
        name: `Brutal Fury (Verminus)`,
        desc: `Once per battle, at the start of the combat phase, you can add 3 to the Attacks characteristic of this general's melee weapons until the end of that phase.`,
        when: [START_OF_COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Powerful (Verminus)`,
    effects: [
      {
        name: `Powerful (Verminus)`,
        desc: `Add 1 to this general's Wounds characteristic.`,
        when: [DURING_GAME],
      },
    ],
  },
  {
    name: `Devious Adversary (Verminus)`,
    effects: [
      {
        name: `Devious Adversary (Verminus)`,
        desc: `If the unmodified hit roll for an attack made with a melee weapon that targets this general is a 1, add 1 to the Attacks characteristic of this general's melee weapons until the end of that phase.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Malevolent (Moulder)`,
    effects: [
      {
        name: `Malevolent (Moulder)`,
        desc: `You can re-roll wound rolls of 1 for attacks made with melee weapons by this general.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Verminous Valour (Moulder)`,
    effects: [
      {
        name: `Verminous Valour (Moulder)`,
        desc: `Before you allocate a wound or mortal wound to this general, you can roll a D6. Subtract 1 from the roll if this general is a MONSTER or WAR MACHINE. On a 4+, instead of allocating the wound or mortal wound to this general, you can allocate it to a friendly SKAVENTIDE unit within 3" of this general.`,
        when: [DURING_GAME],
      },
    ],
  },
  {
    name: `Savage Overlord (Moulder)`,
    effects: [
      {
        name: `Savage Overlord (Moulder)`,
        desc: `Add 1 to the Bravery characteristic of friendly SKAVENTIDE units while they are wholly within 18" of this general.`,
        when: [BATTLESHOCK_PHASE],
      },
    ],
  },
  {
    name: `Moulder Supreme (Moulder)`,
    effects: [
      {
        name: `Moulder Supreme (Moulder)`,
        desc: `When you use the Prized Creations battle trait and pick 1 friendly CLANS MOULDER FIGHTING BEAST model for this general, you can either add 3 to that model's Wounds characteristic instead of D3, or add D6 to that model's Wounds characteristic instead of D3.`,
        when: [DURING_GAME],
      },
    ],
  },
  {
    name: `Hordemaster (Moulder)`,
    effects: [
      {
        name: `Hordemaster (Moulder)`,
        desc: `When this general uses the Unleash More-more Beasts! command ability, you receive a new unit on a roll of 4+ instead of 5+.`,
        when: [DURING_GAME],
      },
    ],
  },
  {
    name: `Burly (Moulder)`,
    effects: [
      {
        name: `Burly (Moulder)`,
        desc: `Add 1 to this general's Wounds characteristic.`,
        when: [DURING_GAME],
      },
    ],
  },
  {
    name: `Malevolent (Eshin)`,
    effects: [
      {
        name: `Malevolent (Eshin)`,
        desc: `You can re-roll wound rolls of 1 for attacks made with melee weapons by this general.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Verminous Valour (Eshin)`,
    effects: [
      {
        name: `Verminous Valour (Eshin)`,
        desc: `Before you allocate a wound or mortal wound to this general, you can roll a D6. Subtract 1 from the roll if this general is a MONSTER or WAR MACHINE. On a 4+, instead of allocating the wound or mortal wound to this general, you can allocate it to a friendly SKAVENTIDE unit within 3" of this general.`,
        when: [DURING_GAME],
      },
    ],
  },
  {
    name: `Savage Overlord (Eshin)`,
    effects: [
      {
        name: `Savage Overlord (Eshin)`,
        desc: `Add 1 to the Bravery characteristic of friendly SKAVENTIDE units while they are wholly within 18" of this general.`,
        when: [BATTLESHOCK_PHASE],
      },
    ],
  },
  {
    name: `Unrivalled Killer (Eshin)`,
    effects: [
      {
        name: `Unrivalled Killer (Eshin)`,
        desc: `You can re-roll hit rolls for attacks made by this general that target the enemy HERO chosen for the Masters of Murder battle trait.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Shadowmaster (Eshin)`,
    effects: [
      {
        name: `Shadowmaster (Eshin)`,
        desc: `While this general is within 1" of a terrain feature, this general is not visible to enemy models while they are more than 6" from this general.`,
        when: [DURING_GAME],
      },
    ],
  },
  {
    name: `Incredible Agility (Eshin)`,
    effects: [
      {
        name: `Incredible Agility (Eshin)`,
        desc: `This general can fly.`,
        when: [MOVEMENT_PHASE],
      },
    ],
  },
]

export default CommandTraits
