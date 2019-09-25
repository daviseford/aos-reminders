import { DURING_GAME, START_OF_HERO_PHASE } from 'types/phases'
import { TAbilities } from 'types/army'

// General Allegiance Abilities (always active regardless of army composition)
const Abilities: TAbilities = [
  {
    name: `Forgotten Nightmares`,
    desc: `Missile weapons can only be used to target an IDONETH DEEPKIN unit with this battle trait if it is the closest visible enemy unit.`,
    when: [DURING_GAME],
  },
  {
    name: `Isharann Rituals`,
    desc: `A maximum of one Isharann ritual can be performed in each hero phase.

      In order to perform a ritual, at the start of your hero phase, say which ritual is being performed and then pick one ISHARANN HERO from your army that is more than 9" from any enemy models. Then roll 2D6. Add 1 to the roll if the HERO performing the ritual is within 1" of a Gloomtide Shipwreck, and add a further 1 to the roll if they are a PRIEST. In addition, add 1 to the roll for each other friendly ISHARANN HERO that is within 3" of the model performing the ritual (add 2 instead for each HERO within 3" that is a PRIEST). On a 10+ the ritual is successfully performed and has the effect listed below. On any other result, the ritual fails and nothing happens.

      Ritual of Erosion: Until your next hero phase, enemy units do not receive any benefit for being in cover.

      Ritual of Rousing: Heal 1 wound allocated to each friendly EIDOLON on the battlefield. In addition, you can re-roll failed hit rolls and casting rolls for friendly EIDOLONS until your next hero phase.

      Ritual of the Tempest: Until your next hero phase, enemy models cannot fly.`,
    when: [START_OF_HERO_PHASE],
  },
  {
    name: `Tides of Death`,
    desc: `Idoneth Deepkin units with this battle trait have a different Tides of Death ability each round, as outlined below.

      Round 1 - Low Tide: In this battle round, all units with the Tides of Death battle trait are treated as being in cover.

      Round 2 - Flood Tide: In this battle round, all units with the Tides of Death battle trait that run can still either shoot or charge in the same turn (but not both).

      Round 3 - High Tide: In this battle round, all units with the Tides of Death battle trait fight at the start of the combat phase.

      Round 4 - Ebb Tide: In this battle round, all units with the Tides of Death battle trait that retreat can still either shoot or charge in the same turn (but not both).

      Round 5+ - Repeat starting with Low tide`,
    when: [DURING_GAME],
  },
]

export default Abilities
