import { tagAs } from 'factions/metatagger'
import meta_rule_sources from 'meta/rule_sources'
import { COMBAT_PHASE, END_OF_SETUP, SHOOTING_PHASE } from 'types/phases'
import rule_sources from '../rule_sources'
import { TItemDescriptions } from 'factions/factionTypes'

const KruleboyzBattleTraits = {
  'Venom-encrusted Weapons': {
    effects: [
      {
        name: `Venom-encrusted Weapons`,
        desc: `If the unmodified hit roll for an attack made by a KRULEBOYZ ORRUK model is 6, that attack causes a number of mortal wounds to the target equal to the weapon's Damage characteristic and the attack sequence ends (do not make a wound or save roll). This ability has no effect on attacks made by a mount unless noted otherwise.`,
        when: [COMBAT_PHASE, SHOOTING_PHASE],
      },
    ],
  },
  'Kruleboyz Waaagh!': {
    effects: [
      {
        name: `Kruleboyz Waaagh!`,
        desc: `Once per battle, in the combat phase, when you pick a friendly KRULEBOYZ general to fight, you can say that they are calling a Kruleboyz Waaagh!. If you do so, pick up to 2 other friendly KRULEBOYZ units wholly within 18" of that general and that have not yet fought in that combat phase. That general and the units you picked can fight one after the other in the order of your choice.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  'Dirty Tricks': {
    effects: [
      {
        name: `Dirty Tricks`,
        desc: `After the players have received their starting command points but before the start of the first turn, you can pick 2 different Dirty Tricks to employ during the battle:

        Noisy Racket: Subtract 1 from wound rolls for attacks made by enemy units in the first battle round.

        Lethal Surprise: Roll 3 dice. For each 4+, you can pick 1 different terrain feature or different objective that is not wholly within enemy territory and secretly note it down. The first time any enemy unit finishes a move within 1" of that terrain feature or objective, roll a dice. On a 2+, that unit suffers D6 mortal wounds.

        Disappearin' Act: Roll 3 dice. For each 4+, you can pick 1 different enemy unit on the battlefield that has not been reinforced. Then, roll a dice for each unit you picked. If the roll is greater than that unit's Wounds characteristic, your opponent must remove that unit from the battlefield and set it up as a reserve unit. At the end of your opponent's first movement phase, they must set up that unit on the battlefield wholly within their territory and more than 9" away from all enemy units. This Dirty Trick cannot be picked if the battleplan has the 'No Reserves' rule.

        Covered in Mud: Roll 3 dice. For each 4+, pick 1 friendly unit that is nota HERO or MONSTER. While that unit is in cover, it is not visible to enemy units.`,
        when: [END_OF_SETUP],
        rule_sources: [
          rule_sources.BATTLETOME_ORRUK_WARCLANS,
          meta_rule_sources.BATTLESCROLL_DEPLETED_RESERVES_APRIL_2023,
          meta_rule_sources.BATTLESCROLL_ANDTOR_SEPTEMBER_2023,
        ],
      },
    ],
  },
} satisfies TItemDescriptions

export default tagAs(KruleboyzBattleTraits, 'battle_trait')
