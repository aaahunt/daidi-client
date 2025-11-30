import { appSelector } from "store/rootSelectors"
import { createSelector } from "reselect"

export const gameState = createSelector(appSelector, (app) => app.game)

export const boardSelector = createSelector(gameState, (game) => game.board)
export const handSelector = createSelector(gameState, (game) => game.hand)
export const selectedCardsSelector = createSelector(gameState, (game) => game.selectedCards)
export const historySelector = createSelector(gameState, (game) => game.history)
export const gameErrorSelector = createSelector(gameState, (game) => game.errors)
export const gameInProgressSelector = createSelector(gameState, (game) => game.inProgress)
export const activePlayerSelector = createSelector(gameState, (game) => game.activePlayer)
export const userSeatNumberSelector = createSelector(gameState, (game) => game.userSeatNumber)
