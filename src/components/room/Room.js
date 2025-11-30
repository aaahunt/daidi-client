import React, { useState, useEffect, useMemo } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import Button from "react-bootstrap/esm/Button"

import config from "config"

import Board from "components/game/Board"
import Actions from "components/game/Actions"
import { joinRoom, leaveRoom } from "modules/app/actions"
import { roomList } from "modules/app/selectors"
import { userSelector } from "modules/authentication/selectors"

const Room = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { id } = useParams()

  const rooms = useSelector(roomList)
  const loggedInUser = useSelector(userSelector)
  const seats = rooms[id]?.seats

  const userSeatEntry = Object.entries(seats || {}).find(([, value]) => value?.userId === loggedInUser.userId)

  const userIsSeated = Boolean(userSeatEntry)

  const [topSeatId, rightSeatId, bottomSeatId, leftSeatId] = useMemo(
    () => getSeatOrderForUser(seats, loggedInUser),
    [seats, loggedInUser]
  )

  const attemptJoin = (room, seat) => {
    dispatch(joinRoom({ room: id, seat }))
  }

  const standUp = () => {
    dispatch(leaveRoom())
  }

  const renderSeat = (seatId) => {
    const seat = seats?.[seatId]

    // seat is occupied
    if (seat?.username) {
      return <span>{seat.username}</span>
    }

    // seat is empty and user is already sitting somewhere
    if (userIsSeated) {
      return <span>Empty seat</span>
    }

    // seat is empty and user is NOT sitting yet → allow join
    return <Button onClick={() => attemptJoin(id, seatId)}>Join Seat {seatId}</Button>
  }

  if (!rooms[id]) return

  return (
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

      <div style={{ marginTop: 10 }}>
        <Button className="ms-1" onClick={standUp}>
          Leave game
        </Button>
        <Button className="ms-1" onClick={() => navigate(config.URL.DASHBOARD)}>
          Back to dashboard
        </Button>
      </div>
    </div>
  )
}

export default Room

const getSeatOrderForUser = (seats, loggedInUser) => {
  if (!seats) return [1, 2, 3, 4]

  // find which seat the logged-in user is in
  const entry = Object.entries(seats).find(([, value]) => value?.userId === loggedInUser.userId)

  // user not found in room – no rotation
  if (!entry) return [1, 2, 3, 4]

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
