import type { Aos4Catalog, CanonicalId, ContentEntity } from '../../aos4/domain'
import {
  REPRESENTATIVE_CATALOG,
  REPRESENTATIVE_CONTEXT_ID,
  REPRESENTATIVE_EXPLICIT_SELECTION_IDS,
  REPRESENTATIVE_IDS,
} from '../../aos4/generated'
import { createAos4PrintDocument } from '../../aos4/print'
import { createAos4ArmyDocument } from '../../aos4/state'
import { AOS4_RULES_UNAVAILABLE_MESSAGE, createAos4BuilderViewModel } from '../../aos4/view'
import { describe, expect, it } from 'vitest'

/*
 * While a rules source is withdrawn (#1757), an army that fields a profile-only unit, belongs to a
 * faction with unavailable rules, or holds set-aside selections says so; any other army does not.
 */
const liberatorsId = REPRESENTATIVE_IDS.warscrolls.liberators
const affectedCatalog: Aos4Catalog = {
  ...REPRESENTATIVE_CATALOG,
  entities: REPRESENTATIVE_CATALOG.entities.map((entity): ContentEntity => {
    if (entity.id === liberatorsId && entity.kind === 'warscroll') {
      return { ...entity, rulesAvailability: 'profile-only' }
    }
    if (entity.id === REPRESENTATIVE_IDS.faction && entity.kind === 'faction') {
      return { ...entity, unavailableRules: ['Battle traits', 'Heroic traits'] }
    }
    return entity
  }),
}

const createDocument = (unavailableSelectionIds?: CanonicalId[]) =>
  createAos4ArmyDocument({
    id: 'army:notice',
    name: 'Notice Test',
    rulesContextId: REPRESENTATIVE_CONTEXT_ID,
    explicitSelectionIds: REPRESENTATIVE_EXPLICIT_SELECTION_IDS,
    ...(unavailableSelectionIds ? { unavailableSelectionIds } : {}),
  })

describe('rules availability notice (#1757)', () => {
  it('is absent for an unaffected army', () => {
    const builder = createAos4BuilderViewModel(REPRESENTATIVE_CATALOG, createDocument())

    expect(builder.rulesNotice).toBeUndefined()
    expect(builder.options.some(option => option.profileOnly)).toBe(false)
  })

  it('lists profile-only units, faction rules, and set-aside selections', () => {
    const builder = createAos4BuilderViewModel(
      affectedCatalog,
      createDocument(['warscroll:gone-1' as CanonicalId, 'warscroll:gone-2' as CanonicalId])
    )
    const liberators = affectedCatalog.entities.find(entity => entity.id === liberatorsId)!

    expect(builder.rulesNotice).toEqual({
      message: AOS4_RULES_UNAVAILABLE_MESSAGE,
      affected: [
        `Units without rules: ${liberators.name}`,
        'Faction rules unavailable: Battle traits; Heroic traits',
        '2 saved selections are temporarily unavailable',
      ],
    })
    expect(builder.options.filter(option => option.profileOnly).map(option => option.id)).toEqual([
      liberatorsId,
    ])
  })

  it('shows for set-aside selections alone', () => {
    const builder = createAos4BuilderViewModel(
      REPRESENTATIVE_CATALOG,
      createDocument(['warscroll:gone-1' as CanonicalId])
    )

    expect(builder.rulesNotice?.affected).toEqual(['1 saved selection is temporarily unavailable'])
  })

  it('prints first on an affected sheet and leaves an unaffected sheet unchanged', () => {
    const reminder = {
      id: 'a',
      name: 'Rule',
      windowKey: 'hero-phase',
      windowLabel: 'Hero Phase',
      typeLabel: 'Active',
      effect: 'Effect',
      hidden: false,
    }
    const army = { armyName: 'Army', factionName: 'Faction', warscrolls: [{ name: 'Unit' }] }
    const rulesNotice = { message: AOS4_RULES_UNAVAILABLE_MESSAGE, affected: ['Units without rules: Unit'] }

    const unaffected = createAos4PrintDocument([reminder], army)
    const affected = createAos4PrintDocument([reminder], { ...army, rulesNotice })

    expect(unaffected.sections.map(section => section.key)).toEqual(['hero-phase'])
    expect(affected.sections.map(section => section.key)).toEqual(['rules-availability', 'hero-phase'])
    expect(affected.sections[0].rules[0].paragraphs.map(paragraph => paragraph.text)).toEqual([
      AOS4_RULES_UNAVAILABLE_MESSAGE,
      'Units without rules: Unit',
    ])
    expect({ ...affected, sections: affected.sections.slice(1) }).toEqual(unaffected)
  })
})
