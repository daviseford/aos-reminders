import { HERO_PHASE, COMBAT_PHASE, SHOOTING_PHASE, BATTLESHOCK_PHASE } from 'types/phases'
import { TSpells } from 'types/army'

// Lore of the Deep
const Spells: TSpells = [
  {
    name: `Steed of Tides`,
    effects: [
      {
        name: `Steed of Tides`,
        desc: `Casting value 5. Pick a friendly hero that is not a monster within 6". Remove them from the table and set them up within 24" of their original spot and outside of 9" of enemies. This counts as their movement in the movement phase. The Hero does not need to be an Idoneth Deepkin.`,
        when: [HERO_PHASE],
      },
    ],
  },
  {
    name: `Abyssal Darkness`,
    effects: [
      {
        name: `Abyssal Darkness`,
        desc: `Casting Value 5. Friendly deepkin are treated as being within cover while wholly within 9" of the caster until your next hero phase.`,
        when: [HERO_PHASE],
      },
      {
        name: `Abyssal Darkness`,
        desc: `If cast in the hero phase, Friendly deepkin are treated as being within cover while wholly within 9" of the caster until your next hero phase.`,
        when: [SHOOTING_PHASE, COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Vorpal Maelstrom`,
    effects: [
      {
        name: `Vorpal Maelstrom`,
        desc: `Casting Value 6. Pick a spot within 18" of the caster that they can see. Roll for each enemy unit within 3" of that spot, if the dice is less than or equal to the number of models in that unit they take D3 mortal wounds.`,
        when: [HERO_PHASE],
      },
    ],
  },
  {
    name: `Pressure of the Deeps`,
    effects: [
      {
        name: `Pressure of the Deeps`,
        desc: `Casting value 7. Pick an enemy model within 12" of the caster that is visible to them, and roll a D6. If the dice roll is greater than that model's Wounds characteristic, it is slain.`,
        when: [HERO_PHASE],
      },
    ],
  },
  {
    name: `Tide of Fear`,
    effects: [
      {
        name: `Tide of Fear`,
        desc: `Casting Value 6. Pick an enemy unit within 12" of the caster that is visible to them. Until your next hero phase, subtract 1 from hit rolls for that unit and subtract 1 from that unit's Bravery characteristic.`,
        when: [HERO_PHASE],
      },
      {
        name: `Tide of Fear`,
        desc: `If successfully cast, units affected by Tide of Fear subtract 1 from hit rolls for that unit.`,
        when: [SHOOTING_PHASE, COMBAT_PHASE],
      },
      {
        name: `Tide of Fear`,
        desc: `If successfully cast, units affected by Tide of Fear subtract 1 from their Bravery characteristic.`,
        when: [BATTLESHOCK_PHASE],
      },
    ],
  },
  {
    name: `Arcane Corrasion`,
    effects: [
      {
        name: `Arcane Corrasion`,
        desc: `Casting value 6. Pick the closest enemy unit within 48" of the cater and measure the distance between the caster and the unit. If the distance is up to 12", the target suffers 1 mortal wound; if the distance is more than 12" and up to 24" it suffers 2 mortal wounds instead; if the distance is more than 24" and up to 36" it suffers 3 mortal wounds instead; if the distance is more than 36" it suffers 4 mortal wounds instead.`,
        when: [HERO_PHASE],
      },
    ],
  },
  {
    name: `Mor'phann: Freezing Mists`,
    effects: [
      {
        name: `Mor'phann: Freezing Mists`,
        desc: `Casting value 6. Pick an enemy unit within 12" of hte caster that is visible to them. Until your next hero phase, that unit can only move 1" when it piles in, and any abilities that would increase its pilein move are ignored.`,
        when: [HERO_PHASE],
      },
    ],
  },
  {
    name: `Nautilar: Protective Barrier`,
    effects: [
      {
        name: `Nautilar: Protective Barrier`,
        desc: `Casting value 4. Pick a friendly Nautilar unit within 12" of the caster that is visible to them. Until your next hero phase, worsen the rend characteristic of attacks that target that unit by 1 (to a minimum of '-').`,
        when: [HERO_PHASE],
      },
    ],
  },
]

export default Spells
