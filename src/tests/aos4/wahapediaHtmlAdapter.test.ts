import {
  artifactChecksum,
  dedupeWahapediaRegimentOfRenownPages,
  factionRootWarscrollScope,
  filterNativeWahapediaFactionWarscrolls,
  parseWahapediaFactionHtml,
  parseWahapediaFactionRootWarscrollsHtml,
  parseWahapediaRulesHtml,
  parseWahapediaWarscrollHtml,
  parseWahapediaWarscrollCollectionHtml,
  type ArtifactManifestEntry,
} from '../../aos4/data'

const warscrollHtml = (overrides: { sourceTitle?: string; health?: string; bodyCount?: number } = {}) => {
  const keywordsStrip = `
    <div class="abKeywords">
      <table><tbody><tr>
        <td class="abHeader abKeywordsBody"><span class="kwb">KEYWORDS</span></td>
        <td class="abKeywordsBodyText abNoReaction"><span class="kwb">CORE</span>, <span class="kwb">DIRTY</span> <span class="kwb">TRICK</span></td>
      </tr></tbody></table>
    </div>`
  const bodies = Array.from({ length: overrides.bodyCount ?? 1 }, (_, index) =>
    index === 0
      ? `<div class="abBody"><b>Stalwart Defenders:</b><span class="ShowFluff">Fluff.</span><p>Effect: Add 3 to this unit's control score.</p></div>${keywordsStrip}`
      : `<div class="abBody"><b>Extra Ability:</b><p>Effect: Extra.</p></div>`
  ).join('')
  return `
    <!doctype html>
    <html>
      <body>
        <span class="page_header_span2">Stormcast Eternals</span>
        <section class="datasheet">
          <a name="Liberators"></a>
          <h1 class="wsHeaderIn">Liberators</h1>
          <img class="logo3" title="${overrides.sourceTitle ?? 'Battletome: Stormcast Eternals (4th edition)'}">
          <span class="wsMove">5"</span>
          <span class="wsWounds">${overrides.health ?? '2'}</span>
          <span class="wsSave">3+</span>
          <span class="wsBravery">1</span>
          <div class="wsDescription"><em>Trusted display text is normalized later.</em></div>
          <div class="PitchedBattleProfile">
            <div>Unit Size: 5 Points: 90</div>
            <div>Base size: 40mm</div>
            <div>Can be reinforced: Yes</div>
            <div>Regiment Options: Any Stormcast Eternals</div>
          </div>
          <div class="wsTable">
            <table>
              <tr class="wsHeaderRow"><th>RANGED WEAPONS</th></tr>
              <tr class="wsDataRow">
                <td class="wsDataCell_long">Stormbolt Bow <span class="wsWeaponAbility">Crit (2 Hits)</span></td>
                <td class="wsCell">18"</td><td class="wsCell">2</td><td class="wsCell">3+</td>
                <td class="wsCell">3+</td><td class="wsCell">1</td><td class="wsCell">1</td>
              </tr>
              <tr class="wsHeaderRow"><th>MELEE WEAPONS</th></tr>
              <tr class="wsDataRow">
                <td class="wsDataCell_long">Warhammer</td>
                <td class="wsCell">2</td><td class="wsCell">3+</td><td class="wsCell">3+</td>
                <td class="wsCell">1</td><td class="wsCell">1</td>
              </tr>
            </table>
          </div>
          <div class="abHeader" bgcolor="#fff">Reaction: You declared a FIGHT ability <span class="kwb">CORE</span></div>
          ${bodies}
          <div class="wsKeywordLine1">INFANTRY, CHAMPION</div>
          <div class="wsKeywordLine2">ORDER, STORMCAST ETERNALS</div>
        </section>
      </body>
    </html>
  `
}

const input = (html: string) => {
  const bytes = new TextEncoder().encode(html)
  const artifact: ArtifactManifestEntry = {
    requestUrl: 'https://wahapedia.ru/aos4/factions/stormcast-eternals/Liberators',
    finalUrl: 'https://wahapedia.ru/aos4/factions/stormcast-eternals/Liberators',
    redirectChain: [],
    retrievedAt: '2026-07-28T00:00:00.000Z',
    adapterVersion: 'wahapedia-html/1',
    mediaType: 'text/html',
    byteLength: bytes.byteLength,
    checksum: artifactChecksum(bytes),
  }
  return { bytes, artifact }
}

