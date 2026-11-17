// @vitest-environment jsdom

import type { CanonicalId } from '../../aos4/domain'
import type { createAos4BuilderViewModel } from '../../aos4/view'
import RulesNotice from 'components/info/rulesNotice'
import ArmyBuilder from 'components/input/army_builder'
import { render, unmountComponentAtNode } from 'tests/support/reactTestHelpers'
import { act } from 'react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

vi.mock('context/useTheme', () => ({
  useTheme: () => ({
    theme: { card: 'card', cardBody: 'card-body', bgColor: '', text: '', selectTheme: {} },
  }),
}))
vi.mock('utils/hooks/useIsMobile', () => ({ useIsMobile: () => false }))

type Builder = ReturnType<typeof createAos4BuilderViewModel>

const unit = (name: string, profileOnly: boolean) => ({
  id: `warscroll:${name}` as CanonicalId,
  name,
  kind: 'warscroll' as const,
  selected: true,
  available: true,
  ...(profileOnly ? { profileOnly: true } : {}),
})

const builder = (options: Builder['options']) =>
  ({ options, labels: { season: 'Season', historical: 'Historical' } }) as unknown as Builder

describe('rules availability UI (#1757)', () => {
  let container: HTMLDivElement

  beforeEach(() => {
    container = document.createElement('div')
    document.body.appendChild(container)
  })

  afterEach(() => {
    act(() => {
      unmountComponentAtNode(container)
    })
    container.remove()
  })

  it('renders the warning and its affected list, and nothing without a notice', () => {
    act(() => {
      render(
        <RulesNotice notice={{ message: 'Some rules are unavailable.', affected: ['A', 'B'] }} />,
        container
      )
    })
    const alert = container.querySelector('[role="alert"]')
    expect(alert?.textContent).toContain('Some rules are unavailable.')
    expect(Array.from(container.querySelectorAll('li')).map(item => item.textContent)).toEqual(['A', 'B'])
    // Not d-print-none: a browser-printed sheet carries the warning too.
    expect(container.querySelector('.d-print-none')).toBeNull()

    act(() => {
      render(<RulesNotice />, container)
    })
    expect(container.innerHTML).toBe('')
  })

  it('badges only the profile-only unit in the Units card', () => {
    act(() => {
      render(
        <ArmyBuilder
          builder={builder([unit('Grudgebearers', true), unit('Warriors', false)])}
          onSetGroupSelections={() => {}}
        />,
        container
      )
    })
    const badges = Array.from(container.querySelectorAll('.badge'))
    expect(badges.map(badge => badge.textContent)).toEqual(['Rules unavailable'])
    expect(badges[0].parentElement?.textContent).toContain('Grudgebearers')
  })
})
