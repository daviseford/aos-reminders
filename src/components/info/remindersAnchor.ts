/**
 * The reminders region's anchor id, in a module of its own.
 *
 * The skip link that targets it lives in Home's catalog-free shell — it has to be the first
 * focusable element on the page or it is not a skip link — while the region itself lives in the
 * lazily-loaded catalog-bound half. Reading the id from `reminders.tsx` would drag the
 * drag-and-drop library, the Bootstrap dropdown, and two icon packs into the first chunk for the
 * sake of one string.
 */
export const REMINDERS_ANCHOR_ID = 'aos4-reminders'
