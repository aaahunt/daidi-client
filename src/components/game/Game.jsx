import React from "react"
import { Link } from "react-router-dom"
import { SocketContext } from "../../context/socket"

// Components
import Board from "./Board"
import Opponent from "./Opponent"
import Player from "./Player"
import Modals from "../notifications/Modals"
import withLocation from "../withLocation"
import server from "../../context/axios"

import { byRank, modeCard } from "../../utils/handOrdering"

// Config vars
const config = require("../../config")

class Game extends React.Component {
  static contextType = SocketContext
  socket = this.context
  navigate = this.props.navigate

  state = {
    ...config.GAME_INIT_STATE,
    ...this.props.state, // Grab the state from App
    ...this.props.location.state, // Grab the game init state passed in by server
  }

  componentDidMount() {
    this.getStateUsingCookies()

    // Fetch previous game history scores from database
    if (this.state.opponent) this.getPreviousScores()

    // Add socket listeners - these are the incoming messages from our opponent
    this.socket.on("play", this.handleOpponentPlay)
    this.socket.on("pass", this.handleOpponentPass)
    this.socket.on("win", this.handleLoss)
    this.socket.on("quit", this.handleQuitter)
    this.socket.on("resign", this.handleWin)
    this.socket.on("rematch", this.handleRematchOffer)
    this.socket.on("accepted", this.handleRematchAccepted)
    this.socket.on("emoji", this.setEmoji)
  }

  getStateUsingCookies = () => {
    const game = JSON.parse(localStorage.getItem("game"))
    if (game && game.hand) this.setState(game)
  }

  // Use axios to fetch previous game data
  getPreviousScores() {
    server
      .get("/auth/games", { params: { opponent: this.state.opponent.user_id } })
      .then((res) => {
        console.log("games", res.data)
        if (!res.data) return
        res.data.forEach((el) => {
          if (el.opponent_id === this.state.opponent.user_id)
            this.setState((prevState) => ({
              ...prevState,
              score: el.our_score,
              opponent: {
                ...prevState.opponent,
                score: el.opponent_score,
              },
            }))
        })
      })
      .catch((err) => {
        console.log(err)
      })
  }

  render() {
    // If we're in a game, update the new game state into cookies
    if (this.state.hand)
      localStorage.setItem("game", JSON.stringify(this.state))

    if (!this.state.opponent)
      return (
        <section className="d-flex justify-content-center position-absolute top-50 start-50 translate-middle">
          <div className="text-center p-3 rounded-0">
            <h1>{config.MESSAGE.GAMES.NONE_IN_PROGRESS}</h1>
            <Link to={config.URL.DASHBOARD}>Go to dashboard</Link>
          </div>
        </section>
      )

    return (
      <main className="d-grid text-center">
        <Opponent
          {...this.state.opponent}
          emoji={this.state.emoji}
          setEmoji={this.setEmoji}
        />
        <Board
          board={this.state.board}
          history={this.state.history}
          error={this.state.error}
        />

        <Player
          {...this.state}
          handleCardClick={this.handleCardClick}
          clearSelection={this.clearSelection}
          toggleHandSorting={this.toggleHandSorting}
          passTurn={this.passTurn}
          playCards={this.playCards}
          resign={this.resign}
          quitGame={this.quitGame}
        />

        <Modals
          {...this.state}
          quitGame={this.quitGame}
          leaveGame={this.leaveGame}
          rematch={this.rematch}
        />
      </main>
    )
  }

  // Set emoji / Clear Emoji
  setEmoji = (emoji) => {
    this.setState({ emoji: emoji })
  }

  resign = () => {
    if (!window.confirm(config.MESSAGE.CONFIRM.RESIGN)) return
    // How many points did our opponent gain? Depends on how many cards we have left
    let points = this.determinePoints(this.state.hand.length)

    this.socket.emit("action", "resign", this.state.opponent.user_id)
    this.setState((prevState) => ({
      ...prevState,
      showRematch: true,
      winner: this.state.playerNumber === 1 ? 2 : 1,
      opponent: {
        ...prevState.opponent,
        score: this.state.opponent.score + points,
      },
      winnersPoints: points,
    }))
  }

  quitGame = () => {
    if (!window.confirm(config.MESSAGE.CONFIRM.QUIT)) return
    this.socket.emit("action", "quit", this.state.opponent.user_id)
    this.leaveGame()
  }

  leaveGame = () => {
    localStorage.removeItem("game")
    this.setState(config.GAME_INIT_STATE)
    this.props.location.state = null
    this.navigate(config.URL.DASHBOARD)
  }

  handleOpponentPlay = (hand) => {
    this.setState((prevState) => ({
      ...prevState,
      board: hand,
      activePlayer: this.state.activePlayer === 1 ? 2 : 1,
      opponent: {
        ...prevState.opponent,
        cards: this.state.opponent.cards - hand.length,
        passed: false,
      },
      error: null,
    }))
  }

