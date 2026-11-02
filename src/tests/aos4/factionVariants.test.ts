import type { WahapediaDataset, WahapediaRecordMeta } from '../../aos4/data'
import type { SourceRecordId } from '../../aos4/domain'
import { applyFactionVariants, overrideKey } from '../../aos4/generate'

/**
 * Reviewed faction variants (#1757): the October 2026 publications give Khazalite Holds its own
 * Lofnir Drothkeepers, The Duardin Ascendant and The Chosen Axes while Faction Pack: Fyreslayers
 * keeps the originals. A copy keeps its secondary provenance, takes its own identity, and is the
 * only record a variant-scoped override can reach.
 */
const sid = (value: string) => `source-record:wahapedia:${value}` as SourceRecordId
const official = `source-record:games-workshop:${'a'.repeat(64)}%3Apage%3A3` as SourceRecordId
const meta = (
  value: string,
  kinds: WahapediaRecordMeta['rulesContextKinds'] = ['standard']
): WahapediaRecordMeta => ({
  file: 'Faction_abilities.csv',
  row: 0,
  artifactId: 'artifact:sha256:b' as WahapediaRecordMeta['artifactId'],
  sourceRecordId: sid(value),
  recordChecksum: 'c'.repeat(64),
  rulesContextKinds: kinds,
})

const dataset = (): WahapediaDataset =>
  ({
    factions: [
      { id: 'FY', name: 'Fyreslayers', link: '', meta: meta('faction:FY', ['standard', 'legends']) },
      { id: 'KHZ', name: 'Khazalite Holds', link: '', meta: meta('faction:KHZ', ['standard']) },
    ],
    factionAbilityTypes: [
      {
        factionId: 'FY',
        id: 'T1',
        name: 'Lofnir Drothkeepers',
        descriptionHtml: '',
        armyOfRenown: true,
        meta: meta('aor'),
      },
    ],
    factionAbilitySubtypes: [
      {
        factionId: 'FY',
        id: 'S1',
        name: 'Battle Traits',
        typeId: 'T1',
        descriptionHtml: '',
        legendHtml: '',
        meta: meta('traits'),
      },
    ],
    factionAbilities: [
      {
        factionId: 'FY',
        typeId: 'T1',
        typeName: 'Lofnir Drothkeepers',
        subtypeId: 'S1',
        subtypeName: 'Battle Traits',
        line: '1',
        name: 'DARING TAMERS',
        descriptionHtml: '<b>Effect:</b> Enemy MONSTERS have Strike-last.',
        legendHtml: '',
        abilityType: '',
        isReaction: false,
        conditionHtml: 'Passive',
        keywordsHtml: '',
        abilityPhase: '',
        pointsType: '',
        points: '',
        meta: meta('daring-tamers'),
      },
    ],
    warscrolls: [{ id: 'W1', name: 'The Chosen Axes', factionId: 'FY', meta: meta('axes', ['legends']) }],
    warscrollAbilities: [{ warscrollId: 'W1', name: 'BERSERK FURY', meta: meta('axes:ability') }],
    warscrollWeapons: [{ warscrollId: 'W1', name: 'Fyresteel Weapons', meta: meta('axes:weapon') }],
    warscrollKeywords: [{ warscrollId: 'W1', keyword: 'FYRESLAYERS', meta: meta('axes:keyword') }],
    warscrollBases: [],
  }) as unknown as WahapediaDataset

