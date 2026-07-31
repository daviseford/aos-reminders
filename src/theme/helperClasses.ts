export const centerContentClass = 'd-flex align-items-center justify-content-center'

export const navbarStyles = {
  btn: 'btn btn-outline-light btn-sm mx-2',
  headerClass: 'pt-2 d-print-none d-flex justify-content-center align-items-center',
  /*
   * d-inline-block + py-1 takes the links from 21px to 29px, clearing the 24px WCAG 2.5.8 floor.
   * The navbar's own height is set by the taller Log in/Log out button beside them, so nothing
   * moves; an inline element could not carry the vertical padding at all.
   */
  link: 'fw-bold text-light mx-2 d-inline-block py-1',
}
