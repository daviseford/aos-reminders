import {
  abilityId,
  battleProfileId,
  contentGroupId,
  factionId,
  publicationId,
  rulesContextId,
  warscrollId,
  weaponId,
} from '../../domain'

export const REPRESENTATIVE_CONTEXT_ID = rulesContextId('80000000-0000-4000-8000-000000000001')

export const REPRESENTATIVE_IDS = {
  publication: publicationId('80000000-0000-4000-8000-000000000002'),
  faction: factionId('80000000-0000-4000-8000-000000000003'),
  groups: {
    battleTraits: contentGroupId('80000000-0000-4000-8000-000000000004'),
    lightningEchelon: contentGroupId('80000000-0000-4000-8000-000000000005'),
    quicksilverDraught: contentGroupId('80000000-0000-4000-8000-000000000006'),
    loreOfTheStorm: contentGroupId('80000000-0000-4000-8000-000000000007'),
    prayersOfTheStormhosts: contentGroupId('80000000-0000-4000-8000-000000000008'),
    manifestationsOfTheStorm: contentGroupId('80000000-0000-4000-8000-000000000009'),
  },
  warscrolls: {
    liberators: warscrollId('80000000-0000-4000-8000-000000000010'),
    vigilors: warscrollId('80000000-0000-4000-8000-000000000011'),
  },
  battleProfiles: {
    liberators: battleProfileId('80000000-0000-4000-8000-000000000012'),
    vigilors: battleProfileId('80000000-0000-4000-8000-000000000013'),
  },
  abilities: {
    celestialRealm: abilityId('80000000-0000-4000-8000-000000000014'),
    scionsOfTheStorm: abilityId('80000000-0000-4000-8000-000000000015'),
    finestHour: abilityId('80000000-0000-4000-8000-000000000016'),
    oncomingStorm: abilityId('80000000-0000-4000-8000-000000000017'),
    quicksilverDraught: abilityId('80000000-0000-4000-8000-000000000018'),
    lightningBlast: abilityId('80000000-0000-4000-8000-000000000019'),
    healingStorm: abilityId('80000000-0000-4000-8000-000000000020'),
    summonEverblazeComet: abilityId('80000000-0000-4000-8000-000000000021'),
    stalwartDefenders: abilityId('80000000-0000-4000-8000-000000000022'),
    navigatorsOfTheStorm: abilityId('80000000-0000-4000-8000-000000000023'),
  },
  weapons: {
    warhammer: weaponId('80000000-0000-4000-8000-000000000025'),
    grandhammer: weaponId('80000000-0000-4000-8000-000000000026'),
    stormcallerBow: weaponId('80000000-0000-4000-8000-000000000027'),
    stormblade: weaponId('80000000-0000-4000-8000-000000000028'),
  },
} as const

export const REPRESENTATIVE_EXPLICIT_SELECTION_IDS = [
  REPRESENTATIVE_IDS.faction,
  REPRESENTATIVE_IDS.groups.lightningEchelon,
  REPRESENTATIVE_IDS.groups.quicksilverDraught,
  REPRESENTATIVE_IDS.groups.loreOfTheStorm,
  REPRESENTATIVE_IDS.groups.prayersOfTheStormhosts,
  REPRESENTATIVE_IDS.groups.manifestationsOfTheStorm,
  REPRESENTATIVE_IDS.warscrolls.liberators,
  REPRESENTATIVE_IDS.warscrolls.vigilors,
]