const abilityCostWarscrollHtml = ({
  badge,
  condition = 'Your Hero Phase',
  keywords,
}: {
  badge?: string
  condition?: string
  keywords?: string
}) => {
  const keywordStrip = keywords
    ? `<div class="abKeywords"><span class="abKeywordsBodyText">${keywords}</span></div>`
    : ''
  const badgeCell =
    badge === undefined
      ? ''
      : `<td class="abCommandPoints"><span class="abCommandPointsN">${badge}</span></td>`
  return warscrollHtml()
    .replace(
      '<div class="abHeader" bgcolor="#fff">Reaction: You declared a FIGHT ability <span class="kwb">CORE</span></div>',
      `<table><tbody><tr><td class="abHeader" bgcolor="#fff">${condition}</td>${badgeCell}</tr></tbody></table>`
    )
    .replace(/<div class="abKeywords">[\s\S]*?<\/div>/, keywordStrip)
}

describe('Wahapedia warscroll HTML decoding', () => {
  it('decodes a warscroll into provider records with stable section provenance', () => {
    const source = input(warscrollHtml())
    const first = parseWahapediaWarscrollHtml(source)
    const second = parseWahapediaWarscrollHtml(source)

    expect(first).toEqual(second)
    expect(first.diagnostics).toEqual([])
    expect(first.page).toMatchObject({
      name: 'Liberators',
      factionName: 'Stormcast Eternals',
      context: 'standard',
      characteristics: {
        move: '5"',
        health: '2',
        save: '3+',
        control: '1',
      },
      unitSize: 5,
      points: 90,
      baseSizes: ['40mm'],
      regimentOptions: ['Any Stormcast Eternals'],
      canBeReinforced: true,
      keywords: ['INFANTRY', 'CHAMPION', 'ORDER', 'STORMCAST ETERNALS'],
    })
    expect(first.page?.weapons).toEqual([
      expect.objectContaining({
        name: 'Stormbolt Bow',
        range: '18"',
        attacks: '2',
        hit: '3+',
        wound: '3+',
        rend: '1',
        damage: '1',
        weaponType: 'RANGED',
        abilitiesHtml: 'Crit (2 Hits)',
      }),
      expect.objectContaining({
        name: 'Warhammer',
        range: '',
        attacks: '2',
        weaponType: 'MELEE',
      }),
    ])
    expect(first.page?.abilities).toEqual([
      expect.objectContaining({
        name: 'Stalwart Defenders',
        isReaction: true,
        // From the KEYWORDS strip after the body — not the header's keyword mentions.
        keywordsHtml: 'CORE, DIRTY TRICK',
        descriptionHtml: expect.not.stringContaining('ShowFluff'),
      }),
    ])
    expect(first.page?.meta).toMatchObject({
      artifactId: `artifact:sha256:${source.artifact.checksum}`,
      section: 'datasheet:Liberators/warscroll',
      recordChecksum: expect.stringMatching(/^[0-9a-f]{64}$/),
    })
    expect(String(first.page?.weapons[0].meta.sourceRecordId)).toContain('weapon%3A1')
    expect(String(first.page?.abilities[0].meta.sourceRecordId)).toContain('ability%3A1')
  })

  describe('ability cost badges', () => {
    it.each([
      ['1', undefined, 'Command', '1'],
      ['2', 'COMMAND', 'Command', '2'],
      ['7', 'SPELL, UNLIMITED', 'Spell', '7'],
      ['4', 'PRAYER', 'Prayer', '4'],
    ])('decodes a %s badge with %s keywords as %s points', (badge, keywords, pointsType, points) => {
      const result = parseWahapediaWarscrollHtml(input(abilityCostWarscrollHtml({ badge, keywords })))

      expect(result.diagnostics).toEqual([])
      expect(result.page?.abilities[0]).toMatchObject({ pointsType, points })
    })

    it.each([
      ['Spell (6)', 'Spell', '6'],
      ['Prayer (3)', 'Prayer', '3'],
    ])('preserves textual %s cost evidence without a badge', (condition, pointsType, points) => {
      const result = parseWahapediaWarscrollHtml(input(abilityCostWarscrollHtml({ condition })))

      expect(result.diagnostics).toEqual([])
      expect(result.page?.abilities[0]).toMatchObject({ pointsType, points })
    })

    it('uses matching textual evidence to classify a badge without a keyword strip', () => {
      const result = parseWahapediaWarscrollHtml(
        input(abilityCostWarscrollHtml({ badge: '7', condition: 'Spell (7)' }))
      )

      expect(result.diagnostics).toEqual([])
      expect(result.page?.abilities[0]).toMatchObject({ pointsType: 'Spell', points: '7' })
    })

    it('ignores a tooltip badge outside the current ability header row', () => {
      const html = abilityCostWarscrollHtml({ badge: '1' }).replace(
        '<span class="wsMove">',
        '<div class="tooltip"><span class="abCommandPointsN">9</span></div><span class="wsMove">'
      )
      const result = parseWahapediaWarscrollHtml(input(html))

      expect(result.diagnostics).toEqual([])
      expect(result.page?.abilities[0]).toMatchObject({ pointsType: 'Command', points: '1' })
    })

    it.each(['', '0', '-1', '1.5', 'one'])('rejects the malformed or non-positive badge value %j', badge => {
      const result = parseWahapediaWarscrollHtml(input(abilityCostWarscrollHtml({ badge })))

      expect(result.diagnostics).toEqual([])
      expect(result.page?.abilities[0]).toMatchObject({ pointsType: '', points: '' })
    })

    it('does not use textual fallback when a malformed badge is present', () => {
      const result = parseWahapediaWarscrollHtml(
        input(abilityCostWarscrollHtml({ badge: '0', condition: 'Spell (7)' }))
      )

      expect(result.diagnostics).toEqual([])
      expect(result.page?.abilities[0]).toMatchObject({ pointsType: '', points: '' })
    })

    it.each([
      ['6', 'Spell (7)', 'SPELL'],
      ['7', 'Spell (7)', 'PRAYER'],
    ])(
      'fails closed when badge %s conflicts with textual condition %s and keywords %s',
      (badge, condition, keywords) => {
        const result = parseWahapediaWarscrollHtml(
          input(abilityCostWarscrollHtml({ badge, condition, keywords }))
        )

        expect(result.diagnostics).toEqual([])
        expect(result.page?.abilities[0]).toMatchObject({ pointsType: '', points: '' })
      }
    )
  })

  it.each([
    ['Scourge of Aqshy - Stormcast Eternals (4th edition)', 'seasonal'],
    ['Scourge of Ghyran - Stormcast Eternals (4th edition)', 'historical'],
    ['Spearhead: Stormcast Eternals', 'spearhead'],
    ['Legends Warscrolls (4th edition)', 'legends'],
  ])('classifies %s as %s context', (sourceTitle, context) => {
    expect(parseWahapediaWarscrollHtml(input(warscrollHtml({ sourceTitle }))).page?.context).toBe(context)
  })

  it('retains a partial provider record but emits blocking shape diagnostics', () => {
    const html = warscrollHtml({ health: '', bodyCount: 2 }).replace('<td class="wsCell">18"</td>', '')
    const result = parseWahapediaWarscrollHtml(input(html))

    expect(result.page).toBeDefined()
    expect(result.diagnostics).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          code: 'missing-characteristic',
          severity: 'error',
          section: 'health',
        }),
        expect.objectContaining({ code: 'malformed-weapon-row', severity: 'error' }),
        expect.objectContaining({ code: 'ability-pair-mismatch', severity: 'error' }),
      ])
    )
  })

  it('decodes collated faction pages into independently scoped warscroll records', () => {
    const firstSheet = warscrollHtml().match(/<section class="datasheet">[\s\S]*?<\/section>/)?.[0]
    expect(firstSheet).toBeDefined()
    const secondSheet = firstSheet!.replaceAll('Liberators', 'Vigilors')
    const collection = `
      <html><body>
        <span class="page_header_span2">Stormcast Eternals</span>
        ${firstSheet}
        ${secondSheet}
      </body></html>
    `
    const source = input(collection)
    const result = parseWahapediaWarscrollCollectionHtml(source)

    expect(result.diagnostics).toEqual([])
    expect(result.pages.map(page => page.name)).toEqual(['Liberators', 'Vigilors'])
    expect(result.pages[0].meta.section).toBe('datasheet:Liberators/warscroll')
    expect(result.pages[1].meta.section).toBe('datasheet:Vigilors/warscroll')
    expect(result.pages[0].meta.sourceRecordId).not.toBe(result.pages[1].meta.sourceRecordId)
    const injected = {
      ...result.pages[0],
      keywords: result.pages[0].keywords.map(keyword =>
        keyword === 'STORMCAST ETERNALS' ? 'SYLVANETH' : keyword
      ),
    }
    expect(filterNativeWahapediaFactionWarscrolls([result.pages[0], injected])).toEqual([result.pages[0]])
    const nativeChild = {
      ...result.pages[0],
      externalId: 'Ironsunz:Liberators',
      parentExternalId: 'Ironsunz',
    }
    const nativeGroup = {
      ...result.pages[0],
      recordKind: 'content-group' as const,
      externalId: 'Ironsunz',
      keywords: [],
    }
    expect(filterNativeWahapediaFactionWarscrolls([nativeGroup, nativeChild, injected])).toEqual([
      nativeGroup,
      nativeChild,
    ])

    const singlePageResult = parseWahapediaWarscrollHtml(source)
    expect(singlePageResult.page).toBeUndefined()
    expect(singlePageResult.diagnostics).toContainEqual(
      expect.objectContaining({ code: 'not-warscroll-page', severity: 'error' })
    )
  })

  it('gives embedded Spearhead warscrolls stable group-scoped identities', () => {
    const sheet = warscrollHtml()
      .match(/<section class="datasheet">[\s\S]*?<\/section>/)?.[0]
      ?.replace('<a name="Liberators"></a>', '')
      .replace(
        '<h1 class="wsHeaderIn">',
        '<div class="nails-header">SPEARHEAD WARSCROLL</div><h1 class="wsHeaderIn">'
      )
    expect(sheet).toBeDefined()
    const source = input(`
      <html><body>
        <span class="page_header_span">Stormcast Eternals</span>
        <a name="Vigilant-Brotherhood"></a><h2>Vigilant Brotherhood</h2>
        ${sheet}
      </body></html>
    `)
    source.artifact.requestUrl = 'https://wahapedia.ru/aos4/factions/stormcast-eternals/'
    source.artifact.finalUrl = source.artifact.requestUrl

    const result = parseWahapediaWarscrollCollectionHtml(source)

    expect(result.diagnostics).toEqual([])
    expect(result.pages[0]).toMatchObject({
      recordKind: 'content-group',
      externalId: 'Vigilant-Brotherhood',
      name: 'Vigilant Brotherhood',
      context: 'spearhead',
    })
    expect(result.pages[1]).toMatchObject({
      externalId: 'Vigilant-Brotherhood:Liberators',
      parentExternalId: 'Vigilant-Brotherhood',
      parentName: 'Vigilant Brotherhood',
      context: 'spearhead',
      sourceUrl: 'https://wahapedia.ru/aos4/factions/stormcast-eternals/#Vigilant-Brotherhood%3ALiberators',
    })
  })

  it('fails closed for invalid UTF-8 and non-warscroll pages', () => {
    expect(
      parseWahapediaWarscrollHtml({
        bytes: new Uint8Array([0xff]),
        artifact: {
          ...input('').artifact,
          byteLength: 1,
          checksum: 'f'.repeat(64),
        },
      })
    ).toEqual({
      diagnostics: [expect.objectContaining({ code: 'invalid-utf8', severity: 'error' })],
    })

    const result = parseWahapediaWarscrollHtml(input('<html><body>Not a warscroll</body></html>'))
    expect(result.page).toBeUndefined()
    expect(result.diagnostics).toContainEqual(
      expect.objectContaining({ code: 'not-warscroll-page', severity: 'error' })
    )
  })

  it('decodes grouped faction rules while separating current, seasonal, historical, and Spearhead contexts', () => {
    const ability = (timing: string, name: string) => `
      <table><tr><td class="abHeader">${timing}</td></tr></table>
      <div class="abBody"><b>${name}:</b><span class="ShowFluff">Fluff.</span><b>Effect:</b> Resolve ${name}.</div>
    `
    const source = input(`
      <html><body>
        <h1 class="page_header"><span class="page_header_span">Stormcast Eternals</span></h1>
        <a name="Faction-Rules"></a><h2>Faction Rules</h2>
        <a name="Battle-Traits"></a><h2>Battle Traits</h2>
        ${ability('Your Hero Phase', 'Their Finest Hour')}
        <a name="Heroic-Traits"></a><h2>Heroic Traits</h2>
        <a name="Aspects-of-Azyr"></a><h3>Aspects of Azyr</h3>
        ${ability('Passive', 'Shock and Awe')}
        <a name="Stormforged-Qualities"></a>
        <h3><img title="Expansion. Scourge of Ghyran - Stormcast Eternals (4th edition)">Stormforged Qualities</h3>
        ${ability('Passive', 'Old Season Rule')}
        <a name="Scars-of-War"></a>
        <h2><img title="Expansion. Scourge of Aqshy - Stormcast Eternals (4th edition)">Scars of War</h2>
        ${ability('Passive', 'Current Season Rule')}
        <div class="sLegendary">
          <a name="Astral-Templars"></a><h2>Astral Templars</h2>
          ${ability('Passive', 'Legendary Rule')}
        </div>
        <div class="sShowPathToGlory">
          <a name="PATH-TO-GLORY"></a><h2>PATH TO GLORY</h2>
          <a name="Path-Upgrades"></a><h3>Path Upgrades</h3>
          ${ability('Passive', 'Campaign Rule')}
        </div>
        <a name="SPEARHEAD"></a><h2>SPEARHEAD</h2>
        <a name="Vigilant-Brotherhood"></a>
        <h2><img title="Expansion. Spearhead: Stormcast Eternals (4th edition)">Vigilant Brotherhood</h2>
        <a name="Regiment-Abilities"></a><h3>Regiment Abilities</h3>
        ${ability('Your Movement Phase', 'Call for Reinforcements')}
      </body></html>
    `)
    source.artifact.requestUrl = 'https://wahapedia.ru/aos4/factions/stormcast-eternals/'
    source.artifact.finalUrl = source.artifact.requestUrl

    const first = parseWahapediaFactionHtml(source)
    const second = parseWahapediaFactionHtml(source)

    expect(first).toEqual(second)
    expect(first.diagnostics).toEqual([])
    expect(first.page?.factionName).toBe('Stormcast Eternals')
    expect(first.page?.groups).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ externalId: 'Battle-Traits', context: 'standard' }),
        expect.objectContaining({
          externalId: 'Aspects-of-Azyr',
          parentExternalId: 'Heroic-Traits',
          context: 'standard',
        }),
        expect.objectContaining({
          externalId: 'Stormforged-Qualities',
          context: 'historical',
        }),
        expect.objectContaining({ externalId: 'Scars-of-War', context: 'seasonal' }),
        expect.objectContaining({ externalId: 'Astral-Templars', context: 'legends' }),
        expect.objectContaining({
          externalId: 'Regiment-Abilities',
          context: 'spearhead',
        }),
      ])
    )
    expect(first.page?.abilities.map(record => [record.name, record.context])).toEqual([
      ['Their Finest Hour', 'standard'],
      ['Shock and Awe', 'standard'],
      ['Old Season Rule', 'historical'],
      ['Current Season Rule', 'seasonal'],
      ['Legendary Rule', 'legends'],
      ['Call for Reinforcements', 'spearhead'],
    ])
    expect(first.page?.abilities.some(record => record.name === 'Campaign Rule')).toBe(false)
  })

  it('captures the page’s own Army of Renown classification without changing record identity', () => {
    const ability = (timing: string, name: string) => `
      <table><tr><td class="abHeader">${timing}</td></tr></table>
      <div class="abBody"><b>${name}:</b><b>Effect:</b> Resolve ${name}.</div>
    `
    const section = (name: string, prefix: string, intro: string) => `
      <a name="${name.replace(/ /g, '-')}"></a>${prefix}<h2>${name}</h2>
      <div class="Columns2"><div>${intro}</div></div>
      ${ability('Passive', `${name} Rule`)}
    `
    const body = `
      <html><body>
        <h1 class="page_header"><span class="page_header_span">Stormcast Eternals</span></h1>
        <a name="Faction-Rules"></a><h2>Faction Rules</h2>
        <a name="Battle-Traits"></a><h2>Battle Traits</h2>
        ${ability('Your Hero Phase', 'Their Finest Hour')}
        ${section(
          'Ruination Brotherhood',
          '<div class="h2_ArmyOfRenown">Army of Renown</div>',
          'When you pick the Stormcast Eternals faction for your army, you can choose for it to be a Ruination Brotherhood Army of Renown.'
        )}
        <div class="sLegendary">
          ${section(
            'Astral Templars',
            '',
            'You can choose for it to be an Astral Templars Army of Renown. If you do so, use the faction rules on these pages instead of the Stormcast Eternals faction rules.'
          )}
        </div>
        ${section('Scars of War', '', 'Season rules that merely mention an Army of Renown in passing.')}
      </body></html>
    `
    const source = input(body)
    source.artifact.requestUrl = 'https://wahapedia.ru/aos4/factions/stormcast-eternals/'
    source.artifact.finalUrl = source.artifact.requestUrl

    const result = parseWahapediaFactionHtml(source)
    expect(result.diagnostics).toEqual([])
    const groupByExternalId = new Map(result.page?.groups.map(group => [group.externalId, group]))
    // The marker div classifies current sections; the replace-rules intro classifies Legends ones.
    expect(groupByExternalId.get('Ruination-Brotherhood')?.armyOfRenown).toBe(true)
    expect(groupByExternalId.get('Astral-Templars')?.armyOfRenown).toBe(true)
    // A passing mention without the replace-rules sentence is not a classification.
    expect(groupByExternalId.get('Scars-of-War')?.armyOfRenown).toBeUndefined()
    expect(groupByExternalId.get('Battle-Traits')?.armyOfRenown).toBeUndefined()
    // The flag is derived from page structure, never part of the hashed record value: the record
    // checksum of a marked group equals the checksum of the same value fields without the flag.
    const marked = groupByExternalId.get('Ruination-Brotherhood')!
    const unmarkedTwin = groupByExternalId.get('Scars-of-War')!
    expect(Object.keys(marked.meta)).toEqual(Object.keys(unmarkedTwin.meta))
  })

  it('decodes universal rules without retaining example-only ability cards', () => {
    const ability = (timing: string, name: string) => `
      <table><tr><td class="abHeader">${timing}</td></tr></table>
      <div class="abBody"><b>${name}:</b><span class="ShowFluff">Fluff.</span><b>Effect:</b> Resolve ${name}.</div>
    `
    const source = input(`
      <html><body>
        <h1 class="page_header"><span class="page_header_span">The Core Rules</span></h1>
        <a name="Universal-Core-Abilities"></a><h2>14.0 Universal Core Abilities</h2>
        <a name="Movement-Phase"></a><h3>14.1 Movement Phase</h3>
        ${ability('Your Movement Phase', 'Normal Move')}
        <a name="Abilities-Example"></a><h3>Abilities Example</h3>
        ${ability('Any Combat Phase', 'Example Fight')}
        <a name="ADVANCED-RULES-2026-27"></a><h3>ADVANCED RULES 2026-27</h3>
        <a name="Hero-Phase-Commands"></a><h2>2.0 Hero Phase Commands</h2>
        ${ability('Any Hero Phase', 'Rally')}
      </body></html>
    `)
    source.artifact.requestUrl = 'https://wahapedia.ru/aos4/the-rules/the-core-rules/'
    source.artifact.finalUrl = source.artifact.requestUrl

    const first = parseWahapediaRulesHtml(source)
    const second = parseWahapediaRulesHtml(source)

    expect(first).toEqual(second)
    expect(first.diagnostics).toEqual([])
    expect(first.page?.title).toBe('The Core Rules')
    expect(first.page?.abilities.map(record => [record.name, record.context])).toEqual([
      ['Normal Move', 'standard'],
      ['Rally', 'seasonal'],
    ])
    expect(first.page?.groups).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          externalId: 'Universal-Core-Abilities',
          context: 'standard',
        }),
        expect.objectContaining({
          externalId: 'Movement-Phase',
          parentExternalId: 'Universal-Core-Abilities',
          context: 'standard',
        }),
        expect.objectContaining({
          externalId: 'Hero-Phase-Commands',
          context: 'seasonal',
        }),
      ])
    )
  })

  it('retains a page-level record for a rules source with no ability cards', () => {
    const source = input(`
      <html><body>
        <h1 class="page_header"><span class="page_header_span">First Blood</span></h1>
        <a name="Battleplan"></a><h2>Battleplan</h2>
        <p>This source is still material review evidence.</p>
      </body></html>
    `)
    source.artifact.requestUrl = 'https://wahapedia.ru/aos4/the-rules/first-blood/'
    source.artifact.finalUrl = source.artifact.requestUrl

    const result = parseWahapediaRulesHtml(source)

    expect(result.diagnostics).toEqual([])
    expect(result.page).toMatchObject({
      title: 'First Blood',
      context: 'standard',
      groups: [],
      abilities: [],
      meta: expect.objectContaining({ section: 'rules-page' }),
    })
  })

  /**
   * The manifestation index page shape (issue #1791).
   *
   * `factions/endless-spells/` is not a battletome root: it has no `Faction Rules` heading, it
   * carries every one of its warscrolls itself because Wahapedia publishes no `warscrolls.html`
   * for it, and it anchors both its lore index and its warscroll sections to the same six names.
   * The page decoded to nothing for months behind an exemption that named it, so this pins the
   * shape rather than the outcome.
   */
  const manifestationIndexHtml = `
    <html><body>
      <h1 class="page_header"><span class="page_header_span">Endless Spells</span></h1>
      <a name="Books"></a><h2>Books</h2>
      <a name="Manifestation-Lore"></a><h2>Manifestation Lore</h2>
      <a name="Morbid-Conjuration"></a><h3>Morbid Conjuration</h3>
      <table><tr><td class="abHeader">Your Hero Phase</td></tr></table>
      <div class="abBody"><b>SUMMON PURPLE SUN OF SHYISH:</b><b>Effect:</b> Set it up.</div>
      <a name="Morbid-Conjuration"></a><h2>Morbid Conjuration</h2>
      <section class="datasheet">
        <a name="Purple-Sun-of-Shyish"></a>
        <div class="nails-header">•ENDLESS SPELLS WARSCROLL•</div>
        <h1 class="wsHeaderIn">Purple Sun of Shyish</h1>
        <span class="wsMove">10"</span><span class="wsWounds">1</span>
        <span class="wsSave">-</span><span class="wsBravery">-</span>
        <div class="abHeader">Passive</div>
        <div class="abBody"><b>MALIGNANT PATH:</b><b>Effect:</b> Roll a dice.</div>
        <div class="wsKeywordLine1">MANIFESTATION, ENDLESS SPELL</div>
      </section>
    </body></html>
  `

  const manifestationIndexSource = () => {
    const source = input(manifestationIndexHtml)
    source.artifact.requestUrl = 'https://wahapedia.ru/aos4/factions/endless-spells/'
    source.artifact.finalUrl = source.artifact.requestUrl
    return source
  }

  it('decodes a manifestation index page into lores and their warscrolls', () => {
    const source = manifestationIndexSource()

    const faction = parseWahapediaFactionHtml(source)

    expect(faction.diagnostics).toEqual([])
    // The lore index, not the identically anchored warscroll section, and not `Books`.
    expect(faction.page?.groups.map(group => [group.externalId, group.parentExternalId])).toEqual([
      ['Manifestation-Lore', undefined],
      ['Morbid-Conjuration', 'Manifestation-Lore'],
    ])
    // The summoning spell belongs to the lore; the warscroll's own ability does not.
    expect(faction.page?.abilities.map(ability => ability.name)).toEqual(['SUMMON PURPLE SUN OF SHYISH'])

    const warscrolls = parseWahapediaFactionRootWarscrollsHtml(
      source,
      factionRootWarscrollScope(source.artifact.finalUrl, [source.artifact.finalUrl])
    )

    expect(warscrolls.pages.map(page => [page.recordKind, page.name])).toEqual([
      ['warscroll', 'Purple Sun of Shyish'],
    ])
    expect(warscrolls.pages[0].abilities.map(ability => ability.name)).toEqual(['MALIGNANT PATH'])
  })

  it('takes only Spearhead warscrolls from a faction root that has a collection page', () => {
    const source = manifestationIndexSource()
    const scope = factionRootWarscrollScope(source.artifact.finalUrl, [
      source.artifact.finalUrl,
      'https://wahapedia.ru/aos4/factions/endless-spells/warscrolls.html',
    ])

    expect(scope).toEqual('spearhead')
    expect(parseWahapediaFactionRootWarscrollsHtml(source, scope).pages).toEqual([])
  })

  it('fails a faction page that decodes to no rules, whatever the faction is called', () => {
    const source = input(`
      <html><body>
        <h1 class="page_header"><span class="page_header_span">Endless Spells</span></h1>
        <a name="Books"></a><h2>Books</h2>
      </body></html>
    `)
    source.artifact.requestUrl = 'https://wahapedia.ru/aos4/factions/endless-spells/'
    source.artifact.finalUrl = source.artifact.requestUrl

    expect(parseWahapediaFactionHtml(source).diagnostics).toContainEqual(
      expect.objectContaining({ code: 'not-faction-page', severity: 'error' })
    )
  })
})

