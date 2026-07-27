import { createHash } from 'node:crypto'
import { artifactId, sourceRecordId } from '../../domain'
import { parsePipeDelimited } from './delimited'
import {
  WAHAPEDIA_ABILITY_PHASES,
  WAHAPEDIA_EXPORT_DEFINITIONS,
  WAHAPEDIA_WEAPON_TYPES,
  type WahapediaExportFileName,
} from './exportCatalog'
import type {
  WahapediaDataset,
  WahapediaDecodeResult,
  WahapediaDiagnostic,
  WahapediaExportInput,
  WahapediaExportInputs,
  WahapediaFactionAbilityRecord,
  WahapediaRecordMeta,
  WahapediaWarscrollAbilityRecord,
} from './records'

interface RawRecord {
  file: WahapediaExportFileName
  row: number
  values: Record<string, string>
  raw: string
  input: WahapediaExportInput
}

const primaryKeyFields = (file: WahapediaExportFileName): string[] => {
  switch (file) {
    case 'Factions.csv':
    case 'Source.csv':
    case 'Warscrolls.csv':
      return ['id']
    case 'Warscrolls_abilities.csv':
    case 'Warscrolls_weapons.csv':
    case 'Warscrolls_bases.csv':
    case 'Warscrolls_organisation.csv':
      return ['warscroll_id', 'line']
    case 'Warscrolls_keywords.csv':
      return ['warscroll_id', 'keyword', 'parameter']
    case 'Warscrolls_RoRfactions.csv':
      return ['warscroll_id', 'faction_id']
    case 'Faction_ability_types.csv':
      return ['faction_id', 'id']
    case 'Faction_ability_subtypes.csv':
      return ['faction_id', 'id', 'type_id']
    case 'Faction_abilities.csv':
      return ['faction_id', 'type_id', 'subtype_id', 'line']
    case 'Last_update.csv':
      return ['last_update']
  }
}

const compareDiagnostics = (left: WahapediaDiagnostic, right: WahapediaDiagnostic): number =>
  left.file.localeCompare(right.file) ||
  (left.row ?? 0) - (right.row ?? 0) ||
  (left.field ?? '').localeCompare(right.field ?? '') ||
  left.code.localeCompare(right.code) ||
  left.message.localeCompare(right.message)

const decodeUtf8 = (
  file: WahapediaExportFileName,
  input: WahapediaExportInput,
  diagnostics: WahapediaDiagnostic[]
): string | undefined => {
  try {
    return new TextDecoder('utf-8', { fatal: true }).decode(input.bytes)
  } catch {
    diagnostics.push({
      code: 'invalid-utf8',
      severity: 'error',
      file,
      message: `${file} is not valid UTF-8`,
    })
    return undefined
  }
}

const primaryKey = (record: RawRecord): string =>
  primaryKeyFields(record.file)
    .map(field => record.values[field])
    .join(':')

const recordMeta = (record: RawRecord): WahapediaRecordMeta => ({
  file: record.file,
  row: record.row,
  artifactId: artifactId(record.input.artifact.checksum),
  sourceRecordId: sourceRecordId('wahapedia', `${record.file}:${primaryKey(record)}`),
  recordChecksum: createHash('sha256').update(record.raw, 'utf8').digest('hex'),
})

const parseBoolean = (
  record: RawRecord,
  field: string,
  diagnostics: WahapediaDiagnostic[]
): boolean | null => {
  const value = record.values[field]
  if (value === 'true') return true
  if (value === 'false') return false
  diagnostics.push({
    code: 'invalid-boolean',
    severity: 'error',
    file: record.file,
    row: record.row,
    field,
    value,
    message: `${record.file} row ${record.row} has invalid boolean ${field}=${value}`,
  })
  return null
}

