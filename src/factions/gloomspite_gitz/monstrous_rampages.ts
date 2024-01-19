import { TItemDescriptions } from 'factions/factionTypes'
import { tagAs } from 'factions/metatagger'
import { END_OF_CHARGE_PHASE } from 'types/phases'

const MonstrousRampages = {
  'Ensnaring Webbing': {
    effects: [
      {
        name: `Ensnaring Webbing`,
        desc: `Only an ARACHNAROK unit can carry out this monstrous rampage. Pick 1 enemy HERO within 3" of this ARACHNAROK unit that is not a MONSTER and roll a dice. If the score equals or exceeds that HERO's Wounds characteristic, that hero cannot fight in the following combat phase.`,
        when: [END_OF_CHARGE_PHASE],
      },
    ],
  },
  'Giant Boing!': {
    effects: [
      {
        name: `Giant Boing!`,
        desc: `Only a MANGLER SQUIGS unit that has made a charge move this turn can carry out this monstrous rampage. This MANGLER SQUIGS unit can make a 3D6" move but it must finish that move within 3" of any enemy units.`,
        when: [END_OF_CHARGE_PHASE],
      },
    ],
  },
} satisfies TItemDescriptions

export default tagAs(MonstrousRampages, 'monstrous_rampage')
