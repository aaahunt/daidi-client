import Emojis from "../notifications/Emojis"

const Player = (props) => {
  return (
    <div id="actions" className="players-cards bg-dark p-2">
      <Emojis opponent={props.opponent.id} />

      <h3 className="p-2">
        {props.activePlayer === props.playerNumber ? (
          <span className="badge bg-success">Your turn</span>
        ) : (
          <span className="badge bg-danger">Your opponent's turn</span>
        )}
        <span className="ms-3 badge bg-warning text-dark rounded-pill">
          {props.score}
        </span>
      </h3>
      {props.hand.map((hand) => {
        return (
          <img
            key={hand.value}
            src={`/cards/${hand.display}.svg`}
            alt={hand.display}
            className={`playing-card ${
              props.selected.includes(hand) ? "selected" : ""
            }`}
            onClick={() => props.handleCardClick(hand)}
          />
        )
      })}
      <div>
        <button
          onClick={props.passTurn}
          className="btn btn-lg btn-secondary rounded-0 p-2 pe-5 ps-5 mb-1 mt-2"
          disabled={props.activePlayer !== props.playerNumber}
        >
          <h1>Pass</h1>
        </button>
        <button
          onClick={props.playCards}
          className="btn btn-lg btn-success rounded-0 p-2 pe-5 ps-5 mb-1 mt-2"
          disabled={props.activePlayer !== props.playerNumber}
        >
          <h1>Play</h1>
        </button>
      </div>

      <button
        onClick={props.clearSelection}
        className="btn btn-secondary rounded-0 minor-buttons"
      >
        Clear selection
      </button>

      <button
        onClick={props.toggleHandSorting}
        className="btn btn-warning rounded-0 minor-buttons"
      >
        Order by {props.sortOrder === "rank" ? "suit" : "rank"}
      </button>

      <button
        onClick={props.resign}
        className="btn btn-danger rounded-0 minor-buttons"
      >
        Resign round
      </button>

      <button
        onClick={props.quitGame}
        className="btn btn-dark rounded-0 minor-buttons"
      >
        Quit game
      </button>
    </div>
  )
}

export default Player
