import { DURING_GAME, START_OF_SETUP, START_OF_HERO_PHASE } from 'types/phases'
import { IEffects } from 'types/data'

// General Allegiance Abilities (always active regardless of army composition)
const Abilities: IEffects[] = [
  {
    name: 'Forgotten Nightmares',
    desc:
      'Missile weapons can only be used to target an IDONETH DEEPKIN unit with this battle trait if it is the closest visible enemy unit.',
    when: [DURING_GAME],
  },
  {
    name: 'Etheric Vortex',
    desc:
      'After all other terrain features are set up, but before players choose territories or set up their armies, you can set up a maximum of two Etheric Vortex terrain features anywhere on the battlefield so that each is more than 1" from any other terrain features.',
    when: [START_OF_SETUP],
  },
  {
    name: 'Guardians of the Deep',
    desc:
      'Roll a dice each time a wound or mortal wound is allocated to an IDONETH DEEPKIN unit wholly within 6" of this terrain feature. On a 6+ the wound is negated.',
    when: [DURING_GAME],
  },
  {
    name: 'Predators of the Ethersea',
    desc:
      'At the start of your hero phase, roll a dice for each unit within 3" of this terrain feature. Do not roll for IDONETH DEEPKIN units. On a 4+ the unit suffers 1 mortal wound. On a 6+ the unit suffers D3 mortal wounds instead.',
    when: [START_OF_HERO_PHASE],
  },
  {
    name: 'Isharann Rituals',
    desc: `A maximum of one Isharann ritual can be performed in each hero phase.
    
      In order to perform a ritual, at the start of your hero phase, say which ritual is being performed and then pick one ISHARANN HERO from your army that is more than 9" from any enemy models. Then roll 2D6. Add 1 to the roll if the HERO performing the ritual is within 1" of a Gloomtide Shipwreck, and add a further 1 to the roll if they are a PRIEST. In addition, add 1 to the roll for each other friendly ISHARANN HERO that is within 3" of the model performing the ritual (add 2 instead for each HERO within 3" that is a PRIEST). On a 10+ the ritual is successfully performed and has the effect listed below. On any other result, the ritual fails and nothing happens.
      
      Ritual of Erosion: Until your next hero phase, enemy units do not receive any benefit for being in cover.
      
      Ritual of Rousing: Heal 1 wound allocated to each friendly EIDOLON on the battlefield. In addition, you can re-roll failed hit rolls and casting rolls for friendly EIDOLONS until your next hero phase.
      
      Ritual of the Tempest: Until your next hero phase, enemy models cannot fly.`,
    when: [START_OF_HERO_PHASE],
  },
]

export default Abilities