  handleOpponentPass = () => {
    this.setState((prevState) => ({
      ...prevState,
      board: null,
      history: [],
      activePlayer: this.state.activePlayer === 1 ? 2 : 1,
      error: null,
      opponent: {
        ...prevState.opponent,
        passed: true,
      },
    }))
  }

  handleLoss = () => {
    // How many points did our opponent gain? Depends on how many cards we have left
    let points = this.determinePoints(this.state.hand.length)

    setTimeout(() => {
      // Wait a couple seconds before we acknowledge the defeat
      this.setState((prevState) => ({
        ...prevState,
        showRematch: true,
        winner: this.state.playerNumber === 1 ? 2 : 1,
        winnersPoints: points,
        opponent: {
          ...prevState.opponent,
          score: this.state.opponent.score + points,
        },
      }))
    }, config.GAME.WAIT_AFTER_LOSE)
  }

  handleRematchOffer = () => {
    this.setState((prevState) => ({
      ...prevState,
      oneWaiting: true,
    }))
  }

  handleRematchAccepted = (response) => {
    this.setState((prevState) => ({
      ...config.GAME_INIT_STATE,
      ...response,
      score: this.state.score,
      opponent: {
        ...prevState.opponent,
        cards: 13,
        score: this.state.opponent.score,
      },
    }))
  }

  passTurn = () => {
    // Emit our action to opponent, if error response, we must win by default
    this.socket.emit("action", "pass", this.state.opponent.user_id, (res) => {
      if (res === "error") {
        this.handleWin()
        return
      }
      this.setState((prevState) => ({
        ...prevState,
        selected: [],
        board: null,
        history: [],
        activePlayer: this.state.activePlayer === 1 ? 2 : 1,
        error: null,
        opponent: {
          ...prevState.opponent,
          passed: false,
        },
      }))
    })
  }

  handleCardClick = (card) => {
    // If the card they are clicking is already selected, remove it
    if (this.state.selected.includes(card)) {
      this.setState((prevState) => ({
        ...prevState,
        selected: this.state.selected.filter((i) => i !== card),
      }))
      return
    }
    // Check if max cards reached
    if (this.state.selected.length === 5) return

    // Add card to 'selected' array
    this.setState((prevState) => ({
      ...prevState,
      selected: [...prevState.selected, card],
    }))
  }

  // Clear selected array
  clearSelection = () => {
    this.setState((prevState) => ({
      ...prevState,
      selected: [],
    }))
  }

  // Toggle between hands sorted by rank or suit
  toggleHandSorting = () => {
    const currentSort = this.state.sortOrder
    const switchTo = currentSort === "rank" ? "suit" : "rank"
    const propertyToFind = currentSort === "rank" ? "suitValue" : "value"

    const sortedHand = this.state.hand.sort((a, b) => {
      return a[propertyToFind] < b[propertyToFind] ? -1 : 1
    })

    this.setState((prevState) => ({
      ...prevState,
      sortOrder: switchTo,
      hand: sortedHand,
    }))
  }

  handleQuitter = () => {
    // How many points did we gain? Depends on how many cards opponent has left
    let points = this.determinePoints(this.state.opponent.cards)

    //Update the database
    this.updateDatabase(points)

    this.setState((prevState) => ({
      ...prevState,
      showOppLeft: true,
      winner: this.state.playerNumber,
      winnersPoints: points,
    }))
  }

  // Update the database with the points we have won
  updateDatabase = (points) => {
    let id = this.state.user_id
    let opponent = this.state.opponent.user_id

    server
      .post("/auth/win", { id, opponent, points })
      .then((res) => {
        console.log(
          "Successfully added points to database",
          res,
          id,
          opponent,
          points
        )
      })
      .catch((err) => {
        this.setState({ error: err.message })
      })
  }

  handleWin = () => {
    // How many points did we gain? Depends on how many cards opponent has left
    let points = this.determinePoints(this.state.opponent.cards)

    //Update the database
    this.updateDatabase(points)

    this.setState((prevState) => ({
      ...prevState,
      showRematch: true,
      winner: this.state.playerNumber,
      score: this.state.score + points,
      winnersPoints: points,
    }))
  }

  determinePoints = (n) => {
    return n === 13
      ? n * config.GAME.TOP_MULTIPLIER
      : n > 9
      ? n * config.GAME.MIDDLE_MULTIPLIER
      : n * config.GAME.BOTTOM_MULTIPLIER
  }

  // User has clicked rematch button on Modal
  rematch = () => {
    this.setState({ pressedOneMore: true })
    // If player is waiting, start the new game
    if (this.state.oneWaiting) {
      this.socket.emit("accept", this.state.opponent.user_id, (response) => {
        this.setState((prevState) => ({
          ...config.GAME_INIT_STATE,
          ...response,
          score: this.state.score,
          opponent: {
            ...prevState.opponent,
            score: this.state.opponent.score,
            cards: 13,
          },
        }))
      })
      return
    }
    this.socket.emit("action", "rematch", this.state.opponent.user_id)
    this.setState({ oneWaiting: true })
  }

