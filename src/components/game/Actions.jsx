import { useDispatch, useSelector } from "react-redux"

import Emojis from "../notifications/Emojis"
import {
  activePlayerSelector,
  handSelector,
  userSeatNumberSelector,
  selectedCardsSelector,
  gameInProgressSelector,
} from "modules/game/selectors"
import { passTurn, playCards } from "modules/game/actions"

const Player = () => {
  const dispatch = useDispatch()

  const gameInProgress = useSelector(gameInProgressSelector)
  const activePlayer = useSelector(activePlayerSelector)
  const hand = useSelector(handSelector)
  const selected = useSelector(selectedCardsSelector)
  const playerNumber = useSelector(userSeatNumberSelector)

  const handleCardClick = (card) => {
    console.log("handleCardClick", card)
  }

  const passTurnHandler = () => {
    console.log("passTurn")
    dispatch(passTurn)
  }

  const playCardsHandler = (cards) => {
    console.log("playCards")
    dispatch(playCards, cards)
  }

  if (!gameInProgress) return

  return (
    <div id="actions" className="players-cards bg-dark p-2">
      {/* <Emojis opponent={opponent.userId} /> */}

      <h3 className="p-2">
        {activePlayer === playerNumber ? (
          <span className="badge bg-success">Your turn</span>
        ) : (
          <span className="badge bg-danger">Your opponent's turn</span>
        )}
        {/* <span className="ms-3 badge bg-warning text-dark rounded-pill">{score}</span> */}
      </h3>
      {hand.map((hand) => {
        return (
          <img
            key={hand.value}
            src={`/cards/${hand.display}.svg`}
            alt={hand.display}
            className={`playing-card ${selected.includes(hand) ? "selected" : ""}`}
            onClick={() => handleCardClick(hand)}
          />
        )
      })}
      <div>
        <button
          onClick={passTurn}
          className="btn btn-lg btn-secondary rounded-0 p-2 pe-5 ps-5 mb-1 mt-2"
          disabled={activePlayer !== playerNumber}
        >
          <h1>Pass</h1>
        </button>
        <button
          onClick={playCards}
          className="btn btn-lg btn-success rounded-0 p-2 pe-5 ps-5 mb-1 mt-2"
          disabled={activePlayer !== playerNumber}
        >
          <h1>Play</h1>
        </button>
      </div>

      {/* <button onClick={clearSelection} className="btn btn-secondary rounded-0 minor-buttons">
        Clear selection
      </button>

      <button onClick={toggleHandSorting} className="btn btn-warning rounded-0 minor-buttons">
        Order by {sortOrder === "rank" ? "suit" : "rank"}
      </button>

      <button onClick={resign} className="btn btn-danger rounded-0 minor-buttons">
        Resign round
      </button>

      <button onClick={quitGame} className="btn btn-dark rounded-0 minor-buttons">
        Quit game
      </button> */}
    </div>
  )
}

export default Player
