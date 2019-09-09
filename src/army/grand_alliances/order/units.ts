import { uniqBy } from 'lodash'
import DaughtersOfKhaine from 'army/daughters_of_khaine'
import Dispossessed from 'army/dispossessed'
import Fyreslayers from 'army/fyreslayers'
import IdonethDeepkin from 'army/idoneth'
import KharadronOverlords from 'army/kharadron_overlords'
import Seraphon from 'army/seraphon'
import StormcastEternals from 'army/stormcast_eternals'
import Sylvaneth from 'army/sylvaneth'
import { TUnits } from 'types/army'
import { COMBAT_PHASE, DURING_GAME, END_OF_COMBAT_PHASE, SHOOTING_PHASE, START_OF_GAME } from 'types/phases'

export const MonstrousArcanumOrder: TUnits = [
  {
    name: `Carmine Dragon`,
    effects: [
      {
        name: `Deathly Dark Scales`,
        desc: `Roll a dice each time you allocate a mortal wound to this unit. On a 5+, that mortal wound is negated.`,
        when: [DURING_GAME],
      },
      {
        name: `Soul-sheering Blast`,
        desc: `Do not use the attack sequence for an attack made with a Soul-sheering Blast. Instead roll a dice. On a 5+, the target unit suffers D6 mortal wounds.`,
        when: [SHOOTING_PHASE],
      },
      {
        name: `Spell Devourer`,
        desc: `Each time this model is affected by a spell or endless spell, you can roll a dice. If you do so, on a 4+, ignore the effects of that spell on this model.`,
        when: [DURING_GAME],
      },
    ],
  },
]

// Unit Names
export const Units: TUnits = uniqBy(
  [
    ...DaughtersOfKhaine.Units,
    ...Dispossessed.Units,
    ...Fyreslayers.Units,
    ...IdonethDeepkin.Units,
    ...KharadronOverlords.Units,
    ...MonstrousArcanumOrder,
    ...Seraphon.Units,
    ...StormcastEternals.Units,
    ...Sylvaneth.Units,
  ],
  'name'
)

// Available to ALL factions in this Grand Alliance
export const OrderUnits: TUnits = [
  {
    name: `Gotrek Gurnisson`,
    effects: [
      {
        name: `Avatar of Grimnir`,
        desc: `If any damage is inflicted by an attack, spell, or ability that targets Gotrek or affects Gotrek is greater than 1, change it to 1. If a spell or ability would slay Gotrek, instead deal 1 mortal wound.`,
        when: [DURING_GAME],
      },
      {
        name: `Avatar of Grimnir`,
        desc: `If this model is included in your army, it cannot be set up in reserve and you cannot use spells or abilities on this model that would allow you to set it up again after the battle has begun.`,
        when: [START_OF_GAME],
      },
      {
        name: `Krag Blackhammer's Master Rune`,
        desc: `You can re-roll hit and wound rolls for attacks made by this model. In addition, if the unmodified hit roll for an attack made by this model is 6, that attack inflicts D6 mortal wounds on the target in addition to any normal damage.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Unstoppable Battle Fury`,
        desc: `If this model is within 3" of an enemy unit, this model can fight a second time.`,
        when: [END_OF_COMBAT_PHASE],
      },
      {
        name: `Shoulder Plate of Edassa`,
        desc: `Roll a dice each time you allocate a wound or mortal wound to this model. On a 3+, that wound or mortal wound is ignored.`,
        when: [DURING_GAME],
      },
    ],
  },
]
