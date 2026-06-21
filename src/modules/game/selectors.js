import { appSelector } from "store/rootSelectors"
import { userSelector } from "modules/authentication/selectors"
import { createSelector } from "reselect"
import { sortByRank, sortBySuit } from "utils/handOrdering"

export const gameState = createSelector(appSelector, (app) => app.game)

export const boardSelector = createSelector(gameState, (game) => game.board)

export const handSelector = createSelector(gameState, (game) => {
  const sorted = [...game.hand]

  if (game.sortByRank) {
    return sorted.sort(sortByRank)
  }

  return sorted.sort(sortBySuit)
})

export const handByRankSelector = createSelector(gameState, (game) => game.sortByRank === true)

export const selectedCardsSelector = createSelector(gameState, (game) => game.selectedCards)
export const historySelector = createSelector(gameState, (game) => game.history)
export const gameErrorSelector = createSelector(gameState, (game) => game.errors)
export const gameInProgressSelector = createSelector(gameState, (game) => game.inProgress)
export const playersSelector = createSelector(gameState, (game) => game.seats)

export const userDataSelector = createSelector(playersSelector, userSelector, (players, user) =>
  Object.values(players || {}).find((p) => p?.id === user?.userId),
)

export const userSeatedSelector = createSelector(userDataSelector, (userData) => userData?.seat !== undefined)
export const userInHandSelector = createSelector(
  userDataSelector,
  (userData) =>
    userData?.status === "taking_turn" || userData?.status === "waiting_for_turn" || userData?.status === "passed",
)
export const userReadySelector = createSelector(userDataSelector, (userData) => userData?.status === "ready")
export const userTurnSelector = createSelector(userDataSelector, (userData) => userData?.status === "taking_turn")
