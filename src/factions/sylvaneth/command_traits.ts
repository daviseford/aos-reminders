import { tagAs } from 'factions/metatagger'
import {
  BATTLESHOCK_PHASE,
  CHARGE_PHASE,
  COMBAT_PHASE,
  DURING_GAME,
  END_OF_HERO_PHASE,
  HERO_PHASE,
  SAVES_PHASE,
  SHOOTING_PHASE,
  WOUND_ALLOCATION_PHASE,
} from 'types/phases'

// Store Command Traits here. You can add them to units, abilties, flavors, and subfactions later.
const CommandTraits = {
  'Regal Old-growth': {
    effects: [
      {
        name: `Regal Old-growth`,
        desc: `Add 1 to the Wounds characteristic of this general.`,
        when: [DURING_GAME],
      },
    ],
  },
  'Nurtured by Magic': {
    effects: [
      {
        name: `Nurtured by Magic`,
        desc: `Once in each of your hero phases, if this general successfully casts a spell that is not unbound, pick 1 friendly GNARLROOT unit wholly within 18" of this general. You can heal up to D3 wounds allocated to that unit.`,
        when: [HERO_PHASE],
      },
    ],
  },
  'Legacy of Valour': {
    effects: [
      {
        name: `Legacy of Valour`,
        desc: `If this general is slain, you can pick 1 enemy unit within 1" of this general before they are removed from play and roll a D6. On a 2-5 that unit suffers D3 mortal wounds. On a 6, that unit suffers D6 mortal wounds.`,
        when: [WOUND_ALLOCATION_PHASE],
      },
    ],
  },
  'Mere Rainfall': {
    effects: [
      {
        name: `Mere Rainfall`,
        desc: `You can reroll save rolls for attacks made with missile weapons that target this general.`,
        when: [SAVES_PHASE],
      },
    ],
  },
  'My Heart Is Ice': {
    effects: [
      {
        name: `My Heart Is Ice`,
        desc: `Roll a D6 each time a wound inflicted by a melee weapon is allocated to this general and not negated. On a 5+ the attacking unit suffers 1 mortal wound.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  'Paragon of Terror': {
    effects: [
      {
        name: `Paragon of Terror`,
        desc: `Reroll successful battleshock tests for enemy units while they are within 6" of this general.`,
        when: [BATTLESHOCK_PHASE],
      },
    ],
  },
  'Seek New Fruit': {
    effects: [
      {
        name: `Seek New Fruit`,
        desc: `Each time this general attacks with its melee weapons, it can make a 6" move after all of its attacks have been resolved. If it does so, it must finish the move more than 3" from enemy units.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  'Dread Harvester': {
    effects: [
      {
        name: `Dread Harvester`,
        desc: `You can reroll hit rolls for attacks made with melee weapons by this general if this general made a charge move in the same turn.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  'Gnarled Warrior': {
    effects: [
      {
        name: `Gnarled Warrior`,
        desc: `You can reroll save rolls of 1 for attacks that target this general.`,
        when: [SAVES_PHASE],
      },
    ],
  },
  'Gift of Ghyran': {
    effects: [
      {
        name: `Gift of Ghyran`,
        desc: `In your hero phase, you can heal 1 wound allocated to this general.`,
        when: [HERO_PHASE],
      },
    ],
  },
  'Lord of Spites': {
    effects: [
      {
        name: `Lord of Spites`,
        desc: `You can reroll wound rolls of 1 for attacks made by this general.`,
        when: [SHOOTING_PHASE, COMBAT_PHASE],
      },
    ],
  },
  Warsinger: {
    effects: [
      {
        name: `Warsinger`,
        desc: `Add 2 to charge rolls for friendly SYLVANETH units wholly within 12" of this general.`,
        when: [CHARGE_PHASE],
      },
    ],
  },
  'Wisdom of the Ancients': {
    effects: [
      {
        name: `Wisdom of the Ancients`,
        desc: `Add 1 to the Bravery characteristic of friendly SYLVANETH units while they are wholly within 12" of this general.`,
        when: [DURING_GAME],
      },
    ],
  },
  'Arcane Bounty (Wizard Only)': {
    effects: [
      {
        name: `Arcane Bounty (Wizard Only)`,
        desc: `This general knows 1 extra spell from the Lore of the Deepwood.`,
        when: [DURING_GAME],
      },
    ],
  },
  'Mystic Regrowth (Wizard Only)': {
    effects: [
      {
        name: `Mystic Regrowth (Wizard Only)`,
        desc: `At the end of your hero phase, if this general successfully cast any spells in that phase that were not unbound, you can heal D3 wounds allocated to this general.`,
        when: [END_OF_HERO_PHASE],
      },
    ],
  },
  'Voice of Warding (Wizard Only)': {
    effects: [
      {
        name: `Voice of Warding (Wizard Only)`,
        desc: `This general can attempt to unbind 1 extra spell in the enemy hero phase.`,
        when: [HERO_PHASE],
      },
    ],
  },
  'Glade Lore (Wizard Only)': {
    effects: [
      {
        name: `Glade Lore (Wizard Only)`,
        desc: `Add 1 to casting rolls for this general while it is wholly within 6" of any AWAKENED WYLDWOODS.`,
        when: [HERO_PHASE],
      },
    ],
  },
  'Spellsinger (Wizard Only)': {
    effects: [
      {
        name: `Spellsinger (Wizard Only)`,
        desc: `Add 6" to the range of each spell this general successfully casts.`,
        when: [HERO_PHASE],
      },
    ],
  },
  'Radiant Spirit (Wizard Only)': {
    effects: [
      {
        name: `Radiant Spirit (Wizard Only)`,
        desc: `Each time this general is affected by a spell or endless spell, you can roll a D6. If you do so, on a 4+ ignore the effects of that spell or endless spell on this general.`,
        when: [HERO_PHASE],
      },
    ],
  },
}

export default tagAs(CommandTraits, 'command_trait')
