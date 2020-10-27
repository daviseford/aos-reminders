import { TArtifacts } from 'types/army'
import {
  CHARGE_PHASE,
  COMBAT_PHASE,
  DURING_GAME,
  DURING_SETUP,
  HERO_PHASE,
  SHOOTING_PHASE,
  START_OF_COMBAT_PHASE,
  START_OF_HERO_PHASE,
  TURN_ONE_START_OF_ROUND,
  WOUND_ALLOCATION_PHASE,
} from 'types/phases'

const Artifacts: TArtifacts = [
  // Ravagers Artifacts
  {
    name: `Hellfire Sword (Ravagers)`,
    effects: [
      {
        name: `Hellfire Sword (Ravagers)`,
        desc: `Once per battle, you can pick 1 enemy unit within 8" of the bearer and visible. The target suffers D3 mortal wounds.`,
        when: [SHOOTING_PHASE],
      },
    ],
  },
  {
    name: `Blasphemous Cuirass (Ravagers)`,
    effects: [
      {
        name: `Blasphemous Cuirass (Ravagers)`,
        desc: `Roll a D6 each time a mortal wound is allocated to the bearer. On a 5+ it is negated.`,
        when: [WOUND_ALLOCATION_PHASE],
      },
    ],
  },
  {
    name: `Helm of the Oppressor (Ravagers)`,
    effects: [
      {
        name: `Helm of the Oppressor (Ravagers)`,
        desc: `Subtract 1 from the bravery characteristic of enemy units within 6" of the bearer.`,
        when: [DURING_GAME],
      },
    ],
  },
  {
    name: `Cloak of the Relentless Conqueror (Ravagers)`,
    effects: [
      {
        name: `Cloak of the Relentless Conqueror (Ravagers)`,
        desc: `You can reroll charge rolls for the bearer.`,
        when: [CHARGE_PHASE],
      },
    ],
  },
  {
    name: `Mark of the High-favoured (Ravagers)`,
    effects: [
      {
        name: `Mark of the High-favoured (Ravagers)`,
        desc: `Friendly Ravagers units are affected by the bearer's Aura of Chaos ability while they are wholly within 18".`,
        when: [DURING_GAME],
      },
    ],
  },
  {
    name: `Desecrator Gauntlets (Ravagers)`,
    effects: [
      {
        name: `Desecrator Gauntlets (Ravagers)`,
        desc: `Subtract 2 from the casting rolls for enemy wizards within 3" of the bearer.`,
        when: [HERO_PHASE],
      },
      {
        name: `Desecrator Gauntlets (Ravagers)`,
        desc: `Add 1 to the wound rolls made by the bearer if their target is a wizard or priest.`,
        when: [SHOOTING_PHASE, COMBAT_PHASE],
      },
    ],
  },
  // Cabalists Artifacts
  {
    name: `Soul Feeder (Cabalists)`,
    effects: [
      {
        name: `Soul Feeder (Cabalists)`,
        desc: `Pick 1 of the bearer's melee weapons. If the unmodified wound roll for an attack made by that weapon is a 6, you can heal 1 would allocated to the bearer.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Black Athame (Cabalists)`,
    effects: [
      {
        name: `Black Athame (Cabalists)`,
        desc: `Once per battle, when the bearer attempts to perform a binding ritual, you can use this artifact to automatically succeed the ritual attempt.`,
        when: [START_OF_HERO_PHASE],
      },
    ],
  },
  {
    name: `Infernal Puppet (Cabalists)`,
    effects: [
      {
        name: `Infernal Puppet (Cabalists)`,
        desc: `Once per battle, you can pick 1 enemy wizard within 24" and visible. In the next enemy hero phase, each time that wizard attempts to cast a spell they suffer D3 mortal wounds before the casting roll is made. If the wiazrd is slain by these mortal wounds the casting attempt fails (do not roll dice).`,
        when: [HERO_PHASE],
      },
    ],
  },
  {
    name: `Spelleater Pendant (Cabalists)`,
    effects: [
      {
        name: `Spelleater Pendant (Cabalists)`,
        desc: `The bearer gains the wizard keyword and can attempt to unbind 1 spell. If the bearer is already a wizard they gain an extra unbind attempt.`,
        when: [HERO_PHASE],
      },
    ],
  },
  {
    name: `Scroll of Dark Unravelling (Cabalists)`,
    effects: [
      {
        name: `Scroll of Dark Unravelling (Cabalists)`,
        desc: `Once per battle, when the bearer attempts to unbind a spell, you can use this artifact to automatically unbind it (do not roll the dice).`,
        when: [HERO_PHASE],
      },
    ],
  },
  {
    name: `Spell Familiar (Cabalists)`,
    effects: [
      {
        name: `Spell Familiar (Cabalists)`,
        desc: `The bearer knows 1 extra spell from the Lore of the Damned.`,
        when: [DURING_SETUP],
      },
    ],
  },
  // Despoilers Artifacts
  {
    name: `Crown of Hellish Adoration (Despoilers)`,
    effects: [
      {
        name: `Crown of Hellish Adoration (Despoilers)`,
        desc: `Subtract 1 from wound rolls for attacks made with missle weapons targeting the bearer while they are within 3" of any friendly Despoilers units with at least 3 models.`,
        when: [SHOOTING_PHASE],
      },
    ],
  },
  {
    name: `Helm of Many Eyes (Despoilers)`,
    effects: [
      {
        name: `Helm of Many Eyes (Despoilers)`,
        desc: `The bearer and their mount fight at the start of the combat phase if they charged this turn, but cannot fight again in this phase unless an ability or spells allows them to fight more than once.`,
        when: [CHARGE_PHASE, START_OF_COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Armour of Tortured Souls (Despoilers)`,
    effects: [
      {
        name: `Armour of Tortured Souls (Despoilers)`,
        desc: `Worsen the read characteristic of attacks that target the bearer by 1 (to a minimum of '-').`,
        when: [SHOOTING_PHASE, COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Diabolic Mantle (Despoilers)`,
    effects: [
      {
        name: `Diabolic Mantle (Despoilers)`,
        desc: `If the bearer is on the battlefield, you receive D3 comamnd points.`,
        when: [TURN_ONE_START_OF_ROUND],
      },
    ],
  },
  {
    name: `Doombringer Blade (Despoilers)`,
    effects: [
      {
        name: `Doombringer Blade (Despoilers)`,
        desc: `After setup is complete but before the start of the turn, you can pick 1 enemy hero or monster on the battlefield. Friendly Despoilers units can reroll hit and wound rolls when targeting the selected model.`,
        when: [TURN_ONE_START_OF_ROUND],
      },
    ],
  },
  {
    name: `Realmwarper's Twist-rune (Despoilers)`,
    effects: [
      {
        name: `Realmwarper's Twist-rune (Despoilers)`,
        desc: `Friendly Despoilers units wholly within 12" of the bearer are unaffected by Pitch-black and Nightmare Chasm scenery rules.`,
        when: [DURING_GAME],
      },
    ],
  },
  // Knights of the Empty Throne Artifacts
  {
    name: `Flask of Daemonblood (Knights of the Empty Throne)`,
    effects: [
      {
        name: `Flask of Daemonblood (Knights of the Empty Throne)`,
        desc: `This unit can roll a D6 and 4+ you can heal D3 wounds that have been allocated.`,
        when: [HERO_PHASE],
      },
    ],
  },
  {
    name: `Grasping Plate (Knights of the Empty Throne)`,
    effects: [
      {
        name: `Grasping Plate (Knights of the Empty Throne)`,
        desc: `This unit is eligible to fight if it is within 6" of an enemy unit. It can move an extra 3" when it piles in.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Corrupted Nullstone (Knights of the Empty Throne)`,
    effects: [
      {
        name: `Corrupted Nullstone (Knights of the Empty Throne)`,
        desc: `Once per battle, this unit can attempt to unbind 1 spell. If it does so the spell is automatically unbound.`,
        when: [HERO_PHASE],
      },
    ],
  },
]

export default Artifacts
