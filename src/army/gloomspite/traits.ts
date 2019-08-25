import { TTraits } from 'types/army'
import {
  BATTLESHOCK_PHASE,
  COMBAT_PHASE,
  DURING_GAME,
  DURING_ROUND,
  HERO_PHASE,
  MOVEMENT_PHASE,
  START_OF_COMBAT_PHASE,
  START_OF_HERO_PHASE,
  TURN_ONE_START_OF_ROUND,
} from 'types/phases'

const CommandTraits: TTraits = [
  {
    name: `Cunning Plans`,
    effects: [
      {
        name: `Cunning Plans`,
        desc: `At the start of the first battle round, you receive 1 additional command point.`,
        when: [TURN_ONE_START_OF_ROUND],
      },
    ],
  },
  {
    name: `Fight Another Day`,
    effects: [
      {
        name: `Fight Another Day`,
        desc: `Each time this general attacks with its melee weapons, it can make a 2D6" move after all of its attacks have been resolved. If it does so, it must finish the move more than 3" from enemy units.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Sneaky Stabba`,
    effects: [
      {
        name: `Sneaky Stabba`,
        desc: `You can re-roll wound rolls for attacks made with melee weapons by this general.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Tough 'n' Leathery`,
    effects: [
      {
        name: `Tough 'n' Leathery`,
        desc: `Add 2 to this general's Wounds characteristic.`,
        when: [DURING_GAME],
      },
    ],
  },
  {
    name: `Dead Shouty`,
    effects: [
      {
        name: `Dead Shouty`,
        desc: `Once per battle round, this general can use a command ability on their warscroll without a command point being spent.`,
        when: [DURING_ROUND],
      },
    ],
  },
  {
    name: `The Clammy Hand`,
    effects: [
      {
        name: `The Clammy Hand`,
        desc: `If this general is within 12" of a Bad Moon Loonshrine at the start of your hero phase, you can use the Bad Moon Loonshrine's 'Moonclan Lair' scenery rule 2 times in that hero phase.`,
        when: [START_OF_HERO_PHASE],
      },
    ],
  },
  {
    name: `Low Cunning`,
    effects: [
      {
        name: `Low Cunning`,
        desc: `At the start of the first battle round, you receive 1 additional command point.`,
        when: [TURN_ONE_START_OF_ROUND],
      },
    ],
  },
  {
    name: `Spiteful Git`,
    effects: [
      {
        name: `Spiteful Git`,
        desc: `Roll a D6 each time a wound or mortal wound is allocated to this model. On a 4+ the unit that inflicted the wound or mortal wound suffers 1 mortal wound. On a 6, it suffers D3 mortal wounds instead.`,
        when: [DURING_GAME],
      },
    ],
  },
  {
    name: `Great Shaman`,
    effects: [
      {
        name: `Great Shaman`,
        desc: `This general knows 1 extra spell from the Lore of the Moonclans.`,
        when: [HERO_PHASE],
      },
    ],
  },
  {
    name: `Dodgy Character`,
    effects: [
      {
        name: `Dodgy Character`,
        desc: `Re-roll successful hit rolls for attacks that target this general.`,
        when: [DURING_GAME],
      },
    ],
  },
  {
    name: `Boss Shaman`,
    effects: [
      {
        name: `Boss Shaman`,
        desc: `This general has the I'm Da Boss, Now Stab 'Em Good! command ability from the Loonboss warscroll.`,
        when: [START_OF_COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Loon-touched`,
    effects: [
      {
        name: `Loon-touched`,
        desc: `Add 2 to casting rolls for this general when they are affected by the light of the Bad Moon instead of 1.`,
        when: [HERO_PHASE],
      },
    ],
  },
  {
    name: `Monstrous Mount`,
    effects: [
      {
        name: `Monstrous Mount`,
        desc: `Double the number of mortal wounds that are inflicted by this general's Spider Venom ability.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Masterful Spider Rider`,
    effects: [
      {
        name: `Masterful Spider Rider`,
        desc: `Add 4" to this general's Move characteristic.`,
        when: [MOVEMENT_PHASE],
      },
    ],
  },
  {
    name: `Ululating Battle Cry`,
    effects: [
      {
        name: `Ululating Battle Cry`,
        desc: `Subtract 1 from the Bravery characteristic of enemy units while they are within 9" of this general.`,
        when: [BATTLESHOCK_PHASE],
      },
    ],
  },
  {
    name: `Dead Shouty`,
    effects: [
      {
        name: `Dead Shouty`,
        desc: `Once per battle round, this general can use a command ability on their warscroll without a command point being spent.`,
        when: [DURING_ROUND],
      },
    ],
  },
  {
    name: `Creeping Assault`,
    effects: [
      {
        name: `Creeping Assault`,
        desc: `Enemy units do not receive the benefit of cover against attacks made by friendly SPIDERFANG units while the friendly unit is wholly within 12" of this general.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Tough as Rocks`,
    effects: [
      {
        name: `Tough as Rocks`,
        desc: `Add 2 to this general's Wounds characteristic.`,
        when: [DURING_GAME],
      },
    ],
  },
  {
    name: `Alpha Trogg`,
    effects: [
      {
        name: `Alpha Trogg`,
        desc: `Troggoth units affected by this general's Reassuring Presence ability add 2 to their Bravery characteristic instead of 1.`,
        when: [DURING_GAME],
      },
    ],
  },
  {
    name: `Loonskin`,
    effects: [
      {
        name: `Loonskin`,
        desc: `This general counts as being affected by the light of the Bad Moon wherever it is located, until it is removed when it reaches the opposite edge of the battlefield.`,
        when: [DURING_GAME],
      },
    ],
  },
  {
    name: `Pulverising Grip`,
    effects: [
      {
        name: `Pulverising Grip`,
        desc: `When you use this general's Crushing Grip ability, you can re-roll the dice that determines if the target is slain.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Mighty Blow`,
    effects: [
      {
        name: `Mighty Blow`,
        desc: `You can re-roll the dice that determines the Damage characteristic of this general's Boulder Club.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Realmstone-studded Hide`,
    effects: [
      {
        name: `Realmstone-studded Hide`,
        desc: `When you use this general's Magical Resistance ability, you can re-roll the dice that determines if the spell's effects are ignored.`,
        when: [HERO_PHASE],
      },
    ],
  },
]

export default CommandTraits
