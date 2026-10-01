// @vitest-environment jsdom

import { join } from 'node:path'
import { compile } from 'sass'
import { describe, expect, it } from 'vitest'

const css = compile(join(process.cwd(), 'src/css/index.scss'), {
  loadPaths: [join(process.cwd(), 'node_modules')],
  logger: {
    debug: () => undefined,
    warn: () => undefined,
  },
}).css

describe('theme stylesheet', () => {
  it('keeps explicitly dark form controls dark while focused', () => {
    const style = document.createElement('style')
    style.textContent = css
    document.head.appendChild(style)

    const expectFocusBackground = (className: string, expected?: string) => {
      const input = document.createElement('input')
      input.className = className
      document.body.appendChild(input)

      const background = getComputedStyle(input).backgroundColor
      if (expected) expect(background).toBe(expected)
      input.focus()
      expect(getComputedStyle(input).backgroundColor).toBe(background)
      input.remove()
    }

    expectFocusBackground('form-control bg-themeDarkBlueSecondary text-white', 'rgb(24, 38, 51)')
    expectFocusBackground('form-control bg-white text-dark')
    style.remove()
  })

  const TAG_TONE_CLASSES = [
    'cost',
    'kind-active',
    'kind-reaction',
    'kind-passive',
    'turn-your',
    'turn-enemy',
    'turn-neutral',
    'priority',
    'usage',
    'source',
    'provenance',
    'keyword',
  ]

  it('outlines every reminder tag in its own ink in both themes (#2052)', () => {
    const style = document.createElement('style')
    style.textContent = css
    document.head.appendChild(style)

    ;['ReminderTags-Light', 'ReminderTags-Dark'].forEach(themeClass => {
      const row = document.createElement('div')
      row.className = themeClass
      document.body.appendChild(row)

      TAG_TONE_CLASSES.forEach(tone => {
        const tag = document.createElement('button')
        tag.className = `ReminderTag ReminderTag--${tone}`
        row.appendChild(tag)
        const computed = getComputedStyle(tag)

        expect(computed.color, `${themeClass} ${tone}`).not.toBe('')
        expect(computed.borderColor, `${themeClass} ${tone}`).toBe(computed.color)
      })
      row.remove()
    })
    style.remove()
  })

  it('keeps the reminder tag size, so the bolder outline cannot cost mobile density (#2052)', () => {
    const rule = css.match(/\.ReminderTag \{[^}]*\}/)?.[0] ?? ''

    expect(rule).toContain('font-size: 0.7rem')
    expect(rule).toContain('padding: 0.1rem 0.4rem')
    expect(rule).toContain('border: 1px solid transparent')
  })

  it('still drops tag colour to a grey outline in print (#2052)', () => {
    expect(css).toMatch(
      /@media print \{\s*\.ReminderTag \{\s*background-color: transparent !important;\s*color: black !important;\s*border-color: rgba\(0, 0, 0, 0\.45\) !important;/
    )
  })
})
