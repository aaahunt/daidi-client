import { useDispatch, useSelector } from "react-redux"

import {
  handSelector,
  selectedCardsSelector,
  gameInProgressSelector,
  boardSelector,
  userReadySelector,
  userTurnSelector,
  userInHandSelector,
  handByRankSelector,
  userDataSelector,
} from "modules/game/selectors"
import { currentRoomSelector } from "modules/app/selectors"
import { clearCardSelection, toggleHandOrder, passTurn, playCards, quitGame, selectCards } from "modules/game/actions"
import { leaveSeat, ready } from "modules/app/actions"
import { notifyUser } from "modules/toast/actions"

const Actions = () => {
  const dispatch = useDispatch()

  const user = useSelector(userDataSelector)
  const room = useSelector(currentRoomSelector)
  const gameInProgress = useSelector(gameInProgressSelector)
  const userTurn = useSelector(userTurnSelector)
  const userInHand = useSelector(userInHandSelector)
  const userReady = useSelector(userReadySelector)
  const hand = useSelector(handSelector)
  const handByRank = useSelector(handByRankSelector)
  const selected = useSelector(selectedCardsSelector)
  const board = useSelector(boardSelector)

  const handleCardClick = (card) => {
    dispatch(selectCards(card))
  }

  const passTurnHandler = () => {
    dispatch(passTurn())
  }

  const playCardsHandler = (cards) => {
    if (board.length > 0 && cards.length !== board.length) {
      dispatch(notifyUser("You must play the same number of cards", "error"))
    } else {
      dispatch(playCards(cards))
    }
  }

  const clearSelection = () => {
    dispatch(clearCardSelection())
  }

  const toggleHandSorting = () => {
    dispatch(toggleHandOrder())
  }

  const handleQuit = () => {
    dispatch(quitGame())
  }

  const handleReady = () => {
    dispatch(ready(userReady ? false : true))
  }

  const handleStandUp = () => {
    dispatch(leaveSeat({ room, seat: user.seat }))
  }

  if (!gameInProgress || !userInHand)
    return (
      <div>
        <h4 className="text-center">You</h4>
        <button onClick={handleReady} className="btn btn-lg btn-success rounded-0 p-2 pe-5 ps-5 m-1">
          {userReady ? "Sit out" : "Ready"}
        </button>
        <button onClick={handleStandUp} className="btn btn-lg btn-secondary rounded-0 p-2 pe-5 ps-5 m-1">
          Stand up
        </button>
        <button onClick={handleQuit} className="btn btn-lg btn-warning rounded-0 p-2 pe-5 ps-5 m-1">
          Quit game
        </button>
      </div>
    )

  return (
    <div id="actions" className="players-cards bg-dark p-2">
      {/* <Emojis opponent={opponent.userId} /> */}

      <h3 className="p-2">
        {userTurn ? (
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
          onClick={passTurnHandler}
          className="btn btn-lg btn-secondary rounded-0 p-2 pe-5 ps-5 mb-1 mt-2"
          disabled={!userTurn}
        >
          <h1>Pass</h1>
        </button>
        <button
          onClick={() => playCardsHandler(selected)}
          className="btn btn-lg btn-success rounded-0 p-2 pe-5 ps-5 mb-1 mt-2"
          disabled={!userTurn}
        >
          <h1>Play</h1>
        </button>
      </div>

      <button onClick={clearSelection} className="btn btn-secondary rounded-0 minor-buttons">
        Clear selection
      </button>

      <button onClick={toggleHandSorting} className="btn btn-warning rounded-0 minor-buttons">
        Order by {handByRank ? "suit" : "rank"}
      </button>

      <button onClick={handleQuit} className="btn btn-dark rounded-0 minor-buttons">
        Quit game
      </button>
    </div>
  )
}

export default Actions
