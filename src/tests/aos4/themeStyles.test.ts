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
})
