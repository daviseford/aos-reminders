import { tagAs } from 'factions/metatagger'
import { START_OF_HERO_PHASE } from 'types/phases'

const Prayers = {
  'Isharann Rituals': {
    effects: [
      {
        name: `Isharann Rituals`,
        desc: `A maximum of one Isharann ritual can be performed in each hero phase.
      
          In order to perform a ritual, at the start of your hero phase, say which ritual is being performed and then pick one ISHARANN HERO from your army that is more than 9" from any enemy models. Then roll 2D6. Add 1 to the roll if the HERO performing the ritual is within 1" of a Gloomtide Shipwreck, and add a further 1 to the roll if they are a PRIEST. In addition, add 1 to the roll for each other friendly ISHARANN HERO that is within 3" of the model performing the ritual (add 2 instead for each HERO within 3" that is a PRIEST). On a 10+ the ritual is successfully performed and has the effect listed below. On any other result, the ritual fails and nothing happens.
          
          Ritual of Erosion: Until your next hero phase, enemy units do not receive any benefit for being in cover.
          Ritual of Rousing: Heal 1 wound allocated to each friendly EIDOLON on the battlefield. In addition, you can reroll failed hit rolls and casting rolls for friendly EIDOLONS until your next hero phase.
          Ritual of the Tempest: Until your next hero phase, enemy models cannot fly.`,
        when: [START_OF_HERO_PHASE],
      },
    ],
  },
}

export default tagAs(Prayers, 'prayer')
