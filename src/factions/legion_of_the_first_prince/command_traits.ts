import { TItemDescriptions } from 'factions/factionTypes'
import { tagAs } from 'factions/metatagger'
import { CHARGE_PHASE, END_OF_MOVEMENT_PHASE, WOUND_ALLOCATION_PHASE } from 'types/phases'

const CommandTraits = {
  'Primordial Commander': {
    effects: [
      {
        name: `Primordial Commander`,
        desc: `If you pick this general to summon via Unyielding Legions, add 1 to the roll.`,
        when: [END_OF_MOVEMENT_PHASE],
      },
    ],
  },
  'Ruinous Aura': {
    effects: [
      {
        name: `Ruinous Aura`,
        desc: `Add 1 to Infernal Realmwalkers rolls for friendly Legion of the First Prince units wholly within 8" of this general.`,
        when: [WOUND_ALLOCATION_PHASE],
      },
    ],
  },
  'Infernal Charge': {
    effects: [
      {
        name: `Infernal Charge`,
        desc: `You can reroll charge rolls made for any friendly Legion of the First Prince units wholly within 12" of this general.`,
        when: [CHARGE_PHASE],
      },
    ],
  },
} satisfies TItemDescriptions

export default tagAs(CommandTraits, 'command_trait')