const parseLastUpdate = (
  record: RawRecord,
  diagnostics: WahapediaDiagnostic[]
): WahapediaDataset['lastUpdate'] => {
  const raw = record.values.last_update
  const match = raw.match(/^(\d{4})-(\d{2})-(\d{2}) (\d{2}):(\d{2}):(\d{2})$/)
  const parsed = match
    ? new Date(`${match[1]}-${match[2]}-${match[3]}T${match[4]}:${match[5]}:${match[6]}+03:00`)
    : null
  const parsedIsValid = parsed !== null && !Number.isNaN(parsed.valueOf())
  const roundTrip = parsedIsValid
    ? new Date(parsed.valueOf() + 3 * 60 * 60 * 1000).toISOString().slice(0, 19).replace('T', ' ')
    : null
  const instant = parsed && parsedIsValid && roundTrip === raw ? parsed.toISOString() : null
  if (!instant) {
    diagnostics.push({
      code: 'invalid-last-update',
      severity: 'error',
      file: record.file,
      row: record.row,
      field: 'last_update',
      value: raw,
      message: `Last_update.csv row ${record.row} has an invalid GMT+3 timestamp`,
    })
  }
  return { raw, instant, meta: recordMeta(record) }
}

const abilityFields = (record: RawRecord, diagnostics: WahapediaDiagnostic[]) => ({
  line: record.values.line,
  name: record.values.name,
  descriptionHtml: record.values.description,
  legendHtml: record.values.legend,
  abilityType: record.values.ability_type,
  isReaction: parseBoolean(record, 'is_reaction', diagnostics),
  conditionHtml: record.values.condition,
  keywordsHtml: record.values.keywords,
  abilityPhase: record.values.ability_phase,
  pointsType: record.values.points_type,
  points: record.values.points,
})

const decodeRecord = (
  record: RawRecord,
  dataset: WahapediaDataset,
  diagnostics: WahapediaDiagnostic[]
): void => {
  const value = (field: string) => record.values[field]
  const meta = recordMeta(record)

  switch (record.file) {
    case 'Factions.csv':
      dataset.factions.push({ id: value('id'), name: value('name'), link: value('link'), meta })
      return
    case 'Source.csv':
      dataset.sources.push({
        id: value('id'),
        name: value('name'),
        type: value('type'),
        edition: value('edition'),
        version: value('version'),
        errataDate: value('errata_date'),
        errataLink: value('errata_link'),
        meta,
      })
      return
    case 'Warscrolls.csv':
      dataset.warscrolls.push({
        id: value('id'),
        name: value('name'),
        factionId: value('faction_id'),
        sourceId: value('source_id'),
        legendHtml: value('legend'),
        regimentOptions: value('regiment_options'),
        notesHtml: value('notes'),
        descriptionHtml: value('description'),
        role: value('role'),
        virtual: parseBoolean(record, 'virtual', diagnostics),
        noReinforced: parseBoolean(record, 'no_reinforced', diagnostics),
        link: value('link'),
        move: value('Move'),
        save: value('Save'),
        control: value('Control'),
        health: value('Health'),
        ward: value('Ward'),
        unitSize: value('UnitSize'),
        cost: value('Cost'),
        meta,
      })
      return
    case 'Warscrolls_abilities.csv':
      dataset.warscrollAbilities.push({
        warscrollId: value('warscroll_id'),
        ...abilityFields(record, diagnostics),
        meta,
      } satisfies WahapediaWarscrollAbilityRecord)
      return
    case 'Warscrolls_weapons.csv':
      dataset.warscrollWeapons.push({
        warscrollId: value('warscroll_id'),
        line: value('line'),
        name: value('name'),
        range: value('Rng'),
        attacks: value('Atk'),
        hit: value('Hit'),
        wound: value('Wnd'),
        rend: value('Rnd'),
        damage: value('Dmg'),
        weaponType: value('type'),
        abilitiesHtml: value('abilities'),
        hasBattleDamage: parseBoolean(record, 'has_battle_damage', diagnostics),
        meta,
      })
      return
    case 'Warscrolls_keywords.csv':
      dataset.warscrollKeywords.push({
        warscrollId: value('warscroll_id'),
        keyword: value('keyword'),
        isFactionKeyword: parseBoolean(record, 'is_faction_keyword', diagnostics),
        parameter: value('parameter'),
        meta,
      })
      return
    case 'Warscrolls_bases.csv':
      dataset.warscrollBases.push({
        warscrollId: value('warscroll_id'),
        line: value('line'),
        model: value('model'),
        base: value('base'),
        meta,
      })
      return
    case 'Warscrolls_organisation.csv':
      dataset.warscrollOrganisation.push({
        warscrollId: value('warscroll_id'),
        line: value('line'),
        unit: value('unit'),
        size: value('size'),
        meta,
      })
      return
    case 'Warscrolls_RoRfactions.csv':
      dataset.regimentOfRenownFactions.push({
        warscrollId: value('warscroll_id'),
        factionId: value('faction_id'),
        meta,
      })
      return
    case 'Faction_ability_types.csv':
      dataset.factionAbilityTypes.push({
        factionId: value('faction_id'),
        id: value('id'),
        name: value('name'),
        descriptionHtml: value('description'),
        meta,
      })
      return
    case 'Faction_ability_subtypes.csv':
      dataset.factionAbilitySubtypes.push({
        factionId: value('faction_id'),
        id: value('id'),
        name: value('name'),
        typeId: value('type_id'),
        descriptionHtml: value('description'),
        legendHtml: value('legend'),
        meta,
      })
      return
    case 'Faction_abilities.csv':
      dataset.factionAbilities.push({
        factionId: value('faction_id'),
        typeId: value('type_id'),
        typeName: value('type_name'),
        subtypeId: value('subtype_id'),
        subtypeName: value('subtype_name'),
        ...abilityFields(record, diagnostics),
        meta,
      } satisfies WahapediaFactionAbilityRecord)
      return
    case 'Last_update.csv':
      dataset.lastUpdate = parseLastUpdate(record, diagnostics)
  }
}

