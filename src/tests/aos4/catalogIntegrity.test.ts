import { readFileSync } from 'node:fs'
import path from 'node:path'
import {
  armyFactions,
  sourceRecordId,
  validateCatalog,
  type Ability,
  type Aos4Catalog,
  type Faction,
  type Warscroll,
} from '../../aos4/domain'
import type { ArtifactManifest } from '../../aos4/data'
import {
  createRuntimeProjection,
  serializeAuditCatalog,
  serializeRuntimeProjection,
  validateGenerationIntegrity,
  validateIdentityRegistry,
  type IdentityRegistry,
} from '../../aos4/generate'
import { AOS4_CATALOG, AOS4_GENERATION_AUDIT, AOS4_RUNTIME_PROJECTION } from '../../aos4/generated'
import type { ReconciliationDiagnostic } from '../../aos4/reconcile'
import { resolveSelection } from '../../aos4/select'

interface CorpusSummaryReport {
  status: 'strict-pass' | 'blocked'
  summary: {
    factions: number
    warscrolls: number
    battleProfiles: number
    abilities: number
    weapons: number
    sourceArtifacts: number
    sourceRecords: number
    ignoredSourceRecords: number
  }
  integrity: {
    consumedSourceRecords: number
    dispositions: Array<{ sourceRecordId: string; status: string; reason: string }>
    issues: unknown[]
    supersededSourceRecords: {
      count: number
      checksum: string
      reason: string
    }
  }
  sourceDiagnostics: {
    reviewed: number
    byCode: Record<string, number>
  }
}

interface OfficialBattleProfileReport {
  records: Array<{
    status: 'effective' | 'superseded'
    disposition: 'applied-to-runtime' | 'profile-only' | 'structured-reference' | 'superseded'
    fact: {
      kind: 'unit' | 'roster-option' | 'regiment-of-renown'
      factChecksum: string
      sourceRecordId: string
    }
  }>
  summary: {
    records: number
    effective: number
    superseded: number
    units: number
    rosterOptions: number
    regimentsOfRenown: number
    appliedToRuntime: number
    profileOnly: number
    structuredReference: number
  }
}

const dataPath = (...segments: string[]): string => path.join(process.cwd(), 'data', 'aos4', ...segments)

const readJson = <T>(...segments: string[]): T => JSON.parse(readFileSync(dataPath(...segments), 'utf8')) as T

const acceptedManifest = readJson<ArtifactManifest>('manifests', 'accepted-2026-08-01b.json')
const identityRegistry = readJson<IdentityRegistry>('identities', 'corpus.json')
const report = readJson<CorpusSummaryReport>('reports', 'corpus-2026-08-01b-summary.json')
const officialBattleProfiles = readJson<OfficialBattleProfileReport>(
  'catalog',
  'official-battle-profiles.json'
)

const copyCatalog = (changes: Partial<Aos4Catalog> = {}): Aos4Catalog => ({
  ...AOS4_CATALOG,
  ...changes,
})

