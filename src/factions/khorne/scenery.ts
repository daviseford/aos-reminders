import { tagAs } from 'factions/metatagger'
import { GenericEffects } from 'generic_rules'
import { HERO_PHASE } from 'types/phases'

const Scenery = {
  'Skull Altar': {
    effects: [
      GenericEffects.FactionTerrainSetup,
      GenericEffects.Defensible,
      {
        name: `Words of Hate`,
        desc: `You can reroll chanting rolls for friendly BLADES OF KHORNE PRIESTS while they are wholly within 8" of this terrain feature.`,
        when: [HERO_PHASE],
      },
      {
        name: `Witchbane`,
        desc: `While any terrain features with this scenery rule are on the battlefield, if a spell is miscast, the caster suffers D6 mortal wounds instead of D3.`,
        when: [HERO_PHASE],
      },
      {
        name: `Invoke Judgement`,
        desc: `While a BLADES OF KHORNE PRIEST garrisons this terrain feature, double the range of any prayers it chants to summon invocations.`,
        when: [HERO_PHASE],
      },
    ],
  },
}

export default tagAs(Scenery, 'scenery')
