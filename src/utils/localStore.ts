import { TSupportedFaction } from 'meta/factions'

const LOCAL_FAVORITE_KEY = 'favoriteFaction'

/**
 * Set the local favoriteFaction to a faction name
 * Or remove it from the local store by passing null
 * @param factionName
 */
export const setLocalFavorite = (factionName: TSupportedFaction | null) => {
  if (factionName) {
    localStorage.setItem(LOCAL_FAVORITE_KEY, factionName)
    console.log(`Set ${LOCAL_FAVORITE_KEY} in localStorage to ${factionName}`)
  } else {
    localStorage.removeItem(LOCAL_FAVORITE_KEY)
  }
}

export const getLocalFavorite = () => {
  const localFavorite = localStorage.getItem(LOCAL_FAVORITE_KEY) as TSupportedFaction | null
  console.log(`Got local favorite: ${localFavorite}`)
  return localFavorite
}
