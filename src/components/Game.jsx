import React from "react"

// Axios library for simplified HTTP requests
import axios from "axios"

// React Router DOM for links/routing
import { Link } from "react-router-dom"

// Socket IO Context
import { SocketContext } from "../context/socket"

// Components
import Board from "./Board"
import Opponent from "./Opponent"
import Player from "./Player"
import Modals from "./notifications/Modals"

// Config vars
const config = require("../config")

class Game extends React.Component {
  // Retrieve our socket from context
  static contextType = SocketContext
  socket = this.context

  state = {
    ...config.GAME_INIT_STATE,
    ...this.props.state, // Grab the state from App
    ...this.props.location.state, // Grab the game init state passed in by server
  }

  componentDidMount() {
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
    this.socket.on("emoji", this.handleEmoji)
  }

  // Use axios to fetch previous game data
  getPreviousScores() {
    axios.get(config.URL.SERVER + "/games?id=" + this.state.id).then((res) => {
      res.data.forEach((el) => {
        if (el.opponent_id === this.state.opponent.id)
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
  }

  render() {
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
          clearEmoji={this.clearEmoji}
        />
        <Board board={this.state.board} error={this.state.error} />

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

  // Show emoji that opponent has sent
  handleEmoji = (emoji) => {
    this.setState({ emoji })
  }

  // Clear emoji from opponent's chat box
  clearEmoji = () => {
    this.setState({ emoji: null })
  }

  resign = () => {
    // How many points did our opponent gain? Depends on how many cards we have left
    let numCards = this.state.hand.length
    let points = numCards === 13 ? 39 : numCards > 9 ? numCards * 2 : numCards

    this.socket.emit("action", "resign", this.state.opponent.id)
    this.setState((prevState) => ({
      ...prevState,
      showRematch: true,
      winner: this.state.playerNumber === 1 ? 2 : 1,
      opponent: {
        ...prevState.opponent,
        score: this.state.opponent.score + points,
      },
    }))
  }

  quitGame = () => {
    this.socket.emit("action", "quit", this.state.opponent.id)
    this.leaveGame()
  }

  leaveGame = () => {
    sessionStorage.removeItem("game")
    this.setState(config.GAME_INIT_STATE)
    this.props.location.state = null
    this.props.history.push(config.URL.DASHBOARD)
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
      activePlayer: this.state.activePlayer === 1 ? 2 : 1,
      error: null,
      opponent: {
        ...prevState.opponent,
        passed: true,
      },
    }))
  }

  handleLoss = () => {
    // Wait a couple seconds before we acknowledge the defeat
    // How many points did our opponent gain? Depends on how many cards we have left
    let numCards = this.state.hand.length
    let points = numCards === 13 ? 39 : numCards > 9 ? numCards * 2 : numCards

    setTimeout(() => {
      this.setState((prevState) => ({
        ...prevState,
        showRematch: true,
        winner: this.state.playerNumber === 1 ? 2 : 1,
        opponent: {
          ...prevState.opponent,
          score: this.state.opponent.score + points,
        },
      }))
    }, 2000)
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
    this.socket.emit("action", "pass", this.state.opponent.id, (res) => {
      if (res === "error") {
        this.handleWin()
        return
      }
      this.setState((prevState) => ({
        ...prevState,
        selected: [],
        board: null,
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
      if (a[propertyToFind] < b[propertyToFind]) return -1
      return 1
    })

    this.setState((prevState) => ({
      ...prevState,
      sortOrder: switchTo,
      hand: sortedHand,
    }))
  }

  handleQuitter = () => {
    // How many points did we gain? Depends on how many cards opponent has left
    let numCards = this.state.opponent.cards
    let points = numCards === 13 ? 39 : numCards > 9 ? numCards * 2 : numCards

    //Update the database
    this.updateDatabase(points)

    this.setState((prevState) => ({
      ...prevState,
      showOppLeft: true,
      winner: this.state.playerNumber,
    }))
  }

  // Update the database with the points we have won
  updateDatabase = (points) => {
    let id = this.state.id
    let opponent = this.state.opponent.id

    axios
      .post(config.URL.SERVER + "/win", { id, opponent, points })
      .then((res) => {
        console.log("Successfully added points to database")
      })
      .catch((err) => {
        this.setState({ error: err.message })
      })
  }

  handleWin = () => {
    // How many points did we gain? Depends on how many cards opponent has left
    let numCards = this.state.opponent.cards
    let points = numCards === 13 ? 39 : numCards > 9 ? numCards * 2 : numCards

    //Update the database
    this.updateDatabase(points)

    this.setState((prevState) => ({
      ...prevState,
      showRematch: true,
      winner: this.state.playerNumber,
      score: this.state.score + points,
    }))
  }

  // User has clicked rematch button on Modal
  rematch = () => {
    this.setState({ pressedOneMore: true })
    // If player is waiting, start the new game
    if (this.state.oneWaiting) {
      this.socket.emit("accept", this.state.opponent.id, (response) => {
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
    this.socket.emit("action", "rematch", this.state.opponent.id)
    this.setState({ oneWaiting: true })
  }

  playCards = () => {
    const numCards = this.state.selected.length
    let boardRank = 0

    // If trying to play zero cards, return
    if (numCards < 1) return

    // If there is a board, check our submission is the same number of cards, if not return
    if (this.state.board && this.state.board.length !== numCards) {
      this.setState({ error: config.MESSAGE.ERROR.NUM_CARDS })
      return
    }

    // When they submit 3 cards we only need to make sure all cards are the same and one cards beats one board card
    if (numCards <= 3) {
      if (this.legalThreeCardHand) {
        this.handleHandSubmit()
        return
      }
      this.setState({ error: config.MESSAGE.ERROR.NOT_ALLOWED })
      return
    }

    // Don't allow 4 card hands
    if (numCards === 4) {
      this.setState({ error: config.MESSAGE.ERROR.FOUR_CARDS })
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
      if (handRank > boardRank) this.handleHandSubmit()
      // If the board is strictly better, return with error
      else if (handRank < boardRank) {
        this.setState({ error: config.MESSAGE.ERROR.NOT_BEAT_BOARD })
        return
      }
      // Otherwise hands be of equal strict value so we need to investigate further
      else if (this.winOnTieBreak(handRank)) this.handleHandSubmit()
    }
  }

  // This functions checks if the submission is a legal three card hand
  legalThreeCardHand = () => {
    let beatsBoard = true
    let legal = this.state.selected.every(
      (card) => card.rankValue === this.state.selected[0].rankValue
    )
    // Check if our best cards value beats the current best card
    if (this.state.board)
      beatsBoard = this.state.selected.some(
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
        const modeCard = this.modeCard(this.state.selected)
        const modeBoardCard = this.modeCard(this.state.board)
        if (modeCard.value < modeBoardCard.value) {
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
  handleHandSubmit = () => {
    // Emit our hand to opponent, if emit unsuccessful, we must win by default
    this.socket.emit(
      "play",
      this.state.selected,
      this.state.opponent.id,
      (res) => {
        if (res === "offline") {
          this.handleWin()
          return
        }

        this.setState(
          (prevState) => ({
            ...prevState,
            board: this.state.selected.sort(this.byRank),
            activePlayer: this.state.activePlayer === 1 ? 2 : 1,
            hand: this.state.hand.filter((card) => {
              return !this.state.selected.includes(card)
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
              this.socket.emit("action", "win", this.state.opponent.id)
              this.handleWin()
            }
          }
        )
      }
    )
  }

  // Return the rank of our hand
  // Invalid = 0, Straight = 1, Flush = 2, Full house = 3, Quads = 4, Straight flush = 5, Royal flush = 6
  handRanking = (hand) => {
    let straight
    const flush = hand.every((card) => card.suit === hand[0].suit)

    // Get the number of unique card ranks in our hand
    const unique = [...new Set(hand.map((card) => card.rankValue))]

    // If there are only two unique cards in the hand we must have Full house or Quads
    if (unique.length === 2) {
      var countFirst = hand.reduce((n, card) => {
        return n + (card.rankValue === hand[0].rankValue)
      }, 0)
      if (countFirst === 2 || countFirst === 3) return 3 // Full house
      return 4 // Quads
    }

    // Straights check
    if (unique.length === 5) {
      const sortedHand = hand.sort(this.byRank)

      straight = true
      for (let i = 1; i < sortedHand.length; i++) {
        if (sortedHand[i].rankValue !== sortedHand[i - 1].rankValue + 1) {
          if (
            (i === 3 || i === 4) &&
            sortedHand[i].rankValue === sortedHand[i - 1].rankValue + 9
          )
            continue
          straight = false
          break
        }
      }
    }

    //Royal flush
    let containsAceKing =
      hand.some((e) => e.rank === "K") && hand.some((e) => e.rank === "A")
    if (flush && straight && containsAceKing) return 6

    // Straight flush
    if (flush && straight) return 5

    if (flush) return 2
    if (straight) return 1
    return 0
  }

  // Utility functions
  byRank = (a, b) => {
    if (a.rankValue > b.rankValue) return 1
    if (a.rankValue < b.rankValue) return -1
    return 0
  }

  modeCard = (arr) => {
    return [...arr]
      .sort(
        (a, b) =>
          arr.filter((v) => v.rank === a.rank).length -
          arr.filter((v) => v.rank === b.rank).length
      )
      .pop()
  }
}

export default Game
