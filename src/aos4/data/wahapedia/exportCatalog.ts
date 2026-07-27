import type { AcquireArtifactRequest } from '../command'
import type { ArtifactManifest } from '../manifest'

export const WAHAPEDIA_EXPORT_DEFINITIONS = [
  {
    file: 'Factions.csv',
    headers: ['id', 'name', 'link'],
  },
  {
    file: 'Source.csv',
    headers: ['id', 'name', 'type', 'edition', 'version', 'errata_date', 'errata_link'],
  },
  {
    file: 'Warscrolls.csv',
    headers: [
      'id',
      'name',
      'faction_id',
      'source_id',
      'legend',
      'regiment_options',
      'notes',
      'description',
      'role',
      'virtual',
      'no_reinforced',
      'link',
      'Move',
      'Save',
      'Control',
      'Health',
      'Ward',
      'UnitSize',
      'Cost',
    ],
  },
  {
    file: 'Warscrolls_abilities.csv',
    headers: [
      'warscroll_id',
      'line',
      'name',
      'description',
      'legend',
      'ability_type',
      'is_reaction',
      'condition',
      'keywords',
      'ability_phase',
      'points_type',
      'points',
    ],
  },
  {
    file: 'Warscrolls_weapons.csv',
    headers: [
      'warscroll_id',
      'line',
      'name',
      'Rng',
      'Atk',
      'Hit',
      'Wnd',
      'Rnd',
      'Dmg',
      'type',
      'abilities',
      'has_battle_damage',
    ],
  },
  {
    file: 'Warscrolls_keywords.csv',
    headers: ['warscroll_id', 'keyword', 'is_faction_keyword', 'parameter'],
  },
  {
    file: 'Warscrolls_bases.csv',
    headers: ['warscroll_id', 'line', 'model', 'base'],
  },
  {
    file: 'Warscrolls_organisation.csv',
    headers: ['warscroll_id', 'line', 'unit', 'size'],
  },
  {
    file: 'Warscrolls_RoRfactions.csv',
    headers: ['warscroll_id', 'faction_id'],
  },
  {
    file: 'Faction_ability_types.csv',
    headers: ['faction_id', 'id', 'name', 'description'],
  },
  {
    file: 'Faction_ability_subtypes.csv',
    headers: ['faction_id', 'id', 'name', 'type_id', 'description', 'legend'],
  },
  {
    file: 'Faction_abilities.csv',
    headers: [
      'faction_id',
      'type_id',
      'type_name',
      'subtype_id',
      'subtype_name',
      'line',
      'name',
      'description',
      'legend',
      'ability_type',
      'is_reaction',
      'condition',
      'keywords',
      'ability_phase',
      'points_type',
      'points',
    ],
  },
  {
    file: 'Last_update.csv',
    headers: ['last_update'],
  },
] as const

export type WahapediaExportFileName = (typeof WAHAPEDIA_EXPORT_DEFINITIONS)[number]['file']

export const WAHAPEDIA_EXPORT_FILES = WAHAPEDIA_EXPORT_DEFINITIONS.map(definition => definition.file)

export const WAHAPEDIA_EXPORT_BASE_URL = 'https://wahapedia.ru/aos4/' as const
export const WAHAPEDIA_EXPORT_ADAPTER_VERSION = 'wahapedia-export/1' as const
export const WAHAPEDIA_ATTRIBUTION = 'Powered by Wahapedia' as const

export const wahapediaExportUrl = (file: WahapediaExportFileName): string =>
  new URL(file, WAHAPEDIA_EXPORT_BASE_URL).toString()

export const wahapediaExportRequest = (
  file: WahapediaExportFileName,
  options: {
    acceptedManifest?: ArtifactManifest
    candidateManifest?: ArtifactManifest
    offline?: boolean
  } = {}
): AcquireArtifactRequest => ({
  url: wahapediaExportUrl(file),
  adapterVersion: WAHAPEDIA_EXPORT_ADAPTER_VERSION,
  allowedMediaTypes: ['text/csv'],
  maxBytes: 16 * 1024 * 1024,
  timeoutMs: 30_000,
  maxRedirects: 5,
  ...options,
})

export const WAHAPEDIA_ABILITY_PHASES = new Set([
  '',
  'Charge Phase',
  'Combat Phase',
  'Defensive reaction',
  'End of Turn',
  'Hero Phase',
  'Movement Phase',
  'Shooting Phase',
  'Start of Turn',
])

export const WAHAPEDIA_WEAPON_TYPES = new Set(['MELEE', 'RANGED'])
