import { readFile } from 'node:fs/promises'
import path from 'node:path'
import { artifactChecksum, type ArtifactManifestEntry } from '../../aos4/data'
import {
  WAHAPEDIA_EXPORT_FILES,
  assessWahapediaFreshness,
  createWahapediaFactionCohortReport,
  decodeWahapediaExports,
  normalizeWahapediaAbility,
  normalizeWahapediaWeapon,
  parsePipeDelimited,
  wahapediaExportRequest,
  type WahapediaExportFileName,
  type WahapediaExportInputs,
} from '../../aos4/data/wahapedia'

const fixtureRoot = path.join(process.cwd(), 'src', 'tests', 'fixtures', 'aos4', 'wahapedia')

const textEncoder = new TextEncoder()

const artifact = (file: WahapediaExportFileName, bytes: Uint8Array): ArtifactManifestEntry => ({
  requestUrl: `https://wahapedia.ru/aos4/${file}`,
  finalUrl: `https://wahapedia.ru/aos4/${file}`,
  redirectChain: [],
  retrievedAt: '2026-07-29T12:00:00.000Z',
  adapterVersion: 'wahapedia-export/1',
  mediaType: 'text/csv',
  byteLength: bytes.byteLength,
  checksum: artifactChecksum(bytes),
})

const loadInputs = async (): Promise<WahapediaExportInputs> => {
  const entries = await Promise.all(
    WAHAPEDIA_EXPORT_FILES.map(async file => {
      const buffer = await readFile(path.join(fixtureRoot, file))
      const bytes = new Uint8Array(buffer)
      return [file, { bytes, artifact: artifact(file, bytes) }] as const
    })
  )
  return Object.fromEntries(entries) as WahapediaExportInputs
}

const replaceFile = (
  inputs: WahapediaExportInputs,
  file: WahapediaExportFileName,
  transform: (source: string) => string
): WahapediaExportInputs => {
  const current = inputs[file]
  if (!current) throw new Error(`Missing fixture input ${file}`)
  const bytes = textEncoder.encode(transform(new TextDecoder().decode(current.bytes)))
  return {
    ...inputs,
    [file]: {
      bytes,
      artifact: artifact(file, bytes),
    },
  }
}

describe('Wahapedia pipe-delimited decoding', () => {
  it('preserves quoted delimiters, line breaks, Unicode, and physical row locations', () => {
    const result = parsePipeDelimited('\uFEFFid|description|\n1|"A | value\nwith Stormcast — text"|\n')

    expect(result.rows).toEqual([
      {
        line: 1,
        values: ['id', 'description'],
        raw: '\uFEFFid|description|',
        lineEnding: '\n',
      },
      {
        line: 2,
        values: ['1', 'A | value\nwith Stormcast — text'],
        raw: '1|"A | value\nwith Stormcast — text"|',
        lineEnding: '\n',
      },
    ])
    expect(result.diagnostics).toEqual([])
  })

  it('reports malformed quoted records without silently repairing them', () => {
    const result = parsePipeDelimited('id|description|\n1|"unterminated\n')

    expect(result.diagnostics).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          code: 'unterminated-quoted-field',
          line: 2,
        }),
      ])
    )
  })
})

