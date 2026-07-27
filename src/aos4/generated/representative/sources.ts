import {
  artifactId,
  sourceRecordId,
  type SourceArtifact,
  type SourceRecord,
  type SourceRecordId,
} from '../../domain'
import { REPRESENTATIVE_CONTEXT_ID } from './identities'

const CHECKSUMS = {
  official: '0e69101a8adf954eedadc6caa098514f05c8a61f136eb423f89bfc22f0a733d0',
  factions: '42596b20e7bb09f13372bd9b9c3a4f1baadd5036ecab9b415b98fa73ee417ff0',
  warscrolls: 'c16e4a8a8403277f67a714b1727bafd0fa3c809cbdc805776dc6bced26b53db5',
  warscrollAbilities: '4f9e15b6fa4f62536322ae626b1061a27b261f36fac9e460c2cc714f18a5d339',
  warscrollWeapons: '0b002d2762087d079efcdaf2715ae08a01fc88b8aeb2dcccab40af5b506892ca',
  factionAbilities: '12c54620832b9cdd4390a3c09ad98010c13dee521f6736b630bc3f4c2347fcdf',
  factionAbilityTypes: '294e0c93164d40d78709b2e5f47eb4db72ebf97df38a6cb0bb2613c748c7b44a',
  factionAbilitySubtypes: '1ba800415ac99371fdc729315033bfef45c36e179a333ccf81c0985e8e3551a5',
  timingFixture: 'aaf494a92e0a3e87529a758892cc14b7d18db31e47fa60189501035cb5b3ccf2',
} as const

const wahaArtifact = (file: string, checksum: string): SourceArtifact => ({
  id: artifactId(checksum),
  publisher: 'wahapedia',
  authority: { kind: 'secondary' },
  title: `Wahapedia AoS 4 ${file}`,
  edition: '4',
  language: 'en',
  retrievedAt: '2026-07-27T19:00:00.000Z',
  sourceUrl: `https://wahapedia.ru/aos4/${file}`,
  checksum,
  mediaType: 'text/csv',
  version: 'export-marker-2026-05-26',
})

export const REPRESENTATIVE_SOURCE_ARTIFACTS: SourceArtifact[] = [
  {
    id: artifactId(CHECKSUMS.official),
    publisher: 'games-workshop',
    authority: { kind: 'official' },
    title: 'Warhammer Age of Sigmar Battle Profiles',
    edition: '4',
    language: 'en',
    retrievedAt: '2026-07-27T19:46:15.000Z',
    sourceUrl: 'https://assets.warhammer-community.com/eng_aos_battle_profiles-2wsrrn6poc-wb3lenb8nn.pdf',
    checksum: CHECKSUMS.official,
    mediaType: 'application/pdf',
    publicationDate: '2026-06-29',
    effectiveDate: '2026-06-29',
    version: 'June 2026',
  },
  wahaArtifact('Factions.csv', CHECKSUMS.factions),
  wahaArtifact('Warscrolls.csv', CHECKSUMS.warscrolls),
  wahaArtifact('Warscrolls_abilities.csv', CHECKSUMS.warscrollAbilities),
  wahaArtifact('Warscrolls_weapons.csv', CHECKSUMS.warscrollWeapons),
  wahaArtifact('Faction_abilities.csv', CHECKSUMS.factionAbilities),
  wahaArtifact('Faction_ability_types.csv', CHECKSUMS.factionAbilityTypes),
  wahaArtifact('Faction_ability_subtypes.csv', CHECKSUMS.factionAbilitySubtypes),
  {
    id: artifactId(CHECKSUMS.timingFixture),
    publisher: 'other',
    authority: { kind: 'unknown', raw: 'repository timing fixture' },
    title: 'Representative core timing fixture',
    edition: '4',
    language: 'en',
    retrievedAt: '2026-07-27T19:00:00.000Z',
    sourceUrl: 'fixture:aos4/representative/core-timing.json',
    checksum: CHECKSUMS.timingFixture,
    mediaType: 'application/json',
    version: '1',
  },
]