describe('Regiment of Renown datasheets (issue #1858)', () => {
  const regimentSheet = (
    overrides: { anchor?: string; name?: string; effect?: string; inclusion?: string[] } = {}
  ) => {
    const anchor = overrides.anchor ?? 'Lord-Skaldior-s-Chosen'
    const name = overrides.name ?? 'Lord Skaldior’s Chosen'
    const inclusion = overrides.inclusion ?? ['Blades of Khorne', 'Skaven']
    return `
      <section class="datasheet">
        <a name="${anchor}"></a>
        <div class="wsHeader_short">
          <div class="nails-header"><span class="nails">•</span>REGIMENT OF RENOWN<span class="nails">•</span></div>
          <h1 class="wsHeaderIn">${name}</h1>
        </div>
        <div>
          <div class="wsAbilityHeader">INCLUSION</div>
          This Regiment of Renown can be included in armies from the following factions:
          <ul>${inclusion.map(faction => `<li><a href="/aos4/factions/x">${faction}</a></li>`).join('')}</ul>
        </div>
        <div>
          <div class="wsAbilityHeader">ORGANISATION</div>
          <ul class="wsOrgList"><li>1 <a href="/aos4/factions/slaves-to-darkness/warscrolls.html#Chaos-Knights">Chaos Knights</a> unit with 5 models.</li></ul>
        </div>
        <div class="PitchedBattleProfile">
          <div class="wsAbilityHeader">BATTLE PROFILE</div>
          <div>Points: 530</div>
        </div>
        <div class="abHeader" bgcolor="#000000">Passive</div>
        <div class="abBody"><b>IRONCLAD DESPOILERS:</b><span class="ShowFluff">Fluff.</span><div><b>Effect:</b> ${
          overrides.effect ?? 'Add 1 to save rolls for units in this Regiment of Renown.'
        }</div></div>
      </section>
    `
  }
  const collectionInput = (
    sheets: string,
    faction = 'Skaven',
    url = 'https://wahapedia.ru/aos4/factions/skaven/warscrolls.html'
  ) => {
    const source = input(`
      <html><body>
        <span class="page_header_span2">${faction}</span>
        ${sheets}
      </body></html>
    `)
    source.artifact.requestUrl = url
    source.artifact.finalUrl = url
    return source
  }

  it('decodes the marker, inclusion factions, and member links, and the native filter keeps the sheet', () => {
    const result = parseWahapediaWarscrollCollectionHtml(collectionInput(regimentSheet()))
    expect(result.diagnostics).toEqual([])
    expect(result.pages).toHaveLength(1)
    const page = result.pages[0]
    expect(page).toMatchObject({
      recordKind: 'content-group',
      name: 'Lord Skaldior’s Chosen',
      points: 530,
      regimentOfRenown: {
        inclusionFactionNames: ['Blades of Khorne', 'Skaven'],
        members: [
          {
            name: 'Chaos Knights',
            href: '/aos4/factions/slaves-to-darkness/warscrolls.html#Chaos-Knights',
          },
        ],
      },
    })
    expect(page.abilities.map(ability => ability.name)).toEqual(['IRONCLAD DESPOILERS'])
    // A regiment has no keyword line, so only the marker keeps it through the native filter.
    expect(filterNativeWahapediaFactionWarscrolls([page])).toEqual([page])
    expect(filterNativeWahapediaFactionWarscrolls([{ ...page, regimentOfRenown: undefined }])).toEqual([])
  })

  it('collapses identical copies to the smallest source URL without diagnostics', () => {
    const khorne = parseWahapediaWarscrollCollectionHtml(
      collectionInput(
        regimentSheet(),
        'Blades of Khorne',
        'https://wahapedia.ru/aos4/factions/blades-of-khorne/warscrolls.html'
      )
    ).pages[0]
    const skaven = parseWahapediaWarscrollCollectionHtml(collectionInput(regimentSheet())).pages[0]
    const bystander = parseWahapediaWarscrollCollectionHtml(collectionInput(regimentSheet())).pages[0]

    const result = dedupeWahapediaRegimentOfRenownPages([skaven, khorne])
    expect(result.diagnostics).toEqual([])
    expect(result.pages).toEqual([khorne])
    // Non-regiment pages pass through untouched.
    const passthrough = { ...bystander, regimentOfRenown: undefined }
    expect(dedupeWahapediaRegimentOfRenownPages([passthrough, khorne]).pages).toEqual([passthrough, khorne])
  })

  it('keeps the majority variant when copies disagree on rules text, and surfaces the drift', () => {
    const urlFor = (faction: string) => `https://wahapedia.ru/aos4/factions/${faction}/warscrolls.html`
    const copy = (faction: string, effect?: string) =>
      parseWahapediaWarscrollCollectionHtml(
        collectionInput(regimentSheet(effect ? { effect } : {}), faction, urlFor(faction))
      ).pages[0]
    const majorityA = copy('blades-of-khorne')
    const majorityB = copy('skaven')
    const divergent = copy('maggotkin-of-nurgle', 'Add 1 to save rolls for non-INFANTRY units.')

    const result = dedupeWahapediaRegimentOfRenownPages([divergent, majorityB, majorityA])
    expect(result.pages).toEqual([majorityA])
    expect(result.diagnostics).toEqual([
      expect.objectContaining({
        code: 'regiment-of-renown-variant',
        severity: 'warning',
        url: majorityA.sourceUrl,
        message: expect.stringContaining('2 conflicting variants across 3 collection copies'),
      }),
    ])
  })
})
