const Board = ({ board, error, emoji, clearEmoji }) => {
  return (
    <section
      className="position-relative d-flex justify-content-center align-items-center"
      id="board"
    >
      <div>
        {/* Map through each card in each hand played */}
        {board &&
          board.map((card) => (
            <img
              key={card.value}
              src={`/cards/${card.display}.svg`}
              alt={card.display}
              className="board-card"
            />
          ))}
      </div>

      {error && (
        <div className="alert alert-danger position-absolute bottom-0 start-50 translate-middle-x">
          {error}
        </div>
      )}
    </section>
  )
}

export default Board