interface WahaRecordDefinition {
  key: string
  file:
    | 'Factions.csv'
    | 'Warscrolls.csv'
    | 'Warscrolls_abilities.csv'
    | 'Warscrolls_weapons.csv'
    | 'Faction_abilities.csv'
    | 'Faction_ability_types.csv'
    | 'Faction_ability_subtypes.csv'
  row: number
  checksum: string
}

const wahaRecordDefinitions: WahaRecordDefinition[] = [
  {
    key: 'Factions.csv:SE',
    file: 'Factions.csv',
    row: 9,
    checksum: '2748f6fc1ab2994a2d3993ff2dcf50a7e27cfae7134e9f79a2ae6449cbb1355f',
  },
  {
    key: 'Warscrolls.csv:000000061',
    file: 'Warscrolls.csv',
    row: 1236,
    checksum: '3c7f7932f9420f28cc1448d7a6ed2cdcfe277655b8d5fdc4066f405653ad75b6',
  },
  {
    key: 'Warscrolls.csv:000001366',
    file: 'Warscrolls.csv',
    row: 1302,
    checksum: '06d5b51259647a8f7415d954e92fee4e54098dff7e84332f9df85fc43afe4975',
  },
  {
    key: 'Warscrolls_abilities.csv:000000061:1',
    file: 'Warscrolls_abilities.csv',
    row: 75,
    checksum: 'd53422d63289fa6f43f0e59a95b018d43ea844651dc42efffef35e9375ce2597',
  },
  {
    key: 'Warscrolls_abilities.csv:000001366:1',
    file: 'Warscrolls_abilities.csv',
    row: 1283,
    checksum: '863bb624287b5b181de7bf9f40940adbf46b280488e32c8f7301b919d7895ded',
  },
  {
    key: 'Warscrolls_weapons.csv:000000061:1',
    file: 'Warscrolls_weapons.csv',
    row: 72,
    checksum: '926eb03f5fcfc8cad60c26a65986325c9f3c3497e80b42c20a480a65e16b6943',
  },
  {
    key: 'Warscrolls_weapons.csv:000000061:2',
    file: 'Warscrolls_weapons.csv',
    row: 73,
    checksum: 'a131fee3ab1000591da056f5e83b29173a79681b5bf97e12583bae47f8a92234',
  },
  {
    key: 'Warscrolls_weapons.csv:000001366:1',
    file: 'Warscrolls_weapons.csv',
    row: 1125,
    checksum: 'b332d46fd242658453a15b41491c915213f3fb60f272c3853ceb937241494dce',
  },
  {
    key: 'Warscrolls_weapons.csv:000001366:2',
    file: 'Warscrolls_weapons.csv',
    row: 1126,
    checksum: '551081c4b275447afe4a1ebe220a1ae8aa1b1bdd11290df49336074214e15024',
  },
  {
    key: 'Faction_abilities.csv:SE:000000612:000002233:3',
    file: 'Faction_abilities.csv',
    row: 1189,
    checksum: 'b538ac7fe051ced910aecac9d34079cc74dcbd00a3303468d42daf0b0c70a7cd',
  },
  {
    key: 'Faction_abilities.csv:SE:000000606:000002238:2',
    file: 'Faction_abilities.csv',
    row: 1205,
    checksum: 'ea7324edc04827229f433f08a71767860dc256f8aac4c4ca9826482ab8d3958d',
  },
  {
    key: 'Faction_abilities.csv:SE:000000610:000002231:2',
    file: 'Faction_abilities.csv',
    row: 1207,
    checksum: '5ff9e2b2df9acfa131f2113276a9de257b2d65c6485ae225a717ddd744c579d6',
  },
  {
    key: 'Faction_abilities.csv:SE:000000610:000002231:3',
    file: 'Faction_abilities.csv',
    row: 1208,
    checksum: 'fc306573ab4653ddaa2e7476727b7d77eb4552762632071d244ab38aa07dc5ee',
  },
  {
    key: 'Faction_abilities.csv:SE:000000610:000002231:5',
    file: 'Faction_abilities.csv',
    row: 1210,
    checksum: '54e482961d2a0b96c1b93b2e39a0b9b7e6027383721593f3474d40d03b73a7d5',
  },
  {
    key: 'Faction_abilities.csv:SE:000000613:000002235:4',
    file: 'Faction_abilities.csv',
    row: 1239,
    checksum: 'd8f25399f5555b000d0e54c230c46a5f540867579d8ba317cc95eb20e1f70184',
  },
  {
    key: 'Faction_abilities.csv:SE:000000614:000002234:2',
    file: 'Faction_abilities.csv',
    row: 1241,
    checksum: 'd92ca8e8bf96d29621d4001706a24df75fcd8ffafd1160c4c130009575781cb1',
  },
  {
    key: 'Faction_abilities.csv:SE:000000605:000002236:2',
    file: 'Faction_abilities.csv',
    row: 1253,
    checksum: '7bcc231170b2383cdf54cd6a813c6d3be2551cf9cd621b7827d5d569ce9e97ea',
  },
  {
    key: 'Faction_ability_types.csv:SE:000000605',
    file: 'Faction_ability_types.csv',
    row: 562,
    checksum: '20d9a1cb3990e39cc0ea4368f3406c74eda971e675f26e417433b52e7da894ed',
  },
  {
    key: 'Faction_ability_types.csv:SE:000000610',
    file: 'Faction_ability_types.csv',
    row: 540,
    checksum: 'c8a70089c93aa4f7cc2fb4d74dae654d9222d38a1e3c64144c018a0df443933a',
  },
  {
    key: 'Faction_ability_types.csv:SE:000000613',
    file: 'Faction_ability_types.csv',
    row: 555,
    checksum: 'd3e4915764e933bffc2fc2b8ebae4f23c70f6018d5bf9f0b32a419f98c71f5b0',
  },
  {
    key: 'Faction_ability_types.csv:SE:000000614',
    file: 'Faction_ability_types.csv',
    row: 557,
    checksum: '6000b93bb3eadd399731c7f568cc04f5431cdd1b4f012694a7ea4c6cf40a30be',
  },
  {
    key: 'Faction_ability_subtypes.csv:SE:000002238:000000606',
    file: 'Faction_ability_subtypes.csv',
    row: 547,
    checksum: 'cc5ae5cc7e80751c1500a816061afa1b0a9335e31ce325faa8e547b0cd6cc31a',
  },
]