describe('reviewed faction variants (#1757)', () => {
  const variant = (sourceRecordId: SourceRecordId, factionId = 'KHZ') => ({
    factionId,
    sourceRecordId,
    reason: 'October 2026 re-targets it to Khazalite Holds',
    officialSourceRecordIds: [official],
  })

  it('copies an Army of Renown onto the new faction with its own identity, leaving the original', () => {
    const source = dataset()
    const result = applyFactionVariants(source, [variant(sid('aor'))])
    const copy = result.factionAbilityTypes.find(type => type.factionId === 'KHZ')!
    expect(copy).toMatchObject({ id: 'T1~KHZ', name: 'Lofnir Drothkeepers', armyOfRenown: true })
    expect(copy.meta).toMatchObject({
      sourceRecordId: sid('aor'),
      identitySourceRecordId: `${sid('aor')}%7Cvariant%3AKHZ`,
      variantFactionId: 'KHZ',
    })
    expect(result.factionAbilitySubtypes.find(subtype => subtype.factionId === 'KHZ')).toMatchObject({
      id: 'S1~KHZ',
      typeId: 'T1~KHZ',
    })
    expect(result.factionAbilities.filter(ability => ability.factionId === 'KHZ')).toEqual([
      expect.objectContaining({ typeId: 'T1~KHZ', subtypeId: 'S1~KHZ', name: 'DARING TAMERS' }),
    ])
    // The original records are untouched and the input is not mutated.
    expect(source.factionAbilityTypes).toHaveLength(1)
    expect(result.factionAbilityTypes.find(type => type.factionId === 'FY')).toBe(
      source.factionAbilityTypes[0]
    )
  })

  it('copies a warscroll and its rows, and extends the faction to the copy’s Legends context', () => {
    const result = applyFactionVariants(dataset(), [variant(sid('axes'))])
    expect(result.warscrolls.find(record => record.factionId === 'KHZ')).toMatchObject({ id: 'W1~KHZ' })
    expect(result.warscrollKeywords.filter(record => record.warscrollId === 'W1~KHZ')).toHaveLength(1)
    expect(result.warscrollWeapons.filter(record => record.warscrollId === 'W1~KHZ')).toHaveLength(1)
    expect(result.warscrollAbilities.filter(record => record.warscrollId === 'W1~KHZ')).toHaveLength(1)
    expect(result.factions.find(faction => faction.id === 'KHZ')!.meta.rulesContextKinds).toEqual([
      'legends',
      'standard',
    ])
  })

  it('adds an officially sourced rule to a copied group only', () => {
    const result = applyFactionVariants(
      dataset(),
      [variant(sid('aor'))],
      [
        {
          factionId: 'KHZ',
          groupSourceRecordId: sid('traits'),
          name: 'BLAZING VENGEANCE',
          timing: 'Passive',
          effect: 'Each time a friendly DROTHKEEPERS MONSTER is slain, give 1 grudge mark.',
          reason: 'Armies of Renown page 3',
          officialSourceRecordIds: [official],
        },
      ]
    )
    const added = result.factionAbilities.find(ability => ability.name === 'BLAZING VENGEANCE')!
    expect(added).toMatchObject({
      factionId: 'KHZ',
      subtypeId: 'S1~KHZ',
      line: '2',
      conditionHtml: 'Passive',
    })
    expect(added.meta).toMatchObject({ sourceRecordId: official, variantFactionId: 'KHZ' })
    expect(added.descriptionHtml).toBe(
      '<b>Effect:</b> Each time a friendly DROTHKEEPERS MONSTER is slain, give 1 grudge mark.'
    )
  })

  it('fails closed on a missing, repeated, self-targeted or unknown-faction variant', () => {
    expect(() => applyFactionVariants(dataset(), [variant(sid('nothing'))])).toThrow(/exactly one/)
    expect(() => applyFactionVariants(dataset(), [variant(sid('aor')), variant(sid('aor'))])).toThrow(
      /repeated/
    )
    expect(() => applyFactionVariants(dataset(), [variant(sid('aor'), 'FY')])).toThrow(/its own faction/)
    expect(() => applyFactionVariants(dataset(), [variant(sid('aor'), 'NOPE')])).toThrow(/unknown faction/)
    expect(() =>
      applyFactionVariants(
        dataset(),
        [],
        [
          {
            factionId: 'KHZ',
            groupSourceRecordId: sid('traits'),
            name: 'X',
            timing: 'Passive',
            effect: 'Y',
            reason: 'Z',
            officialSourceRecordIds: [official],
          },
        ]
      )
    ).toThrow(/copied group/)
  })

  it('keys a variant-scoped override apart from the original record', () => {
    expect(overrideKey(sid('a'))).toBe(sid('a'))
    expect(overrideKey(sid('a'), 'KHZ')).toBe(`${sid('a')}|variant:KHZ`)
    expect(overrideKey(sid('a'), 'KHZ')).not.toBe(overrideKey(sid('a')))
  })
})
