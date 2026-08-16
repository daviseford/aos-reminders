export const centerContentClass = 'd-flex align-items-center justify-content-center'

/*
 * The navbar sat at the 24px WCAG 2.5.8 floor rather than at the 44px target DESIGN.md actually
 * sets: links were 31-32px tall and the Log in/Log out button 31px. On the primary usage scene — a
 * phone held in one hand, dice in the other — every one of them was a miss waiting to happen, and
 * one of them is the Subscribe link.
 *
 * The links take `.TapTarget` and grow to 44px visually — they are borderless, so the extra height
 * is invisible. The Log in/Log out button cannot: it draws a border, and at 44px the border box
 * looked inflated beside the links. `.TapTargetOverlay` keeps its btn-sm look and extends only the
 * clickable area to 44px with a pseudo-element, the same approach .ReminderMenuToggle uses.
 */
export const navbarStyles = {
  btn: 'btn btn-outline-light btn-sm mx-2 TapTargetOverlay',
  headerClass: 'pt-2 d-print-none d-flex justify-content-center align-items-center',
  link: 'fw-bold text-light mx-2 TapTarget',
}

/*
 * The `ITheme` button slots whose value must be the *same string* in both themes.
 *
 * A slot normally exists so light and dark can each supply their own value. These three exist for
 * the opposite reason, and they are declared here — once — and spread into both theme files so the
 * two cannot drift apart:
 *
 * - `commitButton` and `destructiveButton` carry a decision, and a decision must read with the same
 *   weight in both themes. The slots these replace did not: `modalSuccessClass` was filled
 *   (`btn-success`) in light and outlined (`btn-outline-success`) in dark, so the single control
 *   that commits looked primary on one theme and secondary on the other. `modalDangerClass` was
 *   filled red in dark on four controls whose job is *cancel* or *close*, making the way out of a
 *   modal its loudest element.
 * - `alertActionButton` sits on a Bootstrap `alert-*`, whose palette stays light in both themes —
 *   see The Alert Surface Rule in DESIGN.md. A theme-varying class is a contrast defect there by
 *   construction.
 *
 * Measured in the compiled bundle, on the surfaces each is used on:
 * - `btn-primary` is `$blue` #0070e8 and carries white at 4.69:1. Bootstrap's green measures
 *   3.13:1, which is why the commit colour here is Action Blue and not green.
 * - `btn-danger` #dc3545 carries white at 4.53:1.
 * - `btn-outline-dark` draws its ink at #343a40 — `$dark` is pinned to 4.6's `$gray-800`, not
 *   Bootstrap 5's #212529 — which is 10.4:1 on `alert-warning` and at least 8.6:1 on every other
 *   alert background. It replaced `btn-outline-secondary` (#6c757d), theme-invariant but 4.23:1 on
 *   `alert-warning` — under the 4.5:1 floor this product treats as correctness. Theme-invariance
 *   alone is not enough on an alert.
 */
export const invariantButtons = {
  alertActionButton: 'btn btn-sm btn-outline-dark',
  commitButton: 'btn btn-primary',
  destructiveButton: 'btn btn-danger',
}
