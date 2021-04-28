import { TEntry } from 'types/data'
import { COMBAT_PHASE, HERO_PHASE, SAVES_PHASE, SHOOTING_PHASE, WOUND_ALLOCATION_PHASE } from 'types/phases'

// General triumphs available from GHB 2020
const GenericTriumphs: TEntry[] = [
  {
    name: `Inspired`,
    effects: [
      {
        name: `Inspired`,
        desc: `Once per battle, when selecting a friendly unit to shoot/fight, you may reroll hit rolls for attacks made by the target until the end of the phase.`,
        when: [SHOOTING_PHASE, COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Bloodthirsty`,
    effects: [
      {
        name: `Bloodthirsty`,
        desc: `Once per battle, when selecting a friendly unit to shoot/fight, you may reroll wound rolls for attacks made by the target until the end of the phase.`,
        when: [SHOOTING_PHASE, COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Indomitable`,
    effects: [
      {
        name: `Indomitable`,
        desc: `Once per battle, before making a save roll for a selected friendly unit, you may reroll save rolls for attacks made against the target.`,
        when: [SAVES_PHASE],
      },
    ],
  },
  // Kharadron Overloards specific triumphs.
  // Most likely these should to live somewhere else after some additional merge functionality is added for faction specific triumphs.
  {
    name: `Overcharged Aetheric Augmentation (Kharadron)`,
    effects: [
      {
        name: `Overcharged Aetheric Augmentation`,
        desc: `Once per battle, before an Aether-Khemist uses Aetheric Augmentation, you can overchage it. Pick 1 friendly Skyfarers unit wholly within 18" (Can pick 2 with Supreme command trait). This can be used while in garrison as long as the target is in the same garrison.`,
        when: [HERO_PHASE],
      },
    ],
  },
  {
    name: `Large-calibre Augmentation (Kharadron)`,
    effects: [
      {
        name: `Large-calibre Augmentation`,
        desc: `Once per battle, when a friendly Skyvessel with an Aether-Khemist garrisoned is selected to shoot, pick 1 missile weapon it is armed with.  You can re-roll wounds rolls of 1 for that weapon until the end of the phase.`,
        when: [SHOOTING_PHASE],
      },
    ],
  },
  {
    name: `Focused Aethersight (Kharadron)`,
    effects: [
      {
        name: `Focused Aethersight`,
        desc: `Once per battle, before an Aetheric Navigator attempts to unbind/dispel, you can use this triumph to allow for a re-roll on the unbind/dispel attempt.`,
        when: [HERO_PHASE],
      },
    ],
  },
  {
    name: `Ride the Storm (Kharadron)`,
    effects: [
      {
        name: `Ride the Storm`,
        desc: `Once per battle, before a friendly Aetheric Navigator garrisoned in a Skyvessel uses Aetherstorm, you can use this triumph. If used, add D6" to the Skyvessel's move characteristic and can also re-roll run and charge rolls until the end of the turn.`,
        when: [HERO_PHASE],
      },
    ],
  },
  {
    name: `The Gaffer's Motivation (Kharadron)`,
    effects: [
      {
        name: `The Gaffer's Motivation`,
        desc: `Once per battle, you can pick 1 friendly Endrinmaster and use this triumph. You can use By Grungni, I Have My Eye On You! command ability without spending a command point.  Add 1 to the number of wounds healed by the Endrinriggers unit.`,
        when: [HERO_PHASE],
      },
    ],
  },
  {
    name: `Blow the Magazine (Kharadron)`,
    effects: [
      {
        name: `Blow the Magazine`,
        desc: `Once per battle, when a Skyvessel garrisoning an Endrinmaster is destroyed, you can use this triumph. Roll a D6 and on a 1 nothing happens. On a 2-3 each enemy unit within 3" of the Skyvessel suffers 1 mortal wound. On a 4-5 the damage increases to D3 mortal wounds. On a 6, the damage increases to D6 mortal wounds. Proceed with Flying Transport rules as normal after this resolves.`,
        when: [WOUND_ALLOCATION_PHASE],
      },
    ],
  },
]

export default GenericTriumphs
