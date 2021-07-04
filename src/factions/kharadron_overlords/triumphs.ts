import { tagAs } from 'factions/metatagger'
import meta_rule_sources from 'meta/rule_sources'
import { HERO_PHASE, SHOOTING_PHASE, WOUND_ALLOCATION_PHASE } from 'types/phases'

// Kharadron Overlords specific triumphs.
const Triumphs = {
  'Overcharged Aetheric Augmentation': {
    effects: [
      {
        name: `Overcharged Aetheric Augmentation`,
        desc: `Once per battle, before an Aether-Khemist uses Aetheric Augmentation, you can overchage it. Pick 1 friendly Skyfarers unit wholly within 18" (Can pick 2 with Supreme command trait). This can be used while in garrison as long as the target is in the same garrison.`,
        when: [HERO_PHASE],
        rule_sources: [meta_rule_sources.BOOK_BROKEN_REALMS_BELAKOR],
      },
    ],
  },
  'Large-calibre Augmentation': {
    effects: [
      {
        name: `Large-calibre Augmentation`,
        desc: `Once per battle, when a friendly Skyvessel with an Aether-Khemist garrisoned is selected to shoot, pick 1 missile weapon it is armed with. You can reroll wounds rolls of 1 for that weapon until the end of the phase.`,
        when: [SHOOTING_PHASE],
        rule_sources: [meta_rule_sources.BOOK_BROKEN_REALMS_BELAKOR],
      },
    ],
  },
  'Focused Aethersight': {
    effects: [
      {
        name: `Focused Aethersight`,
        desc: `Once per battle, before an Aetheric Navigator attempts to unbind/dispel, you can use this triumph to allow for a reroll on the unbind/dispel attempt.`,
        when: [HERO_PHASE],
        rule_sources: [meta_rule_sources.BOOK_BROKEN_REALMS_BELAKOR],
      },
    ],
  },
  'Ride the Storm': {
    effects: [
      {
        name: `Ride the Storm`,
        desc: `Once per battle, before a friendly Aetheric Navigator garrisoned in a Skyvessel uses Aetherstorm, you can use this triumph. If used, add D6" to the Skyvessel's move characteristic and can also reroll run and charge rolls until the end of the turn.`,
        when: [HERO_PHASE],
        rule_sources: [meta_rule_sources.BOOK_BROKEN_REALMS_BELAKOR],
      },
    ],
  },
  "The Gaffer's Motivation": {
    effects: [
      {
        name: `The Gaffer's Motivation`,
        desc: `Once per battle, you can pick 1 friendly Endrinmaster and use this triumph. You can use By Grungni, I Have My Eye On You! command ability without spending a command point. Add 1 to the number of wounds healed by the Endrinriggers unit.`,
        when: [HERO_PHASE],
        rule_sources: [meta_rule_sources.BOOK_BROKEN_REALMS_BELAKOR],
      },
    ],
  },
  'Blow the Magazine': {
    effects: [
      {
        name: `Blow the Magazine`,
        desc: `Once per battle, when a Skyvessel garrisoning an Endrinmaster is destroyed, you can use this triumph. Roll a D6 and on a 1 nothing happens. On a 2-3 each enemy unit within 3" of the Skyvessel suffers 1 mortal wound. On a 4-5 the damage increases to D3 mortal wounds. On a 6, the damage increases to D6 mortal wounds. Proceed with Flying Transport rules as normal after this resolves.`,
        when: [WOUND_ALLOCATION_PHASE],
        rule_sources: [meta_rule_sources.BOOK_BROKEN_REALMS_BELAKOR],
      },
    ],
  },
}

export default tagAs(Triumphs, 'triumph')
