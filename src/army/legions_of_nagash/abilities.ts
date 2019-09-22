import {
  COMBAT_PHASE,
  DURING_SETUP,
  END_OF_MOVEMENT_PHASE,
  START_OF_HERO_PHASE,
  HERO_PHASE,
} from 'types/phases'
import { TAbilities } from 'types/army'

// General Allegiance Abilities (always active regardless of army composition)
const Abilities: TAbilities = [
  {
    name: `Deathless Minions`,
    desc: `Roll a D6 each time you allocate a wound or mortal wound to a friendly DEATH unit within 6" of your general or another friendly DEATH HERO. On a 6+ the wound is negated.`,
    when: [COMBAT_PHASE],
  },
  {
    name: `The Unquiet Dead`,
    desc: `After territories have been determined, but before any units have been set up, you may pick up to 2 points in your territory and up to 2 points anywhere on the battlefield to be gravesites. You may wish to place suitable markers on these points. Instead of setting up a SUMMONABLE unit on the battlefield, you can place it to one side and say that it is set up in the grave. You can do this with as many units as you wish.`,
    when: [DURING_SETUP],
  },
  {
    name: `The Unquiet Dead`,
    desc: `At the end of your movement phase, for each friendly Death Hero within 9" of a gravesite, you may pick a single friendly unit in the grave and set it up wholly within 9" of the gravesite and more than 9" from any enemy models. Any model that is unable to be set up in this way is slain. If a unit is still in the grave at the end of the battle, it is considered to be slain.`,
    when: [END_OF_MOVEMENT_PHASE],
  },
  {
    name: `Invigorating Aura`,
    desc: `At the start of your hero phase, pick a friendly SUMMONABLE unit within 9" of this gravesite. You can either heal D3 wounds that have been allocated to it or, if no wounds are currently allocated to the unit, you may return a number of slain models to it that have a combined Wounds characteristic equal to or less than the roll of a D3.`,
    when: [START_OF_HERO_PHASE],
  },
  {
    name: `Endless Legions`,
    desc: `You can use this command ability at the end of your movement phase. If you do so, pick a gravesite that is within 9" of your general, and then pick a friendly Summonable unit that has been destroyed. Set up that unit wholly within 9" of that gravesite and more than 9" from any enemy units.`,
    when: [END_OF_MOVEMENT_PHASE],
    command_ability: true,
  },
  {
    name: `Locus of Shyish`,
    desc: `When you cast any spell from any lore and the unmodified casting roll is 9+, then resolve the spell effect twice.`,
    when: [HERO_PHASE],
  },
]

export default Abilities
