import { DURING_GAME, DURING_SETUP, HERO_PHASE } from 'types/phases'
import { TAbilities } from 'types/army'
import LegionsOfNagash from 'army/legions_of_nagash'

// Importing from LoN
const getLegionsOfNagashAbilities = () => LegionsOfNagash.Abilities

// General Allegiance Abilities (always active regardless of army composition)
const Abilities: TAbilities = [
  ...getLegionsOfNagashAbilities(),
  {
    name: `The Master's Teachings`,
    desc: `Whenever an enemy unit is destroyed, before removing the last model, you may pick one of your gravesites within 6" of that model. Roll a D6, then remove the model. On a 4+, you may pick a friendly SUMMONABLE unit that has been destroyed and set it up again wholly within 9" of that gravesite and more than 9" from any enemy models.`,
    when: [DURING_GAME],
  },
  {
    name: `The Black Disciples`,
    desc: `Friendly LEGION OF SACRAMENT WIZARDS may add +1 to casting rolls.`,
    when: [HERO_PHASE],
  },
  {
    name: `Legion of Sacrament`,
    desc: `This is Arkhan's legion, if he is included in this army he MUST be the army general and if you include any Mortarch units he has to be one of them.`,
    when: [DURING_SETUP],
  },
]

export default Abilities