  playCards = () => {
    const numCards = this.state.selected.length
    let boardRank = 0

    if (numCards < 1) return

    if (numCards === 4) {
      this.setState({ error: config.MESSAGE.ERROR.FOUR_CARDS })
      return
    }

    // If there is a board, check our submission is the same number of cards, if not return
    if (this.state.board && this.state.board.length !== numCards) {
      this.setState({ error: config.MESSAGE.ERROR.NUM_CARDS })
      return
    }

    // When they submit 3 cards we only need to make sure all cards are the same and one cards beats one board card
    if (numCards <= 3) {
      if (this.legalThreeCardHand(this.state.selected)) {
        this.submitHand(this.state.selected)
        return
      }
      this.setState({ error: config.MESSAGE.ERROR.NOT_ALLOWED })
      return
    }

    // If five card poker hand, figure out the value of our hand and compare vs the board
    if (numCards === 5) {
      // Invalid = 0, Straight = 1, Flush = 2, Full house = 3, Quads = 4, Straight flush = 5, Royal flush = 6
      let handRank = this.handRanking(this.state.selected)

      // If handRank = 0, return with error
      if (!handRank) {
        this.setState({ error: config.MESSAGE.ERROR.INVALID_HAND })
        return
      }

      // If there is a board, determine it's rank
      if (this.state.board) boardRank = this.handRanking(this.state.board)

      // If our hand is strictly better, handle the submit
      if (handRank > boardRank) this.submitHand(this.state.selected)
      // If the board is strictly better, return with error
      else if (handRank < boardRank) {
        this.setState({ error: config.MESSAGE.ERROR.NOT_BEAT_BOARD })
        return
      }
      // Otherwise hands be of equal strict value so we need to investigate further
      else if (this.winOnTieBreak(handRank))
        this.submitHand(this.state.selected)
    }
  }

  // This functions checks if the submission is a legal three card hand
  legalThreeCardHand = (hand) => {
    let beatsBoard = true
    let legal = hand.every((card) => card.rankValue === hand[0].rankValue)
    // Check if our best cards value beats the current best card
    if (this.state.board)
      beatsBoard = hand.some(
        (card) =>
          card.value >
          Math.max.apply(
            Math,
            this.state.board.map(function (o) {
              return o.value
            })
          )
      )
    return beatsBoard && legal
  }

  // When both players have the same five card hand type (i.e. flush) determine the winner
  // returns true if we beat the board and should therefore submit our hand
  winOnTieBreak = (handRank) => {
    // Inspect the highest card on the board, including deuces and suits
    const boardMaxCard = Math.max.apply(
      Math,
      this.state.board.map(function (o) {
        return o.value
      })
    )

    const handMaxCard = Math.max.apply(
      Math,
      this.state.selected.map(function (o) {
        return o.value
      })
    )

    switch (handRank) {
      // Straight, flush, and straight flush evaluated together, just looking for highest value card
      case 1:
      case 2:
      case 5:
        if (handMaxCard < boardMaxCard) {
          this.setState({ error: config.MESSAGE.ERROR.NOT_BEAT_BOARD })
          return false
        }
        return true

      // Full house and quads evaluated at the same time, just looking at the highest value card for the most occuring card
      case 3:
      case 4:
        const mode = modeCard(this.state.selected)
        const modeBoardCard = modeCard(this.state.board)
        if (mode.value < modeBoardCard.value) {
          this.setState({ error: config.MESSAGE.ERROR.NOT_BEAT_BOARD })
          return false
        }
        return true
      default:
        this.setState({ error: config.MESSAGE.ERROR.SERVER })
        return false
    }
  }

  // Play the selected hand
  submitHand = (hand) => {
    let sortedHand = hand.sort(byRank)

    // If our hand is a straight containing a deuce we must sort it correctly
    if (this.handRanking(hand) === 1 && hand.some((e) => e.rank === "2")) {
      sortedHand = sortedHand.map((card) => {
        if (card.rank === "2") card.rankValue = 2
        if (card.rank === "A") card.rankValue = 1
        return card
      })
      sortedHand = sortedHand.sort(byRank)
    }

    // Emit our hand to opponent, if emit unsuccessful, we must win by default
    this.socket.emit("play", sortedHand, this.state.opponent.user_id, (res) => {
      if (res === "offline") {
        this.handleWin()
        return
      }

      this.setState(
        (prevState) => ({
          ...prevState,
          board: sortedHand,
          history: [...prevState.history, prevState.board],
          activePlayer: this.state.activePlayer === 1 ? 2 : 1,
          hand: this.state.hand.filter((card) => {
            return !hand.includes(card)
          }),
          selected: [],
          opponent: {
            ...prevState.opponent,
            passed: false,
          },
          error: null,
          passed: false,
        }),
        () => {
          if (this.state.hand.length === 0) {
            this.socket.emit("action", "win", this.state.opponent.user_id)
            this.handleWin()
          }
        }
      )
    })
  }
}

export default withLocation(Game)
