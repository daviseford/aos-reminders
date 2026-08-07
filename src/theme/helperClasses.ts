export const centerContentClass = 'd-flex align-items-center justify-content-center'

/*
 * The navbar sat at the 24px WCAG 2.5.8 floor rather than at the 44px target DESIGN.md actually
 * sets: links were 31-32px tall and the Log in/Log out button 31px. On the primary usage scene — a
 * phone held in one hand, dice in the other — every one of them was a miss waiting to happen, and
 * one of them is the Subscribe link.
 *
 * `.TapTarget` on both the links and the button takes all of them to 44px. The
 * navbar row grows by roughly 12px as a result, on every page. That is the visible cost of the fix
 * and it is deliberate: the alternative is a control the thumb cannot reliably hit.
 */
export const navbarStyles = {
  btn: 'btn btn-outline-light btn-sm mx-2 TapTarget',
  headerClass: 'pt-2 d-print-none d-flex justify-content-center align-items-center',
  link: 'fw-bold text-light mx-2 TapTarget',
}
