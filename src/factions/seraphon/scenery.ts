import { tagAs } from 'factions/metatagger'
import { GenericEffects } from 'generic_rules'
import { COMBAT_PHASE, HERO_PHASE } from 'types/phases'

const Scenery = {
  'Coalesced Realmshaper Engine': {
    effects: [
      GenericEffects.FactionTerrainSetup_Removable,
      GenericEffects.Impassable,
      {
        name: `Fierce Guardians`,
        desc: `Add 1 to bite rolls made for COALESCED SAURUS and COALESCED KROXIGOR units using the Mighty Saurus Jaws, Saurus Jaws or Vice-like Jaws ability if they are wholly within 12" of this terrain feature. In addition, use the top row on the damage tables of friendly COALESCED MONSTERS if they are wholly within 12" of this terrain feature, regardless of how many wounds the unit has suffered.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  'Starborne Realmshaper Engine': {
    effects: [
      GenericEffects.FactionTerrainSetup_Removable,
      GenericEffects.Impassable,
      {
        name: `Power Unleashed`,
        desc: `In your hero phase, if there are any friendly SERAPHON WIZARDS within 3" of this terrain feature, you can pick 1 other terrain feature on the battlefield and roll a dice for each enemy unit within 3" of that terrain feature. Add 2 to the roll if that terrain feature is within 18" of this terrain feature, and subtract 2 from the roll if that terrain feature is more than 36" from this terrain feature. On a 4+, that enemy unit suffers D3 mortal wounds.`,
        when: [HERO_PHASE],
      },
    ],
  },
}

export default tagAs(Scenery, 'scenery')
