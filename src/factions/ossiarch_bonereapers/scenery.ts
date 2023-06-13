import { tagAs } from 'factions/metatagger'
import { GenericEffects } from 'generic_rules'
import { HERO_PHASE } from 'types/phases'

const Scenery = {
  'Bone-tithe Nexus': {
    effects: [
      GenericEffects.FactionTerrainSetup_Removable,
      GenericEffects.Impassable,
      {
        name: `Deadly Gaze`,
        desc: `In your hero phase, you can choose for this terrain feature to deliver 1 of the following punishments:

        Punishment of Agony: Pick 1 enemy unit within 18" of this terrain feature and visible to it, and roll a dice. Add 1 to the roll if any enemy models were slain within 12" of this terrain feature in the previous turn. On a 4+, subtract 1 from hit rolls for attacks made by that unit until your next hero phase.
        
        Punishment of Death: Pick 1 enemy unit within 18" of this terrain feature and visible to it, and roll a dice. Add 1 to the roll if any enemy models were slain within 12" of this terrain feature in the previous turn. On a 4+, that unit suffers D3 mortal wounds.
        
        Punishment of Ignorance: Pick 1 enemy WIZARD or PRIEST within 18" of this terrain feature and visible to it, and roll a dice. Add 1 to the roll if any enemy models were slain within 12" of this terrain feature in the previous turn. On a 4+, subtract 1 from casting rolls or chanting rolls for that unit until your next hero phase.
        
        Punishment of Lethargy: Pick 1 enemy unit within 18" of this terrain feature and visible to it, and roll a dice. Add 1 to the roll if any enemy models were slain within 12" of this terrain feature in the previous turn. On a 4+, that unit cannot run until your next hero phase. In addition, subtract 3 from charge rolls for that unit until your next hero phase.`,
        when: [HERO_PHASE],
      },
    ],
  },
}

export default tagAs(Scenery, 'scenery')
