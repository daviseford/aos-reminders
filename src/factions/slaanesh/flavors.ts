import { pickEffects } from 'factions/metatagger'
import { CHARGE_PHASE, COMBAT_PHASE, START_OF_COMBAT_PHASE } from 'types/phases'
import { Artifacts } from './artifacts'
import { BattleTraits } from './battle_traits'
import { CommandTraits } from './command_traits'

const Flavors = {
  'Lurid Haze': {
    effects: [
      ...pickEffects(BattleTraits, 'Lurid Haze'),
      ...pickEffects(CommandTraits, 'Lurid Haze'),
      ...pickEffects(Artifacts, 'Lurid Haze'),
      {
        name: `Intoxicating Pall`,
        desc: `You can use this ability once per turn in this phase. Pick 1 friendly Lurid Haze Invaders Host unit wholly within 12" of a friendly Lurid Haze Invaders Host hero with this ability. Until the end of the phase, add 1 to the save rolls for attacks that target the selected unit. The same unit cannot benefit from this more than once per turn.`,
        when: [COMBAT_PHASE],
        command_ability: true,
      },
    ],
  },
  'Faultless Blades': {
    effects: [
      ...pickEffects(BattleTraits, 'Faultless Blades'),
      ...pickEffects(CommandTraits, 'Faultless Blades'),
      ...pickEffects(Artifacts, 'Faultless Blades'),
      {
        name: `Armour of Arrogance`,
        desc: `You can use this ability once per turn. Pick 1 friendly Faultless Blades Pretenders Host unit wholly within 12" of a friendly Faultless Blades Pretenders Host hero with this ability. The first 2 wounds allocated to that unit in this phase are negated.`,
        when: [COMBAT_PHASE],
        command_ability: true,
      },
    ],
  },
  'Scarlet Cavalcade': {
    effects: [
      ...pickEffects(BattleTraits, 'Scarlet Cavalcade'),
      ...pickEffects(CommandTraits, 'Scarlet Cavalcade'),
      ...pickEffects(Artifacts, 'Scarlet Cavalcade'),
      {
        name: `Vicious Spurs`,
        desc: `Pick 1 friendly Scarlet Cavalcade Godseekers Host unit that made a charge move this turn wholly within 12" of a friendly Scarlet Cavalcade Godseekers Host hero. Until the end of the phase, if the unmodified save roll for an attack that targets the unit is a 6, the attacking unit suffers 1 mortal wound after all its attacks have resolved.`,
        when: [START_OF_COMBAT_PHASE],
        command_ability: true,
      },
      {
        name: `Vicious Spurs`,
        desc: `A unit that charges in this phase will be an eligible target for Vicious Spurs if it is wholly within 12" of a Scarlet Cavalcade Godseekers hero.`,
        when: [CHARGE_PHASE],
      },
    ],
  },
}

export default Flavors