const parseExport = (
  file: WahapediaExportFileName,
  headers: readonly string[],
  input: WahapediaExportInput,
  diagnostics: WahapediaDiagnostic[]
): RawRecord[] => {
  const source = decodeUtf8(file, input, diagnostics)
  if (source === undefined) return []
  const parsed = parsePipeDelimited(source)
  parsed.diagnostics.forEach(diagnostic => {
    diagnostics.push({
      code: diagnostic.code,
      severity: 'error',
      file,
      row: diagnostic.line,
      message: diagnostic.message,
    })
  })

  const [header, ...physicalRows] = parsed.rows
  if (
    !header ||
    header.values.length !== headers.length ||
    header.values.some((value, index) => value !== headers[index])
  ) {
    diagnostics.push({
      code: 'header-drift',
      severity: 'error',
      file,
      row: header?.line,
      message: `${file} headers do not match the published export contract`,
      value: header?.values.join('|') ?? '(missing)',
    })
    return []
  }

  const rows = physicalRows.reduce<Array<(typeof physicalRows)[number]>>((logicalRows, row) => {
    const previous = logicalRows.at(-1)
    if (
      previous &&
      previous.values.length < headers.length &&
      previous.values.length + row.values.length - 1 <= headers.length
    ) {
      previous.values = [
        ...previous.values.slice(0, -1),
        `${previous.values.at(-1)}\n${row.values[0]}`,
        ...row.values.slice(1),
      ]
      previous.raw = `${previous.raw}${previous.lineEnding}${row.raw}`
      previous.lineEnding = row.lineEnding
      return logicalRows
    }
    logicalRows.push({
      line: row.line,
      values: [...row.values],
      raw: row.raw,
      lineEnding: row.lineEnding,
    })
    return logicalRows
  }, [])

  const records = rows.flatMap(row => {
    if (row.values.length !== headers.length) {
      diagnostics.push({
        code: 'row-column-count',
        severity: 'error',
        file,
        row: row.line,
        message: `${file} row ${row.line} has ${row.values.length} columns; expected ${headers.length}`,
      })
      return []
    }
    const values = Object.fromEntries(headers.map((headerName, index) => [headerName, row.values[index]]))
    return [{ file, row: row.line, values, raw: row.raw, input }]
  })

  const seenKeys = new Map<string, string>()
  const uniqueRecords = records.filter(record => {
    if (record.file === 'Warscrolls_keywords.csv' && !record.values.keyword && !record.values.parameter) {
      diagnostics.push({
        code: 'empty-association-record',
        severity: 'warning',
        file,
        row: record.row,
        field: 'keyword',
        message: `${file} row ${record.row} is an empty keyword association and was ignored`,
      })
      return false
    }

    const key = primaryKey(record)
    const recordValue = JSON.stringify(record.values)
    primaryKeyFields(file).forEach(field => {
      if (!record.values[field] && field !== 'parameter' && field !== 'subtype_id') {
        diagnostics.push({
          code: 'missing-required-field',
          severity: 'error',
          file,
          row: record.row,
          field,
          message: `${file} row ${record.row} is missing required field ${field}`,
        })
      }
    })

    if (seenKeys.has(key)) {
      const identical = seenKeys.get(key) === recordValue
      diagnostics.push({
        code: identical ? 'duplicate-identical-record' : 'duplicate-record-key',
        severity: identical ? 'warning' : 'error',
        file,
        row: record.row,
        value: key,
        message: identical
          ? `${file} repeats identical record key ${key}`
          : `${file} contains conflicting record key ${key}`,
      })
      return false
    }
    seenKeys.set(key, recordValue)

    Object.entries(record.values).forEach(([field, value]) => {
      if (/%\d{6,}/.test(value)) {
        diagnostics.push({
          code: 'polluted-marker',
          severity: 'warning',
          file,
          row: record.row,
          field,
          value,
          message: `${file} row ${record.row} retains an embedded source marker in ${field}`,
        })
      }
    })
    return true
  })

  return uniqueRecords
}

