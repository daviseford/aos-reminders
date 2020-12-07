import { tagAs } from 'factions/metatagger'
import {
  BATTLESHOCK_PHASE,
  COMBAT_PHASE,
  DURING_GAME,
  END_OF_BATTLESHOCK_PHASE,
  END_OF_CHARGE_PHASE,
  END_OF_COMBAT_PHASE,
  END_OF_HERO_PHASE,
  END_OF_MOVEMENT_PHASE,
  END_OF_SHOOTING_PHASE,
  HERO_PHASE,
  SHOOTING_PHASE,
  START_OF_ROUND,
} from 'types/phases'

//Soullinked effect
const SoulLinkedEffect = {
  name: `Soul-linked`,
  desc: `This spell is soul-linked to the caster. When predatory endless spells are moved at the start of the battle round, any that are soul-linked to a caster are moved first, followed by any endless spells that are not. Soul-linked spells are always moved by the player whose army includes the caster the spell is soul-linked to. The player that won the roll-off to determine who moves an endless spell first must move all their soul-linked spells first, followed by their opponent.

  You must subtract 1 from casting rolls for a WIZARD that is soul-linked to an endless spell. A caster cannot be soul-linked to more than one endless spell at the same time. If the caster is slain, then any endless spell they are soul-linked to is dispelled.`,
  when: [START_OF_ROUND],
}

// Add Endless spells here
const EndlessSpells = {
  'Bone-tithe Shrieker': {
    effects: [
      {
        name: `Predatory`,
        desc: `A Bone-tithe Shrieker can move up to 8" and can fly.`,
        when: [START_OF_ROUND],
      },
      {
        name: `Summon Bone-tithe Shrieker`,
        desc: `Casting value of 5. Only OSSIARCH BONEREAPERS WIZARDS can attempt to cast this spell. Set up a Bone-tithe Shrieker model wholly within 12" of the caster and visible to them.`,
        when: [HERO_PHASE],
      },
      SoulLinkedEffect,
      {
        name: `Portent of Doom`,
        desc: `Subtract 1 from the Bravery of units while they are within 12" of this model. OSSIARCH BONEREAPERS units are not affected by this ability.`,
        when: [BATTLESHOCK_PHASE],
      },
      {
        name: `No Escape`,
        desc: `Add 1 to hit rolls for attacks made by OSSIARCH BONEREAPERS units that target a unit that is within 12" of this model.`,
        when: [COMBAT_PHASE, SHOOTING_PHASE],
      },
    ],
  },
  'Nightmare Predator': {
    effects: [
      {
        name: `Predatory`,
        desc: `A Nightmare Predator can move up to 2D6" and can fly.`,
        when: [START_OF_ROUND],
      },
      SoulLinkedEffect,
      {
        name: `Summon Nightmare Predator`,
        desc: `Casting value of 7. Only OSSIARCH BONEREAPERS WIZARDS can attempt to cast this spell. Set up a Nightmare Predator model wholly within 6" of the caster and visible to them.`,
        when: [START_OF_ROUND],
      },
      {
        name: `Perpetual Hunter`,
        desc: `When this model is set up, the player who set it up can pick 1 enemy HERO as its prety and then immediately make a move with this model. If this model's prey is destroyed, this model is dispelled.`,
        when: [START_OF_ROUND],
      },
      {
        name: `Death Incarnate`,
        desc: `After this model moves, roll a D6 for each unit within 3" of it. On a 2+, that unit suffers D3 mortal wounds. If that unit was this model's prey, on a 2+ it suffers D6 mortal wounds instead of D3 mortal wounds. OSSIARCH BONEREAPERS units are not affected by this ability.`,
        when: [START_OF_ROUND],
      },
    ],
  },
  'Soulstealer Carrion': {
    effects: [
      {
        name: `Predatory`,
        desc: `A Soulstealer Carrion can move up to 16" and can fly.`,
        when: [START_OF_ROUND],
      },
      SoulLinkedEffect,
      {
        name: `Summon Soulstealer Carrion`,
        desc: `Casting value of 6. Only OSSIARCH BONEREAPERS WIZARDS can attempt to cast this spell. Set up a Soulstealer Carrion model anywhere on the battlefield that is visible to the caster.`,
        when: [START_OF_ROUND],
      },
      {
        name: `Soul Thief`,
        desc: `At the end of each phase, roll a D6 if any CHAOS, DESTRUCTION, or ORDER models were slain within 6" of this model during that phase. On a 1-2, heal 1 wound allocated to the caster soul-linked to this model. On a 3-4, inflict 1 mortal wound on each CHAOS, DESTRUCTION, or ORDER unit within 6" of this model. On a 5-6, do both of these things.`,
        when: [DURING_GAME],
      },
      {
        name: `Soul Thief`,
        desc: `See "Soul Thief - During Game"`,
        when: [
          END_OF_BATTLESHOCK_PHASE,
          END_OF_CHARGE_PHASE,
          END_OF_COMBAT_PHASE,
          END_OF_HERO_PHASE,
          END_OF_MOVEMENT_PHASE,
          END_OF_SHOOTING_PHASE,
        ],
      },
      {
        name: `Second Sight`,
        desc: `Anything visible to this model is also visible to the caster that is soul-linked to this model.`,
        when: [START_OF_ROUND],
      },
    ],
  },
}

export default tagAs(EndlessSpells, 'endless_spell')