const artifactByFile = new Map(
  REPRESENTATIVE_SOURCE_ARTIFACTS.map(artifact => [artifact.sourceUrl.split('/').at(-1), artifact.id])
)

const wahaRecords: SourceRecord[] = wahaRecordDefinitions.map(definition => ({
  id: sourceRecordId('wahapedia', definition.key),
  artifactId: artifactByFile.get(definition.file)!,
  locator: { kind: 'row', row: definition.row },
  recordChecksum: definition.checksum,
  rulesContextIds: [REPRESENTATIVE_CONTEXT_ID],
}))

export const REPRESENTATIVE_SOURCE_RECORDS: SourceRecord[] = [
  {
    id: sourceRecordId('games-workshop', `${CHECKSUMS.official}:page:21`),
    artifactId: artifactId(CHECKSUMS.official),
    locator: { kind: 'page', page: 21, section: 'Stormcast Eternals' },
    recordChecksum: '27d18dab3621422babd7e87f1439b2e887c63b2cbc0c81b5a3083d05dab156c5',
    rulesContextIds: [REPRESENTATIVE_CONTEXT_ID],
  },
  ...wahaRecords,
  {
    id: sourceRecordId('fixture', 'defensive-reflex'),
    artifactId: artifactId(CHECKSUMS.timingFixture),
    locator: { kind: 'section', section: 'defensive-reflex' },
    recordChecksum: '47389d1de945c8a1933fc45a9040ac671a84b5611504c4cc0465318b91d58ab9',
    rulesContextIds: [REPRESENTATIVE_CONTEXT_ID],
  },
]

