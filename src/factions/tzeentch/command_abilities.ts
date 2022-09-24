import { tagAs } from 'factions/metatagger'
import { START_OF_HERO_PHASE } from 'types/phases'

const CommandAbilities = {
  // Unit Commands
  'Beacon of Sorcery': {
    effects: [
      {
        name: `Beacon of Sorcery`,
        desc: `You can use this command ability at the start of your hero phase. If you do so, pick 1 friendly model with this command ability. Until your next hero phase, you can add 1 to casting and unbinding rolls for friendly TZEENTCH DAEMON WIZARDS while they are wholly within 18" of that model. The same unit cannot benefit from this command ability more than once per turn.`,
        when: [START_OF_HERO_PHASE],
      },
    ],
  },
  'Lord of Fate': {
    effects: [
      {
        name: `Lord of Fate`,
        desc: `You can use this command ability at the start of your hero phase. If you do so, pick a friendly model with this command ability. Until your next hero phase, you can reroll hit rolls for attacks made by friendly Tzeentch units wholly within 9" of this model.`,
        when: [START_OF_HERO_PHASE],
      },
    ],
  },
}

export default tagAs(CommandAbilities, 'command_ability')
