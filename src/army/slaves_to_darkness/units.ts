import { filterUnits } from 'utils/filterUtils'
import { TBattalions, TUnits } from 'types/army'
import {
  BATTLESHOCK_PHASE,
  CHARGE_PHASE,
  COMBAT_PHASE,
  DURING_GAME,
  END_OF_COMBAT_PHASE,
  HERO_PHASE,
  MOVEMENT_PHASE,
  SHOOTING_PHASE,
  START_OF_CHARGE_PHASE,
  START_OF_HERO_PHASE,
  START_OF_COMBAT_PHASE,
} from 'types/phases'
import { MARK_UNDIVIDED, MARK_KHORNE, MARK_NURGLE, MARK_TZEENTCH, MARK_SLAANESH } from 'meta/alliances'

// Export markable Slaves to Darkness units.
export const getSlavesUnits = () => {
  const listOfUnits = [
    `Chaos Chariots`,
    `Chaos Chosen`,
    `Chaos Knights`,
    `Chaos Lord on Daemonic Mount`,
    `Chaos Lord on Manticore`,
    `Chaos Marauder Horsemen`,
    `Chaos Marauders`,
    `Chaos Sorcerer Lord on Manticore`,
    `Chaos Sorcerer Lord`,
    `Chaos War Mammoth`,
    `Chaos Warriors`,
    `Chaos Warshrine`,
    `Daemon Prince`,
    `Exalted Hero of Chaos`,
    `Chaos Gorebeast Chariots`,
    `Lord of Chaos`,
    `Curs'd Ettin`,
  ]
  return filterUnits(Units, listOfUnits)
}

