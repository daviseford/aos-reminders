import { TBattalions, TUnits } from 'types/army'
import {
  BATTLESHOCK_PHASE,
  CHARGE_PHASE,
  COMBAT_PHASE,
  DURING_GAME,
  DURING_SETUP,
  END_OF_SETUP,
  HERO_PHASE,
  MOVEMENT_PHASE,
  SHOOTING_PHASE,
} from 'types/phases'

// Unit Names
export const Units: TUnits = [
  {
    name: `Glade Guard`,
    effects: [
      {
        name: `Peerless Archery`,
        desc: `You can add 1 to all hit rolls made for a unit of Glade Guard in the Shooting phase if it has 20 or more models and there are no enemy models within 3".`,
        when: [SHOOTING_PHASE],
      },
      {
        name: `Arcane Bodkins`,
        desc: `Once per game, this unit can fire enchanted arrows called arcane bodkins in your shooting phase instead of their normal arrows. If they do, the Rend of their Longbows is -3 until the end of that phase.`,
        when: [SHOOTING_PHASE],
      },
      {
        name: `Lord's Bowman`,
        desc: `The leader of this unit is the Lord's Bowman. A Lord's Bowman makes 2 attacks rather than 1 with his Longbow.`,
        when: [SHOOTING_PHASE],
      },
      {
        name: `Pennant Bearer`,
        desc: `If the unit includes any Pennant Bearers, add 1 to the Bravery of its models. Add 2 their Bravery instead if the unit is in cover.`,
        when: [BATTLESHOCK_PHASE],
      },
      {
        name: `Hornblower`,
        desc: `You can re-roll the dice when determining how far this unit can run if it includes any Hornblowers.`,
        when: [MOVEMENT_PHASE],
      },
    ],
  },
  {
    name: `Nomad Prince`,
    effects: [
      {
        name: `Eye Thief`,
        desc: `If an enemy model suffers any wounds from a Hunting Hawk's Beak and is not slain, the hawk has pecked out one of its eyes. For the rest of the battle, your opponent must subtract 1 from any hit roll made for the affected model.`,
        when: [DURING_GAME],
      },
      {
        name: `Deepwood Shield`,
        desc: `You can re-roll any failed save rolls for a Nomad Prince.`,
        when: [DURING_GAME],
      },
      {
        name: `Lord of the Deepwood Host`,
        desc: `If a Nomad Prince uses this ability, then until your next hero phase you can re-roll all hit rolls of 1 for Wanderer units from your army that are within 8" of him when they attack.`,
        when: [HERO_PHASE],
        command_ability: true,
      },
    ],
  },
  {
    name: `Spellweaver`,
    effects: [
      {
        name: `Ancient Blessings`,
        desc: `Once per game, this model can call upon these blessings when attempting to unbind a spell. When it does so, that attempt is automatically successful.`,
        when: [HERO_PHASE],
      },
      {
        name: `Magic`,
        desc: `A Spellweaver is a wizard. A Spellweaver can attempt to cast one spell in each of your own hero phases, and attempt to unbind one spell in each enemy hero phase. A Spellweaver knows the Arcane Bolt, Mystic Shield and Blessing of Life spells.`,
        when: [HERO_PHASE],
      },
      {
        name: `Blessing of Life`,
        desc: `The Spellweaver speaks in the tongue of ancient days, restoring life to the fallen. Blessing of Life has a casting value of 5. If successfully cast, select a Wanderers unit within 16". You can return D3 slain models to that unit.`,
        when: [HERO_PHASE],
        spell: true,
      },
    ],
  },
  {
    name: `Wayfinder`,
    effects: [
      {
        name: `Bravest of the Brave`,
        desc: `If a Wayfinder uses this ability, then until your next hero phase, Wanderers from your army that are within 18" of him in the battleshock phase may use his Bravery instead of their own. In addition, if you roll a 1 for any of these units' battleshock tests, that unit can immediately shoot as if it were the shooting phase.`,
        when: [HERO_PHASE],
        command_ability: true,
      },
      {
        name: `Hail of Doom Arrow`,
        desc: `Once per game, a Wayfinder can fire its Hail of Doom Arrow during your shooting phase. When he does so he makes 3D6 attacks with his Greatbow that phase instead of 3.`,
        when: [SHOOTING_PHASE],
      },
    ],
  },
  {
    name: `Waystrider`,
    effects: [
      {
        name: `Boldest of the Bold`,
        desc: `If a Waystrider uses this ability, then until your next hero phase, Wanderers from your army that are within 18" of him in the battleshock phase may use his Bravery instead of their own. In addition, if you roll a 1 for any of these units' battleshock tests, that unit can immediately pile in and attack as if it were the combat phase.`,
        when: [HERO_PHASE],
        command_ability: true,
      },
      {
        name: `Heartseeker Arrow`,
        desc: `After set-up is complete, roll a dice if the enemy general is visible to at least one Waystrider from your army; on a 5 or more that general suffers a mortal wound.`,
        when: [END_OF_SETUP],
      },
    ],
  },
  {
    name: `Waywatcher`,
    effects: [
      {
        name: `See, But Do Not Be Seen`,
        desc: `If a Waywatcher uses this ability, then until your next hero phase, Wanderers from your army that are within 18" of him gain the Invisible Hunter ability (see left).`,
        when: [HERO_PHASE],
        command_ability: true,
      },
      {
        name: `Invisible Hunter`,
        desc: `Your opponent subtracts 1 from any hit rolls that target a model with this ability in the shooting phase.`,
        when: [DURING_GAME],
      },
      {
        name: `Solitary Marksman`,
        desc: `Add 1 to hit rolls made for a Waywatcher's shooting attacks if it did not move in its preceding movement phase.`,
        when: [SHOOTING_PHASE],
      },
      {
        name: `Hawk-eyed Archer`,
        desc: `When a Waywatcher shoots his Waystalker Bow, he can choose to make either Fast Shots or Precise Shots (he cannot make Fast and Precise Shots in the same shooting phase): Fast Shots: A Waywatcher firing Fast Shots makes three extra attacks with his Waystalker Bow. In addition, each time you roll a hit roll of 6 or more for this model when making a Fast Shot, it can make one additional attack with its bow. Precise Shots: A Waywatcher firing Precise Shots inflicts double damage with its Waystalker Bow. In addition, each time you roll a wound roll of 6 or more for this model when making Precise Shots, that shot is resolved with a Rend of -2 instead of -1.`,
        when: [SHOOTING_PHASE],
      },
    ],
  },
  {
    name: `Eternal Guard`,
    effects: [
      {
        name: `Fortress of Boughs`,
        desc: `In your hero phase, this unit can form a fortress of boughs. If it does so, it cannot move until your next hero phase, but until then you can add 1 to all hit rolls, wound rolls and save rolls made for models in this unit.`,
        when: [HERO_PHASE],
      },
      {
        name: `Glade Shields`,
        desc: `You can re-roll failed save rolls of 1 for a unit with Glade Shields. You can re-roll failed save rolls of 1 or 2 instead if a unit with Glade Shields is in cover.`,
        when: [DURING_GAME],
      },
      {
        name: `Eternal Warden`,
        desc: `The leader of this unit is the Eternal Warden. An Eternal Warden makes 2 attacks rather than 1.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Standard Bearer`,
        desc: `If the unit includes any Standard Bearers, add 1 to the Bravery of its models. Add 2 their Bravery instead if the unit is in cover.`,
        when: [BATTLESHOCK_PHASE],
      },
      {
        name: `Hornblower`,
        desc: `You can re-roll the dice when determining how far this unit can run if it includes any Hornblowers.`,
        when: [MOVEMENT_PHASE],
      },
    ],
  },
  {
    name: `Sisters of the Thorn`,
    effects: [
      {
        name: `Magic`,
        desc: `A Spellweaver is a wizard. A Spellweaver can attempt to cast one spell in each of your own hero phases, and attempt to unbind one spell in each enemy hero phase. A Spellweaver knows the Arcane Bolt, Mystic Shield and Blessing of Life spells.`,
        when: [HERO_PHASE],
      },
      {
        name: `Shield of Thorns`,
        desc: `The Sisters cause crawling brambles to burst from the ground and form a living barrier around their allies. Shield of Thorns has a casting value of 6. If successfully cast, pick a unit within 18". You can re-roll failed save rolls for that unit until your next hero phase. In addition, each time you make a successful save roll of a 6 or more for that unit in the combat phase, the attacking unit suffers a mortal wound after all its attacks have been made.`,
        when: [HERO_PHASE],
        spell: true,
      },
      {
        name: `Handmaiden Of The Thorn`,
        desc: `The leader of this unit is the Handmaiden of the Thorn. A Handmaiden of the Thorn makes 2 attacks with her Deepwood Coven Staff rather than 1.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Standard Bearer`,
        desc: `If the unit includes any Standard Bearers, add 1 to the Bravery of its models. Add 2 their Bravery instead if the unit is in cover.`,
        when: [BATTLESHOCK_PHASE],
      },
      {
        name: `Hornblower`,
        desc: `You can re-roll the dice when determining how far this unit can run if it includes any Hornblowers.`,
        when: [MOVEMENT_PHASE],
      },
    ],
  },
  {
    name: `Sisters of the Watch`,
    effects: [
      {
        name: `High Sister`,
        desc: `The leader of this unit is a High Sister. A High Sister makes 2 attacks rather than 1 with her Watch Bow.`,
        when: [SHOOTING_PHASE],
      },
      {
        name: `Eldritch Arrowsr`,
        desc: `Creatures of Chaos cannot abide the magical flames of these enchanted arrows. You can add 1 to any wound roll made when a Sister of the Watch targets a Chaos unit with her Watch Bow.`,
        when: [SHOOTING_PHASE],
      },
      {
        name: `Quicksilver Shot`,
        desc: `A unit of Sisters of the Watch can attack twice in their shooting phase if they did not move in their movement phase.`,
        when: [SHOOTING_PHASE],
      },
      {
        name: `Loose Until the Last`,
        desc: `Once per turn, if an enemy unit ends its charge move within 1/2" of this unit, the Sisters of the Watch can immediately shoot their Watch Bows against the charging unit.`,
        when: [CHARGE_PHASE],
      },
    ],
  },
  {
    name: `Wild Riders`,
    effects: [
      {
        name: `Wild Hunter`,
        desc: `The leader of this unit is a Wild Hunter. A Wild Hunter makes 3 attacks rather than 2 with his Hunting Spear.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Standard Bearer`,
        desc: `If the unit includes any Standard Bearers, add 1 to the Bravery of its models. Add 2 their Bravery instead if the unit is in cover.`,
        when: [BATTLESHOCK_PHASE],
      },
      {
        name: `Hornblower`,
        desc: `You can re-roll the dice when determining how far this unit can run if it includes any Hornblowers.`,
        when: [MOVEMENT_PHASE],
      },
      {
        name: `Unbound Fury`,
        desc: `Wild Riders can run and charge in the same turn. You can add 1 to any wound roll made for a Wild Rider's Hunting Spear if it charged during the same turn.`,
        when: [DURING_GAME, COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Wildwood Rangers`,
    effects: [
      {
        name: `Guardians of the Kindreds`,
        desc: `The Wildwood Rangers have had cause to master the art of hunting monstrous creatures that roam the wildwoods. Rangers' Draichs inflict D3 Damage on Monsters instead of 1.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Wildwood Warden`,
        desc: `The leader of this unit is a Wildwood Warden. A Wildwood Warden makes 3 attacks rather than 2.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Standard Bearer`,
        desc: `If the unit includes any Standard Bearers, add 1 to the Bravery of its models. Add 2 their Bravery instead if the unit is in cover.`,
        when: [BATTLESHOCK_PHASE],
      },
      {
        name: `Hornblower`,
        desc: `You can re-roll the dice when determining how far this unit can run if it includes any Hornblowers.`,
        when: [MOVEMENT_PHASE],
      },
    ],
  },
]

// Battalions
export const Battalions: TBattalions = [
  {
    name: `Waystone Pathfinders`,
    effects: [
      {
        name: `Realm Wanderers`,
        desc: `Waystone Pathfinders have travelled the realms for countless years and know many hidden paths. Instead of setting up units in this battalion on the battlefield, you can place them to one side. In your first movement phase, set up all of these wholly within 6" of the edges of the battlefield, and more than 9" from any enemy models. This is each unit's move for that movement phase.`,
        when: [DURING_SETUP],
      },
      {
        name: `Protective Volley`,
        desc: `Perhaps the greatest weapon of the Waystone Pathfinders lies in their ability to cut down any foes that draw close eonugh to threaten their leader with devastatingly effective volleys of bow-fire. In your hero phase, pick one enemy unity within 12" of the battalions Nomad Prince. All other Waystone Pathfinder units can immediately make a shooting attack against the unit as if it were the shooting phase.`,
        when: [DURING_SETUP],
      },
    ],
  },
]
