import meta_rule_sources from 'meta/rule_sources'
import { TEntry } from 'types/data'
import {
  CHARGE_PHASE,
  COMBAT_PHASE,
  DURING_SETUP,
  END_OF_MOVEMENT_PHASE,
  HERO_PHASE,
  START_OF_HERO_PHASE,
  WARDS_PHASE,
} from 'types/phases'

// General artifacts from Core Rules 2021
const GenericArtifacts: TEntry[] = [
  {
    name: `Amulet of Destiny`,
    effects: [
      {
        name: `Amulet of Destiny`,
        desc: `The bearer has a ward of 6+.`,
        when: [WARDS_PHASE],
        rule_sources: [meta_rule_sources.CORE_RULES_2021, meta_rule_sources.ERRATA_CORE_RULES_DECEMBER_2021],
      },
    ],
  },
  {
    name: `Vial of Manticore Venom`,
    effects: [
      {
        name: `Vial of Manticore Venom`,
        desc: `Pick 1 of the bearer's melee weapons. Add 1 to wound rolls for attacks made with that weapon.`,
        when: [COMBAT_PHASE],
        rule_sources: [meta_rule_sources.CORE_RULES_2021],
      },
    ],
  },
  {
    name: `Arcane Tome`,
    effects: [
      {
        name: `Arcane Tome`,
        desc: `HERO that does not have the WIZARD, PRIEST or KHORNE keyword. The bearer becomes a WIZARD that can only cast  Arcane Bolt, Mystic Shield and spells to summon endless spells on your army roster. They can attempt to cast 1 spell in your hero phase and attempt to unbind 1 spell in the enemy hero phase.`,
        when: [HERO_PHASE],
        rule_sources: [
          meta_rule_sources.CORE_RULES_2021,
          meta_rule_sources.BATTLESCROLL_DEPLETED_RESERVES_APRIL_2023,
          meta_rule_sources.BATTLESCROLL_ANDTOR_JULY_2023,
        ],
      },
    ],
  },
  {
    name: `Seed of Rebirth`,
    effects: [
      {
        name: `Seed of Rebirth`,
        desc: `You can reroll heroic recovery rolls for the bearer.`,
        when: [START_OF_HERO_PHASE],
        rule_sources: [meta_rule_sources.CORE_RULES_2021],
      },
    ],
  },

  // GHB 2022-23 Season 2 Artifacts
  {
    name: `Tuskhelm`,
    effects: [
      {
        name: `Tuskhelm`,
        desc: `After the bearer makes a charge move, you can pick 1 enemy unit within 1" of the bearer. If you do so, roll a number of dice equal to the unmodified charge roll for that charge move. For each 4+, the target suffers 1 mortal wound. If the bearer already has an ability with an effect that triggers after they make a charge move, you must pick which effect applies (you cannot use both).`,
        when: [CHARGE_PHASE],
        rule_sources: [meta_rule_sources.GHB_2022_2023_SEASON_2],
      },
    ],
  },
  {
    name: `Nightflyer Cloak`,
    effects: [
      {
        name: `Nightflyer Cloak`,
        desc: `During deployment, instead of setting up the bearer on the battlefield, you can place them to one side and say that they are set up in ambush as a reserve unit. At the end of your movement phase, you can set up the bearer on the battlefield, within 1" of a friendly Battleline unit and more than 9" from all enemy units.`,
        when: [DURING_SETUP],
        rule_sources: [meta_rule_sources.GHB_2022_2023_SEASON_2],
      },
      {
        name: `Nightflyer Cloak`,
        desc: `At the end of your movement phase, you can set up the bearer on the battlefield, within 1" of a friendly Battleline unit and more than 9" from all enemy units.`,
        when: [END_OF_MOVEMENT_PHASE],
        rule_sources: [meta_rule_sources.GHB_2022_2023_SEASON_2],
      },
    ],
  },
  {
    name: `Gryph-feather Charm`,
    effects: [
      {
        name: `Gryph-feather Charm`,
        desc: `The bearer has a ward of 5+.`,
        when: [WARDS_PHASE],
        rule_sources: [meta_rule_sources.GHB_2022_2023_SEASON_2],
      },
    ],
  },
]

export default GenericArtifacts
