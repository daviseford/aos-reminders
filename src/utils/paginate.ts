import { ISavedArmyFromApi } from 'types/savedArmy'

export const paginateSavedArmies = (
  savedArmies: ISavedArmyFromApi[],
  pageSize = 6
): ISavedArmyFromApi[][] => {
  return savedArmies.reduce(
    (accum, army, i) => {
      if (i === 0) return { ...accum, pages: [[army]] }
      if (i === accum.currPage * pageSize) {
        accum.currPage = accum.currPage + 1
        accum.pages.push([])
      }
      accum.pages[accum.currPage - 1].push(army)
      return accum
    },
    { currPage: 1, pages: [] as ISavedArmyFromApi[][] }
  ).pages
}
