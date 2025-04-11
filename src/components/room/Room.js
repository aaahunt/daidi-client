import { useParams } from "react-router-dom"

import Board from "components/game/Board"
import Opponent from "components/game/Opponent"

const Room = () => {
  const { name } = useParams()

  return (
    <div>
      <h1>Room {name}</h1>
      <Opponent />
      <Board board={[]} history={[]} error={null} />
    </div>
  )
}

export default Room
