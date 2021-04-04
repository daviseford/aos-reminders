import { tagAs } from 'factions/metatagger'
import { COMBAT_PHASE, DURING_SETUP, HERO_PHASE, SAVES_PHASE, START_OF_COMBAT_PHASE } from 'types/phases'

// Add individual artifacts here, and access them in other files!
const Artifacts = {
  'Ring of Dominion': {
    effects: [
      {
        name: `Ring of Dominion`,
        desc: `When the bearer is selected to fight in the combat phase, you can pick an enemy model within 3" of them and roll a D6. On a 5+ you can pick a melee weapon that the enemy model is armed with (though not one that has a value for one or more characteristics that is given as '*' or 'See below'). For this combat phase, the bearer of this ring may attack with that weapon in addition to their own. Abilities, modifiers or rerolls that apply to attacks made with that weapon when it is used by the enemy model do not apply to the attacks made with it by the bearer.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  'Shadeglass Decanter': {
    effects: [
      {
        name: `Shadeglass Decanter`,
        desc: `After armies have been set up but before the first battle round, select an enemy HERO. In your hero phase, as long as that hero is on the battlefield, you can roll a D6. If the result is higher than the number of the current battle round, that hero suffers 1 mortal wound.`,
        when: [DURING_SETUP, HERO_PHASE],
      },
    ],
  },
  'Orb of Enchantment': {
    effects: [
      {
        name: `Orb of Enchantment`,
        desc: `Once per battle, at the start of the combat phase, you can pick an enemy HERO within 3" of the bearer. In that combat phase, that enemy hero may not pile in, attack or use abilities.`,
        when: [START_OF_COMBAT_PHASE],
      },
    ],
  },
  'Soulbound Garments': {
    effects: [
      {
        name: `Soulbound Garments`,
        desc: `Reroll save rolls of 1 for the bearer.`,
        when: [SAVES_PHASE],
      },
    ],
  },
  'Oubliette Arcana': {
    effects: [
      {
        name: `Oubliette Arcana`,
        desc: `When an enemy WIZARD successfully casts a spell within 30" of the bearer, instead of attempting to unbind it you can declare that the Oubliette Arcana will attempt to capture the magical energies. Roll a D6. On a 6+ the spell is negated and has no effect. In addition, that spell may not be cast again by that WIZARD for the rest of the battle.`,
        when: [HERO_PHASE],
      },
    ],
  },
  'Amulet of Screams': {
    effects: [
      {
        name: `Amulet of Screams`,
        desc: `Once per battle, when an enemy Wizard successfully casts a spell, you can declare that the bearer will use the Amulet of Screams. If you do so, you cannot attempt to unbind the spell. Instead, roll a D6. On a 2+, the spell is not successfully cast.`,
        when: [HERO_PHASE],
      },
    ],
  },
}

// Always export using tagAs
export default tagAs(Artifacts, 'artifact')
