import { TItemDescriptions } from 'factions/factionTypes'
import { tagAs } from 'factions/metatagger'
import { CHARGE_PHASE, HERO_PHASE } from 'types/phases'

const IronjawzCommandTraits = {
  'Hulking Brute': {
    effects: [
      {
        name: `Hulking Brute`,
        desc: `After this general makes a charge move, you can pick 1 enemy unit within 1" of them and roll a dice. On a 2+, that enemy unit suffers D3 mortal wounds.`,
        when: [CHARGE_PHASE],
      },
    ],
  },

  'Mega Bossy': {
    effects: [
      {
        name: `Mega Bossy`,
        desc: `This general can issue the Mighty Destroyers command even if it has already been issued by another friendly model in the same phase.`,
        when: [HERO_PHASE],
      },
    ],
  },

  'Mighty Waaagh! Leader': {
    effects: [
      {
        name: `Mighty Waaagh! Leader`,
        desc: `If this general calls an Ironjawz Waaagh!, you can reroll charge rolls for friendly IRONJAWZ units wholly within 12" of them until the end of that turn.`,
        when: [CHARGE_PHASE],
      },
    ],
  },

  'Touched by the Waaagh!': {
    effects: [
      {
        name: `Touched by the Waaagh!`,
        desc: `Before attempting to cast a spell with this general, you must pick a unit within 6" of them. That unit suffers D3 mortal wounds but you can add the number of mortal wounds caused to that unit to the casting roll for the spell. If you pick this general to suffer the mortal wounds and they are slain by one of those wounds, the spell is not successfully cast.`,
        when: [HERO_PHASE],
      },
    ],
  },

  'Master of the Weird': {
    effects: [
      {
        name: `Master of the Weird`,
        desc: `You can pick 1 extra spell for this general from the Lore of the Weird (pg 91).`,
        when: [HERO_PHASE],
      },
    ],
  },
} satisfies TItemDescriptions

export default tagAs(IronjawzCommandTraits, 'command_trait')
