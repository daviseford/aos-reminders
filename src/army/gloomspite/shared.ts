import { TEffects } from 'types/data'
import { START_OF_COMBAT_PHASE } from 'types/phases'

export const StabEmGoodEffect: TEffects = {
  name: `I'm Da Boss, Now Stab 'Em Good!`,
  desc: `You can use this command ability at the start of the combat phase. If you do so, pick 1 friendly Moonclan Grot unit wholly within 12" of a friendly model with this command ability, or wholly within 24" of a model with this command ability that is your general.'The same unit cannot be picked to be affected by this command ability more than once per phase.`,
  when: [START_OF_COMBAT_PHASE],
  command_ability: true,
}
