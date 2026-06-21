import React, { useMemo } from "react"
import { useParams, Navigate } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import Button from "react-bootstrap/esm/Button"

import Board from "components/game/Board"
import Actions from "components/game/Actions"
import { joinSeat } from "modules/app/actions"
import { userSelector } from "modules/authentication/selectors"
import { playersSelector, userSeatedSelector } from "modules/game/selectors"
import { roomsSelector } from "modules/app/selectors"

const Room = () => {
  const dispatch = useDispatch()
  const { id } = useParams()

  const players = useSelector(playersSelector)
  const loggedInUser = useSelector(userSelector)
  const userIsSeated = useSelector(userSeatedSelector)
  const rooms = Object.keys(useSelector(roomsSelector))

  const [topSeatId, rightSeatId, bottomSeatId, leftSeatId] = useMemo(
    () => getSeatOrderForUser(players, loggedInUser),
    [players, loggedInUser],
  )

  const handleJoinSeat = (room, seat) => {
    dispatch(joinSeat({ room: id, seat }))
  }

  if (rooms?.length === 0) {
    return <div>Loading...</div>
  }

  if (!rooms.includes(id)) {
    return <Navigate to="/" replace />
  }

  const renderSeat = (seatNumber) => {
    const seat = players?.[seatNumber]

    if (seat?.username) {
      return (
        <div>
          <span>{seat.username}</span>
          <span
            className={`ms-3 badge rounded-pill ${
              seat?.status === "ready" ? "bg-success text-white" : "bg-warning text-dark"
            }`}
          >
            {seat?.status ?? "Not ready"}
          </span>
        </div>
      )
    }

    if (userIsSeated) {
      return <span>Seat # {seatNumber} - Empty</span>
    } else {
      return <Button onClick={() => handleJoinSeat(id, seatNumber)}>Join Seat {seatNumber}</Button>
    }
  }

  return (
    <div>
      <div className="w-100 bg-white border-bottom p-2 mb-2">
        <div className="container-fluid d-flex justify-content-center">
          <h5 className="mb-0 fw-semibold text-dark">{id} room</h5>
        </div>
      </div>
      <div className="table-wrapper">
        {/* TOP */}
        <div className="row">
          <div className="player">{renderSeat(topSeatId)}</div>
        </div>

        {/* MIDDLE */}
        <div className="middle">
          <div className="player">{renderSeat(leftSeatId)}</div>

          <div className="board">
            <Board />
          </div>

          <div className="player">{renderSeat(rightSeatId)}</div>
        </div>

        {/* BOTTOM */}
        <div className="row">
          {userIsSeated ? <Actions /> : <div className="player highlight">{renderSeat(bottomSeatId)}</div>}
        </div>
      </div>
    </div>
  )
}

export default Room

const getSeatOrderForUser = (seats, loggedInUser) => {
  if (!seats) return [1, 2, 3, 4]

  // find which seat the logged-in user is in
  const entry = Object.entries(seats).find(([, value]) => value?.id === loggedInUser?.userId)

  if (!entry) {
    return [1, 2, 3, 4]
  }

  const userSeatId = Number(entry[0]) // 1–4

  const physicalOrder = [1, 2, 3, 4] // 1=top,2=right,3=bottom,4=left
  const desiredBottomIndex = 2 // index 2 in this array = bottom

  const currentIndex = physicalOrder.indexOf(userSeatId)
  const steps = (desiredBottomIndex - currentIndex + 4) % 4

  // rotate the *order* so that userSeatId ends up at position 2 (bottom)
  const rotatedOrder = physicalOrder.map((_, i) => {
    return physicalOrder[(i - steps + 4) % 4]
  })

  return rotatedOrder // [topSeatId, rightSeatId, bottomSeatId, leftSeatId]
}
