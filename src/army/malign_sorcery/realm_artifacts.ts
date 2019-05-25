import { TArtifacts } from 'types/army'
import {
  COMBAT_PHASE,
  SHOOTING_PHASE,
  START_OF_COMBAT_PHASE,
  END_OF_SHOOTING_PHASE,
  HERO_PHASE,
  DURING_GAME,
  CHARGE_PHASE,
  MOVEMENT_PHASE,
  END_OF_COMBAT_PHASE,
  START_OF_HERO_PHASE,
  BATTLESHOCK_PHASE,
  START_OF_SETUP,
  START_OF_SHOOTING_PHASE,
} from 'types/phases'

const RealmArtifacts: TArtifacts = [
  {
    name: 'Entangling Blade (Ghyran)',
    effects: [
      {
        name: 'Entangling Blade (Ghyran)',
        desc:
          'Pick one of the bearer’s melee weapons to be an Entangling Blade. If the bearer scores 1 or more hits on an enemy HERO or MONSTER with that weapon, subtract 1 from hit rolls for that enemy HERO or MONSTER until the end of the phase in which the hits were scored.',
        when: COMBAT_PHASE,
      },
    ],
  },
  {
    name: 'Jadewound Thorn (Ghyran)',
    effects: [
      {
        name: 'Jadewound Thorn (Ghyran)',
        desc:
          'Pick one of the bearer’s melee weapons to be the Jadewound Thorn. If the hit roll for that weapon is 6+ that attack inflicts 1 mortal wound in addition to its normal damage.',
        when: COMBAT_PHASE,
      },
    ],
  },
  {
    name: 'Blade of Hammerhal Ghyra (Ghyran)',
    effects: [
      {
        name: 'Blade of Hammerhal Ghyra (Ghyran)',
        desc:
          'Pick one of the bearer’s melee weapons to be a Blade of Hammerhal Ghyra. Add 1 to the Attacks characteristic of this weapon.',
        when: COMBAT_PHASE,
      },
    ],
  },
  {
    name: 'The Sunderblade (Ghyran)',
    effects: [
      {
        name: 'The Sunderblade (Ghyran)',
        desc:
          'In your shooting phase, roll a dice for each enemy unit within 9" of the bearer. On a 6+ that unit suffers D3 mortal wounds.',
        when: SHOOTING_PHASE,
      },
    ],
  },
  {
    name: 'Ghyrstrike (Ghyran)',
    effects: [
      {
        name: 'Ghyrstrike (Ghyran)',
        desc: 'Pick one of the bearer’s melee weapons to be Ghyrstrike. Add 1 to hit and wound rolls for this weapon.',
        when: COMBAT_PHASE,
      },
    ],
  },
  {
    name: 'Arboreal Stave (Ghyran)',
    effects: [
      {
        name: 'Arboreal Stave (Ghyran)',
        desc:
          'At the start of the combat phase, you can pick an enemy HERO within 3" of the bearer that is visible to them and roll a dice. On a 5+ that HERO cannot make a pile-in move this combat phase.',
        when: START_OF_COMBAT_PHASE,
      },
    ],
  },
  {
    name: 'Hypersnare Seeds (Ghyran)',
    effects: [
      {
        name: 'Hypersnare Seeds (Ghyran)',
        desc:
          'At the end of your opponent’s shooting phase, pick an enemy unit within 8" of the bearer that is visible to them and roll a dice. On a 5+ that unit may not charge in the subsequent charge phase.',
        when: END_OF_SHOOTING_PHASE,
      },
    ],
  },
  {
    name: 'Verdant Mantle (Ghyran)',
    effects: [
      {
        name: 'Verdant Mantle (Ghyran)',
        desc:
          'In your hero phase, the bearer may attempt to dispel one endless spell in the same manner as a WIZARD. If the bearer is a WIZARD, this does not prevent them from casting any spells during this phase.',
        when: HERO_PHASE,
      },
    ],
  },
  {
    name: 'Jade Diadem (Ghyran)',
    effects: [
      {
        name: 'Jade Diadem (Ghyran)',
        desc:
          'If the unmodified save roll for an attack that targets the bearer is 6, heal 1 wound allocated to the bearer.',
        when: DURING_GAME,
      },
    ],
  },
  {
    name: 'Greenglade Flask (Ghyran)',
    effects: [
      {
        name: 'Greenglade Flask (Ghyran)',
        desc:
          'Once per battle, in your hero phase, the bearer can drink from the Greenglade Flask. If they do, heal D6 wounds allocated to them.',
        when: HERO_PHASE,
      },
    ],
  },
  {
    name: 'Ghyrropian Gauntlets (Ghyran)',
    effects: [
      {
        name: 'Ghyrropian Gauntlets (Ghyran)',
        desc: 'The bearer can move an extra 3" when making a pile-in move.',
        when: CHARGE_PHASE,
      },
    ],
  },
  {
    name: 'Wand of Restoration (Ghyran)',
    effects: [
      {
        name: 'Wand of Restoration (Ghyran)',
        desc:
          'In your hero phase, pick a friendly model within 6" of the bearer that is visible to them. Heal 1 wound allocated to that model.',
        when: HERO_PHASE,
      },
    ],
  },
  {
    name: 'Stonehorn Blade (Ghur)',
    effects: [
      {
        name: 'Stonehorn Blade (Ghur)',
        desc:
          'Pick one of the bearer’s melee weapons to be a Stonehorn Blade. Roll a dice at the end of any phase in which any wounds were inflicted by that weapon. On a 5+ you can pick an enemy unit within 3" of the bearer. That unit suffers D3 mortal wounds.',
        when: COMBAT_PHASE,
      },
    ],
  },
  {
    name: "Anraheir's Claw (Ghur)",
    effects: [
      {
        name: "Anraheir's Claw (Ghur)",
        desc:
          'Pick one of the bearer’s melee weapons to be Anraheirs’s Claw. If the wound roll for that weapon is 6+ add 2 to the Damage characteristic of that weapon for that attack.',
        when: COMBAT_PHASE,
      },
    ],
  },
  {
    name: 'Amberglaive (Ghur)',
    effects: [
      {
        name: 'Amberglaive (Ghur)',
        desc:
          'Pick one of the bearer’s melee weapons to be an Amberglaive. Add 1" to the Range characteristic of that weapon (to a maximum of 3"). In addition, add 1 to hit rolls for that weapon.',
        when: COMBAT_PHASE,
      },
    ],
  },
  {
    name: 'Blade of Carving (Ghur)',
    effects: [
      {
        name: 'Blade of Carving (Ghur)',
        desc:
          'Pick one of the bearer’s melee weapons to be a Blade of Carving. If a hit roll for an attack with this weapon is 6+ the wound roll for that attack is automatically successful.',
        when: COMBAT_PHASE,
      },
    ],
  },
  {
    name: 'Rageblade (Ghur)',
    effects: [
      {
        name: 'Rageblade (Ghur)',
        desc:
          'Pick one of the bearer’s melee weapons to be a Rageblade. Add 1 to the attacks characteristic of that weapon.',
        when: COMBAT_PHASE,
      },
    ],
  },
  {
    name: 'Rockjaws (Ghur)',
    effects: [
      {
        name: 'Rockjaws (Ghur)',
        desc:
          'In your shooting phase, you can pick an enemy unit within 8" of the bearer that is visible to them and roll a dice. On a 3+ that unit suffers D3 mortal wounds.',
        when: SHOOTING_PHASE,
      },
    ],
  },
  {
    name: "Beastcaller's Bones (Ghur)",
    effects: [
      {
        name: "Beastcaller's Bones (Ghur)",
        desc:
          'At the start of the combat phase, roll a dice for each MONSTER within 3" of the bearer. On a 5+ the monster being rolled for cannot attack this phase. If the monster is a mount, the rider may still attack with their own weapons as normal.',
        when: START_OF_COMBAT_PHASE,
      },
    ],
  },
  {
    name: 'Drakeforged Plate (Ghur)',
    effects: [
      {
        name: 'Drakeforged Plate (Ghur)',
        desc: 'Re-roll save rolls of 1 for the bearer against attacks that have a random Damage characteristic.',
        when: DURING_GAME,
      },
    ],
  },
  {
    name: 'Gryph-feather Charm (Ghur)',
    effects: [
      {
        name: 'Gryph-feather Charm (Ghur)',
        desc:
          'Subtract 1 from hit rolls for attacks that target the bearer. In addition, add 1" to the bearer’s Move characteristic.',
        when: DURING_GAME,
      },
    ],
  },
  {
    name: 'Gargant-bone Dice (Ghur)',
    effects: [
      {
        name: 'Gargant-bone Dice (Ghur)',
        desc:
          'Once per battle, in your hero phase, you can declare that the bearer will roll their Gargant- bone Dice. If you do so, roll three dice. For each roll of a 5+ each enemy unit within 6" of the bearer suffers D3 mortal wounds.',
        when: HERO_PHASE,
      },
    ],
  },
  {
    name: 'Shardfist Pelt (Ghur)',
    effects: [
      {
        name: 'Shardfist Pelt (Ghur)',
        desc:
          'Each time you make a save roll of 6+ for the bearer in the combat phase, the attacking unit suffers 1 mortal wound after all of its attacks have been made.',
        when: COMBAT_PHASE,
      },
    ],
  },
  {
    name: 'Tuskhelm (Ghur)',
    effects: [
      {
        name: 'Tuskhelm (Ghur)',
        desc:
          'Roll a dice for each enemy unit within 1" of the bearer after the bearer completes a charge move. On a 4+ the unit being rolled for suffers 1 mortal wound.',
        when: CHARGE_PHASE,
      },
    ],
  },
  {
    name: "Aiban's Hidden Blade (Chamon)",
    effects: [
      {
        name: "Aiban's Hidden Blade (Chamon)",
        desc:
          'Pick one of the bearer’s melee weapons to be Aiban’s Hidden Blade. If the hit roll for that weapon is 6+ add 1 to the Damage characteristic of that attack.',
        when: COMBAT_PHASE,
      },
    ],
  },
  {
    name: 'Flowstone Blade (Chamon)',
    effects: [
      {
        name: 'Flowstone Blade (Chamon)',
        desc:
          'Pick one of the bearer’s melee weapons to be a Flowstone Blade. Each time you roll a hit roll of 6+ for this weapon, add 1 to the wound roll for that attack.',
        when: COMBAT_PHASE,
      },
    ],
  },
  {
    name: 'Rune Blade (Chamon)',
    effects: [
      {
        name: 'Rune Blade (Chamon)',
        desc: 'Pick one of the bearer’s melee weapons to be a Rune Blade. That weapon has a Rend characteristic of -3.',
        when: COMBAT_PHASE,
      },
    ],
  },
  {
    name: 'Crucible of Molten Silver (Chamon)',
    effects: [
      {
        name: 'Crucible of Molten Silver (Chamon)',
        desc:
          'Once per battle, in your shooting phase, pick a point on the battlefield within 9" of the bearer that is visible to them and draw an imaginary straight line 1mm wide between that point and the closest part of the bearer. Each unit other than the bearer that has models passed across by this line suffers D3 mortal wounds.',
        when: SHOOTING_PHASE,
      },
    ],
  },
  {
    name: 'Chamonite Darts (Chamon)',
    effects: [
      {
        name: 'Chamonite Darts (Chamon)',
        desc:
          'In your shooting phase, you can pick an enemy unit within 8" of the bearer and roll six dice. For each 6+ that enemy unit suffers 1 mortal wound.',
        when: SHOOTING_PHASE,
      },
    ],
  },
  {
    name: "Argentine's Tooth (Chamon)",
    effects: [
      {
        name: "Argentine's Tooth (Chamon)",
        desc: 'Pick one of the bearer’s melee weapons to be Argentine’s Tooth. Re-roll hit rolls of 1 for this weapon.',
        when: COMBAT_PHASE,
      },
    ],
  },
  {
    name: 'Gildenbane (Chamon)',
    effects: [
      {
        name: 'Gildenbane (Chamon)',
        desc:
          'If an enemy model is the bearer of an artefact of power, they cannot use the rules for their artefact of power while they are within 3" of the bearer of Gildenbane.',
        when: DURING_GAME,
      },
    ],
  },
  {
    name: 'Argent Armour (Chamon)',
    effects: [
      {
        name: 'Argent Armour (Chamon)',
        desc: 'Subtract 1 from hit rolls for attacks for melee weapons that target the bearer.',
        when: COMBAT_PHASE,
      },
    ],
  },
  {
    name: 'Hydroxskin Cloak (Chamon)',
    effects: [
      {
        name: 'Hydroxskin Cloak (Chamon)',
        desc:
          'The bearer can fly. After the bearer has made a normal move, you can pick 1 unit that has any models that the bearer has passed across and roll a dice. On a 3+ that unit suffers D3 mortal wounds.',
        when: MOVEMENT_PHASE,
      },
    ],
  },
  {
    name: 'Godwrought Helm (Chamon)',
    effects: [
      {
        name: 'Godwrought Helm (Chamon)',
        desc: 'Roll a dice each time you allocate a wound to the bearer. On a 6+ the wound is negated.',
        when: DURING_GAME,
      },
    ],
  },
  {
    name: 'Bejewelled Gauntlet (Chamon)',
    effects: [
      {
        name: 'Bejewelled Gauntlet (Chamon)',
        desc:
          'At the end of the combat phase, pick an enemy unit within 1" of the bearer and roll a dice. On a 3+ that unit suffers 1 mortal wound.',
        when: END_OF_COMBAT_PHASE,
      },
    ],
  },
  {
    name: 'Alchemical Chain (Chamon)',
    effects: [
      {
        name: 'Alchemical Chain (Chamon)',
        desc:
          'The bearer can attempt to unbind a single spell in each enemy hero phase in the same manner as a WIZARD. If the bearer is already a WIZARD, they can attempt to unbind 1 additional spell instead.',
        when: HERO_PHASE,
      },
    ],
  },
  {
    name: 'Ruby Ring (Aqshy)',
    effects: [
      {
        name: 'Ruby Ring (Aqshy)',
        desc:
          'In your hero phase, you can pick the closest enemy unit within 18" of the bearer and roll a dice. On a 5+ that unit suffers D3 mortal wounds. If two or more enemy units are equally close to the bearer, you can pick any of them.',
        when: HERO_PHASE,
      },
    ],
  },
  {
    name: 'Magmaforged Blade (Aqshy)',
    effects: [
      {
        name: 'Magmaforged Blade (Aqshy)',
        desc:
          'Pick one of the bearer’s melee weapons to be a Magmaforged Blade. If the wound roll for that weapon is 6+ that attack inflicts 1 mortal wound in addition to its normal damage.',
        when: COMBAT_PHASE,
      },
    ],
  },
  {
    name: 'Magmadroth Blood Vials (Aqshy)',
    effects: [
      {
        name: 'Magmadroth Blood Vials (Aqshy)',
        desc:
          'In your shooting phase, you can pick an enemy unit within 8" of the bearer and roll a dice. On a 4+ that unit suffers 1 mortal wound.',
        when: SHOOTING_PHASE,
      },
    ],
  },
  {
    name: 'Purefire Brazier (Aqshy)',
    effects: [
      {
        name: 'Purefire Brazier (Aqshy)',
        desc:
          'In your shooting phase, roll a dice for each enemy unit within 9" of the bearer. On a 5+ that unit suffers 1 mortal wound.',
        when: SHOOTING_PHASE,
      },
    ],
  },
  {
    name: 'Onyx Blade (Aqshy)',
    effects: [
      {
        name: 'Onyx Blade (Aqshy)',
        desc: 'Pick one of the bearer’s melee weapons to be an Onyx Blade. Add 1 to wound rolls for that weapon.',
        when: COMBAT_PHASE,
      },
    ],
  },
  {
    name: 'Exile Torch (Aqshy)',
    effects: [
      {
        name: 'Exile Torch (Aqshy)',
        desc:
          'At the start of the combat phase, pick an enemy HERO within 3" of the bearer and roll a dice. On a 6+ that HERO suffers 1 mortal wound and may not fight or be chosen as the target of an attack until the end of the turn.',
        when: START_OF_COMBAT_PHASE,
      },
    ],
  },
  {
    name: 'Essence of Vulcatrix (Aqshy)',
    effects: [
      {
        name: 'Essence of Vulcatrix (Aqshy)',
        desc:
          'Once per battle, at the start of your hero phase, the bearer may drink the Essence of Vulcatrix. If they do so, roll a dice. On a 1, the bearer suffers D3 mortal wounds. On a 2+ add 1 to hit and wound rolls for the bearer until your next hero phase.',
        when: START_OF_HERO_PHASE,
      },
    ],
  },
  {
    name: 'Thermalrider Cloak (Aqshy)',
    effects: [
      {
        name: 'Thermalrider Cloak (Aqshy)',
        desc: 'Add 4 to the bearer’s Movement characteristic. In addition, the bearer may fly.',
        when: MOVEMENT_PHASE,
      },
    ],
  },
  {
    name: 'Smouldering Helm (Aqshy)',
    effects: [
      {
        name: 'Smouldering Helm (Aqshy)',
        desc:
          'Each time you make a successful save roll of 6+ for the bearer in the combat phase, the attacking unit suffers 1 mortal wound after all of its attacks have been made.',
        when: COMBAT_PHASE,
      },
    ],
  },
  {
    name: "Ignax's Scales (Aqshy)",
    effects: [
      {
        name: "Ignax's Scales (Aqshy)",
        desc: 'Roll a dice each time you allocate a mortal wound to the bearer. On a 4+ the wound is negated.',
        when: DURING_GAME,
      },
    ],
  },
  {
    name: 'Crown of Flames (Aqshy)',
    effects: [
      {
        name: 'Crown of Flames (Aqshy)',
        desc: 'Add 1 to the Bravery characteristic of friendly units while they are wholly within 9" of the bearer.',
        when: BATTLESHOCK_PHASE,
      },
    ],
  },
  {
    name: 'Cleansing Brooch (Aqshy)',
    effects: [
      {
        name: 'Cleansing Brooch (Aqshy)',
        desc:
          'Once per battle, at the start of your hero phase, you may declare that the bearer will activate the brooch. If you do so, heal D3 wounds allocated to them.',
        when: START_OF_HERO_PHASE,
      },
    ],
  },
  {
    name: 'Blade of Endings (Shyish)',
    effects: [
      {
        name: 'Blade of Endings (Shyish)',
        desc:
          'Pick one of the bearer’s melee weapons to be a Blade of Endings. If the hit roll for that weapon is 6+ add 2 to the Damage characteristic of that attack.',
        when: COMBAT_PHASE,
      },
    ],
  },
  {
    name: 'Banshee Blade (Shyish)',
    effects: [
      {
        name: 'Banshee Blade (Shyish)',
        desc:
          'Pick one of the bearer’s melee weapons to be a Banshee Blade. Each time you roll a hit roll of 6+ for this weapon, roll 2D6. If the roll is equal to or more than the target’s Bravery characteristic, that attack inflicts D3 mortal wounds in addition to its normal damage.',
        when: COMBAT_PHASE,
      },
    ],
  },
  {
    name: 'Lifebane (Shyish)',
    effects: [
      {
        name: 'Lifebane (Shyish)',
        desc: 'Pick one of the bearer’s melee weapons to be Lifebane. Add 1 to wound rolls for this weapon.',
        when: COMBAT_PHASE,
      },
    ],
  },
  {
    name: 'Sliver of Decreptitude (Shyish)',
    effects: [
      {
        name: 'Sliver of Decreptitude (Shyish)',
        desc:
          'Pick one of the bearer’s melee weapons to be a Sliver of Decrepitude. Allocate wounds inflicted by that weapon before allocating wounds inflicted by any other attacks made by the bearer. If 1 or more wounds by that weapon are inflicted on an enemy HERO or MONSTER, subtract 2" from that HERO or MONSTER’s Move characteristic for the rest of the battle.',
        when: COMBAT_PHASE,
      },
    ],
  },
  {
    name: 'Wraithbow (Shyish)',
    effects: [
      {
        name: 'Wraithbow (Shyish)',
        desc:
          'In your shooting phase, pick an enemy unit within 18" of the bearer and roll six dice. For each 6+ that enemy unit suffers 1 mortal wound.',
        when: SHOOTING_PHASE,
      },
    ],
  },
  {
    name: 'Splintertooth (Shyish)',
    effects: [
      {
        name: 'Splintertooth (Shyish)',
        desc:
          'In your shooting phase, pick an enemy unit within 8" of the bearer and roll three dice. If two dice have the same roll, that enemy unit suffers D3 mortal wounds. If all three dice have the same roll, that enemy unit suffers D6 mortal wounds instead.',
        when: SHOOTING_PHASE,
      },
    ],
  },
  {
    name: 'Cronehair Fetish (Shyish)',
    effects: [
      {
        name: 'Cronehair Fetish (Shyish)',
        desc: 'You can add or subtract 1 from the result of any roll on the Shyish Realmscape Features table.',
        when: START_OF_SETUP,
      },
    ],
  },
  {
    name: 'Ethereal Amulet (Shyish)',
    effects: [
      {
        name: 'Ethereal Amulet (Shyish)',
        desc: 'Ignore modifiers (positive or negative) when making save rolls for this model.',
        when: DURING_GAME,
      },
    ],
  },
  {
    name: 'Sepulchral Plate (Shyish)',
    effects: [
      {
        name: 'Sepulchral Plate (Shyish)',
        desc: 'Roll a dice each time you allocate a wound to the bearer. On a 6+ the wound is negated.',
        when: DURING_GAME,
      },
    ],
  },
  {
    name: 'Amethyst Blindmask (Shyish)',
    effects: [
      {
        name: 'Amethyst Blindmask (Shyish)',
        desc:
          'If the bearer is slain, before removing the model, roll a dice for each enemy unit within 6" of the bearer. On a 3+ that unit suffers 1 mortal wound.',
        when: DURING_GAME,
      },
    ],
  },
  {
    name: 'The Ragged Cloak (Shyish)',
    effects: [
      {
        name: 'The Ragged Cloak (Shyish)',
        desc:
          'Once per battle, at the start of your opponent’s shooting phase, you can declare that bearer will shroud themselves with the Ragged Cloak. If you do so, the bearer may not be chosen as the target of an attack until the end of the phase.',
        when: START_OF_SHOOTING_PHASE,
      },
    ],
  },
  {
    name: 'Goblet of Draining (Shyish)',
    effects: [
      {
        name: 'Goblet of Draining (Shyish)',
        desc:
          'If 1 or more wounds are inflicted on an enemy HERO by the bearer, roll a dice. On a 5+ that HERO suffers D3 mortal wounds.',
        when: DURING_GAME,
      },
    ],
  },
  {
    name: 'Miasmatic Blade (Ulgu)',
    effects: [
      {
        name: 'Miasmatic Blade (Ulgu)',
        desc:
          'Pick one of the bearer’s melee weapons to be a Miasmatic Blade. Subtract 1 from hit rolls for attacks that target the bearer.',
        when: DURING_GAME,
      },
    ],
  },
  {
    name: 'Blade of the Thirteen Dominions (Ulgu)',
    effects: [
      {
        name: 'Blade of the Thirteen Dominions (Ulgu)',
        desc:
          'Pick one of the bearer’s melee weapons to be a Blade of the Thirteen Dominions. Allocate wounds inflicted by that weapon before allocating wounds inflicted by any other attacks made by the bearer. If 1 or more wounds are inflicted on an enemy unit by that weapon, subtract 1 from hit rolls for attacks made by that unit until the end of the phase.',
        when: COMBAT_PHASE,
      },
    ],
  },
  {
    name: 'Blade of Folded Shadows (Ulgu)',
    effects: [
      {
        name: 'Blade of Folded Shadows (Ulgu)',
        desc:
          'Pick one of the bearer’s melee weapons to be a Blade of Folded Shadows. Add 1 to hit rolls for this weapon.',
        when: COMBAT_PHASE,
      },
    ],
  },
  {
    name: 'Blade of Secrets (Ulgu)',
    effects: [
      {
        name: 'Blade of Secrets (Ulgu)',
        desc:
          'Pick one of the bearer’s melee weapons to be a Blade of Secrets. Allocate wounds inflicted by that weapon before allocating wounds inflicted by any other attacks made by the bearer. If 1 or more wounds are inflicted on an enemy WIZARD by that weapon, pick one spell that WIZARD knows. That WIZARD may not attempt to cast that spell again during that battle.',
        when: COMBAT_PHASE,
      },
    ],
  },
  {
    name: 'Dimensional Blade (Ulgu)',
    effects: [
      {
        name: 'Dimensional Blade (Ulgu)',
        desc:
          'Pick one of the bearer’s melee weapons to be a Dimensional Blade. Change the Rend characteristic of this weapon to -3.',
        when: COMBAT_PHASE,
      },
    ],
  },
  {
    name: 'Sword of Judgement (Ulgu)',
    effects: [
      {
        name: 'Sword of Judgement (Ulgu)',
        desc:
          'Pick one of the bearer’s melee weapons to be a Sword of Judgement. If the hit roll for an attack with that weapon against a HERO or MONSTER is 6+, that attack inflicts D6 mortal wounds and the attack sequence ends (do not make a wound or save roll).',
        when: COMBAT_PHASE,
      },
    ],
  },
  {
    name: 'Spellmirror (Ulgu)',
    effects: [
      {
        name: 'Spellmirror (Ulgu)',
        desc:
          'If a friendly unit within 6" of the bearer is affected by a spell, you can roll a dice. On a 5+ that unit is not affected by the spell. On a 1 the Spellmirror may not be used for the rest of the battle.',
        when: HERO_PHASE,
      },
    ],
  },
  {
    name: "Trickster's Helm (Ulgu)",
    effects: [
      {
        name: "Trickster's Helm (Ulgu)",
        desc: 'Re-roll successful casting rolls for enemy WIZARDS while they are within 8" of the bearer.',
        when: HERO_PHASE,
      },
    ],
  },
  {
    name: 'Wristbands of Illusion (Ulgu)',
    effects: [
      {
        name: 'Wristbands of Illusion (Ulgu)',
        desc: 'Roll a dice each time you allocate a wound to the bearer. On a 6+ the wound is negated.',
        when: DURING_GAME,
      },
    ],
  },
  {
    name: 'Doppelganger Cloak (Ulgu)',
    effects: [
      {
        name: 'Doppelganger Cloak (Ulgu)',
        desc:
          'Once per battle, at the start of the combat phase, you can say that the bearer will put on the cloak. If you do so, the bearer cannot be chosen as the target of attacks made with melee weapons unless the bearer has made any attacks earlier in that phase.',
        when: START_OF_COMBAT_PHASE,
      },
    ],
  },
  {
    name: "Betrayer's Crown (Ulgu)",
    effects: [
      {
        name: "Betrayer's Crown (Ulgu)",
        desc:
          'Once per battle, at the start of the combat phase, pick an enemy unit within 3" of the bearer that has two or more models. Roll a dice for each model in that enemy unit. For each 5+ that enemy unit suffers 1 mortal wound.',
        when: START_OF_COMBAT_PHASE,
      },
    ],
  },
  {
    name: 'Talisman of the Watcher (Ulgu)',
    effects: [
      {
        name: 'Talisman of the Watcher (Ulgu)',
        desc:
          'If the bearer is not within 3" of an enemy unit at the start of the combat phase, pick a friendly unit within 9" of the bearer. You can re-roll save rolls of 1 for that unit until the end of that phase.',
        when: START_OF_COMBAT_PHASE,
      },
    ],
  },
  {
    name: 'Blade of Symmetry (Hysh)',
    effects: [
      {
        name: 'Blade of Symmetry (Hysh)',
        desc:
          'Pick one of the bearer’s melee weapons to be a Blade of Symmetry. Add 1 to the Damage characteristic of that weapon.',
        when: COMBAT_PHASE,
      },
    ],
  },
  {
    name: 'Gleaming Blade (Hysh)',
    effects: [
      {
        name: 'Gleaming Blade (Hysh)',
        desc:
          'Pick one of the bearer’s melee weapons to be a Gleaming Blade. Allocate wounds inflicted by that weapon before allocating wounds inflicted by any other attacks made by the bearer. If 1 or more wounds are inflicted on an enemy unit by that weapon, heal 1 wound allocated to the bearer.',
        when: COMBAT_PHASE,
      },
    ],
  },
  {
    name: 'Luminary Rod (Hysh)',
    effects: [
      {
        name: 'Luminary Rod (Hysh)',
        desc:
          'Once per battle, pick a point on the battlefield within 9" of the bearer that is visible to them and draw an imaginary straight line 1mm wide between that point and the closest part of the bearer. Each unit other than the bearer that has models passed across by this line suffers D3 mortal wounds.',
        when: DURING_GAME,
      },
    ],
  },
  {
    name: 'Sunblade (Hysh)',
    effects: [
      {
        name: 'Sunblade (Hysh)',
        desc:
          'Pick one of the bearer’s melee weapons to be a Sunblade. Allocate wounds inflicted by that weapon before allocating wounds inflicted by any other attacks made by the bearer. If 1 or more wounds are inflicted on an enemy HERO or MONSTER by that weapon, subtract 1 from hit rolls for that enemy HERO or MONSTER until the end of the phase.',
        when: COMBAT_PHASE,
      },
    ],
  },
  {
    name: 'Crystalline Blade (Hysh)',
    effects: [
      {
        name: 'Crystalline Blade (Hysh)',
        desc: 'Pick one of the bearer’s melee weapons to be a Crystalline Blade. Add 1 to wound rolls for this weapon.',
        when: COMBAT_PHASE,
      },
    ],
  },
  {
    name: 'Prism Amyntok (Hysh)',
    effects: [
      {
        name: 'Prism Amyntok (Hysh)',
        desc:
          'In your shooting phase, you can pick an enemy unit within 8" of the bearer and roll four dice. For each 6+ that unit suffers 1 mortal wound.',
        when: SHOOTING_PHASE,
      },
    ],
  },
  {
    name: 'Aetherquartz Brooch (Hysh)',
    effects: [
      {
        name: 'Aetherquartz Brooch (Hysh)',
        desc: 'Each time you spend a command point, roll a dice. On a 5+ you receive 1 command point.',
        when: DURING_GAME,
      },
    ],
  },
  {
    name: 'Lens of Refraction (Hysh)',
    effects: [
      {
        name: 'Lens of Refraction (Hysh)',
        desc:
          'Once per battle round, the first time a friendly unit within 6" of the bearer suffers any mortal wounds inflicted by a spell or endless spell, roll a D3 and reduce the number of mortal wounds suffered by the roll.',
        when: HERO_PHASE,
      },
    ],
  },
  {
    name: 'Mirrored Cuirass (Hysh)',
    effects: [
      {
        name: 'Mirrored Cuirass (Hysh)',
        desc:
          'Roll a dice each time you allocate a mortal wound to the bearer. On a 5+ the wound is negated. On a 6+ you can also pick an enemy unit within 6" of the bearer. That unit suffers 1 mortal wound.',
        when: DURING_GAME,
      },
    ],
  },
  {
    name: 'Lightshard (Hysh)',
    effects: [
      {
        name: 'Lightshard (Hysh)',
        desc:
          'If the bearer is slain, before removing the model, roll a dice for each enemy unit within 6" of them. On a 3+ that unit suffers 1 mortal wound.',
        when: DURING_GAME,
      },
    ],
  },
  {
    name: "Guardan's Coronet (Hysh)",
    effects: [
      {
        name: "Guardan's Coronet (Hysh)",
        desc:
          'Once per battle, at the start of your hero phase, the bearer can call upon the guardian spirits. If they do so, until your next hero phase, roll a dice each time you allocate a wound to the bearer. On a 4+ the wound is negated.',
        when: START_OF_HERO_PHASE,
      },
    ],
  },
  {
    name: 'Sash of the Ten Paradises (Hysh)',
    effects: [
      {
        name: 'Sash of the Ten Paradises (Hysh)',
        desc: 'Add 2" to the bearer’s Move characteristic.',
        when: MOVEMENT_PHASE,
      },
    ],
  },
]

export default RealmArtifacts
