import React, { useEffect, useState } from "react"
import ListGroup from "react-bootstrap/ListGroup"
import useAuthHeader from "react-auth-kit/hooks/useAuthHeader"

import server from "../../context/axios"
const config = require("../../config")

export const GameList = () => {
  const [games, setGames] = useState([])
  const authHeader = useAuthHeader()

  useEffect(() => {
    server
      .get("/auth/games", { headers: { Authorization: authHeader } })
      .then((res) => {
        setGames(res.data)
      })
      .catch((err) => {
        console.error("Error fetching games:", err)
      })
  }, [authHeader])

  if (!games) return <p>{config.MESSAGE.GAMES.NONE}</p>
  return games.map((game) => (
    <ListGroup.Item
      key={game._id}
      variant={game.our_score > game.opponent_score ? "success" : "danger"}
    >
      {game.opponent_name} ({game.opponent_score}) - ({game.our_score})
    </ListGroup.Item>
  ))
}
