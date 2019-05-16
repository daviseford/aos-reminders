import { Game } from 'meta/turn_structure'
import { TURN_ONE, SETUP_END, HERO_PHASE, TTurnWhen, GAME_DURING } from 'types/meta'
import { Units, Battalions } from './units'
import { IBattalions, IArtifacts } from 'types/army'
import Artifacts from './artifacts'

const Seraphon_Game = { ...Game }

Seraphon_Game[SETUP_END].push({
  condition: [Units.SLANN, Units.LORD_KROAK],
  action: 'Roll for Constellation Configuration',
})

Seraphon_Game[TURN_ONE][HERO_PHASE].push({
  condition: [Units.RIPPERDACTYLS],
  action: 'Place Blot Toad for Ripperdactyls',
})

const processEffects = (obj: IBattalions | IArtifacts) => {
  Object.values(obj).forEach(battalion => {
    battalion.effects.forEach(e => {
      Seraphon_Game[e.when[0] as string].push({
        condition: [e.name || battalion.name],
        action: e.desc,
      })
    })
  })
}

processEffects(Battalions)
processEffects(Artifacts)

export default Seraphon_Game
