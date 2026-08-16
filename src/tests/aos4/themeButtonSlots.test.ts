import DarkTheme from 'theme/dark'
import LightTheme from 'theme/light'
import { describe, expect, it } from 'vitest'

/*
 * The button slots that must NOT vary by theme, and why each one is on this list.
 *
 * This is the contract behind `invariantButtons` in theme/helperClasses. It is a test rather than a
 * comment because the failure it guards is invisible in the theme you happen to be developing in:
 * `modalSuccessClass` was `btn-success` in light and `btn-outline-success` in dark, so the single
 * control that commits looked primary on one theme and secondary on the other, and nothing caught
 * it for as long as those slots existed.
 */
const invariantSlots = ['alertActionButton', 'commitButton', 'destructiveButton'] as const

/*
 * Slots removed by the modal-family pass. Listed by name so a re-introduction has to argue with
 * this test: `modalConfirmClass` was byte-identical to `genericButton` in both themes (a
 * distinction the theme never delivered), `modalSuccessClass` and `modalDangerClass` varied their
 * fill by theme, and `modalDangerClass` was carrying four controls whose job is cancel or close.
 */
const removedSlots = ['modalConfirmClass', 'modalDangerClass', 'modalSuccessClass', 'secondaryButton']

describe('theme button slots', () => {
  it.each(invariantSlots)('%s is the same string in both themes', slot => {
    expect(LightTheme[slot]).toBe(DarkTheme[slot])
  })

  it.each(removedSlots)('%s stays removed', slot => {
    expect(LightTheme).not.toHaveProperty(slot)
    expect(DarkTheme).not.toHaveProperty(slot)
  })

  /*
   * The alert control's ink, specifically. An alert keeps its light palette in both themes (see The
   * Alert Surface Rule in DESIGN.md), so its control is resolved against a light ground either way.
   * `btn-outline-secondary` was theme-invariant and still failed: #6c757d on `alert-warning`
   * #fff3cd measures 4.23:1, under the 4.5:1 floor. `btn-outline-dark` is 10.4:1 there.
   * Invariance is necessary, not sufficient.
   */
  it('resolves the alert control against a light ground with dark ink', () => {
    expect(LightTheme.alertActionButton).toContain('btn-outline-dark')
    expect(LightTheme.alertActionButton).not.toContain('btn-outline-secondary')
  })

  /*
   * Action Blue, not Bootstrap's green: white on $blue #0070e8 measures 4.69:1 and on $green
   * #28a745 measures 3.13:1.
   */
  it('commits in Action Blue', () => {
    expect(LightTheme.commitButton).toBe('btn btn-primary')
  })
})
