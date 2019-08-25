import { TArtifacts } from 'types/army'
import {
  BATTLESHOCK_PHASE,
  CHARGE_PHASE,
  COMBAT_PHASE,
  DURING_GAME,
  END_OF_COMBAT_PHASE,
  END_OF_SHOOTING_PHASE,
  HERO_PHASE,
  MOVEMENT_PHASE,
  SHOOTING_PHASE,
  START_OF_COMBAT_PHASE,
  START_OF_HERO_PHASE,
  START_OF_SETUP,
  START_OF_SHOOTING_PHASE,
} from 'types/phases'
import { GHYRAN, GHUR, CHAMON, AQSHY, SHYISH, ULGU, HYSH } from 'types/realmscapes'

const RealmArtifacts: TArtifacts = [
  {
    name: `Entangling Blade (${GHYRAN})`,
    effects: [
      {
        name: `Entangling Blade (${GHYRAN})`,
        desc: `If the bearer scores 1 or more hits on an enemy HERO or MONSTER with that weapon, subtract 1 from hit rolls for that enemy HERO or MONSTER until the end of the phase in which the hits were scored.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Jadewound Thorn (${GHYRAN})`,
    effects: [
      {
        name: `Jadewound Thorn (${GHYRAN})`,
        desc: `If the hit roll for that weapon is 6+ that attack inflicts 1 mortal wound in addition to its normal damage.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Blade of Hammerhal Ghyra (${GHYRAN})`,
    effects: [
      {
        name: `Blade of Hammerhal Ghyra (${GHYRAN})`,
        desc: `Add 1 to the Attacks characteristic of this weapon.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  {
    name: `The Sunderblade (${GHYRAN})`,
    effects: [
      {
        name: `The Sunderblade (${GHYRAN})`,
        desc: `In your shooting phase, roll a D6 for each enemy unit within 9" of the bearer. On a 6+ that unit suffers D3 mortal wounds.`,
        when: [SHOOTING_PHASE],
      },
    ],
  },
  {
    name: `Ghyrstrike (${GHYRAN})`,
    effects: [
      {
        name: `Ghyrstrike (${GHYRAN})`,
        desc: `Add 1 to hit and wound rolls for this weapon.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Arboreal Stave (${GHYRAN})`,
    effects: [
      {
        name: `Arboreal Stave (${GHYRAN})`,
        desc: `At the start of the combat phase, you can pick an enemy HERO within 3" of the bearer that is visible to them and roll a D6. On a 5+ that HERO cannot make a pile-in move this combat phase.`,
        when: [START_OF_COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Hypersnare Seeds (${GHYRAN})`,
    effects: [
      {
        name: `Hypersnare Seeds (${GHYRAN})`,
        desc: `At the end of your opponent's shooting phase, pick an enemy unit within 8" of the bearer that is visible to them and roll a D6. On a 5+ that unit may not charge in the subsequent charge phase.`,
        when: [END_OF_SHOOTING_PHASE],
      },
    ],
  },
  {
    name: `Verdant Mantle (${GHYRAN})`,
    effects: [
      {
        name: `Verdant Mantle (${GHYRAN})`,
        desc: `In your hero phase, the bearer may attempt to dispel one endless spell in the same manner as a WIZARD. If the bearer is a WIZARD, this does not prevent them from casting any spells during this phase.`,
        when: [HERO_PHASE],
      },
    ],
  },
  {
    name: `Jade Diadem (${GHYRAN})`,
    effects: [
      {
        name: `Jade Diadem (${GHYRAN})`,
        desc: `If the unmodified save roll for an attack that targets the bearer is 6, heal 1 wound allocated to the bearer.`,
        when: [SHOOTING_PHASE, COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Greenglade Flask (${GHYRAN})`,
    effects: [
      {
        name: `Greenglade Flask (${GHYRAN})`,
        desc: `Once per battle, in your hero phase, the bearer can drink from the Greenglade Flask. If they do, heal D6 wounds allocated to them.`,
        when: [HERO_PHASE],
      },
    ],
  },
  {
    name: `Ghyrropian Gauntlets (${GHYRAN})`,
    effects: [
      {
        name: `Ghyrropian Gauntlets (${GHYRAN})`,
        desc: `The bearer can move an extra 3" when making a pile-in move.`,
        when: [CHARGE_PHASE],
      },
    ],
  },
  {
    name: `Wand of Restoration (${GHYRAN})`,
    effects: [
      {
        name: `Wand of Restoration (${GHYRAN})`,
        desc: `In your hero phase, pick a friendly model within 6" of the bearer that is visible to them. Heal 1 wound allocated to that model.`,
        when: [HERO_PHASE],
      },
    ],
  },
  {
    name: `Stonehorn Blade (${GHUR})`,
    effects: [
      {
        name: `Stonehorn Blade (${GHUR})`,
        desc: `Roll a D6 at the end of any phase in which any wounds were inflicted by that weapon. On a 5+ you can pick an enemy unit within 3" of the bearer. That unit suffers D3 mortal wounds.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Anraheir's Claw (${GHUR})`,
    effects: [
      {
        name: `Anraheir's Claw (${GHUR})`,
        desc: `If the wound roll for that weapon is 6+ add 2 to the Damage characteristic of that weapon for that attack.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Amberglaive (${GHUR})`,
    effects: [
      {
        name: `Amberglaive (${GHUR})`,
        desc: `Add 1" to the Range characteristic of that weapon (to a maximum of 3"). In addition, add 1 to hit rolls for that weapon.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Blade of Carving (${GHUR})`,
    effects: [
      {
        name: `Blade of Carving (${GHUR})`,
        desc: `If a hit roll for an attack with this weapon is 6+ the wound roll for that attack is automatically successful.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Rageblade (${GHUR})`,
    effects: [
      {
        name: `Rageblade (${GHUR})`,
        desc: `Add 1 to the attacks characteristic of that weapon.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Rockjaws (${GHUR})`,
    effects: [
      {
        name: `Rockjaws (${GHUR})`,
        desc: `In your shooting phase, you can pick an enemy unit within 8" of the bearer that is visible to them and roll a D6. On a 3+ that unit suffers D3 mortal wounds.`,
        when: [SHOOTING_PHASE],
      },
    ],
  },
  {
    name: `Beastcaller's Bones (${GHUR})`,
    effects: [
      {
        name: `Beastcaller's Bones (${GHUR})`,
        desc: `At the start of the combat phase, roll a D6 for each MONSTER within 3" of the bearer. On a 5+ the monster being rolled for cannot attack this phase. If the monster is a mount, the rider may still attack with their own weapons as normal.`,
        when: [START_OF_COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Drakeforged Plate (${GHUR})`,
    effects: [
      {
        name: `Drakeforged Plate (${GHUR})`,
        desc: `Re-roll save rolls of 1 for the bearer against attacks that have a random Damage characteristic.`,
        when: [SHOOTING_PHASE, COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Gryph-feather Charm (${GHUR})`,
    effects: [
      {
        name: `Gryph-feather Charm (${GHUR})`,
        desc: `Subtract 1 from hit rolls for attacks that target the bearer.`,
        when: [SHOOTING_PHASE, COMBAT_PHASE],
      },
      {
        name: `Gryph-feather Charm (${GHUR})`,
        desc: `Add 1" to the bearer's Move characteristic.`,
        when: [MOVEMENT_PHASE],
      },
    ],
  },
  {
    name: `Gargant-bone Dice (${GHUR})`,
    effects: [
      {
        name: `Gargant-bone Dice (${GHUR})`,
        desc: `Once per battle, in your hero phase, you can declare that the bearer will roll their Gargant- bone Dice. If you do so, roll three dice. For each roll of a 5+ each enemy unit within 6" of the bearer suffers D3 mortal wounds.`,
        when: [HERO_PHASE],
      },
    ],
  },
  {
    name: `Shardfist Pelt (${GHUR})`,
    effects: [
      {
        name: `Shardfist Pelt (${GHUR})`,
        desc: `Each time you make a save roll of 6+ for the bearer in the combat phase, the attacking unit suffers 1 mortal wound after all of its attacks have been made.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Tuskhelm (${GHUR})`,
    effects: [
      {
        name: `Tuskhelm (${GHUR})`,
        desc: `Roll a D6 for each enemy unit within 1" of the bearer after the bearer completes a charge move. On a 4+ the unit being rolled for suffers 1 mortal wound.`,
        when: [CHARGE_PHASE],
      },
    ],
  },
  {
    name: `Aiban's Hidden Blade (${CHAMON})`,
    effects: [
      {
        name: `Aiban's Hidden Blade (${CHAMON})`,
        desc: `If the hit roll for that weapon is 6+ add 1 to the Damage characteristic of that attack.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Flowstone Blade (${CHAMON})`,
    effects: [
      {
        name: `Flowstone Blade (${CHAMON})`,
        desc: `Each time you roll a hit roll of 6+ for this weapon, add 1 to the wound roll for that attack.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Rune Blade (${CHAMON})`,
    effects: [
      {
        name: `Rune Blade (${CHAMON})`,
        desc: `That weapon has a Rend characteristic of -3.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Crucible of Molten Silver (${CHAMON})`,
    effects: [
      {
        name: `Crucible of Molten Silver (${CHAMON})`,
        desc: `Once per battle, in your shooting phase, pick a point on the battlefield within 9" of the bearer that is visible to them and draw an imaginary straight line 1mm wide between that point and the closest part of the bearer. Each unit other than the bearer that has models passed across by this line suffers D3 mortal wounds.`,
        when: [SHOOTING_PHASE],
      },
    ],
  },
  {
    name: `Chamonite Darts (${CHAMON})`,
    effects: [
      {
        name: `Chamonite Darts (${CHAMON})`,
        desc: `In your shooting phase, you can pick an enemy unit within 8" of the bearer and roll six dice. For each 6+ that enemy unit suffers 1 mortal wound.`,
        when: [SHOOTING_PHASE],
      },
    ],
  },
  {
    name: `Argentine's Tooth (${CHAMON})`,
    effects: [
      {
        name: `Argentine's Tooth (${CHAMON})`,
        desc: `Re-roll hit rolls of 1 for this weapon.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Gildenbane (${CHAMON})`,
    effects: [
      {
        name: `Gildenbane (${CHAMON})`,
        desc: `If an enemy model is the bearer of an artifact of power, they cannot use the rules for their artifact of power while they are within 3" of the bearer of Gildenbane.`,
        when: [DURING_GAME],
      },
    ],
  },
  {
    name: `Argent Armour (${CHAMON})`,
    effects: [
      {
        name: `Argent Armour (${CHAMON})`,
        desc: `Subtract 1 from hit rolls for attacks for melee weapons that target the bearer.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Hydroxskin Cloak (${CHAMON})`,
    effects: [
      {
        name: `Hydroxskin Cloak (${CHAMON})`,
        desc: `The bearer can fly. After the bearer has made a normal move, you can pick 1 unit that has any models that the bearer has passed across and roll a D6. On a 3+ that unit suffers D3 mortal wounds.`,
        when: [MOVEMENT_PHASE],
      },
    ],
  },
  {
    name: `Godwrought Helm (${CHAMON})`,
    effects: [
      {
        name: `Godwrought Helm (${CHAMON})`,
        desc: `Roll a D6 each time you allocate a wound to the bearer. On a 6+ the wound is negated.`,
        when: [DURING_GAME],
      },
    ],
  },
  {
    name: `Bejewelled Gauntlet (${CHAMON})`,
    effects: [
      {
        name: `Bejewelled Gauntlet (${CHAMON})`,
        desc: `At the end of the combat phase, pick an enemy unit within 1" of the bearer and roll a D6. On a 3+ that unit suffers 1 mortal wound.`,
        when: [END_OF_COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Alchemical Chain (${CHAMON})`,
    effects: [
      {
        name: `Alchemical Chain (${CHAMON})`,
        desc: `The bearer can attempt to unbind a single spell in each enemy hero phase in the same manner as a WIZARD. If the bearer is already a WIZARD, they can attempt to unbind 1 additional spell instead.`,
        when: [HERO_PHASE],
      },
    ],
  },
  {
    name: `Ruby Ring (${AQSHY})`,
    effects: [
      {
        name: `Ruby Ring (${AQSHY})`,
        desc: `In your hero phase, you can pick the closest enemy unit within 18" of the bearer and roll a D6. On a 5+ that unit suffers D3 mortal wounds. If two or more enemy units are equally close to the bearer, you can pick any of them.`,
        when: [HERO_PHASE],
      },
    ],
  },
  {
    name: `Magmaforged Blade (${AQSHY})`,
    effects: [
      {
        name: `Magmaforged Blade (${AQSHY})`,
        desc: `If the wound roll for that weapon is 6+ that attack inflicts 1 mortal wound in addition to its normal damage.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Magmadroth Blood Vials (${AQSHY})`,
    effects: [
      {
        name: `Magmadroth Blood Vials (${AQSHY})`,
        desc: `In your shooting phase, you can pick an enemy unit within 8" of the bearer and roll a D6. On a 4+ that unit suffers 1 mortal wound.`,
        when: [SHOOTING_PHASE],
      },
    ],
  },
  {
    name: `Purefire Brazier (${AQSHY})`,
    effects: [
      {
        name: `Purefire Brazier (${AQSHY})`,
        desc: `In your shooting phase, roll a D6 for each enemy unit within 9" of the bearer. On a 5+ that unit suffers 1 mortal wound.`,
        when: [SHOOTING_PHASE],
      },
    ],
  },
  {
    name: `Onyx Blade (${AQSHY})`,
    effects: [
      {
        name: `Onyx Blade (${AQSHY})`,
        desc: `Add 1 to wound rolls for that weapon.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Exile Torch (${AQSHY})`,
    effects: [
      {
        name: `Exile Torch (${AQSHY})`,
        desc: `At the start of the combat phase, pick an enemy HERO within 3" of the bearer and roll a D6. On a 6+ that HERO suffers 1 mortal wound and may not fight or be chosen as the target of an attack until the end of the turn.`,
        when: [START_OF_COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Essence of Vulcatrix (${AQSHY})`,
    effects: [
      {
        name: `Essence of Vulcatrix (${AQSHY})`,
        desc: `Once per battle, at the start of your hero phase, the bearer may drink the Essence of Vulcatrix. If they do so, roll a D6. On a 1, the bearer suffers D3 mortal wounds. On a 2+ add 1 to hit and wound rolls for the bearer until your next hero phase.`,
        when: [START_OF_HERO_PHASE],
      },
    ],
  },
  {
    name: `Thermalrider Cloak (${AQSHY})`,
    effects: [
      {
        name: `Thermalrider Cloak (${AQSHY})`,
        desc: `Add 4 to the bearer's Movement characteristic. In addition, the bearer may fly.`,
        when: [MOVEMENT_PHASE],
      },
    ],
  },
  {
    name: `Smouldering Helm (${AQSHY})`,
    effects: [
      {
        name: `Smouldering Helm (${AQSHY})`,
        desc: `Each time you make a successful save roll of 6+ for the bearer in the combat phase, the attacking unit suffers 1 mortal wound after all of its attacks have been made.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Ignax's Scales (${AQSHY})`,
    effects: [
      {
        name: `Ignax's Scales (${AQSHY})`,
        desc: `Roll a D6 each time you allocate a mortal wound to the bearer. On a 4+ the wound is negated.`,
        when: [DURING_GAME],
      },
    ],
  },
  {
    name: `Crown of Flames (${AQSHY})`,
    effects: [
      {
        name: `Crown of Flames (${AQSHY})`,
        desc: `Add 1 to the Bravery characteristic of friendly units while they are wholly within 9" of the bearer.`,
        when: [BATTLESHOCK_PHASE],
      },
    ],
  },
  {
    name: `Cleansing Brooch (${AQSHY})`,
    effects: [
      {
        name: `Cleansing Brooch (${AQSHY})`,
        desc: `Once per battle, at the start of your hero phase, you may declare that the bearer will activate the brooch. If you do so, heal D3 wounds allocated to them.`,
        when: [START_OF_HERO_PHASE],
      },
    ],
  },
  {
    name: `Blade of Endings (${SHYISH})`,
    effects: [
      {
        name: `Blade of Endings (${SHYISH})`,
        desc: `If the hit roll for that weapon is 6+ add 2 to the Damage characteristic of that attack.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Banshee Blade (${SHYISH})`,
    effects: [
      {
        name: `Banshee Blade (${SHYISH})`,
        desc: `Each time you roll a hit roll of 6+ for this weapon, roll 2D6. If the roll is equal to or more than the target's Bravery characteristic, that attack inflicts D3 mortal wounds in addition to its normal damage.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Lifebane (${SHYISH})`,
    effects: [
      {
        name: `Lifebane (${SHYISH})`,
        desc: `Add 1 to wound rolls for this weapon.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Sliver of Decreptitude (${SHYISH})`,
    effects: [
      {
        name: `Sliver of Decreptitude (${SHYISH})`,
        desc: `Allocate wounds inflicted by that weapon before allocating wounds inflicted by any other attacks made by the bearer. If 1 or more wounds by that weapon are inflicted on an enemy HERO or MONSTER, subtract 2" from that HERO or MONSTER's Move characteristic for the rest of the battle.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Wraithbow (${SHYISH})`,
    effects: [
      {
        name: `Wraithbow (${SHYISH})`,
        desc: `In your shooting phase, pick an enemy unit within 18" of the bearer and roll six dice. For each 6+ that enemy unit suffers 1 mortal wound.`,
        when: [SHOOTING_PHASE],
      },
    ],
  },
  {
    name: `Splintertooth (${SHYISH})`,
    effects: [
      {
        name: `Splintertooth (${SHYISH})`,
        desc: `In your shooting phase, pick an enemy unit within 8" of the bearer and roll three dice. If two dice have the same roll, that enemy unit suffers D3 mortal wounds. If all three dice have the same roll, that enemy unit suffers D6 mortal wounds instead.`,
        when: [SHOOTING_PHASE],
      },
    ],
  },
  {
    name: `Cronehair Fetish (${SHYISH})`,
    effects: [
      {
        name: `Cronehair Fetish (${SHYISH})`,
        desc: `You can add or subtract 1 from the result of any roll on the Shyish Realmscape Features table.`,
        when: [START_OF_SETUP],
      },
    ],
  },
  {
    name: `Ethereal Amulet (${SHYISH})`,
    effects: [
      {
        name: `Ethereal Amulet (${SHYISH})`,
        desc: `Ignore modifiers (positive or negative) when making save rolls for this model.`,
        when: [DURING_GAME],
      },
    ],
  },
  {
    name: `Sepulchral Plate (${SHYISH})`,
    effects: [
      {
        name: `Sepulchral Plate (${SHYISH})`,
        desc: `Roll a D6 each time you allocate a wound to the bearer. On a 6+ the wound is negated.`,
        when: [DURING_GAME],
      },
    ],
  },
  {
    name: `Amethyst Blindmask (${SHYISH})`,
    effects: [
      {
        name: `Amethyst Blindmask (${SHYISH})`,
        desc: `If the bearer is slain, before removing the model, roll a D6 for each enemy unit within 6" of the bearer. On a 3+ that unit suffers 1 mortal wound.`,
        when: [DURING_GAME],
      },
    ],
  },
  {
    name: `The Ragged Cloak (${SHYISH})`,
    effects: [
      {
        name: `The Ragged Cloak (${SHYISH})`,
        desc: `Once per battle, at the start of your opponent's shooting phase, you can declare that bearer will shroud themselves with the Ragged Cloak. If you do so, the bearer may not be chosen as the target of an attack until the end of the phase.`,
        when: [START_OF_SHOOTING_PHASE],
      },
    ],
  },
  {
    name: `Goblet of Draining (${SHYISH})`,
    effects: [
      {
        name: `Goblet of Draining (${SHYISH})`,
        desc: `If 1 or more wounds are inflicted on an enemy HERO by the bearer, roll a D6. On a 5+ that HERO suffers D3 mortal wounds.`,
        when: [DURING_GAME],
      },
    ],
  },
  {
    name: `Miasmatic Blade (${ULGU})`,
    effects: [
      {
        name: `Miasmatic Blade (${ULGU})`,
        desc: `Subtract 1 from hit rolls for attacks that target the bearer.`,
        when: [SHOOTING_PHASE, COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Blade of the Thirteen Dominions (${ULGU})`,
    effects: [
      {
        name: `Blade of the Thirteen Dominions (${ULGU})`,
        desc: `Allocate wounds inflicted by that weapon before allocating wounds inflicted by any other attacks made by the bearer. If 1 or more wounds are inflicted on an enemy unit by that weapon, subtract 1 from hit rolls for attacks made by that unit until the end of the phase.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Blade of Folded Shadows (${ULGU})`,
    effects: [
      {
        name: `Blade of Folded Shadows (${ULGU})`,
        desc: `Add 1 to hit rolls for this weapon.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Blade of Secrets (${ULGU})`,
    effects: [
      {
        name: `Blade of Secrets (${ULGU})`,
        desc: `Allocate wounds inflicted by that weapon before allocating wounds inflicted by any other attacks made by the bearer. If 1 or more wounds are inflicted on an enemy WIZARD by that weapon, pick one spell that WIZARD knows. That WIZARD may not attempt to cast that spell again during that battle.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Dimensional Blade (${ULGU})`,
    effects: [
      {
        name: `Dimensional Blade (${ULGU})`,
        desc: `Change the Rend characteristic of this weapon to -3.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Sword of Judgement (${ULGU})`,
    effects: [
      {
        name: `Sword of Judgement (${ULGU})`,
        desc: `If the hit roll for an attack with that weapon against a HERO or MONSTER is 6+, that attack inflicts D6 mortal wounds and the attack sequence ends (do not make a wound or save roll).`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Spellmirror (${ULGU})`,
    effects: [
      {
        name: `Spellmirror (${ULGU})`,
        desc: `If a friendly unit within 6" of the bearer is affected by a spell, you can roll a D6. On a 5+ that unit is not affected by the spell. On a 1 the Spellmirror may not be used for the rest of the battle.`,
        when: [HERO_PHASE],
      },
    ],
  },
  {
    name: `Trickster's Helm (${ULGU})`,
    effects: [
      {
        name: `Trickster's Helm (${ULGU})`,
        desc: `Re-roll successful casting rolls for enemy WIZARDS while they are within 8" of the bearer.`,
        when: [HERO_PHASE],
      },
    ],
  },
  {
    name: `Wristbands of Illusion (${ULGU})`,
    effects: [
      {
        name: `Wristbands of Illusion (${ULGU})`,
        desc: `Roll a D6 each time you allocate a wound to the bearer. On a 6+ the wound is negated.`,
        when: [DURING_GAME],
      },
    ],
  },
  {
    name: `Doppelganger Cloak (${ULGU})`,
    effects: [
      {
        name: `Doppelganger Cloak (${ULGU})`,
        desc: `Once per battle, at the start of the combat phase, you can say that the bearer will put on the cloak. If you do so, the bearer cannot be chosen as the target of attacks made with melee weapons unless the bearer has made any attacks earlier in that phase.`,
        when: [START_OF_COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Betrayer's Crown (${ULGU})`,
    effects: [
      {
        name: `Betrayer's Crown (${ULGU})`,
        desc: `Once per battle, at the start of the combat phase, pick an enemy unit within 3" of the bearer that has two or more models. Roll a D6 for each model in that enemy unit. For each 5+ that enemy unit suffers 1 mortal wound.`,
        when: [START_OF_COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Talisman of the Watcher (${ULGU})`,
    effects: [
      {
        name: `Talisman of the Watcher (${ULGU})`,
        desc: `If the bearer is not within 3" of an enemy unit at the start of the combat phase, pick a friendly unit within 9" of the bearer. You can re-roll save rolls of 1 for that unit until the end of that phase.`,
        when: [START_OF_COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Blade of Symmetry (${HYSH})`,
    effects: [
      {
        name: `Blade of Symmetry (${HYSH})`,
        desc: `Add 1 to the Damage characteristic of that weapon.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Gleaming Blade (${HYSH})`,
    effects: [
      {
        name: `Gleaming Blade (${HYSH})`,
        desc: `Allocate wounds inflicted by that weapon before allocating wounds inflicted by any other attacks made by the bearer. If 1 or more wounds are inflicted on an enemy unit by that weapon, heal 1 wound allocated to the bearer.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Luminary Rod (${HYSH})`,
    effects: [
      {
        name: `Luminary Rod (${HYSH})`,
        desc: `Once per battle, pick a point on the battlefield within 9" of the bearer that is visible to them and draw an imaginary straight line 1mm wide between that point and the closest part of the bearer. Each unit other than the bearer that has models passed across by this line suffers D3 mortal wounds.`,
        when: [DURING_GAME],
      },
    ],
  },
  {
    name: `Sunblade (${HYSH})`,
    effects: [
      {
        name: `Sunblade (${HYSH})`,
        desc: `Allocate wounds inflicted by that weapon before allocating wounds inflicted by any other attacks made by the bearer. If 1 or more wounds are inflicted on an enemy HERO or MONSTER by that weapon, subtract 1 from hit rolls for that enemy HERO or MONSTER until the end of the phase.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Crystalline Blade (${HYSH})`,
    effects: [
      {
        name: `Crystalline Blade (${HYSH})`,
        desc: `Add 1 to wound rolls for this weapon.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Prism Amyntok (${HYSH})`,
    effects: [
      {
        name: `Prism Amyntok (${HYSH})`,
        desc: `In your shooting phase, you can pick an enemy unit within 8" of the bearer and roll four dice. For each 6+ that unit suffers 1 mortal wound.`,
        when: [SHOOTING_PHASE],
      },
    ],
  },
  {
    name: `Aetherquartz Brooch (${HYSH})`,
    effects: [
      {
        name: `Aetherquartz Brooch (${HYSH})`,
        desc: `Each time you spend a command point, roll a D6. On a 5+ you receive 1 command point.`,
        when: [DURING_GAME],
      },
    ],
  },
  {
    name: `Lens of Refraction (${HYSH})`,
    effects: [
      {
        name: `Lens of Refraction (${HYSH})`,
        desc: `Once per battle round, the first time a friendly unit within 6" of the bearer suffers any mortal wounds inflicted by a spell or endless spell, roll a D3 and reduce the number of mortal wounds suffered by the roll.`,
        when: [HERO_PHASE],
      },
    ],
  },
  {
    name: `Mirrored Cuirass (${HYSH})`,
    effects: [
      {
        name: `Mirrored Cuirass (${HYSH})`,
        desc: `Roll a D6 each time you allocate a mortal wound to the bearer. On a 5+ the wound is negated. On a 6+ you can also pick an enemy unit within 6" of the bearer. That unit suffers 1 mortal wound.`,
        when: [DURING_GAME],
      },
    ],
  },
  {
    name: `Lightshard (${HYSH})`,
    effects: [
      {
        name: `Lightshard (${HYSH})`,
        desc: `If the bearer is slain, before removing the model, roll a D6 for each enemy unit within 6" of them. On a 3+ that unit suffers 1 mortal wound.`,
        when: [DURING_GAME],
      },
    ],
  },
  {
    name: `Guardan's Coronet (${HYSH})`,
    effects: [
      {
        name: `Guardan's Coronet (${HYSH})`,
        desc: `Once per battle, at the start of your hero phase, the bearer can call upon the guardian spirits. If they do so, until your next hero phase, roll a D6 each time you allocate a wound to the bearer. On a 4+ the wound is negated.`,
        when: [START_OF_HERO_PHASE],
      },
    ],
  },
  {
    name: `Sash of the Ten Paradises (${HYSH})`,
    effects: [
      {
        name: `Sash of the Ten Paradises (${HYSH})`,
        desc: `Add 2" to the bearer's Move characteristic.`,
        when: [MOVEMENT_PHASE],
      },
    ],
  },
]

export default RealmArtifacts
