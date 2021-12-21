import { tagAs } from 'factions/metatagger'
import { GenericEffects } from 'generic_rules'
import { CHARGE_PHASE, END_OF_MOVEMENT_PHASE, HERO_PHASE, MOVEMENT_PHASE, START_OF_SETUP } from 'types/phases'
import rule_sources from './rule_sources'

const Scenery = {
  Gnawholes: {
    effects: [
      {
        name: `Setup`,
        desc: `After territories are determined, you can set up this terrain feature more than 3" from all objectives and other terrain features, more than 18" from all other Gnawholes in your army, and wholly within 8" of the edge of the battlefield. If both players can set up faction terrain features at the same time, they must roll off and the winner chooses who sets up their faction terrain features first.`,
        when: [START_OF_SETUP],
        rule_sources: [rule_sources.BATTLETOME_SKAVEN, rule_sources.ERRATA_JULY_2021],
      },
      GenericEffects.Impassable,
      {
        name: `Tunnels Through Reality`,
        desc: `At the end of your movement phase, if there is a friendly SKAVENTIDE Hero within 6" of this terrain feature, you can pick 1 friendly SKAVENTIDE unit within 6" of this terrain feature, remove that unit from the battlefield and set it up wholly within 6" of a different Gnawhole in your army and more than 9" from all enemy models. You can only transport up to 1 friendly unit in this way per battle round, regardless of the number of Gnawholes in your army.`,
        when: [END_OF_MOVEMENT_PHASE],
        rule_sources: [rule_sources.BATTLETOME_SKAVEN, rule_sources.ERRATA_JULY_2021],
      },
      {
        name: `Aura of the Horned Rat`,
        desc: `Add 1 to chanting rolls for friendly SKAVENTIDE PRIESTS within 1" of this terrain feature, and add 1 to casting, dispelling and unbinding rolls for friendly SKAVENTIDE WIZARDS within 1" of this terrain feature.`,
        when: [HERO_PHASE],
        rule_sources: [rule_sources.BATTLETOME_SKAVEN, rule_sources.ERRATA_JULY_2021],
      },
      {
        name: `Aura of the Horned Rat`,
        desc: `Roll a dice for each enemy unit that finishes a normal move, run, retreat or charge move within 1" of this terrain feature. On a 6, that unit suffers D3 mortal wounds.`,
        when: [MOVEMENT_PHASE, CHARGE_PHASE],
        rule_sources: [rule_sources.BATTLETOME_SKAVEN, rule_sources.ERRATA_JULY_2021],
      },
    ],
  },
}

export default tagAs(Scenery, 'scenery')
