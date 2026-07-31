import { decodeAos4TextRoster } from '../../importers'
import { readOfficialAppFixture as fixture } from '../support/officialAppFixtures'

describe('official AoS app text import', () => {
  it('decodes current app output into provider-neutral composition selections', () => {
    const result = decodeAos4TextRoster(fixture('ser-001-current-format'))

    expect(result.diagnostics).toEqual([])
    expect(result.parsedRoster).toMatchObject({
      source: 'official-app-text',
      proposedName: 'Sunhost',
      declaredFaction: 'Seraphon',
      declaredContext: "General's Handbook 2026-27",
    })
    expect(result.parsedRoster?.selections).toEqual([
      { line: 3, label: 'Thunderquake Starhost', kindHint: 'battle-formation' },
      { line: 6, label: 'Lore of Primal Jungles', kindHint: 'spell-lore' },
      { line: 9, label: 'Slann Starmaster', kindHint: 'warscroll' },
      { line: 11, label: 'Coatl Familiar', kindHint: 'enhancement' },
      { line: 12, label: 'Saurus Warriors', kindHint: 'warscroll', count: 2 },
      { line: 15, label: 'Realmshaper Engine', kindHint: 'warscroll' },
    ])
  })

  it('supports the exported-version footer, CRLF, pipe headers, and regiments of renown', () => {
    const result = decodeAos4TextRoster(fixture('sce-001-exported-version-format').replace(/\n/g, '\r\n'))

    expect(result.diagnostics).toEqual([])
    expect(result.parsedRoster).toMatchObject({
      source: 'official-app-text',
      proposedName: 'Skyhammer',
      declaredFaction: 'Stormcast Eternals',
    })
    expect(result.parsedRoster?.declaredContext).toBeUndefined()
    expect(result.parsedRoster?.selections).toEqual([
      {
        line: 2,
        label: 'Sentinels of the Bleak Citadels',
        kindHint: 'battle-formation',
      },
      { line: 6, label: 'Knight-Vexillor', kindHint: 'warscroll' },
      { line: 8, label: 'Mirrorshield', kindHint: 'enhancement' },
      { line: 9, label: 'Annihilators', kindHint: 'warscroll', count: 3 },
      // Dashed members are regiment of renown content too, and carry the cross-faction flag.
      { line: 13, label: 'Freeguild Fusiliers', kindHint: 'warscroll', isRegimentOfRenown: true },
      { line: 14, label: 'Freeguild Marshal', kindHint: 'warscroll', isRegimentOfRenown: true },
    ])
    expect(result.parsedRoster?.selections.map(selection => selection.label)).not.toContain(
      'The bearer shines with a rule description that is not roster composition.'
    )
  })

  describe('v1.36 export shapes', () => {
    const roster = (...body: string[]): string =>
      [
        'Test 100/2000 pts',
        ...body,
        'Created with Warhammer Age of Sigmar: The App',
        'App: v1.36.0 (1) | Data: v466',
      ].join('\n')

    const decode = (...body: string[]) => decodeAos4TextRoster(roster(...body)).parsedRoster

    const labelled = (parsed: ReturnType<typeof decode>, kind: string): string[] =>
      (parsed?.selections ?? []).filter(s => s.kindHint === kind).map(s => s.label)

    it.each([
      ['Grand Alliance Order | Cities of Sigmar | Grudgebound War Throng', 'Cities of Sigmar'],
      // No grand alliance at all — an Army of Renown declares `faction | army`.
      ["Gloomspite Gitz | Da King's Gitz", 'Gloomspite Gitz'],
      // A parent publication in front instead of a grand alliance. `Orruk Warclans` is a
      // publication and resolves against nothing; `Ironjawz` is the faction.
      ['Orruk Warclans | Ironjawz | Weirdfist', 'Ironjawz'],
      ['Grand Alliance Order | Stormcast Eternals', 'Stormcast Eternals'],
    ])('reads the faction from the tail of the header %s', (header, faction) => {
      expect(decode(header)?.declaredFaction).toBe(faction)
    })

    it('never reads the pipe-delimited version footer as a header', () => {
      // `App: … | Data: …` is the only other pipe line in an export, and it sits below the
      // sections. Reading it as a faction is silent corruption, so guard it explicitly.
      const parsed = decode('Stormcast Eternals')
      expect(parsed?.declaredFaction).toBe('Stormcast Eternals')
      expect(parsed?.declaredFaction).not.toContain('|')
    })

    it('does not mistake a separator run for the faction', () => {
      expect(decode('-----', 'Stormcast Eternals', '-----')?.declaredFaction).toBe('Stormcast Eternals')
    })

    it('strips the points suffix the app now writes on battle formations', () => {
      const parsed = decode('Grand Alliance Destruction | Ogor Mawtribes | Greedy Eaters (10 Points)')
      expect(labelled(parsed, 'battle-formation')).toEqual(['Greedy Eaters'])
    })

    it('treats a • Legends bullet as a mark on the unit above, not an enhancement', () => {
      const parsed = decode(
        "Gloomspite Gitz | Da King's Gitz",
        'Regiment 1',
        'Loonboss (70)',
        '• Legends',
        'Squig Herd (100)'
      )

      expect(parsed?.allowsLegends).toBe(true)
      expect(labelled(parsed, 'enhancement')).toEqual([])
      expect(parsed?.selections).toEqual([
        expect.objectContaining({ label: "Da King's Gitz" }),
        expect.objectContaining({ label: 'Loonboss', isLegends: true }),
        expect.objectContaining({ label: 'Squig Herd' }),
      ])
      // The mark applies to the unit above it only.
      expect(parsed?.selections.find(s => s.label === 'Squig Herd')?.isLegends).toBeUndefined()
    })

    it('splits a manifestation line into one selection per manifestation', () => {
      const parsed = decode(
        'Grand Alliance Order | Cities of Sigmar | Grudgebound War Throng',
        'Manifestation Lore - Morbid Conjuration (20 Points), Forbidden Power (20 Points) and Krondspine Incarnate'
      )
      expect(labelled(parsed, 'manifestation-lore')).toEqual([
        'Morbid Conjuration',
        'Forbidden Power',
        'Krondspine Incarnate',
      ])
    })

    it('splits a spell lore row holding several picks', () => {
      // Not just manifestations — a spell lore row carries multiple lores too, with the points
      // suffix on the row rather than on each member.
      const parsed = decode(
        'Grand Alliance Order | Lumineth Realm-lords | Warhost of Duality (20 Points)',
        'Spell Lore - Lore of Hysh, Lore of the Awakened Realms and Lore of Prismatic Resonance (10 Points)'
      )
      expect(labelled(parsed, 'spell-lore')).toEqual([
        'Lore of Hysh',
        'Lore of the Awakened Realms',
        'Lore of Prismatic Resonance',
      ])
    })

    it('splits a lore row but never a unit name, in the same list', () => {
      // Both shapes appear together in a real Tzeentch export. Only lore rows are lists; a unit
      // line is one name however many conjunctions it holds.
      const parsed = decode(
        'Grand Alliance Chaos | Disciples of Tzeentch | Denizens of the Silver Towers',
        'Spell Lore - Lore of Change and Lore of Fate',
        'Auxiliary Units',
        'Blue Horrors and Brimstone Horrors (120)'
      )
      expect(labelled(parsed, 'spell-lore')).toEqual(['Lore of Change', 'Lore of Fate'])
      expect(labelled(parsed, 'warscroll')).toEqual(['Blue Horrors and Brimstone Horrors'])
    })

    it('does not split a battle formation whose own name contains "and"', () => {
      // `Pioneers and Scavengers` and `Mutants and Mad Things` are single formations. Lore rows are
      // lists; a formation row never is, so it must survive the conjunction untouched.
      const parsed = decode('Grand Alliance Chaos | Slaves to Darkness | Pioneers and Scavengers')
      expect(labelled(parsed, 'battle-formation')).toEqual(['Pioneers and Scavengers'])
    })

    it('leaves a single-valued lore and a name containing "and" intact', () => {
      const parsed = decode(
        'Grand Alliance Order | Cities of Sigmar | Grudgebound War Throng',
        'Manifestation Lore - Forbidden Power (20 Points)',
        'Spell Lore - Spells of the Collegiate Arcane'
      )
      expect(labelled(parsed, 'manifestation-lore')).toEqual(['Forbidden Power'])
      expect(labelled(parsed, 'spell-lore')).toEqual(['Spells of the Collegiate Arcane'])

      // Only the final comma segment splits on " and ", so a member whose own name contains the
      // word survives ahead of the conjunction.
      const conjoined = decode(
        'Grand Alliance Order | Cities of Sigmar | Grudgebound War Throng',
        'Manifestation Lore - Intercept and Recover, Forbidden Power and Primal Energy'
      )
      expect(labelled(conjoined, 'manifestation-lore')).toEqual([
        'Intercept and Recover',
        'Forbidden Power',
        'Primal Energy',
      ])
    })

    it('keeps bundled sub-units that share the cost of the line above', () => {
      const parsed = decode(
        'Grand Alliance Order | Cities of Sigmar | Grudgebound War Throng',
        'Regiment 1',
        'Freeguild Command Corps Adjutants (200)',
        'Freeguild Command Corps Auxiliaries',
        'Freeguild Command Corps Whisperblade',
        'Freeguild Fusiliers (120)'
      )
      expect(labelled(parsed, 'warscroll')).toEqual([
        'Freeguild Command Corps Adjutants',
        'Freeguild Command Corps Auxiliaries',
        'Freeguild Command Corps Whisperblade',
        'Freeguild Fusiliers',
      ])
    })

    it('does not read detached or sentence-shaped lines as bundled sub-units', () => {
      const parsed = decode(
        'Grand Alliance Order | Cities of Sigmar | Grudgebound War Throng',
        'Regiment 1',
        'Freeguild Fusiliers (120)',
        'The bearer shines with a rule description that is not roster composition.',
        '',
        'Detached from any unit above it'
      )
      expect(labelled(parsed, 'warscroll')).toEqual(['Freeguild Fusiliers'])
    })

    it('keeps a model count in the label but drops the points beside it', () => {
      // `Terradon Riders (2 models) (70)` carries two parenthesised suffixes. Only the points are
      // bookkeeping — the catalog ships the size variant as its own warscroll, so the count is part
      // of the identity and has to survive for the roster to pick the right one.
      const parsed = decode(
        'Grand Alliance Order | Seraphon | Sunclaw Starhost',
        'Regiment 1',
        'Terradon Riders (90)',
        'Terradon Riders (2 models) (70)'
      )
      expect(labelled(parsed, 'warscroll')).toEqual(['Terradon Riders', 'Terradon Riders (2 models)'])
    })

    it('keeps a singular model count too', () => {
      // The app writes "(1 model)", not "(1 models)", and the catalog carries the variant under
      // that exact spelling — so the singular has to survive as faithfully as the plural.
      const parsed = decode(
        "Grand Alliance Chaos | Maggotkin of Nurgle | Nurgle's Menagerie",
        'Auxiliary Units',
        'Pusgoyle Blightlords (190)',
        'Pusgoyle Blightlords (1 model) (110)'
      )
      expect(labelled(parsed, 'warscroll')).toEqual([
        'Pusgoyle Blightlords',
        'Pusgoyle Blightlords (1 model)',
      ])
    })

    it('keeps every faction terrain entry, not just the first', () => {
      const parsed = decode(
        'Grand Alliance Destruction | Ogor Mawtribes | Greedy Eaters',
        'Faction Terrain',
        'Great Mawpot',
        'Mawpit'
      )
      expect(labelled(parsed, 'warscroll')).toEqual(['Great Mawpot', 'Mawpit'])
    })

    it('reads dashless regiment of renown members and drops the bundle itself', () => {
      const parsed = decode(
        'Orruk Warclans | Ironjawz | Weirdfist',
        'Regiments of Renown',
        "Big Grikk's Kruleshots (320)",
        'Beast-skewer Killbow',
        'Man-skewer Boltboyz',
        'Big Drogg Fort-Kicka (450)',
        'Gatebreaker Mega-Gargant'
      )
      // The bundle carries the points but has no warscroll of its own.
      expect(labelled(parsed, 'warscroll')).toEqual([
        'Beast-skewer Killbow',
        'Man-skewer Boltboyz',
        'Gatebreaker Mega-Gargant',
      ])
      // Members are cross-faction by design; the flag is what lets them resolve outside Ironjawz.
      expect(
        parsed?.selections.filter(s => s.kindHint === 'warscroll').every(s => s.isRegimentOfRenown)
      ).toBe(true)
    })

    it('marks only regiment of renown members as cross-faction', () => {
      const parsed = decode(
        'Orruk Warclans | Ironjawz | Weirdfist',
        'Regiment 1',
        'Megaboss (130)',
        'Regiments of Renown',
        "Big Grikk's Kruleshots (320)",
        'Beast-skewer Killbow'
      )
      expect(parsed?.selections.find(s => s.label === 'Megaboss')?.isRegimentOfRenown).toBeUndefined()
      expect(parsed?.selections.find(s => s.label === 'Beast-skewer Killbow')?.isRegimentOfRenown).toBe(true)
    })

    it('marks faction terrain as Legends when the bullet follows it', () => {
      // A wholly retired faction marks its terrain too, so the bullet is not confined to units.
      const parsed = decode(
        'Grand Alliance Chaos | Beasts of Chaos | Marauding Brayherd',
        'Faction Terrain',
        'Herdstone',
        '• Legends'
      )
      expect(parsed?.selections.find(s => s.label === 'Herdstone')?.isLegends).toBe(true)
      expect(parsed?.allowsLegends).toBe(true)
    })

    it('decodes a roster that declares no units at all', () => {
      // An empty list has no section headers, so header detection cannot lean on finding one.
      const parsed = decode('Cities of Sigmar | Allies of the Free Cities', 'Army of Renown')

      expect(parsed?.proposedName).toBe('Test')
      expect(parsed?.declaredFaction).toBe('Cities of Sigmar')
      expect(parsed?.selections).toEqual([
        expect.objectContaining({ label: 'Allies of the Free Cities', kindHint: 'battle-formation' }),
      ])
    })

    it('ignores roster bookkeeping the app emits alongside composition', () => {
      const parsed = decode(
        "Gloomspite Gitz | Da King's Gitz",
        'Army of Renown',
        'Auxiliaries: 2 (+20 Points)',
        'Drops: 5',
        'Battle Tactics Cards: Legend of the Parch, Siege of Ashes and Smokescreen',
        'Regiment 1',
        'Loonboss (70)',
        'Auxiliary Units',
        'Madcap Shaman (80)'
      )
      expect(labelled(parsed, 'warscroll')).toEqual(['Loonboss', 'Madcap Shaman'])
      expect(parsed?.selections.map(s => s.label)).not.toContain('Army of Renown')
    })
  })

  it('rejects empty, stale, mixed, oversized, and overlong inputs without guessing a source', () => {
    const official = fixture('ser-001-current-format')
    const listbot = 'Skaven\nFormation\nGenerated by Listbot 4.0'
    const stale = 'Stormcast Eternals\nGenerated by Warscroll Builder'

    expect(decodeAos4TextRoster('').diagnostics).toContainEqual(
      expect.objectContaining({ code: 'unsupported-source', severity: 'error' })
    )
    expect(decodeAos4TextRoster(stale).diagnostics).toContainEqual(
      expect.objectContaining({ code: 'unsupported-source', severity: 'error' })
    )
    expect(decodeAos4TextRoster(`${official}\n${listbot}`).diagnostics).toContainEqual(
      expect.objectContaining({ code: 'unsupported-source', severity: 'error' })
    )
    expect(decodeAos4TextRoster(`x${'a'.repeat(1024 * 1024)}`).diagnostics).toContainEqual(
      expect.objectContaining({ code: 'input-too-large', severity: 'error' })
    )
    expect(
      decodeAos4TextRoster(Array.from({ length: 10_001 }, () => 'x').join('\n')).diagnostics
    ).toContainEqual(expect.objectContaining({ code: 'input-too-large', severity: 'error' }))
  })
})
