import React from "react"
import { useParams } from "react-router-dom"
import Board from "../game/Board"
import Opponent from "../game/Opponent"

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
