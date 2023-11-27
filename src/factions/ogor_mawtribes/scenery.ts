import { tagAs } from 'factions/metatagger'
import { GenericEffects } from 'generic_rules'
import { END_OF_CHARGE_PHASE, HERO_PHASE, WOUND_ALLOCATION_PHASE } from 'types/phases'
import rule_sources from './rule_sources'

const Scenery = {
  'Great Mawpot': {
    effects: [
      GenericEffects.FactionTerrainSetup,
      GenericEffects.Impassable,
      {
        name: `Vessel of the Gulping God`,
        desc: `Add 1 to casting, unbinding and dispelling rolls for friendly OGOR WIZARDS that are within 1" of this terrain feature.`,
        when: [HERO_PHASE],
        rule_sources: [rule_sources.BATTLETOME_OGOR_MAWTRIBES],
      },
      {
        name: `Battlebroth`,
        desc: `A Great Mawpot is either full or empty. At the start of the battle, it is full. In your hero phase, 1 friendly OGOR HERO within 6" of a full Great Mawpot in your army can spend all of that Great Mawpot's magic. If they do so, you can heal D3 wounds allocated to each friendly OGOR unit wholly within 36" of that Great Mawpot (roll separately for each unit). Once all of the Great Mawpot's magic has been spent, it is empty.`,
        when: [HERO_PHASE],
        rule_sources: [rule_sources.BATTLETOME_OGOR_MAWTRIBES],
      },
      {
        name: `Throw 'Em In`,
        desc: `If an enemy model is slain within 6" of an empty Great Mawpot in your army, it becomes full.`,
        when: [WOUND_ALLOCATION_PHASE],
        rule_sources: [rule_sources.BATTLETOME_OGOR_MAWTRIBES],
      },
    ],
  },

  Mawpit: {
    effects: [
      GenericEffects.FactionTerrainSetup,
      GenericEffects.Defensible,
      {
        name: `The Throat of Ghur`,
        desc: `At the end of the charge phase, the player whose turn is taking place must roll a dice for each unit in their army that is within 12" of this terrain feature and within 12" of any units in their opponent's army and more than 3" from all units in their opponent's army. On a 3+, that unit suffers D3 mortal wounds.

        If this terrain feature has a Head Butcher, this ability affects units within 18" of this terrain feature instead of 12". This ability has no effect on GUTBUSTERS units.`,
        when: [END_OF_CHARGE_PHASE],
      },
      {
        name: `Head Butcher`,
        desc: `If this terrain feature has a Head Butcher, in your hero phase, you can say that an offering will be made to the Mawpit. If you do so, pick 1 enemy unit within 18" of this terrain feature and roll D6. If the roll is more than twice that enemy unit's Wounds characteristic, 1 model in that unit is slain. If the roll is more than three times that enemy unit's Wounds characteristic, 3 models in that unit are slain.`,
        when: [HERO_PHASE],
      },
      {
        name: `It Fights Back`,
        desc: `If this terrain feature is picked as the target of the Smash To Rubble monstrous rampage, and that monstrous rampage is unsuccessful, the MONSTER that carried out that monstrous rampage suffers 3D6 mortal wounds.

        Designer's Note: A Smash To Rubble monstrous rampage is unsuccessful if the roll was not a 3+.`,
        when: [END_OF_CHARGE_PHASE],
      },
    ],
  },
}

export default tagAs(Scenery, 'scenery')