const diagnostic = (
  code: WahapediaDiagnostic['code'],
  file: WahapediaExportFileName,
  row: number,
  field: string,
  value: string,
  message: string
): WahapediaDiagnostic => ({
  code,
  severity: code === 'unknown-vocabulary' ? 'warning' : 'error',
  file,
  row,
  field,
  value,
  message,
})

const validateVocabulary = (dataset: WahapediaDataset, diagnostics: WahapediaDiagnostic[]): void => {
  dataset.warscrollWeapons.forEach(record => {
    if (!WAHAPEDIA_WEAPON_TYPES.has(record.weaponType)) {
      diagnostics.push(
        diagnostic(
          'unknown-vocabulary',
          record.meta.file,
          record.meta.row,
          'type',
          record.weaponType,
          `Unknown Wahapedia weapon type ${record.weaponType}`
        )
      )
    }
  })
  ;[...dataset.warscrollAbilities, ...dataset.factionAbilities].forEach(record => {
    if (!WAHAPEDIA_ABILITY_PHASES.has(record.abilityPhase)) {
      diagnostics.push(
        diagnostic(
          'unknown-vocabulary',
          record.meta.file,
          record.meta.row,
          'ability_phase',
          record.abilityPhase,
          `Unknown Wahapedia ability phase ${record.abilityPhase}`
        )
      )
    }
  })
}