// Unit Names
export const Units: TUnits = [
  {
    name: `Daemon Prince`,
    effects: [
      {
        name: `Cursed Soul-eater: ${MARK_UNDIVIDED}`,
        desc: `If this model is not dedicated to a Chaos God, it heals 1 wound at the end of this phase if it killed any models.`,
        when: [END_OF_COMBAT_PHASE],
      },
      {
        name: `Immortal Champion: ${MARK_KHORNE}`,
        desc: `You can add 1 to all hit rolls made by this unit.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Immortal Champion: ${MARK_NURGLE}`,
        desc: `This model has a save characteristic of 3+.`,
        when: [DURING_GAME],
      },
      {
        name: `Immortal Champion: ${MARK_TZEENTCH}`,
        desc: `This model is a wizard. Can attempt to cast 1 spell and unbind 1 spell. Knows Arcane Bolt and Mystic Shield.`,
        when: [HERO_PHASE],
      },
      {
        name: `Immortal Champion: ${MARK_SLAANESH}`,
        desc: `When your opponent selects a unit within 3" of this model to pile in, you can immediately select this Daemon Prince to pile in and attack before the enemy unit, even though it is not your turn to do so. This can only be done if this Daemon Prince is still eligible for combat activation.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Chaos Lord on Manticore`,
    effects: [
      {
        name: `Mark of Chaos: ${MARK_KHORNE}`,
        desc: `This model can pile in 6" instead of 3".`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Mark of Chaos: ${MARK_NURGLE}`,
        desc: `This model has a save characteristic of 3+.`,
        when: [SHOOTING_PHASE, COMBAT_PHASE],
      },
      {
        name: `Mark of Chaos: ${MARK_TZEENTCH}`,
        desc: `This model can attempt to unbind one spell.`,
        when: [HERO_PHASE],
      },
      {
        name: `Mark of Chaos: ${MARK_SLAANESH}`,
        desc: `Enemy units must subtract 1 from their bravery characteristic if they are within 3" of this model in the battleshock phase.`,
        when: [BATTLESHOCK_PHASE],
      },
      {
        name: `Chaos Runeshield`,
        desc: `Roll a D6 each time this model equiped with a Chaos Runeshield suffers a mortal wound. On a 5+ it is negated.`,
        when: [DURING_GAME],
      },
      {
        name: `Daggerfirst`,
        desc: `If this model is equipped with a Daggerfirst, each time you make a save roll of 6+, and the attacking unit is within 1", the attacking unit suffers a mortal wound after all of its attacks have been made.`,
        when: [DURING_GAME],
      },
      {
        name: `Chaos Lance`,
        desc: `The Chaos Lance inflicts 3 damage rather than 2 and has a rend of -1 instead of '-' if this model charged in the same turn.`,
        when: [CHARGE_PHASE, COMBAT_PHASE],
      },
      {
        name: `Territorial Predator`,
        desc: `You can re-roll hit rolls of 1 for the Manitcore's Claws and Jaws attacks if the target is a monster. If the target is a unit within your army's territory you can re-rol any failed hit rolls for these attacks.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Iron-willed Overlord`,
        desc: `Select a Chaos Warriors unit within 15". Until your next hero phase you can re-roll charge rolls, wound rolls, and battleshock tests for that unit until you next hero phase.`,
        when: [HERO_PHASE, CHARGE_PHASE, COMBAT_PHASE, BATTLESHOCK_PHASE],
        command_ability: true,
      },
    ],
  },
  {
    name: `Chaos Sorcerer Lord on Manticore`,
    effects: [
      {
        name: `Oracular Visions`,
        desc: `Pick a unit within 10" of this model. Until you next hero phase, you can re-roll save rolls of 1 for that unit.`,
        when: [HERO_PHASE],
      },
      {
        name: `Territorial Predator`,
        desc: `You can re-roll hit rolls of 1 for the Manitcore's Claws and Jaws attacks if the target is a monster. If the target is a unit within your army's territory you can re-rol any failed hit rolls for these attacks.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Wizard`,
        desc: `This model is a wizard. Can attempt to cast 1 spell and unbind 1 spell. Knows Arcane Bolt, Mystic Shield, and Wind of Chaos.`,
        when: [HERO_PHASE],
      },
      {
        name: `Wind of Chaos`,
        desc: `Casting value of 7. If successfully cast, pick a unit within 18" and visible to the caster. Roll a number of dice equal to the casting roll. For each 5, the target suffers a mortal wound. For each 6, the target suffers D3 mortal wounds.`,
        when: [HERO_PHASE],
        spell: true,
      },
    ],
  },
  {
    name: `Chaos Lord on Daemonic Mount`,
    effects: [
      {
        name: `Eye of the Gods`,
        desc: `Each time this model slays a monster or hero, roll a D6. If the result is 2 or more this model heals D3 wounds. If the model is already at full health, increase the wounds characteristic by 1 instead.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Mark of Chaos: ${MARK_KHORNE}`,
        desc: `Re-roll all hit rolls of a 1 for this model's Cursed Warhammer.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Mark of Chaos: ${MARK_NURGLE}`,
        desc: `This model has a wounds characteristic of 8 instead of 7.`,
        when: [DURING_GAME],
      },
      {
        name: `Mark of Chaos: ${MARK_TZEENTCH}`,
        desc: `You can re-roll failed save rolls for this model.`,
        when: [DURING_GAME],
      },
      {
        name: `Mark of Chaos: ${MARK_SLAANESH}`,
        desc: `This model can run and charge in the same turn.`,
        when: [MOVEMENT_PHASE, CHARGE_PHASE],
      },
      {
        name: `Chaos Runeshield`,
        desc: `Roll a D6 each time this model equiped with a Chaos Runeshield suffers a mortal wound. On a 5+ it is negated.`,
        when: [DURING_GAME],
      },
      {
        name: `The Knights of Chaos`,
        desc: `Select a friendly unit of Chaos Knights, Chaos Chariots, or Gorebeast Chariots within 15". Until your next hero phase you can re-roll charge rolls and add 1 to any hit rolls for that unit in the combat phase.`,
        when: [HERO_PHASE],
        command_ability: true,
      },
      {
        name: `The Knights of Chaos`,
        desc: `If active, you can re-roll charge rolls for the buffed unit.`,
        when: [CHARGE_PHASE],
      },
      {
        name: `The Knights of Chaos`,
        desc: `If active, you can add 1 to the hit rolls for the buffed unit.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Lord of Chaos`,
    effects: [
      {
        name: `Glory or Damnation`,
        desc: `If a this model slays the opposing army general, you can choose to replace him with a Daemon Prince model. If this model is slain, replace him with a Chaos Spawn model.`,
        when: [DURING_GAME],
      },
      {
        name: `Mark of Chaos: ${MARK_KHORNE}`,
        desc: `You can re-roll hit rolls of 1 for attacks made by this model.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Mark of Chaos: ${MARK_NURGLE}`,
        desc: `You can re-roll wound rolls of 1 for this model.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Mark of Chaos: ${MARK_TZEENTCH}`,
        desc: `You can re-roll save rolls of 1 for this model.`,
        when: [DURING_GAME],
      },
      {
        name: `Mark of Chaos: ${MARK_SLAANESH}`,
        desc: `This model can run and charge in the same turn.`,
        when: [MOVEMENT_PHASE, CHARGE_PHASE],
      },
      {
        name: `Reaperblade`,
        desc: `Once per battle, before attacking with this model, you can empower Reaperblade. It makes only 1 attack but inflicts 2D6 damage.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Aided by the Gods`,
        desc: `Pick a friendly Slaves to Darkness unit within 10" that has the same Mark of Chaos as this model. Until your next hero phase, that unit receives the same benefit as the Lord of Chaos for his Mark.`,
        when: [HERO_PHASE],
        command_ability: true,
      },
    ],
  },
  {
    name: `Darkoath Warqueen`,
    effects: [
      {
        name: `Savage Duellist`,
        desc: `Attacks made with this model's Warlord Axe have a damage characteristic of 2 when targeting an enemy hero or monster. Each time a wound inflicted by this model slays a hero or monster, add 1 to the attacks characteristic of the Warlord Axe for the remainder of the battle.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Infernal Runeshield`,
        desc: `Each time you allocate a wound or mortal wound to this model, roll a D6. On a 6+ the wound is negated at the attacking model suffers 1 mortal wound after all its attacks have been made.`,
        when: [DURING_GAME],
      },
      {
        name: `Will of the Gods`,
        desc: `If this model is your general and uses this comamnd ability, you can re-roll failed charge rolls for friendly Slaves to Darkness units that are wholly within 12".`,
        when: [START_OF_CHARGE_PHASE],
        command_ability: true,
      },
    ],
  },
  {
    name: `Darkoath Chieftain`,
    effects: [
      {
        name: `Berserker Charge`,
        desc: `This model makes 6 attacks with his Broadsword rather than 3 if he charged in this turn.`,
        when: [CHARGE_PHASE, COMBAT_PHASE],
      },
      {
        name: `Deathblow`,
        desc: `If this model slays any enemy models in the combat phase, each enemy unit within 1" of him suffers 1 mortal wound.`,
        when: [END_OF_COMBAT_PHASE],
      },
      {
        name: `Quest for Glory`,
        desc: `Keep track of the number of wounds inflicted by this model during the battle. If the total reaches 8+, you can add 1 to all hit rolls made for this model for the remainder of the battle. If the total reaches 16+, you can add 1 to all wound rolls as well.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Chaos Sorcerer Lord`,
    effects: [
      {
        name: `Chaos Steed`,
        desc: `Some Chaos sorcerer lords ride on Chaos Steeds. If this model has a steed, this model's move characteristic is 10" instead of 5" and it gains the Flailing Hooves attack.`,
        when: [DURING_GAME],
      },
      {
        name: `Oracular Visions`,
        desc: `Pick a unit within 10" of this model. Until you next hero phase, you can re-roll save rolls of 1 for that unit.`,
        when: [HERO_PHASE],
      },
      {
        name: `Wizard`,
        desc: `This model is a wizard. Can attempt to cast 1 spell and unbind 1 spell. Knows Arcane Bolt, Mystic Shield, and Daemonic Power.`,
        when: [HERO_PHASE],
      },
      {
        name: `Daemonic Power`,
        desc: `Casting value of 5. If successfully cast, select a friendly unit within 18" of the caster. Until your next hero phase, you can re-roll any hit, wound, and save rolls of 1 for the targeted unit.`,
        when: [HERO_PHASE],
        spell: true,
      },
      {
        name: `Daemonic Power`,
        desc: `If active, you can re-roll any hit, wound, and save rolls of 1 for the targeted unit.`,
        when: [SHOOTING_PHASE, COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Exalted Hero of Chaos`,
    effects: [
      {
        name: `Trail of Red Ruin`,
        desc: `If an Exalted Hero of Chaos charges, he can pile in and attack two times in the following combat phase. The second pile in move and attacks are made immediately after the first set of attacks is completed.`,
        when: [CHARGE_PHASE, COMBAT_PHASE],
      },
      {
        name: `Glory-hungry Axeman`,
        desc: `Add 1 to the hit rolls for an Exalted Hero of Chaos if the target is a Hero or a Monster.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Thrice-damned Dagger`,
        desc: `If an enemy hero or monster was slain in this combat phase, this model can double the number of attacks with its Chaos Death-axes in the next combat phase.`,
        when: [END_OF_COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Sayl the Faithless`,
    effects: [
      {
        name: `Mutant Sight`,
        desc: `Once per battle, you can re-roll 1 casting or unbinding roll for this model.`,
        when: [HERO_PHASE],
      },
      {
        name: `'Nightmaw, my pet, protect me!'`,
        desc: `Roll a D6 before you allocate a wound or mortal wound to this model while this model is within 3" of Nightmaw. On a 4+, that wound or mortal wound is allocated to Nightmaw instead of to this model.`,
        when: [DURING_GAME],
      },
      {
        name: `Schalkain's Teeth`,
        desc: `You can pick 1 enemy unit within 8" of this model and roll a D6. On a 5+, that unit suffers D3 mortal wounds.`,
        when: [HERO_PHASE],
      },
      {
        name: `Wizard`,
        desc: `This model is a wizard. Can attempt to cast 1 spell and unbind 1 spell. Knows Arcane Bolt, Mystic Shield, and Traitor's Mist.`,
        when: [HERO_PHASE],
      },
      {
        name: `Traitor's Mist`,
        desc: `Casting value of 7. If successfully cast, pick 1 friendly Slaves to Darkness unit wholly within 15" and visible to the caster. Remove that unit from the battlefield and set it up again anywhere on the battlefield more than 9" from enemy units. It cannot move in the subsequent move phase.`,
        when: [HERO_PHASE],
        spell: true,
      },
    ],
  },
  {
    name: `Nightmaw`,
    effects: [
      {
        name: `Restless Flesh`,
        desc: `You can heal 1 wound allocated to this model.`,
        when: [HERO_PHASE],
      },
      {
        name: `Shadow-kin`,
        desc: `Add 1 to save rolls for attacks made when missile weapons that target this model.`,
        when: [HERO_PHASE],
      },
      {
        name: `Shadow-kin`,
        desc: `Roll a D6 each time you allocate a mortal wound to this model. On a 5+, that mortal wound is negated.`,
        when: [DURING_GAME],
      },
      {
        name: `Writhing Tentacles`,
        desc: `If you roll a double when determining the number of attacks made by this model's Razor-tipped Tentacles, add 1 to hit and wound rolls for attacks made by that model until the end of the phase.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Slambo`,
    effects: [
      {
        name: `Legendary Killer`,
        desc: `If Slambo charges, he can pile in and attack twice in the following combat phase instead of only once. The second pile in move and attacks are made immediately after the first set of attacks is completed.`,
        when: [CHARGE_PHASE, COMBAT_PHASE],
      },
      {
        name: `Glory-seeking Axeman`,
        desc: `Add 1 to hit rolls made for Slambo if the target is a Hero or Monster. If Slambo kills a Hero or Monster, he doubles the number of attacks he makes with his Chaos Axes in the next combat phase.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Theddra Skull-Scryer`,
    effects: [
      {
        name: `Pact of Soul and Iron`,
        desc: `You can re-roll hit rolls of 1 for attacks made by this model that target a Stormcast Eternal.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Wizard`,
        desc: `This model is a wizard. Can attempt to cast 1 spell and unbind 1 spell. Knows Arcane Bolt, Mystic Shield, and Enfeeblement.`,
        when: [HERO_PHASE],
      },
      {
        name: `Enfeeblement`,
        desc: `Casting value of 6. If successfully cast, pick 1 enemy unit within 12" and visible to the caster. Subtract 1 from wound rolls for attacks made by that units melee weapons until your next hero phase.`,
        when: [HERO_PHASE],
        spell: true,
      },
    ],
  },
  {
    name: `Godsworn Hunt`,
    effects: [
      {
        name: `Pact of Soul and Iron`,
        desc: `You can re-roll hit rolls of 1 for attacks made by this model that target a Stormcast Eternal.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Chaos Marauders`,
    effects: [
      {
        name: `Marauder Chieftain`,
        desc: `This model makes 2 attacks rather than 1.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Damned Icon Bearer`,
        desc: `You can re-roll hit rolls of 1 for models in a unit that contains any Damned Icons.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Tribal Banner Bearer`,
        desc: `If this unit includes any Tribal Banners, add 1 to the Bravery of all its models.`,
        when: [DURING_GAME],
      },
      {
        name: `Drummer`,
        desc: `If the unit includes any Drummers, add 1 to its run and charge rolls.`,
        when: [DURING_GAME],
      },
      {
        name: `Barbarian Hordes`,
        desc: `Roll a D6 before a unit of Chaos Marauders piles in. Add 1 to the roll if the unit includes 20 or more models. If the result is 4 or more, add 1 to the result of any hit rolls for the unit's attacks until the end of the phase. If the result is 6 or more, add 1 to the result of any wound rolls as well.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Darkwood Shield`,
        desc: `Units carrying Darkwood Shields have a Save of 5+ rather than 6+.`,
        when: [SHOOTING_PHASE, COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Chaos Chariots`,
    effects: [
      {
        name: `Exalted Charioteer`,
        desc: `This model's attacks with a Chaos Greatblade or Chaos War-flail hit on 3+ rather than 4+.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Don't Spare the Lash`,
        desc: `Before this unit moves, roll a D6 and add that many inches to this unit's Move characteristic for the rest of the phase.`,
        when: [MOVEMENT_PHASE],
      },
      {
        name: `Swift Death`,
        desc: `You can add 1 to all hit and wound rolls for the War Steeds' Roughshod Hooves if this unit charged in the same turn.`,
        when: [CHARGE_PHASE, COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Chaos Gorebeast Chariots`,
    effects: [
      {
        name: `Exalted Charioteer`,
        desc: `This model's attacks with a Chaos Greatblade or Chaos War-flail hit on 3+ rather than 4+.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Explosive Brutality`,
        desc: `If this unit makes a charge move and the result of the charge was 8 or more, all Gorebeasts in the unit make 6 attacks with their Brutish Fists rather than 3 until the end of the turn.`,
        when: [CHARGE_PHASE, COMBAT_PHASE],
      },
      {
        name: `Gorebeast Charge`,
        desc: `After this unit has finished a charge move, roll a D6 for each enemy model within 2". For each 6, that models unit suffers a mortal wound.`,
        when: [CHARGE_PHASE],
      },
    ],
  },
  {
    name: `Chaos Chosen`,
    effects: [
      {
        name: `Exalted Champion`,
        desc: `This model makes 4 attacks rather than 3.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Icon Bearers`,
        desc: `If the unit includes any Icon Bearers, add 1 to the Bravery of all its models.`,
        when: [DURING_GAME],
      },
      {
        name: `Skull Drummers`,
        desc: `If the unit includes any Skull Drummers, add 1 to its run and charge rolls.`,
        when: [DURING_GAME],
      },
      {
        name: `Slaughter-leaders`,
        desc: `If a model from this unit slays an enemy model, you can re-roll failed wound rolls for other Slaves to Darkness units from your army within 8" of this unit until the end of the phase.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Chaos Greataxe`,
        desc: `If the wound roll for a Chaos Greataxe is a 6 or more that attack inflicts a mortal wound on the target instead of its normal damage.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Chaos Warriors`,
    effects: [
      {
        name: `Aspiring Champion`,
        desc: `Add 1 to the result of any hit rolls for an Aspiring Champion.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Standard Bearers`,
        desc: `If the unit includes any Standard Bearers, add 1 to the Bravery of all its models.`,
        when: [DURING_GAME],
      },
      {
        name: `Hornblowers`,
        desc: `If the unit includes any Hornblowers, add 1 to its run and charge rolls.`,
        when: [DURING_GAME],
      },
      {
        name: `Chaos Runeshields`,
        desc: `Roll a D6 each time this model equiped with a Chaos Runeshield suffers a mortal wound. On a 5+ it is negated.`,
        when: [DURING_GAME],
      },
      {
        name: `Berserk Fury`,
        desc: `You can re-roll hit rolls of 1 for Chaos Warriors wielding a pair of Chaos Hand Weapons.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Legions of Chaos`,
        desc: `You can re-roll save rolls of 1 for this unit if it contains 20 or more models.`,
        when: [DURING_GAME],
      },
    ],
  },
  {
    name: `Chaos Warshrine`,
    effects: [
      {
        name: `Protection of the Dark Gods`,
        desc: `Roll a D6 each time a Mortal model from your army suffers a wound or a mortal wound whilst within range of a Warshrine's Protection of the Dark Gods ability. On a 6+ the wound or mortal wound is negated.`,
        when: [DURING_GAME],
      },
      {
        name: `Favour of the Ruinous Powers`,
        desc: `This model may pick a mortal unit within 16" and roll a D6. On a 3+ the prayer is answered based on the God alignment of the Warshrine.`,
        when: [HERO_PHASE],
      },
      {
        name: `Favor: ${MARK_UNDIVIDED}`,
        desc: `You can re-roll hit and wound rolls of 1 for the targeted unit until your next hero phase.`,
        when: [SHOOTING_PHASE, COMBAT_PHASE],
      },
      {
        name: `Favor: ${MARK_KHORNE}`,
        desc: `You can re-roll hit rolls of 1 for the unit. If you picked a Mortal Khorne unit, you can instead re-roll all failed hit rolls.`,
        when: [SHOOTING_PHASE, COMBAT_PHASE],
      },
      {
        name: `Favour: ${MARK_NURGLE}`,
        desc: `You can re-roll wound rolls of 1 for the unit. If you picked a Mortal Nurgle unit, you can instead re-roll all failed wound rolls.`,
        when: [SHOOTING_PHASE, COMBAT_PHASE],
      },
      {
        name: `Favour: ${MARK_TZEENTCH}`,
        desc: `You can re-roll save rolls of 1 for the unit. If you picked a Mortal Tzeentch unit, you can instead re-roll all failed save rolls.`,
        when: [SHOOTING_PHASE, COMBAT_PHASE],
      },
      {
        name: `Favour: ${MARK_SLAANESH}`,
        desc: `You can re-roll failed charge rolls and battleshock tests for the unit. If you picked a Mortal Slaanesh unit, you can re-roll failed charge rolls for the unit and it does not need to take battleshock tests.`,
        when: [CHARGE_PHASE, BATTLESHOCK_PHASE],
      },
    ],
  },
  {
    name: `Chaos Knights`,
    effects: [
      {
        name: `Doom Knight`,
        desc: `You can add 1 to the hit rolls for a Doom Knight.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Standard Bearers`,
        desc: `If the unit includes any Standard Bearers, add 1 to the Bravery of all its models.`,
        when: [DURING_GAME],
      },
      {
        name: `Hornblowers`,
        desc: `If the unit includes any Hornblowers, add 1 to its run and charge rolls.`,
        when: [DURING_GAME],
      },
      {
        name: `Chaos Runeshields`,
        desc: `Roll a D6 each time this model equiped with a Chaos Runeshield suffers a mortal wound. On a 5+ it is negated.`,
        when: [DURING_GAME],
      },
      {
        name: `Impaling Charge`,
        desc: `This unit's Chaos Glaives inflict 2 damage rather than 1 and have a Rend of -1 instead of '-', if it charged in the same turn.`,
        when: [CHARGE_PHASE, COMBAT_PHASE],
      },
      {
        name: `Terrifying Champions`,
        desc: `Subtract 1 from the Bravery of any enemy units within 3" of any Chaos Knights.`,
        when: [BATTLESHOCK_PHASE],
      },
    ],
  },
  {
    name: `Chaos Marauder Horsemen`,
    effects: [
      {
        name: `Horsemaster`,
        desc: `Add 1 to hit rolls for a Horsemaster.`,
        when: [SHOOTING_PHASE, COMBAT_PHASE],
      },
      {
        name: `Damned Icon Bearer`,
        desc: `You can re-roll hit rolls of 1 for a unit that contains any Damned Icons.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Tribal Banner Bearer`,
        desc: `If this unit includes any Tribal Banners, add 1 to the Bravery of all its models.`,
        when: [DURING_GAME],
      },
      {
        name: `Hornblowers`,
        desc: `If the unit includes any Hornblowers, add 1 to its run and charge rolls.`,
        when: [MOVEMENT_PHASE, CHARGE_PHASE],
      },
      {
        name: `Darkwood Shield`,
        desc: `Units carrying Darkwood Shields have a Save of 5+ rather than 6+.`,
        when: [SHOOTING_PHASE, COMBAT_PHASE],
      },
      {
        name: `Feigned Flight`,
        desc: `This unit can shoot and charge even if it retreated in the same turn.`,
        when: [MOVEMENT_PHASE, SHOOTING_PHASE, CHARGE_PHASE],
      },
    ],
  },
  {
    name: `Chaos Spawn`,
    effects: [
      {
        name: `Writhing Tentacles`,
        desc: `If you roll a double when determining the number of attacks made by a Chaos Spawn's Freakish Mutations, add 1 to hit and wound rolls for attacks made by that model until the end of the phase.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Chaos War Mammoth`,
    effects: [
      {
        name: `Crushing Fall`,
        desc: `If this model is slain, before this model is removed from play, the players must roll off. The player who wins the roll-off picks a point on the battlefield 4" from this model. Each unit within 3" of that point suffers D6 mortal wounds. This model is then removed from play.`,
        when: [DURING_GAME],
      },
      {
        name: `Earth-shaking charge`,
        desc: `Subtract 2 from the Bravery characteristic of enemy units while they are within 3" of this model if this model made a charge move in the same turn.`,
        when: [CHARGE_PHASE, COMBAT_PHASE, BATTLESHOCK_PHASE],
      },
      {
        name: `Goring Tusks`,
        desc: `Roll a number of dice equal to the Goring Tusks value shown on the damage table. Add 1 to each roll if the target unit is a Monster. For each 4+, the target unit suffers D3 mortal wounds.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Curs'd Ettin`,
    effects: [
      {
        name: `Cannibal Feast`,
        desc: `At the end of the combat phase, if any enemy models were slain by wounds inflicted by this model's attacks in that combat phase, you can heal up to D3 wounds allocated to this model.`,
        when: [END_OF_COMBAT_PHASE],
      },
      {
        name: `Gibbering Curse`,
        desc: `At the start of your hero phase, roll 2D6 for each enemy unit within 3" of this model. If the roll is more than that unit's Bravery characteristic, that unit suffers D3 mortal wounds.`,
        when: [START_OF_HERO_PHASE],
      },
      {
        name: `Two-headed Horror`,
        desc: `At the start of the combat phase, you can pick 1 enemy model that has a Wounds characteristic of 2 or less and that is within 3" of this model, and roll a dice. On a 6, that model is slain.`,
        when: [START_OF_COMBAT_PHASE],
      },
    ],
  },
]

// Battalions
export const Battalions: TBattalions = [
  {
    name: `Godsworn Champions of Ruin`,
    effects: [
      {
        name: `Unholy Challenge`,
        desc: `One unit from this battalion that is within 3" of an enemy hero or monster can immediately pile in and attack as if it were the combat phase.`,
        when: [HERO_PHASE],
      },
    ],
  },
  {
    name: `Godswrath Warband`,
    effects: [
      {
        name: `Godswrath Warband`,
        desc: `Roll a number of dice equal to the number of units from the formation within 24" of a Chaos Warshrine from this battalion. For every 6+ a selected unit within 18" and visible to the Warshrine takes D3 mortal wound. A unit may not be selected more than once for this ability. Should the number of bolts exceed the number of valid enemy targets, friendly units must be selected for the remainder or until no valid target can be selected.`,
        when: [HERO_PHASE],
      },
    ],
  },
  {
    name: `Ruinbringer Warband`,
    effects: [
      {
        name: `Ruinbringer Warband`,
        desc: `Once per game, every unit in this formation can charge as though it were the charge phase. Each unit that completes the charge successfully deals D3 mortal wounds to enemy units within 1" after charge completion. This changes to D6 mortal wounds if 10+ models from the unit are in range.`,
        when: [HERO_PHASE],
      },
    ],
  },
]
