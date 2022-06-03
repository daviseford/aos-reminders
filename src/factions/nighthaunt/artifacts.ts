import { tagAs } from 'factions/metatagger'
import { COMBAT_PHASE, END_OF_COMBAT_PHASE, HERO_PHASE, START_OF_COMBAT_PHASE } from 'types/phases'

// Add individual artifacts here, and access them in other files!
const Artifacts = {
  "Shadow's Edge": {
    effects: [
      {
        name: `Shadow's Edge`,
        desc: `Pick 1 of the bearer's melee weapons. If the unmodified wound roll for an attack made with that weapon is 6, that attack inflicts D3 mortal wounds on the target and the attack sequence ends (do not make a wound roll or save roll).`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  'Reaper of Sorrows': {
    effects: [
      {
        name: `Reaper of Sorrows`,
        desc: `Pick 1 of the bearer's melee weapons. Before the bearer attacks with that weapon, pick 1 enemy unit within 1" of the bearer and roll 2D6. If the result is higher than the target's Bravery characteristic, that weapon's Rend characteristic is -3 for attacks made against that unit until the end of that phase. That weapon's Rend characteristic is -4 instead of -3 if the target is terrified.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  // 'Balefire Blade': {
  //   effects: [
  //     {
  //       name: `Balefire Blade`,
  //       desc: `Pick one of the bearer's melee weapons. Add 1 to that weapon's Damage characteristic.`,
  //       when: [COMBAT_PHASE],
  //     },
  //   ],
  // },
  Slitter: {
    effects: [
      {
        name: `Slitter`,
        desc: `When you pick the bearer to fight for the first time in a turn, before the bearer makes a pile-in move, you can pick 1 enemy model within 1" of the bearer and roll a dice. If the roll is greater than that model's Wounds characteristic, that model is slain.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  'Soulfire Ring': {
    effects: [
      {
        name: `Soulfire Ring`,
        desc: `At the end of the combat phase, you can heal up to D6 wounds allocated to the bearer if any attacks made by the bearer in that phase slay an enemy model.`,
        when: [END_OF_COMBAT_PHASE],
      },
    ],
  },
  // "Headsman's Judgement": {
  //   effects: [
  //     {
  //       name: `Headsman's Judgement`,
  //       desc: `Pick one of the bearer's melee weapons. Add 1 to hit and wound rolls for attacks made with that weapon.`,
  //       when: [COMBAT_PHASE],
  //     },
  //   ],
  // },
  // 'Shrieking Blade': {
  //   effects: [
  //     {
  //       name: `Shrieking Blade`,
  //       desc: `Subtract 1 from hit rolls for attacks made with melee weapons that target the bearer.`,
  //       when: [COMBAT_PHASE],
  //     },
  //   ],
  // },
  'Cloak of the Waxing Moon': {
    effects: [
      {
        name: `Cloak of the Waxing Moon`,
        desc: `Subtract 1 from the Attacks characteristic of melee weapons that target the bearer (to a minimum of 1).`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  'Pendant of the Fell Wind': {
    effects: [
      {
        name: `Pendant of the Fell Wind`,
        desc: `Subtract 1 from wound rolls for attacks made with melee weapons by enemy units while they are within 3" of the bearer.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  // 'Dreadbolt Ring': {
  //   effects: [
  //     {
  //       name: `Dreadbolt Ring`,
  //       desc: `When the bearer fights, if they inflict one or more wounds with their melee weapons, you can inflict D3 mortal wounds on one enemy unit within 3" of the bearer after all of the bearer's attacks have been made.`,
  //       when: [END_OF_COMBAT_PHASE],
  //     },
  //   ],
  // },
  // 'Mirror of Screaming Souls': {
  //   effects: [
  //     {
  //       name: `Mirror of Screaming Souls`,
  //       desc: `At the start of your shooting phase, roll 2D6 for each enemy unit within 8" of the bearer. If the roll is higher than that unit's Bravery characteristic, it suffers 1 mortal wound.`,
  //       when: [START_OF_SHOOTING_PHASE],
  //     },
  //   ],
  // },
  'Midnight Tome': {
    effects: [
      {
        name: `Midnight Tome`,
        desc: `WIZARD only. Once per battle, if the bearer attempts to cast a spell that would summon an endless spell, that spell is automatically cast with a casting roll of 12 that cannot be modified (do not roll 2D6), and it cannot be unbound.`,
        when: [HERO_PHASE],
      },
    ],
  },
  'Covetous Familiar': {
    effects: [
      {
        name: `Covetous Familiar`,
        desc: `Enemy units that finish a pile-in move within 3" of the bearer suffer 1 mortal wound after the pile-in move is made.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  'Lightshard of the Harvest Moon': {
    effects: [
      {
        name: `Lightshard of the Harvest Moon`,
        desc: `Once per battle, at the start of the combat phase, you can say the bearer will release the baleful gloom of the Lightshard. If you do so, add 1 to the Attacks characteristic of melee weapons used by friendly NIGHTHAUNT units wholly within 12" of the bearer until the end of that phase.`,
        when: [START_OF_COMBAT_PHASE],
      },
    ],
  },
  'Wychlight Lantern': {
    effects: [
      {
        name: `Wychlight Lantern`,
        desc: `WIZARD only. Once per battle, this WIZARD can attempt to cast 1 additional spell that it does not know from the Lore of the Underworlds (pg 61).`,
        when: [HERO_PHASE],
      },
    ],
  },
  'Beacon of Nagashizzar': {
    effects: [
      {
        name: `Beacon of Nagashizzar`,
        desc: `Once per battle, in your hero phase, you can say the bearer will call the souls of the lost to the beacon's light. If you do so, you can return 1 slain model to each friendly NIGHTHAUNT SUMMONABLE unit on the battlefield.`,
        when: [HERO_PHASE],
      },
    ],
  },
  // Emerald Host
  // "The Traitor Knight's Blade": {
  //   effects: [
  //     {
  //       name: `The Traitor Knight's Blade`,
  //       desc: `Add 1 to the attacks characteristic for the bearer's Sword of Stolen Hours attack.`,
  //       when: [COMBAT_PHASE],
  //     },
  //   ],
  // },
  // // Reikenor's Condemned
  // 'Corpse Candle': {
  //   effects: [
  //     {
  //       name: `Corpse Candle`,
  //       desc: `Once per battle you can select either the bearer or 1 enemy model within 12" of them. The target suffers 1 mortal wound. If an enemy was targeted, add 1 to the bearer's next casting roll. Add 3 instead of the target was the bearer.`,
  //       when: [HERO_PHASE],
  //     },
  //     {
  //       name: `Corpse Candle`,
  //       desc: `Once per battle you can select either the bearer or 1 enemy model within 12" of them. The target suffers 1 mortal wound. If an enemy was targeted, add 1 to the bearer's hit rolls this phase. Add 1 to hit and wound rolls instead of the target was the bearer.`,
  //       when: [COMBAT_PHASE],
  //     },
  //   ],
  // },
}

// Always export using tagAs
export default tagAs(Artifacts, 'artifact')
