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
