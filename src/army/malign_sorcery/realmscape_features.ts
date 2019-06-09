import { IEffects } from 'types/data'
import {
  HERO_PHASE,
  BATTLESHOCK_PHASE,
  DURING_GAME,
  START_OF_HERO_PHASE,
  SHOOTING_PHASE,
  MOVEMENT_PHASE,
  END_OF_COMBAT_PHASE,
  START_OF_CHARGE_PHASE,
  END_OF_SETUP,
  START_OF_MOVEMENT_PHASE,
} from 'types/phases'

const RealmscapeFeatures: IEffects[] = [
  {
    name: 'Life Leeching (Shyish)',
    desc: 'Roll a dice. On a 6+, pick an enemy unit. That unit suffers D3 mortal wounds.',
    when: [START_OF_HERO_PHASE],
  },
  {
    name: 'The Winds of Death (Shyish)',
    desc:
      'Roll a dice. On a 6+, pick an enemy unit, and then roll a dice for each model in it. For each 5+, that unit suffers 1 mortal wound.',
    when: [START_OF_HERO_PHASE],
  },
  {
    name: 'Haunted Realm (Shyish)',
    desc: 'Terrain features have the Sinister scenery rule, in addition to any other scenery rules that they have.',
    when: [DURING_GAME],
  },
  {
    name: 'Eternal War (Shyish)',
    desc: 'Add 1 to the Bravery characteristic of all units.',
    when: [BATTLESHOCK_PHASE],
  },
  { name: 'Aetherquake Aftershock (Shyish)', desc: 'Add 1 to casting rolls.', when: [HERO_PHASE] },

  {
    name: 'Flaming Missiles (Aqshy)',
    desc:
      'Improve the Rend characteristic of missile weapons by 1 while the range from the attacking unit to the target unit is more than 12".',
    when: [SHOOTING_PHASE],
  },
  {
    name: 'Clouds of Smoke and Steam (Aqshy)',
    desc:
      'A model cannot see another model if a straight line drawn from the centre of its base to the centre of the other model’s base passes across a terrain feature other than open ground and/or hills.',
    when: [DURING_GAME],
  },
  {
    name: 'Every Step a League (Aqshy)',
    desc:
      'If a run roll is 6+, or a charge roll is 10+, then you can either say that the unit will not run or charge after all, or you can move the unit but it suffers D3 mortal wounds immediately after the move is completed.',
    when: [DURING_GAME],
  },
  {
    name: 'Burning Skies (Aqshy)',
    desc:
      'If an enemy unit can fly and moves more than 6", roll a dice. On a 4+ the enemy unit suffers 1 mortal wound. On a 6+ it suffers D3 mortal wounds instead.',
    when: [MOVEMENT_PHASE],
  },
  {
    name: 'Geysers of Boiling Blood (Aqshy)',
    desc:
      'At the start of each of your hero phases, roll a dice. On a 6+, a geyser explodes. If it does so, pick a point on the battlefield and roll a dice for each unit within 6" of that point; on a 4+ that unit suffers D3 mortal wounds. On a 6+ the unit suffers D6 mortal wounds instead.',
    when: [START_OF_HERO_PHASE],
  },
  {
    name: 'Iron Trees (Chamon)',
    desc:
      'Worsen the Rend characteristic of a weapon by 1 (to a minimum of ‘-’) if the target has cover from a Citadel Wood or Sylvaneth Wyldwood.',
    when: [DURING_GAME],
  },
  {
    name: 'Rust Plague (Chamon)',
    desc:
      'Roll a dice. On a 6+, pick an enemy unit that is in cover. Subtract 1 from save rolls made for that unit for the rest of the battle.',
    when: [START_OF_HERO_PHASE],
  },
  {
    name: 'Steel Rain (Chamon)',
    desc:
      'Roll a dice. On a 6+, pick an enemy unit that is not in cover. Roll a dice for each model in that unit. Inflict 1 mortal wound for each roll that is less than the unit’s',
    when: [START_OF_HERO_PHASE],
  },
  {
    name: 'Brittle Isles (Chamon)',
    desc: 'Ignore the Rend characteristic of all weapons for the duration of the battle.',
    when: [DURING_GAME],
  },
  {
    name: 'Irresistible Force (Chamon)',
    desc:
      'If a casting roll is a double, after re-rolls but before modifiers are applied, it is successful (even if the roll is less than the casting value of the spell being attempted) and the spell cannot be unbound. After the effects of the spell have been carried out, each unit within 3" of the caster suffers 1 mortal wound.',
    when: [HERO_PHASE],
  },
  {
    name: 'Hungering Animus (Ghur)',
    desc:
      'Roll a dice. On a 6+, pick a point anywhere on the battlefield. Roll a dice for each unit within 6" of that point. On a 4+ the unit being rolled for suffers 1 mortal wound. On a 6+ it suffers D3 mortal wounds instead.',
    when: [START_OF_HERO_PHASE],
  },
  {
    name: 'Primal Violence (Ghur)',
    desc:
      'Roll a dice. On a 6+, carry out the combat phase again before moving on to the battleshock phase (do not roll again at the end of the second combat phase to see if a third combat phase takes place).',
    when: [END_OF_COMBAT_PHASE],
  },
  {
    name: 'Reckless Aggression (Ghur)',
    desc:
      'Any unit that is within 12" of an enemy unit at the start of their charge phase suffers 1 mortal wound unless they finish that charge phase within 3" of an enemy model. In addition, you can re-roll hit rolls of 1 for units that have made a charge move in the same turn.',
    when: [START_OF_CHARGE_PHASE],
  },
  {
    name: 'Beasts of Ghur (Ghur)',
    desc: 'Roll off. The winner can set up an additional monstrous beast using the Monstrous Beasts rule.',
    when: [END_OF_SETUP],
  },
  {
    name: 'Territory of Beasts (Ghur)',
    desc: 'Both players can set up an additional monstrous beast using the Monstrous Beasts rule.',
    when: [END_OF_SETUP],
  },
  {
    name: 'Spontaneous Growth (Ghyran)',
    desc:
      'Roll a dice. On a 6+, you can set up a Sylvaneth Wyldwood terrain feature anywhere on the battlefield that is more than 1" from any other models or terrain features.',
    when: [START_OF_HERO_PHASE],
  },
  {
    name: 'Lifesprings (Ghyran)',
    desc:
      'Before the battle begins, each player picks a HERO from their army. Add 1 to the Wounds characteristic of the heroes that are picked.',
    when: [END_OF_SETUP],
  },
  {
    name: 'Hidden Festering Corruption (Ghyran)',
    desc:
      'Roll a dice. Add 1 to the dice roll if your army has allegiance to NURGLE. On a 5+ pick an enemy unit that is within 1" of a terrain feature. The unit you picked suffers 1 mortal wound.',
    when: [START_OF_HERO_PHASE],
  },
  {
    name: 'Fecund Quagmire (Ghyran)',
    desc: 'Models cannot run unless they are able to fly.',
    when: [MOVEMENT_PHASE],
  },
  {
    name: 'Seeds of Hope (Ghyran)',
    desc:
      'If a battleshock roll is an unmodified 1, then no models from the unit will flee. In addition, heal all wounds that are currently allocated to that unit.',
    when: [BATTLESHOCK_PHASE],
  },
  {
    name: 'Dazzling Glow (Hysh)',
    desc: 'Subtract 1 from hit rolls made for attacks that target units that are in cover.',
    when: [DURING_GAME],
  },
  {
    name: 'Speed of Light (Hysh)',
    desc:
      'Roll a dice. On a 6+, you can pick a friendly unit. Remove that unit from the battlefield, and then set up it anywhere on the battlefield that is more than 9" from any enemy models. This counts as that unit’s move for that movement phase.',
    when: [START_OF_MOVEMENT_PHASE],
  },
  {
    name: 'Domain of Symmetry and Purity (Hysh)',
    desc: 'Subtract 1 from the Bravery characteristic of CHAOS, DESTRUCTION and DEATH units.',
    when: [BATTLESHOCK_PHASE],
  },
  {
    name: 'Wilderness of Broken Dreams (Hysh)',
    desc: 'Subtract 1 from the Bravery characteristic of ORDER units.',
    when: [BATTLESHOCK_PHASE],
  },
  {
    name: 'Aetheric Beams of Light (Hysh)',
    desc:
      'One friendly WIZARD can craft an aetherquartz prism instead of attempting to cast any spells in that phase. If they do so, they can attempt to cast one extra spell in each of their future hero phases, and attempt to unbind one extra spell in each future enemy hero phase. A WIZARD cannot craft more than one aetherquartz prism per battle (though your other wizards can do so in future hero phases).',
    when: [HERO_PHASE],
  },
  { name: 'Impenetrable Gloom (Ulgu)', desc: 'The maximum range of attacks or spells is 6".', when: [DURING_GAME] },
  { name: 'Perpetual Dusk (Ulgu)', desc: 'The maximum range of attacks or spells is 12".', when: [DURING_GAME] },
  { name: 'Darkly Shaded (Ulgu)', desc: 'The maximum range of attacks or spells is 18".', when: [DURING_GAME] },
  {
    name: 'Shadowed Mansions (Ulgu)',
    desc:
      'Pick one friendly unit that is part of a garrison. You can immediately transfer that unit to a different terrain feature that can have a garrison. The unit cannot be transferred to a terrain feature that is garrisoned by an enemy unit, or if doing so would result in the number of models that can garrison the terrain feature being exceeded. Then roll a dice for each model you transfer; on a 1 the model being rolled for becomes lost in the shadows and is slain.',
    when: [START_OF_HERO_PHASE],
  },
  {
    name: 'Shadow Realm (Ulgu)',
    desc:
      'Pick one friendly unit that has all of its models within 6" of any edge of the battlefield. You can remove that unit from the battlefield, and then set it up more than 9" from any enemy units, and with all models within 6" of a different edge of the battlefield. Then roll a dice for each model you moved; on a 1 the model being rolled for becomes lost in the shadows and is slain.',
    when: [START_OF_HERO_PHASE],
  },
]

export default RealmscapeFeatures
