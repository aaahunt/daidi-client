import React, { useState } from "react"

const Board = ({ board, history, error, emoji, clearEmoji }) => {
  // State to track hover status
  const [isHovered, setIsHovered] = useState(false)
  // const [historyTimeout, setHistoryTimeout] = useState(0)

  // Handlers to update hover state
  const handleMouseEnter = () => setIsHovered(true)
  const handleMouseLeave = () => setIsHovered(false)

  return (
    <section
      className="position-relative d-flex justify-content-center align-items-center"
      id="board"
    >
      <div onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
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

      <div className="cards-played">
        {isHovered &&
          history &&
          history.map((hand) => (
            <div key={hand}>
              {hand &&
                hand.map((card) => (
                  <img
                    key={card.value}
                    src={`/cards/${card.display}.svg`}
                    alt={card.display}
                    width="25"
                  />
                ))}
            </div>
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
