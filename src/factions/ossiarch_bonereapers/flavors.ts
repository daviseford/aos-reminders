import { CHARGE_PHASE, COMBAT_PHASE, HERO_PHASE, WOUND_ALLOCATION_PHASE } from 'types/phases'

const Flavors = {
  'Mortis Praetorians': {
    effects: [
      {
        name: `The Dread Legion`,
        desc: `Once per turn, during the enemy charge phase, after an enemy unit finishes a charge move, you can pick 1 friendly MORTIS PRAETORIANS unit within 12" of that enemy unit and more than 3" from all enemy units. That unit can attempt a charge.`,
        when: [CHARGE_PHASE],
      },
    ],
  },
  'Petrifex Elite': {
    effects: [
      {
        name: `Unstoppable Juggernauts`,
        desc: `Subtract 1 from wound rolls for combat attacks that target friendly PETRIFEX ELITE HEKATOS or PETRIFEX ELITE GOTHIZZAR HARVESTER units.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  'Stalliarch Lords': {
    effects: [
      {
        name: `Equumortoi`,
        desc: `You can reroll charge rolls for friendly STALLIARCH LORDS units that have a mount.`,
        when: [CHARGE_PHASE],
      },
    ],
  },
  'Ivory Host': {
    effects: [
      {
        name: `Simmering Rage`,
        desc: `Add 1 to the number of hits scored by the Nadirite Weapons battle trait by friendly IVORY HOST units if the unmodified hit roll was 6 and any wounds or mortal wounds were allocated to that unit earlier in the turn.

        Designer's Note: If a unit is affected by this ability and the Empower Nadirite Weapons spell, the effect of this ability is only applied on an unmodified hit roll of 6.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  'Null Myriad': {
    effects: [
      {
        name: `Eldritch Nulls`,
        desc: `You can roll a dice each time a friendly NULL MYRIAD unit wholly within 9" of any friendly NULL MYRIAD MORTISANS or a friendly ARKHAN is affected by a spell cast by an enemy unit or the abilities of an endless spell summoned by an enemy unit. On a 2+, ignore the effect of that spell or the effects of that endless spell's abilities on that unit.`,
        when: [HERO_PHASE],
      },
    ],
  },
  Crematorians: {
    effects: [
      {
        name: `Immolation`,
        desc: `Each time a friendly CREMATORIANS model is slain, before removing that model from play, you can pick 1 enemy unit within 3" of it and roll a number of dice equal to the Wounds characteristic of that model. For each 5+, that enemy unit suffers 1 mortal wound.`,
        when: [WOUND_ALLOCATION_PHASE],
      },
    ],
  },
}

// Note: We do NOT use tagAs for Flavors
export default Flavors
