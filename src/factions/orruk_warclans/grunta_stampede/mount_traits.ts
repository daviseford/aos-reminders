import { TItemDescriptions } from 'factions/factionTypes'
import { tagAs } from 'factions/metatagger'
import meta_rule_sources from 'meta/rule_sources'
import { COMBAT_PHASE, END_OF_CHARGE_PHASE, SHOOTING_PHASE } from 'types/phases'

const GruntaStampedeMountTraits = {
  "Propa 'Ard": {
    effects: [
      {
        name: `Propa 'Ard`,
        desc: `When this unit is targeted by an attack, if the weapon used for that attack has a Rend characteristic of -1, change the Rend characteristic for that attack to '-'`,
        when: [SHOOTING_PHASE, COMBAT_PHASE],
        rule_sources: [meta_rule_sources.BOOK_DAWNBRINGERS_BOOK_2],
      },
    ],
  },
  'Propa Nasty': {
    effects: [
      {
        name: `Propa Nasty`,
        desc: `Add 1 to hit rolls and wound rolls for attacks made with melee weapons by this unit's mount(s) if any wounds or mortal wounds were allocated to this unit in the same phase.`,
        when: [COMBAT_PHASE],
        rule_sources: [meta_rule_sources.BOOK_DAWNBRINGERS_BOOK_2],
      },
    ],
  },
  'Propa Wild': {
    effects: [
      {
        name: `Propa Wild`,
        desc: `At the end of the enemy charge phase, before any monstrous rampages are carried out, if this unit is more than 3" from all enemy units but within 12" of any enemy units, you can roll a dice. On a 3+, this unit can attempt a charge.`,
        when: [END_OF_CHARGE_PHASE],
        rule_sources: [meta_rule_sources.BOOK_DAWNBRINGERS_BOOK_2],
      },
    ],
  },
} satisfies TItemDescriptions

export default tagAs(GruntaStampedeMountTraits, 'mount_trait')
