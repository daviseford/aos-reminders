import { tagAs } from 'factions/metatagger'
import {
  CHARGE_PHASE,
  COMBAT_PHASE,
  DURING_GAME,
  END_OF_COMBAT_PHASE,
  HERO_PHASE,
  MOVEMENT_PHASE,
  START_OF_COMBAT_PHASE,
  WOUND_ALLOCATION_PHASE,
} from 'types/phases'

const Artifacts = {
  // Gifts of Morathi - Hero Artifacts
  'Crown of Woe': {
    effects: [
      {
        name: `Crown of Woe`,
        desc: `Subtract 2 from the bravery characteristic of enemy units that are within 7" of the bearer. If any enemy models are slain by the bearer's attacks, the range of this ability is increased to 14" for the remainder of the battle.`,
        when: [DURING_GAME],
      },
    ],
  },
  "Shadracar's Fang": {
    effects: [
      {
        name: `Shadracar's Fang`,
        desc: `Add 1 to the hit rolls made for the selected melee weapon. In addition, each time an unmodified hit roll of 6 is made for that weapon, the target suffers 1 mortal wound in addition to normal damage.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  'Amulet of Dark Fire': {
    effects: [
      {
        name: `Amulet of Dark Fire`,
        desc: `Roll a D6 each time the bearer is allocated a mortal wound inflicted by an enemy spell. On a 4+ that wound is negated.`,
        when: [WOUND_ALLOCATION_PHASE],
      },
    ],
  },
  'Crone Blade': {
    effects: [
      {
        name: `Crone Blade`,
        desc: `If any enemy models were slain by the selected weapon, you can heal up to D3 wounds allocated to the bearer.`,
        when: [END_OF_COMBAT_PHASE],
      },
    ],
  },
  'Thousand and One Dark Blessings': {
    effects: [
      {
        name: `Thousand and One Dark Blessings`,
        desc: `Roll a D6 each time you allocate a wound or mortal wound to the bearer. On a 5+ it is negated.`,
        when: [WOUND_ALLOCATION_PHASE],
      },
    ],
  },
  'Bloodbane Venom': {
    effects: [
      {
        name: `Bloodbane Venom`,
        desc: `If an enemy model is allocated any wounds from attacks made using the selected melee weapon but not slain in this phase, roll a D6. If the roll equals or exceeds the target's wound characteristic, it is slain.`,
        when: [END_OF_COMBAT_PHASE],
      },
    ],
  },
  // Artifacts of Shadow' - Bloodwrack Medusa Artifacts
  'Shadow Stone': {
    effects: [
      {
        name: `Shadow Stone`,
        desc: `Add 1 to the casting rolls of the bearer.`,
        when: [HERO_PHASE],
      },
    ],
  },
  'Rune of Ulgu': {
    effects: [
      {
        name: `Rune of Ulgu`,
        desc: `The bearer knows one additional spell from the Lore of Shadows.`,
        when: [HERO_PHASE],
      },
    ],
  },
  'The Mirror Glaive': {
    effects: [
      {
        name: `The Mirror Glaive`,
        desc: `Each time the bearer unbinds an enemy spell, they can immediately attempt to cast either the Mystic Shield or Arcane Bolt spells as if they were your hero phase. Your opponent cannot attempt to unbind this spell.`,
        when: [HERO_PHASE],
      },
    ],
  },
  'Seven-fold Shadow': {
    effects: [
      {
        name: `Seven-fold Shadow`,
        desc: `Once per battle, instead of moving the bearer, you can remove and set them up anywhere on the battlefield more that 9" from any enemy models.`,
        when: [MOVEMENT_PHASE],
      },
    ],
  },
  'Crystal Heart': {
    effects: [
      {
        name: `Crystal Heart`,
        desc: `The bearer can attempt to cast 1 extra spell in each of your hero phases. If they do so, roll a D6 before the casting roll is made. On a 1, the bearer suffers D3 mortal wounds.`,
        when: [HERO_PHASE],
      },
    ],
  },
  'Shade Claw': {
    effects: [
      {
        name: `Shade Claw`,
        desc: `The bearer's Whisperclaw has a Rend characteristic of -2.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  // Relics of Khaine - Priest Artifacts
  'Blood Sigil': {
    effects: [
      {
        name: `Blood Sigil`,
        desc: `The bearer knows 1 extra prayer from the Prayers of the Khainite Cult.`,
        when: [HERO_PHASE],
      },
    ],
  },
  'Iron Circlet': {
    effects: [
      {
        name: `Iron Circlet`,
        desc: `You can reroll prayer rolls of 1 for the bearer.`,
        when: [HERO_PHASE],
      },
    ],
  },
  'Rune of Khaine': {
    effects: [
      {
        name: `Rune of Khaine`,
        desc: `The first time the bearer is slain, roll a D6. On a 2-5 the unit that slew the bearer suffers D3 mortal wounds. On a 6 the slayer suffers D6 mortal wounds.`,
        when: [WOUND_ALLOCATION_PHASE],
      },
    ],
  },
  'Crimson Shard': {
    effects: [
      {
        name: `Crimson Shard`,
        desc: `The bearer's selected melee weapon adds 2 to its wound rolls.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  'Khainite Pendant': {
    effects: [
      {
        name: `Khainite Pendant`,
        desc: `The bearer can choose to chant up to three times in your hero phase. If chosen the bearer's prayer rolls of 1 inflict D3 mortal wounds instead of 1.`,
        when: [HERO_PHASE],
      },
    ],
  },
  Hagbrew: {
    effects: [
      {
        name: `Hagbrew`,
        desc: `Add 1 to the melee wound rolls of the bearer.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  // Hagg Nar Flavor
  'The Ulfuri': {
    effects: [
      {
        name: `The Ulfuri`,
        desc: `The selected melee weapon adds 1 to its damage characteristic if the bearer charged this turn.`,
        when: [CHARGE_PHASE, COMBAT_PHASE],
      },
    ],
  },
  // Draichi Ganeth Flavor
  "Death's Kiss": {
    effects: [
      {
        name: `Death's Kiss`,
        desc: `The selected melee weapon adds 2 to its attacks characteristic if the bearer charged this turn.`,
        when: [CHARGE_PHASE, COMBAT_PHASE],
      },
    ],
  },
  // Kraith Flavor
  'Venom of Nagendra': {
    effects: [
      {
        name: `Venom of Nagendra`,
        desc: `Once per battle, choose to not use the selected melee weapon in this combat phase. If you do, pick an enemy unit within 1" of the bearer and deal D6 mortal wounds.`,
        when: [START_OF_COMBAT_PHASE],
      },
    ],
  },
  // Khailebron Flavor
  Whisperdeath: {
    effects: [
      {
        name: `Whisperdeath`,
        desc: `Unmodified melee hit rolls of 6 on the selected weapon inflict 1 mortal wound in addition to normal damage.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  // Khelt Nar Flavor
  "Gaisa's Falx": {
    effects: [
      {
        name: `Gaisa's Falx`,
        desc: `Unmodified melee hit rolls of 6 on the selected weapon score 2 hits instead of 1.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  // Zainthar Kai Flavor
  'Crimson Talisman': {
    effects: [
      {
        name: `Crimson Talisman`,
        desc: `Subtract 1 from melee wound rolls targeting the bearer.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
}

export default tagAs(Artifacts, 'artifact')