const validateJoins = (dataset: WahapediaDataset, diagnostics: WahapediaDiagnostic[]): void => {
  const factions = new Set(dataset.factions.map(record => record.id))
  const sources = new Set(dataset.sources.map(record => record.id))
  const warscrolls = new Set(dataset.warscrolls.map(record => record.id))
  const abilityTypes = new Map(
    dataset.factionAbilityTypes.map(record => [`${record.factionId}:${record.id}`, record])
  )
  const abilitySubtypes = new Map(
    dataset.factionAbilitySubtypes.map(record => [`${record.factionId}:${record.id}`, record])
  )

  const requireFaction = (record: { factionId: string; meta: WahapediaRecordMeta }): void => {
    if (!factions.has(record.factionId)) {
      diagnostics.push(
        diagnostic(
          'missing-faction',
          record.meta.file,
          record.meta.row,
          'faction_id',
          record.factionId,
          `Missing faction ${record.factionId}`
        )
      )
    }
  }
  const requireWarscroll = (record: { warscrollId: string; meta: WahapediaRecordMeta }): void => {
    if (!warscrolls.has(record.warscrollId)) {
      diagnostics.push(
        diagnostic(
          'missing-warscroll',
          record.meta.file,
          record.meta.row,
          'warscroll_id',
          record.warscrollId,
          `Missing warscroll ${record.warscrollId}`
        )
      )
    }
  }

  dataset.warscrolls.forEach(record => {
    requireFaction(record)
    if (record.sourceId && !sources.has(record.sourceId)) {
      diagnostics.push(
        diagnostic(
          'missing-source',
          record.meta.file,
          record.meta.row,
          'source_id',
          record.sourceId,
          `Missing source ${record.sourceId}`
        )
      )
    }
  })
  ;[
    ...dataset.warscrollAbilities,
    ...dataset.warscrollWeapons,
    ...dataset.warscrollKeywords,
    ...dataset.warscrollBases,
    ...dataset.warscrollOrganisation,
    ...dataset.regimentOfRenownFactions,
  ].forEach(requireWarscroll)
  dataset.regimentOfRenownFactions.forEach(requireFaction)
  dataset.factionAbilityTypes.forEach(requireFaction)
  dataset.factionAbilitySubtypes.forEach(record => {
    requireFaction(record)
    if (!abilityTypes.has(`${record.factionId}:${record.typeId}`)) {
      diagnostics.push(
        diagnostic(
          'missing-ability-type',
          record.meta.file,
          record.meta.row,
          'type_id',
          record.typeId,
          `Missing faction ability type ${record.typeId}`
        )
      )
    }
  })
  dataset.factionAbilities.forEach(record => {
    requireFaction(record)
    const type = abilityTypes.get(`${record.factionId}:${record.typeId}`)
    const subtype = record.subtypeId
      ? abilitySubtypes.get(`${record.factionId}:${record.subtypeId}`)
      : undefined
    if (!type) {
      diagnostics.push(
        diagnostic(
          'missing-ability-type',
          record.meta.file,
          record.meta.row,
          'type_id',
          record.typeId,
          `Missing faction ability type ${record.typeId}`
        )
      )
    } else if (record.typeName && record.typeName !== type.name) {
      diagnostics.push(
        diagnostic(
          'denormalized-name-mismatch',
          record.meta.file,
          record.meta.row,
          'type_name',
          record.typeName,
          `Faction ability type name does not match ${type.name}`
        )
      )
    }
    if (record.subtypeId && !subtype) {
      diagnostics.push(
        diagnostic(
          'missing-ability-subtype',
          record.meta.file,
          record.meta.row,
          'subtype_id',
          record.subtypeId,
          `Missing faction ability subtype ${record.subtypeId}`
        )
      )
    } else if (subtype && record.subtypeName && record.subtypeName !== subtype.name) {
      diagnostics.push(
        diagnostic(
          'denormalized-name-mismatch',
          record.meta.file,
          record.meta.row,
          'subtype_name',
          record.subtypeName,
          `Faction ability subtype name does not match ${subtype.name}`
        )
      )
    }
  })
}

const emptyDataset = (): WahapediaDataset => ({
  artifacts: {},
  factions: [],
  sources: [],
  warscrolls: [],
  warscrollAbilities: [],
  warscrollWeapons: [],
  warscrollKeywords: [],
  warscrollBases: [],
  warscrollOrganisation: [],
  regimentOfRenownFactions: [],
  factionAbilityTypes: [],
  factionAbilitySubtypes: [],
  factionAbilities: [],
})

export const decodeWahapediaExports = (inputs: WahapediaExportInputs): WahapediaDecodeResult => {
  const dataset = emptyDataset()
  const diagnostics: WahapediaDiagnostic[] = []

  WAHAPEDIA_EXPORT_DEFINITIONS.forEach(definition => {
    const input = inputs[definition.file]
    if (!input) {
      diagnostics.push({
        code: 'missing-export-file',
        severity: 'error',
        file: definition.file,
        message: `Missing required Wahapedia export ${definition.file}`,
      })
      return
    }

    dataset.artifacts[definition.file] = input.artifact
    parseExport(definition.file, definition.headers, input, diagnostics).forEach(record => {
      decodeRecord(record, dataset, diagnostics)
    })
  })

  validateVocabulary(dataset, diagnostics)
  validateJoins(dataset, diagnostics)

  return {
    dataset,
    diagnostics: diagnostics.sort(compareDiagnostics),
  }
}
