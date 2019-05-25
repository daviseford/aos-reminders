import { IEffects } from 'types/data'
import { HERO_PHASE, START_OF_SETUP, MOVEMENT_PHASE, START_OF_MOVEMENT_PHASE } from 'types/phases'

// General Allegiance Abilities (always active regardless of army composition)
const Abilities: IEffects[] = [
  {
    name: 'Wyldwood Groves',
    desc: 'After all other pieces of scenery are set up, but before the battle begins and players choose territory or set up their armies, you can place one Sylvaneth Wyldwood anywhere on the battlefield that is more than 1" from any other piece of scenery.',
    when: START_OF_SETUP,
  },
  {
    name: 'Forest Spirits',
    desc: 'Instead of setting up a SYLVANETH unit or battalion, you can place it to one side and say it is set up as part of your army in one of the hidden enclaves. In any of your movement phases, you can transport the unit (or battalion) to the battlefield. When you do so, set it up so that all models are within 3"ofa Sylvaneth Wyldwood and more than 9" from any enemy models. This is their move for that movement phase.',
    when: MOVEMENT_PHASE,
  },
  {
    name: 'Navigate Realmroots',
    desc: 'If a SYLVANETH unit is within 3" of a Sylvaneth Wyldwood at the start of your movement phase, it can attempt to traverse the spirit paths instead of moving normally. If it does so, remove the unit from the battlefield, then set it up within 3" of a different Sylvaneth Wyldwood, more than 9" from any enemy models. Then, roll a dice and consult the Spirit Path results table.',
    when: START_OF_MOVEMENT_PHASE,
  },
]

export default Abilities
