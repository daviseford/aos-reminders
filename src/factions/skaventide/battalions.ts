import { keyPicker, tagAs } from 'factions/metatagger'
import {
  COMBAT_PHASE,
  DURING_GAME,
  HERO_PHASE,
  MOVEMENT_PHASE,
  SHOOTING_PHASE,
  START_OF_HERO_PHASE,
  WOUND_ALLOCATION_PHASE,
} from 'types/phases'
import units from './units'

const RegularBattalions = {
  'Fleshmeld Menagerie': {
    mandatory: {
      units: [keyPicker(units, ['Master Moulder', 'Packmasters', 'Rat Ogors'])],
    },
    effects: [
      {
        name: `More-more-more Beasts!`,
        desc: `When the Master Moulder from this battalion uses the Unleash More-more Beasts! command ability for a unit from the same battalion that has been destroyed, a new unit is added to your army on a roll of 4+ instead of 5+.`,
        when: [DURING_GAME],
      },
    ],
  },
  'Claw-horde': {
    mandatory: {
      units: [keyPicker(units, ['Clawlord', 'Stormvermin', 'Clanrats'])],
    },
    effects: [
      {
        name: `Claw-picked`,
        desc: `When the CLAWLORD from this battalion use the Gnash-gnaw on their Bones! command ability, instead of picking 1 unit wholly within 13" of the CLAWLORD, you can pick all of the units from the same battalion that are wholly within 13" of the CLAWLORD.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  Slinktalon: {
    mandatory: {
      units: [keyPicker(units, ['Deathmaster', 'Gutter Runners', 'Night Runners'])],
    },
    effects: [
      {
        name: `Murder-slay, Now-now!`,
        desc: `If the DEATHMASTER from this battalion is set up in hiding as a reserve unit, in the combat phase in which it is set up on the battlefield you can reroll hit rolls for attacks made by units from the same battalion.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  'Warpcog Convocation': {
    mandatory: {
      units: [keyPicker(units, ['Arch-Warlock'])],
    },
    effects: [],
  },
  'Arkhspark Voltik (Enginecoven)': {
    effects: [
      {
        name: `Arkhspark Voltik`,
        desc: `In your shooting phase, you can pick 1 WARP LIGHTNING CANNON from this enginecoven that is within 13" of the WARLOCK ENGINEER from the same enginecoven, or the ARCH-WARLOCK from the same battalion. If you do so, subtract 1 from the power of that WARP LIGHTNING CANNON's Warp Lightning Blast in that shooting phase (to a minimum power of 1).`,
        when: [SHOOTING_PHASE],
      },
    ],
  },
  'Gascloud Chokelung (Enginecoven)': {
    effects: [
      {
        name: `Gascloud Chokelung`,
        desc: `You can reroll hit rolls of 1 for attacks made with missile weapons by this enginecoven's SKRYRE ACOLYTES and STORMFIENDS armed with Windlaunchers while they are wholly within 13" of the WARLOCK ENGINEER from the same enginecoven, or the ARCH-WARLOCK from the same battalion.`,
        when: [SHOOTING_PHASE],
      },
    ],
  },
  'Gautfyre Skorch (Enginecoven)': {
    effects: [
      {
        name: `Gautfyre Skorch`,
        desc: `Up to 2 units can join each WARP-GRINDER from this enginecoven instead of only 1, as long as both of the units come from the same enginecoven as the WARP-GRINDER that they join tunnelling.`,
        when: [DURING_GAME],
      },
    ],
  },
  'Rattlegauge Warplock (Enginecoven)': {
    effects: [
      {
        name: `Rattlegauge Warplock`,
        desc: `You can reroll hit rolls of 1 for attacks made with missile weapons by this enginecoven's WARPLOCK JEZZAILS and RATLING GUNS while they are wholly within 13" of the WARLOCK ENGINEER from the same enginecoven, or the ARCH-WARLOCK from the same battalion.`,
        when: [SHOOTING_PHASE],
      },
    ],
  },
  'Whyrlblade Threshik (Enginecoven)': {
    effects: [
      {
        name: `Whyrlblade Threshik`,
        desc: `You can move a unit from this enginecoven an extra 3" when it starts the move wholly within 13" of the WARLOCK ENGINEER from the same enginecoven, or the ARCH-WARLOCK from the same battalion.`,
        when: [MOVEMENT_PHASE],
      },
    ],
  },

  'Congregation of Filth': {
    mandatory: {
      units: [keyPicker(units, ['Plague Priest on Plague Furnace', 'Plague Monks'])],
    },
    effects: [
      {
        name: `Plague Altar`,
        desc: `Roll a D6 each time you allocate a wound or mortal wound to a PLAGUE MONKS unit from this battalion while it is wholly within 18" of the same battalion's PLAGUE PRIEST. On a 6 that wound or mortal wound is negated.`,
        when: [WOUND_ALLOCATION_PHASE],
      },
    ],
  },
  'Foulrain Congregation': {
    mandatory: {
      units: [keyPicker(units, ['Plague Priest', 'Plagueclaw'])],
    },
    effects: [
      {
        name: `Foetid Blessings`,
        desc: `Add 1 to wound rolls for attacks made with missile weapons by units in this battalion while they are within 13" of the same battalion's PLAGUE PRIEST.`,
        when: [SHOOTING_PHASE],
      },
    ],
  },
  'Plaguesmog Congregation': {
    mandatory: {
      units: [keyPicker(units, ['Plague Priest on Plague Furnace', 'Plague Censer Bearers'])],
    },
    effects: [
      {
        name: `Poisonous Miasma`,
        desc: `You can reroll the dice that determines if an enemy unit suffers any mortal wounds when you use the Poisonous Fumes ability if that enemy unit is within 3" of a unit from this battalion.`,
        when: [HERO_PHASE],
      },
    ],
  },
  "Sqwal's Pestilent Congregation": {
    effects: [
      {
        name: `Rabid Fervour`,
        desc: `In your hero phase, the Plague Furnace's Plague Priest can order his Plague Monks to reload the Plagueclaw. If the Plague Monks are within 3" of the Plagueclaw when he does so, the Plagueclaw may immediately shoot as if it were the shooting phase.`,
        when: [HERO_PHASE],
      },
    ],
  },
}

const SuperBattalions = {
  'Virulent Procession': {
    mandatory: {
      battalions: [keyPicker(RegularBattalions, ['Congregation of Filth'])],
      units: [keyPicker(units, ['Verminlord Corruptor'])],
    },
    effects: [
      {
        name: `Verminous Infestation`,
        desc: `At the start of your hero phase, pick 1 terrain feature within 13" of this battalion's VERMINLORD CORRUPTOR. Roll a D6 for each enemy unit within 3" of that terrain feature. On a 4+ that unit suffers D3 mortal wounds.`,
        when: [START_OF_HERO_PHASE],
      },
    ],
  },
}

const Battalions = { ...RegularBattalions, ...SuperBattalions }

export default tagAs(Battalions, 'battalion')