describe('AoS 4 catalog generation integrity', () => {
  it('ships a strict, fully consumed runtime projection of the accepted corpus', () => {
    expect(validateCatalog(AOS4_CATALOG)).toEqual([])
    // The runtime projection only carries referenced source records, so the six ignored
    // example-card records are absent here and everything present is consumed.
    expect(validateGenerationIntegrity(AOS4_CATALOG)).toEqual({
      ok: true,
      consumedSourceRecordIds: AOS4_CATALOG.sourceRecords
        .map(record => record.id)
        .sort((left, right) => left.localeCompare(right)),
      issues: [],
    })
    expect(AOS4_CATALOG.sourceRecords).toHaveLength(report.integrity.consumedSourceRecords)
    expect(report).toMatchObject({
      status: 'strict-pass',
      summary: {
        factions: 28,
        warscrolls: 1297,
        battleProfiles: 1013,
        abilities: 4919,
        weapons: 2280,
        sourceArtifacts: 244,
        sourceRecords: 19274,
        ignoredSourceRecords: 18903,
      },
      integrity: {
        consumedSourceRecords: 19268,
        issues: [],
        supersededSourceRecords: {
          count: 18897,
          checksum: '31a9e711d23800deb3e0fb23bd686e9e4a85e82ef264aea806911adb506281ef',
        },
      },
    })
    // The six ignored dispositions are exactly the illustrative core-rules example ability cards
    // (customer report 2026-07-31); everything else stays fully consumed.
    expect(report.integrity.dispositions).toHaveLength(6)
    report.integrity.dispositions.forEach(disposition => {
      expect(disposition.status).toBe('ignored')
      expect(disposition.reason).toMatch(/example/i)
      expect(disposition.sourceRecordId).toMatch(/rules-ability%3A(?:Spells|Prayers)%3Aability/)
    })
    expect(report.integrity.supersededSourceRecords.reason.trim()).not.toBe('')
  })

  /**
   * Manifestations are a category of unit, not an army (issue #1791).
   *
   * Wahapedia files them under an `Endless Spells` container row, and the catalog has to hand them
   * to the armies that can take them rather than to that container — which offers nothing at all,
   * so it stays out of the selector (#1796). That leaves 26 of the 27 armies: Bonesplitterz is the
   * one that misses out, and correctly, since it exists only in Legends while this content is
   * current-standard and seasonal.
   */
  it('offers the universal manifestation lores and their warscrolls to the armies', () => {
    const factionIds = new Set(
      AOS4_CATALOG.entities.filter(entity => entity.kind === 'faction').map(entity => entity.id)
    )
    const offeringFactionCount = (name: string, kind: 'content-group' | 'warscroll') => {
      const targets = AOS4_CATALOG.entities.filter(entity => entity.kind === kind && entity.name === name)
      expect(targets).toHaveLength(1)
      return new Set(
        AOS4_CATALOG.relationships
          .filter(
            relationship =>
              relationship.kind === 'offers' &&
              relationship.to === targets[0].id &&
              factionIds.has(relationship.from as never)
          )
          .map(relationship => relationship.from)
      ).size
    }

    const lores = [
      'Aetherwrought Machineries',
      'Forbidden Power',
      'Morbid Conjuration',
      'Primal Energy',
      'Twilit Sorceries',
    ]
    lores.forEach(lore => expect(offeringFactionCount(lore, 'content-group')).toBe(26))
    // One warscroll from each lore, so a change that drops a section is visible here.
    const warscrolls = [
      'Chronomantic Cogs',
      'Horrorghast',
      'Krondspine Incarnate of Ghur',
      'Purple Sun of Shyish',
      'Emerald Lifeswarm',
      'Umbral Spellportal',
    ]
    warscrolls.forEach(warscroll => expect(offeringFactionCount(warscroll, 'warscroll')).toBe(26))
    /**
     * The container offers no warscroll of its own, which is the thing `armyFactions` reads to keep
     * it out of the selector. It still receives the universal rules modules every faction row does.
     */
    const container = AOS4_CATALOG.entities.find(
      entity => entity.kind === 'faction' && entity.name === 'Endless Spells'
    )
    expect(container).toBeDefined()
    const warscrollIds = new Set(
      AOS4_CATALOG.entities.filter(entity => entity.kind === 'warscroll').map(entity => entity.id)
    )
    expect(
      AOS4_CATALOG.relationships.filter(
        relationship => relationship.from === container?.id && warscrollIds.has(relationship.to)
      )
    ).toEqual([])
    expect(armyFactions(AOS4_CATALOG).map(faction => faction.name)).not.toContain('Endless Spells')
  })

  it('pins every accepted source and keeps official evidence distinguishable', () => {
    expect(acceptedManifest).toMatchObject({ schemaVersion: 1 })
    expect(acceptedManifest.artifacts).toHaveLength(244)
    expect(
      acceptedManifest.artifacts.filter(artifact => artifact.adapterVersion === 'wahapedia-export/1')
    ).toHaveLength(13)
    expect(
      acceptedManifest.artifacts.filter(artifact => artifact.adapterVersion === 'games-workshop-pdf/1')
    ).toHaveLength(157)
    // The community fallback tier: commit-pinned BSData catalogues for the Ogor supplement units.
    const bsdataArtifacts = acceptedManifest.artifacts.filter(
      artifact => artifact.adapterVersion === 'bsdata-cat/1'
    )
    expect(bsdataArtifacts).toHaveLength(2)
    bsdataArtifacts.forEach(artifact =>
      expect(artifact.requestUrl).toMatch(
        /^https:\/\/raw\.githubusercontent\.com\/BSData\/age-of-sigmar-4th\/[0-9a-f]{40}\//
      )
    )
    const htmlArtifacts = acceptedManifest.artifacts.filter(
      artifact => artifact.adapterVersion === 'wahapedia-html/1'
    )
    expect(htmlArtifacts).toHaveLength(72)
    expect(
      htmlArtifacts.filter(artifact => new URL(artifact.finalUrl).pathname.endsWith('/warscrolls.html'))
    ).toHaveLength(27)
    expect(
      htmlArtifacts.filter(artifact =>
        /^\/aos4\/factions\/[^/]+\/$/i.test(new URL(artifact.finalUrl).pathname)
      )
    ).toHaveLength(28)
    expect(
      htmlArtifacts.filter(artifact =>
        /^\/aos4\/the-rules\/[^/]+\/$/i.test(new URL(artifact.finalUrl).pathname)
      )
    ).toHaveLength(17)
    acceptedManifest.artifacts.forEach(artifact => {
      expect(artifact.requestUrl).toMatch(/^https:\/\//)
      expect(artifact.finalUrl).toMatch(/^https:\/\//)
      expect(artifact.checksum).toMatch(/^[0-9a-f]{64}$/)
      expect(artifact.byteLength).toBeGreaterThan(0)
    })
    expect(AOS4_CATALOG.sourceArtifacts).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          publisher: 'games-workshop',
          authority: { kind: 'official' },
        }),
        expect.objectContaining({
          publisher: 'wahapedia',
          authority: { kind: 'secondary' },
        }),
      ])
    )
    // Community-tier artifacts must always be distinguishable and explicitly provisional.
    const communityArtifacts = AOS4_CATALOG.sourceArtifacts.filter(artifact => artifact.publisher === 'other')
    expect(communityArtifacts.length).toBeGreaterThan(0)
    communityArtifacts.forEach(artifact => expect(artifact.title).toMatch(/provisional/i))
    expect(AOS4_GENERATION_AUDIT).toMatchObject({
      attribution: 'Powered by Wahapedia',
      acknowledgedDiagnostics: [],
      reviewScope: expect.stringContaining('Complete accepted AoS 4 corpus'),
    })
  })

  it('dispositions every official battle-profile fact without inventing missing rules', () => {
    expect(officialBattleProfiles.summary).toEqual({
      records: 1350,
      effective: 1303,
      superseded: 47,
      units: 967,
      rosterOptions: 307,
      regimentsOfRenown: 76,
      appliedToRuntime: 939,
      profileOnly: 1,
      structuredReference: 363,
    })
    expect(officialBattleProfiles.records).toHaveLength(1350)
    officialBattleProfiles.records.forEach(record => {
      expect(record.fact.factChecksum).toMatch(/^[0-9a-f]{64}$/)
      expect(record.fact.sourceRecordId).toMatch(/^source-record:games-workshop:/)
    })
    expect(
      officialBattleProfiles.records.filter(record => record.disposition === 'profile-only')
    ).toHaveLength(1)
  })

  it('does not allow superseded bulk rule rows into the live catalog', () => {
    const allowedBulkFiles = new Set(['Factions.csv', 'Last_update.csv', 'Source.csv'])
    const liveBulkFiles = new Set(
      AOS4_CATALOG.sourceRecords.flatMap(record => {
        const match = record.id.match(/^source-record:wahapedia:([^%]+\.csv)/)
        return match ? [match[1]] : []
      })
    )
    expect(liveBulkFiles).toEqual(allowedBulkFiles)
    expect(
      AOS4_CATALOG.entities
        .flatMap(entity => entity.sourceRefs)
        .some(reference => /(?:Warscrolls|Faction_abilit)[^%]*\.csv/.test(reference.sourceRecordId))
    ).toBe(false)
  })

  it('records every reviewed source diagnostic without leaving an unknown timing', () => {
    expect(report.sourceDiagnostics).toEqual({
      reviewed: 1718,
      byCode: {
        'duplicate-identical-record': 635,
        'empty-association-record': 559,
        'missing-faction': 2,
        'polluted-marker': 522,
      },
    })
    expect(
      AOS4_CATALOG.entities
        .filter((entity): entity is Ability => entity.kind === 'ability')
        .flatMap(ability => ability.timings)
        .some(timing => timing.window.kind === 'unknown')
    ).toBe(false)
  })

  it('fails generation integrity on hard structured-data pathologies', () => {
    const battleProfile = AOS4_CATALOG.entities.find(entity => entity.kind === 'battle-profile')!
    const catalog = copyCatalog({
      entities: AOS4_CATALOG.entities.map(entity =>
        entity.id === battleProfile.id ? { ...battleProfile, baseSizes: ['2 5 m m [1]'] } : entity
      ),
    })

    expect(validateGenerationIntegrity(catalog).issues).toContainEqual(
      expect.objectContaining({
        code: 'pathology-error',
        severity: 'error',
        subject: battleProfile.id,
        message: expect.stringContaining('malformed-measurement-token'),
      })
    )
  })

  it('keeps stable canonical identities for every accepted runtime entity', () => {
    expect(validateIdentityRegistry(identityRegistry)).toEqual([])
    const identities = new Set(identityRegistry.entries.map(entry => entry.canonicalId))
    AOS4_CATALOG.entities.forEach(entity => expect(identities.has(entity.id)).toBe(true))
  })

  it('keeps current, seasonal, Spearhead, Legends, and historical content separate', () => {
    const standard = AOS4_CATALOG.rulesContexts.find(
      context => context.mode === 'standard' && context.status === 'current'
    )!
    const spearhead = AOS4_CATALOG.rulesContexts.find(context => context.mode === 'spearhead')!
    const seasonal = AOS4_CATALOG.rulesContexts.find(context => context.status === 'seasonal')!
    const legends = AOS4_CATALOG.rulesContexts.find(context => context.status === 'legends')!
    const historical = AOS4_CATALOG.rulesContexts.find(
      context => context.name === 'Age of Sigmar Fourth Edition Historical'
    )!

    expect(AOS4_CATALOG.rulesContexts).toHaveLength(5)
    expect(spearhead.battlepack).toBe('Spearhead')
    expect(seasonal.season).toBe('2026-27')
    expect(seasonal.battlepack).toBe('Scourge of Aqshy')
    expect(legends.mode).toBe('other')
    expect(historical.validTo).toBe('2026-07-05')

    const officialPublication = (name: string) => {
      const publication = AOS4_CATALOG.entities.find(
        entity =>
          entity.kind === 'publication' && entity.publisher === 'games-workshop' && entity.name === name
      )
      expect(publication).toBeDefined()
      return publication!
    }
    const expectOfficialPublicationContexts = (name: string, expectedContextIds: string[]) => {
      const publication = officialPublication(name)
      expect(publication.rulesContextIds).toEqual([...expectedContextIds].sort())
      publication.sourceRefs.forEach(reference => {
        expect(
          AOS4_CATALOG.sourceRecords.find(record => record.id === reference.sourceRecordId)?.rulesContextIds
        ).toEqual([...expectedContextIds].sort())
      })
    }
    expectOfficialPublicationContexts('Spearhead Reference', [spearhead.id])
    expectOfficialPublicationContexts('Scourge of Aqshy - Stormcast Eternals', [seasonal.id])
    expectOfficialPublicationContexts('Scourge of Ghyran - Stormcast Eternals', [historical.id])
    expectOfficialPublicationContexts('Legends compendium', [legends.id])
    expectOfficialPublicationContexts('Faction Pack: Fyreslayers', [standard.id, seasonal.id])
    expectOfficialPublicationContexts(
      'Warhammer Age of Sigmar Core Rules, Spearhead Rules, Terrain List and Glossary',
      AOS4_CATALOG.rulesContexts.map(context => context.id)
    )

    const entitiesById = new Map(AOS4_CATALOG.entities.map(entity => [entity.id, entity]))
    const factions = AOS4_CATALOG.entities.filter(
      (entity): entity is Faction => entity.kind === 'faction' && entity.rulesContextIds.includes(standard.id)
    )
    expect(factions).toHaveLength(27)

    /*
     * Not every decoded faction row is an army. `Endless Spells` is a container for universal
     * manifestations (#1796), and it is the only row of that shape: every real army offers at least
     * eleven warscrolls, this one offers none. Restoring the manifestation warscrolls (#1791) is
     * expected to retire the row, and this assertion should fail loudly when a second container
     * appears or this one gains units, rather than letting either back into the army selector.
     */
    const armies = armyFactions(AOS4_CATALOG)
    const allFactions = AOS4_CATALOG.entities.filter((entity): entity is Faction => entity.kind === 'faction')
    expect(allFactions).toHaveLength(28)
    expect(armies).toHaveLength(27)
    expect(allFactions.filter(faction => !armies.includes(faction)).map(faction => faction.name)).toEqual([
      'Endless Spells',
    ])
    expect(armies.filter(army => army.rulesContextIds.includes(seasonal.id))).toHaveLength(26)

    AOS4_CATALOG.rulesContexts.forEach(context => {
      const applicableFactions = AOS4_CATALOG.entities.filter(
        (entity): entity is Faction =>
          entity.kind === 'faction' && entity.rulesContextIds.includes(context.id)
      )
      expect(applicableFactions.length).toBeGreaterThan(0)
      applicableFactions.forEach(faction => {
        const selection = resolveSelection(AOS4_CATALOG, {
          explicitIds: [faction.id],
          rulesContextId: context.id,
        })
        expect(selection.diagnostics).toEqual([])
        const warscrollNames = selection.availableIds.flatMap(id => {
          const entity = entitiesById.get(id)
          return entity?.kind === 'warscroll' ? [entity.name] : []
        })
        if (context.mode !== 'spearhead') {
          expect(new Set(warscrollNames).size).toBe(warscrollNames.length)
        }
      })
    })

    expect(
      AOS4_CATALOG.entities
        .filter(
          entity =>
            entity.kind === 'warscroll' &&
            entity.factionIds.includes(
              factions.find(faction => faction.name === 'Soulblight Gravelords')!.id
            ) &&
            entity.rulesContextIds.includes(standard.id)
        )
        .map(entity => entity.name)
    ).toEqual(expect.arrayContaining(['Wight King on Skeletal Steed', 'Wight Lord on Skeletal Steed']))

    const gutterRunners = AOS4_CATALOG.entities.filter(
      entity => entity.kind === 'warscroll' && entity.name === 'Gutter Runners'
    )
    expect(gutterRunners).toHaveLength(2)
    expect(gutterRunners.map(warscroll => warscroll.rulesContextIds).sort()).toEqual(
      [[seasonal.id, standard.id].sort(), [spearhead.id]].sort()
    )

    const profiles = AOS4_CATALOG.entities.filter(
      entity =>
        entity.kind === 'battle-profile' &&
        gutterRunners.some(warscroll => warscroll.id === entity.warscrollId)
    )
    expect(profiles).toEqual([
      expect.objectContaining({
        unitSize: 10,
        points: 150,
        rulesContextIds: [seasonal.id, standard.id].sort(),
      }),
    ])

    const celestarBallista = AOS4_CATALOG.entities.find(
      entity => entity.kind === 'warscroll' && entity.name === 'Celestar Ballista'
    )!
    expect(celestarBallista.rulesContextIds).toEqual([legends.id])

    const kragnosWarscrolls = AOS4_CATALOG.entities.filter(
      (entity): entity is Warscroll =>
        entity.kind === 'warscroll' &&
        entity.name === 'Kragnos, the End of Empires' &&
        entity.rulesContextIds.includes(legends.id)
    )
    expect(kragnosWarscrolls).toHaveLength(1)
    expect(kragnosWarscrolls[0].factionIds.map(factionId => entitiesById.get(factionId)?.name)).toEqual([
      'Bonesplitterz',
    ])

    const nighthaunt = factions.find(faction => faction.name === 'Nighthaunt')!
    const nighthauntSelection = resolveSelection(AOS4_CATALOG, {
      explicitIds: [nighthaunt.id],
      rulesContextId: standard.id,
    })
    expect(
      nighthauntSelection.availableIds.flatMap(id => {
        const entity = entitiesById.get(id)
        return entity ? [entity.name] : []
      })
    ).not.toEqual(expect.arrayContaining(['Cursed Shacklehorde', 'Slasher Host', 'Cairn Wraith']))

    const historicalWarscrolls = AOS4_CATALOG.entities.filter(
      entity => entity.kind === 'warscroll' && entity.rulesContextIds.includes(historical.id)
    )
    expect(historicalWarscrolls).toHaveLength(42)
    expect(historicalWarscrolls.every(warscroll => warscroll.name.startsWith('Scourge of Ghyran '))).toBe(
      true
    )
  })

  it('requires explicit dispositions and blocks unsafe generated content', () => {
    const orphan = {
      ...AOS4_CATALOG.sourceRecords[0],
      id: sourceRecordId('fixture', 'unconsumed-catalog-integrity-record'),
    }
    const withOrphan = copyCatalog({
      sourceRecords: [...AOS4_CATALOG.sourceRecords, orphan],
    })
    expect(validateGenerationIntegrity(withOrphan).issues).toContainEqual(
      expect.objectContaining({ code: 'unconsumed-source-record', subject: orphan.id })
    )
    expect(
      validateGenerationIntegrity(withOrphan, [
        {
          sourceRecordId: orphan.id,
          status: 'ignored',
          reason: 'Reviewed test-only source record.',
        },
      ])
    ).toMatchObject({ ok: true, issues: [] })

    const entities = structuredClone(AOS4_CATALOG.entities)
    const ability = entities.find((entity): entity is Ability => entity.kind === 'ability')!
    ability.timings[0].window = { kind: 'unknown' }
    ability.text.effect = '<strong>Unnormalized effect</strong>'
    const reconciliationDiagnostics: ReconciliationDiagnostic[] = [
      {
        code: 'unmatched-entity',
        severity: 'error',
        message: 'Candidate fact could not be linked.',
      },
    ]
    expect(
      validateGenerationIntegrity(copyCatalog({ entities }), [], reconciliationDiagnostics).issues.map(
        issue => issue.code
      )
    ).toEqual(expect.arrayContaining(['unknown-timing', 'unsafe-html', 'reconciliation-error']))
  })

  it('emits deterministic compact runtime data without audit-only payload fields', () => {
    const projection = createRuntimeProjection(AOS4_CATALOG, AOS4_GENERATION_AUDIT.attribution)
    const runtime = serializeRuntimeProjection(projection)
    const reordered = copyCatalog({
      rulesContexts: [...AOS4_CATALOG.rulesContexts].reverse(),
      sourceArtifacts: [...AOS4_CATALOG.sourceArtifacts].reverse(),
      sourceRecords: [...AOS4_CATALOG.sourceRecords].reverse(),
      entities: [...AOS4_CATALOG.entities].reverse(),
      relationships: [...AOS4_CATALOG.relationships].reverse(),
    })

    expect(
      serializeRuntimeProjection(createRuntimeProjection(reordered, AOS4_GENERATION_AUDIT.attribution))
    ).toBe(runtime)
    expect(AOS4_RUNTIME_PROJECTION.sourceRecords).toHaveLength(AOS4_CATALOG.sourceRecords.length)
    expect(runtime).not.toMatch(
      /"checksum"|"recordChecksum"|"retrievedAt"|"transformation"|"sourceRefs"|"revision"|"rulesContextIds"/
    )
    expect(runtime.length).toBeLessThan(serializeAuditCatalog(AOS4_CATALOG).length)
  })
})
