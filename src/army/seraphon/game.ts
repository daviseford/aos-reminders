import { Game } from 'meta/turn_structure'
import { TURN_ONE, SETUP_END, HERO_PHASE } from 'types/meta'
import { Units, Battalions } from './units'
import { IBattalions, IArtifacts } from 'types/army'
import Artifacts from './artifacts'
import { addToGame } from 'utils/addToGame'

const Seraphon_Game = { ...Game }

addToGame(Seraphon_Game, [SETUP_END], {
  condition: [Units.SLANN, Units.LORD_KROAK],
  action: 'Roll for Constellation Configuration',
})

addToGame(Seraphon_Game, [TURN_ONE, HERO_PHASE], {
  condition: [Units.RIPPERDACTYLS],
  action: 'Place Blot Toad for Ripperdactyls',
})

const processEffects = (obj: IBattalions | IArtifacts) => {
  Object.values(obj).forEach(x => {
    x.effects.forEach(e => {
      addToGame(Seraphon_Game, e.when, {
        condition: [x.name],
        ability: e.name,
        action: e.desc,
      })
    })
  })
}

processEffects(Battalions)
processEffects(Artifacts)

export default Seraphon_Game