export const REPRESENTATIVE_UNCLASSIFIED_SOURCE_RECORD = {
  id: sourceRecordId('fixture', 'unclassified-thunder'),
  artifactId: artifactId(CHECKSUMS.timingFixture),
  locator: { kind: 'section', section: 'unclassified-thunder' } as const,
  recordChecksum: '8b90e8acbcbfc3d7bd78e051e51df9e49df20d37a82b19eb44375fef8ddc964d',
  rulesContextIds: [REPRESENTATIVE_CONTEXT_ID],
}

export const REPRESENTATIVE_SOURCE_IDS = {
  officialProfilesPage: sourceRecordId('games-workshop', `${CHECKSUMS.official}:page:21`),
  faction: sourceRecordId('wahapedia', 'Factions.csv:SE'),
  liberators: sourceRecordId('wahapedia', 'Warscrolls.csv:000000061'),
  vigilors: sourceRecordId('wahapedia', 'Warscrolls.csv:000001366'),
  stalwartDefenders: sourceRecordId('wahapedia', 'Warscrolls_abilities.csv:000000061:1'),
  navigatorsOfTheStorm: sourceRecordId('wahapedia', 'Warscrolls_abilities.csv:000001366:1'),
  warhammer: sourceRecordId('wahapedia', 'Warscrolls_weapons.csv:000000061:1'),
  grandhammer: sourceRecordId('wahapedia', 'Warscrolls_weapons.csv:000000061:2'),
  stormcallerBow: sourceRecordId('wahapedia', 'Warscrolls_weapons.csv:000001366:1'),
  stormblade: sourceRecordId('wahapedia', 'Warscrolls_weapons.csv:000001366:2'),
  quicksilverDraught: sourceRecordId('wahapedia', 'Faction_abilities.csv:SE:000000612:000002233:3'),
  oncomingStorm: sourceRecordId('wahapedia', 'Faction_abilities.csv:SE:000000606:000002238:2'),
  celestialRealm: sourceRecordId('wahapedia', 'Faction_abilities.csv:SE:000000610:000002231:2'),
  scionsOfTheStorm: sourceRecordId('wahapedia', 'Faction_abilities.csv:SE:000000610:000002231:3'),
  finestHour: sourceRecordId('wahapedia', 'Faction_abilities.csv:SE:000000610:000002231:5'),
  summonEverblazeComet: sourceRecordId('wahapedia', 'Faction_abilities.csv:SE:000000613:000002235:4'),
  healingStorm: sourceRecordId('wahapedia', 'Faction_abilities.csv:SE:000000614:000002234:2'),
  lightningBlast: sourceRecordId('wahapedia', 'Faction_abilities.csv:SE:000000605:000002236:2'),
  battleTraitsGroup: sourceRecordId('wahapedia', 'Faction_ability_types.csv:SE:000000610'),
  lightningEchelonGroup: sourceRecordId('wahapedia', 'Faction_ability_subtypes.csv:SE:000002238:000000606'),
  loreOfTheStormGroup: sourceRecordId('wahapedia', 'Faction_ability_types.csv:SE:000000605'),
  manifestationsOfTheStormGroup: sourceRecordId('wahapedia', 'Faction_ability_types.csv:SE:000000613'),
  prayersOfTheStormhostsGroup: sourceRecordId('wahapedia', 'Faction_ability_types.csv:SE:000000614'),
  defensiveReflex: sourceRecordId('fixture', 'defensive-reflex'),
} satisfies Record<string, SourceRecordId>