describe('Wahapedia AoS 4 export adapter', () => {
  it('builds bounded acquisition requests for the documented export URLs', () => {
    expect(wahapediaExportRequest('Factions.csv')).toMatchObject({
      url: 'https://wahapedia.ru/aos4/Factions.csv',
      adapterVersion: 'wahapedia-export/1',
      allowedMediaTypes: ['text/csv'],
      maxBytes: 16 * 1024 * 1024,
      timeoutMs: 30_000,
      maxRedirects: 5,
    })
  })

  it('decodes the complete linked export fixture with artifact and row provenance', async () => {
    const result = decodeWahapediaExports(await loadInputs())

    expect(result.diagnostics).toEqual([])
    expect(result.dataset.factions).toHaveLength(1)
    expect(result.dataset.sources).toHaveLength(1)
    expect(result.dataset.warscrolls).toHaveLength(1)
    expect(result.dataset.warscrollAbilities).toHaveLength(1)
    expect(result.dataset.warscrollWeapons).toHaveLength(2)
    expect(result.dataset.warscrollKeywords).toHaveLength(2)
    expect(result.dataset.warscrollBases).toHaveLength(1)
    expect(result.dataset.warscrollOrganisation).toHaveLength(1)
    expect(result.dataset.regimentOfRenownFactions).toHaveLength(1)
    expect(result.dataset.factionAbilityTypes).toHaveLength(1)
    expect(result.dataset.factionAbilitySubtypes).toHaveLength(1)
    expect(result.dataset.factionAbilities).toHaveLength(1)
    expect(result.dataset.lastUpdate).toMatchObject({
      raw: '2026-07-27 01:33:36',
      instant: '2026-07-26T22:33:36.000Z',
    })
    expect(result.dataset.factions[0].meta.recordChecksum).toBe(
      artifactChecksum(
        textEncoder.encode('SCE|Stormcast Eternals|https://wahapedia.ru/aos4/factions/stormcast-eternals|')
      )
    )

    const ability = result.dataset.warscrollAbilities[0]
    expect(ability.descriptionHtml).toContain('Pick this unit | or a friendly unit.\n')
    expect(ability.meta).toMatchObject({
      file: 'Warscrolls_abilities.csv',
      row: 2,
      artifactId: `artifact:sha256:${result.dataset.artifacts['Warscrolls_abilities.csv']!.checksum}`,
      recordChecksum: expect.stringMatching(/^[0-9a-f]{64}$/),
    })
    expect(ability.meta.sourceRecordId).toMatch(/^source-record:wahapedia:/)
  })

  it('reports and excludes empty keyword association sentinels', async () => {
    const inputs = replaceFile(
      await loadInputs(),
      'Warscrolls_keywords.csv',
      source => `${source}ws-1||false||\n`
    )
    const result = decodeWahapediaExports(inputs)

    expect(result.dataset.warscrollKeywords).toHaveLength(2)
    expect(result.diagnostics).toContainEqual(
      expect.objectContaining({
        code: 'empty-association-record',
        severity: 'warning',
        file: 'Warscrolls_keywords.csv',
        field: 'keyword',
      })
    )
    expect(result.diagnostics).not.toContainEqual(
      expect.objectContaining({
        code: 'missing-required-field',
        file: 'Warscrolls_keywords.csv',
        field: 'keyword',
      })
    )
  })

  it('normalizes weapon types and retains source weapon abilities as facts', async () => {
    const { dataset } = decodeWahapediaExports(await loadInputs())
    const weapons = dataset.warscrollWeapons.map(normalizeWahapediaWeapon)

    expect(weapons).toEqual([
      expect.objectContaining({
        weaponType: 'melee',
        profile: {
          range: '1"',
          attacks: '2',
          hit: '3+',
          wound: '3+',
          rend: '1',
          damage: '2',
        },
        abilityLabels: ['Crit (Mortal)'],
        hasBattleDamage: false,
      }),
      expect.objectContaining({
        weaponType: 'ranged',
        abilityLabels: ['Shoot in Combat'],
        hasBattleDamage: true,
      }),
    ])
  })

  it('normalizes source timing as evidence while preserving raw fields and reaction triggers', async () => {
    const { dataset } = decodeWahapediaExports(await loadInputs())
    const warscrollAbility = normalizeWahapediaAbility(dataset.warscrollAbilities[0], 'unit')
    const factionAbility = normalizeWahapediaAbility(dataset.factionAbilities[0], 'army')

    expect(warscrollAbility).toMatchObject({
      abilityKind: 'active',
      actor: 'unit',
      keywords: ['CORE', 'FIGHT'],
      text: {
        declare: 'Pick this unit | or a friendly unit.',
        effect: 'Add 1 to save rolls.',
      },
      raw: {
        condition: 'Your Combat Phase',
        abilityPhase: 'Combat Phase',
      },
    })
    expect(warscrollAbility.timings).toEqual([
      expect.objectContaining({
        kind: 'active',
        window: { kind: 'turn-phase', phase: 'combat' },
        perspective: 'your',
      }),
    ])

    expect(factionAbility).toMatchObject({
      abilityKind: 'reaction',
      actor: 'army',
      text: {
        reactionTrigger: 'You declared a MOVE ability for a friendly unit.',
        effect: 'Move the target D6".',
      },
      raw: {
        abilityPhase: 'Defensive reaction',
        isReaction: true,
      },
    })
    expect(factionAbility.timings[0].window).toEqual({ kind: 'reaction' })
    expect(factionAbility.timings[0].usage).toEqual({
      limit: 1,
      period: 'turn',
      scope: 'army',
    })
  })

  it('creates a bounded, non-verbatim faction cohort review report', async () => {
    const decoded = decodeWahapediaExports(await loadInputs())
    const report = createWahapediaFactionCohortReport(decoded.dataset, decoded.diagnostics, 'SCE')

    expect(report).toMatchObject({
      schemaVersion: 1,
      status: 'cohort-review-required',
      faction: { id: 'SCE', name: 'Stormcast Eternals' },
      counts: {
        sources: 1,
        warscrolls: 1,
        warscrollAbilities: 1,
        warscrollWeapons: 2,
        warscrollKeywords: 2,
        warscrollBases: 1,
        warscrollOrganisation: 1,
        regimentOfRenownFactions: 1,
        factionAbilityTypes: 1,
        factionAbilitySubtypes: 1,
        factionAbilities: 1,
      },
      normalization: {
        abilities: 2,
        weapons: 2,
        unknownWeaponSourceRecordIds: [],
        unresolvedTimingSourceRecordIds: [],
        sourceTimingCorrectionSourceRecordIds: [],
        reactionFlagMismatchSourceRecordIds: [],
      },
      diagnostics: { errors: 0, warnings: 0, byCode: {} },
      sourceIds: ['source-1'],
    })
    expect(report.sourceRecords).toHaveLength(14)
    report.sourceRecords.forEach(sourceRecord => {
      expect(sourceRecord.recordChecksum).toMatch(/^[0-9a-f]{64}$/)
      expect(sourceRecord.file).toMatch(/\.csv$/)
      expect(sourceRecord.row).toBeGreaterThan(1)
    })
    expect(JSON.stringify(report)).not.toMatch(/Pick this unit|Add 1 to save rolls|Move the target/)
  })

  it('refuses to invent a cohort for an unknown faction ID', async () => {
    const decoded = decodeWahapediaExports(await loadInputs())

    expect(() => createWahapediaFactionCohortReport(decoded.dataset, decoded.diagnostics, 'UNKNOWN')).toThrow(
      'Wahapedia faction UNKNOWN does not exist'
    )
  })

  it('uses explicit reaction text but diagnoses a contradictory reaction flag', async () => {
    const inputs = replaceFile(await loadInputs(), 'Faction_abilities.csv', source =>
      source.replace('|true|Once Per Turn (Army), Reaction:', '|false|Once Per Turn (Army), Reaction:')
    )
    const { dataset } = decodeWahapediaExports(inputs)
    const fact = normalizeWahapediaAbility(dataset.factionAbilities[0], 'army')

    expect(fact.abilityKind).toBe('reaction')
    expect(fact.timings[0].window).toEqual({ kind: 'reaction' })
    expect(fact.diagnostics).toContainEqual(
      expect.objectContaining({
        code: 'reaction-flag-mismatch',
        severity: 'warning',
      })
    )
  })

  it.each([
    ['Once Per Turn (Army), Any Comhat Phase', 'Combat Phase', 'combat'],
    ['Your Hero Quest', 'Hero Phase', 'hero'],
  ] as const)(
    'corrects a known source timing typo without using the lossy phase fallback',
    async (conditionHtml, abilityPhase, phase) => {
      const { dataset } = decodeWahapediaExports(await loadInputs())
      const record = {
        ...dataset.warscrollAbilities[0],
        conditionHtml,
        abilityPhase,
      }
      const fact = normalizeWahapediaAbility(record, 'unit')

      expect(fact.raw.condition).toBe(conditionHtml)
      expect(fact.timings[0].window).toEqual({ kind: 'turn-phase', phase })
      expect(fact.diagnostics).toContainEqual(
        expect.objectContaining({
          code: 'source-timing-correction',
          severity: 'warning',
        })
      )
      expect(fact.diagnostics).not.toContainEqual(
        expect.objectContaining({ code: 'source-phase-fallback' })
      )
      expect(
        createWahapediaFactionCohortReport(
          { ...dataset, warscrollAbilities: [record] },
          [],
          'SCE'
        ).normalization.sourceTimingCorrectionSourceRecordIds
      ).toEqual([String(record.meta.sourceRecordId)])
    }
  )

  it('emits row-addressable diagnostics for schema, value, vocabulary, and join failures', async () => {
    let inputs = await loadInputs()
    inputs = replaceFile(inputs, 'Factions.csv', source =>
      source.replace('id|name|link|', 'id|display_name|link|')
    )
    inputs = replaceFile(
      inputs,
      'Source.csv',
      source => `${source}${source.split('\n')[1].replace('Rulebook', 'Conflicting Type')}\n`
    )
    inputs = replaceFile(inputs, 'Warscrolls.csv', source =>
      source
        .replace('|SCE|source-1|', '|MISSING|missing-source|')
        .replace('|false|false|', '|sometimes|false|')
    )
    inputs = replaceFile(inputs, 'Warscrolls_weapons.csv', source => source.replace('|MELEE|', '|ARCANE|'))
    inputs = replaceFile(inputs, 'Faction_abilities.csv', source =>
      source.replace('Once Per Turn', 'Once Per Turn %000012345Polluted%')
    )

    const result = decodeWahapediaExports(inputs)
    const codes = result.diagnostics.map(diagnostic => diagnostic.code)

    expect(codes).toEqual(
      expect.arrayContaining([
        'header-drift',
        'duplicate-record-key',
        'invalid-boolean',
        'missing-faction',
        'missing-source',
        'unknown-vocabulary',
        'polluted-marker',
      ])
    )
    expect(result.diagnostics).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          file: 'Warscrolls.csv',
          row: 2,
          field: 'virtual',
        }),
      ])
    )
  })

  it('detects extra row columns and missing export files', async () => {
    let inputs = await loadInputs()
    inputs = replaceFile(inputs, 'Warscrolls_bases.csv', source =>
      source.replace('ws-1|1|Liberator|40mm|', 'ws-1|1|Liberator|40mm|unexpected|')
    )
    const withoutLastUpdate = { ...inputs } as Partial<WahapediaExportInputs>
    delete withoutLastUpdate['Last_update.csv']

    const result = decodeWahapediaExports(withoutLastUpdate)

    expect(result.diagnostics.map(diagnostic => diagnostic.code)).toEqual(
      expect.arrayContaining(['row-column-count', 'missing-export-file'])
    )
  })

  it('keeps freshness signals per artifact and flags source dates newer than the export marker', async () => {
    const inputs = await loadInputs()
    const decoded = decodeWahapediaExports(inputs)
    const freshness = assessWahapediaFreshness(decoded.dataset)

    expect(freshness.exportUpdatedAt).toBe('2026-07-26T22:33:36.000Z')
    expect(freshness.artifacts['Factions.csv']!.retrievedAt).toBe('2026-07-29T12:00:00.000Z')
    expect(freshness.diagnostics).toEqual([
      expect.objectContaining({
        code: 'source-newer-than-export-marker',
        file: 'Source.csv',
        row: 2,
      }),
    ])
  })

  it('does not normalize impossible export or source calendar dates', async () => {
    let inputs = await loadInputs()
    inputs = replaceFile(inputs, 'Last_update.csv', source => source.replace('2026-07-27', '2026-02-31'))
    inputs = replaceFile(inputs, 'Source.csv', source => source.replace('28.07.2026', '31.02.2026'))

    const decoded = decodeWahapediaExports(inputs)
    const freshness = assessWahapediaFreshness(decoded.dataset)

    expect(decoded.diagnostics).toEqual(
      expect.arrayContaining([expect.objectContaining({ code: 'invalid-last-update' })])
    )
    expect(freshness.diagnostics).toEqual([expect.objectContaining({ code: 'invalid-source-date' })])
  })

  it('is deterministic when input object insertion order changes', async () => {
    const inputs = await loadInputs()
    const reversed = Object.fromEntries(Object.entries(inputs).reverse()) as WahapediaExportInputs

    expect(decodeWahapediaExports(reversed)).toEqual(decodeWahapediaExports(inputs))
  })
})
