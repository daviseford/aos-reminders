import { tagAs } from 'factions/metatagger'
import {
  BATTLESHOCK_PHASE,
  COMBAT_PHASE,
  DURING_GAME,
  HERO_PHASE,
  SAVES_PHASE,
  SHOOTING_PHASE,
} from 'types/phases'

const Spells = {
  'Steed of Tides': {
    effects: [
      {
        name: `Steed of Tides`,
        desc: `Casting value of 5. Pick a friendly hero that is not a monster within 6". Remove them from the table and set them up within 24" of their original spot and outside of 9" of enemies. This counts as their movement in the movement phase. The Hero does not need to be an Idoneth Deepkin.`,
        when: [HERO_PHASE],
      },
    ],
  },
  'Abyssal Darkness': {
    effects: [
      {
        name: `Abyssal Darkness`,
        desc: `Casting value of 5. Friendly deepkin are treated as being within cover while wholly within 9" of the caster until your next hero phase.`,
        when: [HERO_PHASE],
      },
      {
        name: `Abyssal Darkness`,
        desc: `If cast in the hero phase, Friendly deepkin are treated as being within cover while wholly within 9" of the caster until your next hero phase.`,
        when: [SHOOTING_PHASE, COMBAT_PHASE],
      },
    ],
  },
  'Vorpal Maelstrom': {
    effects: [
      {
        name: `Vorpal Maelstrom`,
        desc: `Casting value of 6. Pick a spot within 18" of the caster that they can see. Roll for each enemy unit within 3" of that spot, if the dice is less than or equal to the number of models in that unit they take D3 mortal wounds.`,
        when: [HERO_PHASE],
      },
    ],
  },
  'Pressure of the Deeps': {
    effects: [
      {
        name: `Pressure of the Deeps`,
        desc: `Casting value of 7. Pick an enemy model within 12" of the caster that is visible to them, and roll a D6. If the dice roll is greater than that model's Wounds characteristic, it is slain.`,
        when: [HERO_PHASE],
      },
    ],
  },
  'Tide of Fear': {
    effects: [
      {
        name: `Tide of Fear`,
        desc: `Casting value of 6. Pick an enemy unit within 12" of the caster that is visible to them. Until your next hero phase, subtract 1 from hit rolls for that unit and subtract 1 from that unit's Bravery characteristic.`,
        when: [HERO_PHASE],
      },
      {
        name: `Tide of Fear`,
        desc: `Units affected by Tide of Fear subtract 1 from hit rolls for that unit.`,
        when: [SHOOTING_PHASE, COMBAT_PHASE],
      },
      {
        name: `Tide of Fear`,
        desc: `Units affected by Tide of Fear subtract 1 from their Bravery characteristic.`,
        when: [BATTLESHOCK_PHASE],
      },
    ],
  },
  'Arcane Corrasion': {
    effects: [
      {
        name: `Arcane Corrasion`,
        desc: `Casting value of 6. Pick the closest enemy unit within 48" of the cater and measure the distance between the caster and the unit. If the distance is up to 12", the target suffers 1 mortal wound; if the distance is more than 12" and up to 24" it suffers 2 mortal wounds instead; if the distance is more than 24" and up to 36" it suffers 3 mortal wounds instead; if the distance is more than 36" it suffers 4 mortal wounds instead.`,
        when: [HERO_PHASE],
      },
    ],
  },
  // Mor'phann
  'Freezing Mists': {
    effects: [
      {
        name: `Freezing Mists`,
        desc: `Casting value of 6. Pick an enemy unit within 12" of hte caster that is visible to them. Until your next hero phase, that unit can only move 1" when it piles in, and any abilities that would increase its pilein move are ignored.`,
        when: [HERO_PHASE],
      },
    ],
  },
  // Nautilar
  'Protective Barrier': {
    effects: [
      {
        name: `Protective Barrier`,
        desc: `Casting value of 4. Pick a friendly Nautilar unit within 12" of the caster that is visible to them. Until your next hero phase, worsen the rend characteristic of attacks that target that unit by 1 (to a minimum of '-').`,
        when: [HERO_PHASE],
      },
      {
        name: `Protective Barrier`,
        desc: `If active, until your next hero phase, worsen the rend characteristic of attacks that target that unit by 1 (to a minimum of '-').`,
        when: [SAVES_PHASE],
      },
    ],
  },
  // Unit spells
  'Cloying Seas Mists': {
    effects: [
      {
        name: `Cloying Seas Mists`,
        desc: `Casting value of 6. Pick a unit within 12" of the caster and that is visible. If a friendly Deepkin unit selected, heal D3 wounds allocated to them. Any other unit suffers D3 mortal wounds.`,
        when: [HERO_PHASE],
      },
    ],
  },
  'Tsunami of Terror': {
    effects: [
      {
        name: `Tsunami of Terror`,
        desc: `Casting value of 7. Pick D6 enemy units within 12" of the caster that are visible. Subtract 1 from hit rolls made for those units, and 1 from the Bravery characteristic of those units, until your next hero phase.`,
        when: [HERO_PHASE],
      },
      {
        name: `Tsunami of Terror`,
        desc: `If active, subtract 1 from hit rolls made by debuffed units.`,
        when: [SHOOTING_PHASE, COMBAT_PHASE],
      },
      {
        name: `Tsunami of Terror`,
        desc: `If active, subtract 1 from the Bravery characteristic of debuffed units.`,
        when: [DURING_GAME, BATTLESHOCK_PHASE],
      },
    ],
  },
  Riptide: {
    effects: [
      {
        name: `Riptide`,
        desc: `Casting value of 7. Pick an enemy unit within 18" of the caster that is visible to them. Until your next hero phase, subtract 1 from hit rolls for that unit. In addition, at the start of your next hero phase the unit suffers D3 mortal wounds.`,
        when: [HERO_PHASE],
      },
    ],
  },
}

export default tagAs(Spells, 'spell')
