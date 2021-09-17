// Axios library for simplified HTTP requests
import axios from "axios"

// Components
import React from "react"
import Board from "./Board"
import Opponent from "./Opponent"
import Player from "./Player"
import Modals from "./Modals"

// Config vars
import { SocketContext } from "../context/socket"
import { DASHBOARD_URL, SERVER_URL } from "../config"

const initState = {
  opponent: null,
  score: 0,
  selected: [],
  sortOrder: "rank",
  board: null,
  winner: null,
  // For modals
  showRematch: false,
  showOppLeft: false,
  oneWaiting: false,
  pressedOneMore: false,
}

class Game extends React.Component {
  // Retrieve our socket from context
  static contextType = SocketContext
  socket = this.context

  state = {
    ...initState,
    ...this.props.state, // Grab the state from App
    ...this.props.location.state, // Grab the game init state passed in by server
  }

  componentDidMount() {
    if (this.state.opponent) {
      axios.get(SERVER_URL + "/games?id=" + this.state.id).then((res) => {
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

    // Retrieve game state from cookies upon mount
    // const storedState = sessionStorage.getItem("game")
    // this.setState(JSON.parse(storedState))

    // Add socket listeners
    this.socket.on("played", this.handleOpponentPlay)
    this.socket.on("passed", this.handleOpponentPass)
    this.socket.on("lost", this.handleLoss)
    this.socket.on("quit", this.handleQuitter)
    this.socket.on("resignation", this.handleResignation)
    this.socket.on("rematch", this.handleRematchOffer)
    this.socket.on("accepted", this.handleRematchAccepted)
  }

  componentDidUpdate() {
    // Update game state stored in cookies
    sessionStorage.setItem("game", JSON.stringify(this.state))
  }

  setStateUsingCookies = () => {
    if (this.state.id !== null) return

    const user = sessionStorage.getItem("user")
    if (!user) return
  }

  render() {
    if (!this.state.opponent)
      return (
        <section className="d-flex justify-content-center position-absolute top-50 start-50 translate-middle">
          <div className="text-center p-3 rounded-0">
            <h1>No Game in progress</h1>
          </div>
        </section>
      )

    return (
      <main className="d-grid text-center">
        <Opponent {...this.state.opponent} />
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
          leaveGame={this.leaveGame}
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

  resign = () => {
    // How many points did our opponent gain? Depends on how many cards we have left
    let numCards = this.state.hand.length
    let points = numCards === 13 ? 39 : numCards > 9 ? numCards * 2 : numCards

    this.socket.emit("resign", this.state.opponent.id)
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

  leaveGame = () => {
    sessionStorage.removeItem("game")
    this.props.history.push(DASHBOARD_URL)
  }

  quitGame = () => {
    this.socket.emit("quitter", this.state.opponent.id)
    sessionStorage.removeItem("game")
    this.setState(initState)
    this.props.location.state = null
  }

  handleOpponentPlay = (hand) => {
    this.setState((prevState) => ({
      ...prevState,
      board: hand,
      activePlayer: this.state.activePlayer === 1 ? 2 : 1,
      opponent: {
        ...prevState.opponent,
        cards: this.state.opponent.cards - hand.length,
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

  handleResignation = () => {
    // How many points did we gain? Depends on how many cards opponent has left
    let numCards = this.state.opponent.cards
    let points = numCards === 13 ? 39 : numCards > 9 ? numCards * 2 : numCards

    this.setState((prevState) => ({
      ...prevState,
      showRematch: true,
      winner: this.state.playerNumber,
      score: this.state.score + points,
    }))
  }

  handleRematchOffer = () => {
    this.setState((prevState) => ({
      ...prevState,
      oneWaiting: true,
    }))
  }

  handleRematchAccepted = (response) => {
    this.setState((prevState) => ({
      ...initState,
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
    // Emit our hand to opponent, if emit unsuccessful, we must win by default
    this.socket.emit(
      "action",
      "pass",
      null,
      this.state.opponent.id,
      (response) => {
        if (response === "offline") {
          this.handleWin()
          return
        }
      }
    )

    this.setState((prevState) => ({
      ...prevState,
      selected: [],
      board: null,
      activePlayer: this.state.activePlayer === 1 ? 2 : 1,
      error: null,
    }))
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

    this.setState((prevState) => ({
      ...prevState,
      selected: [...prevState.selected, card],
    }))
  }

  clearSelection = () => {
    this.setState((prevState) => ({
      ...prevState,
      selected: [],
    }))
  }

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
    this.setState((prevState) => ({
      ...prevState,
      showOppLeft: true,
      winner: this.state.playerNumber,
      score: this.state.score + 1,
    }))
  }

  handleWin = () => {
    // How many points did we gain? Depends on how many cards opponent has left
    let numCards = this.state.opponent.cards
    let points = numCards === 13 ? 39 : numCards > 9 ? numCards * 2 : numCards

    this.setState((prevState) => ({
      ...prevState,
      showRematch: true,
      winner: this.state.playerNumber,
      score: this.state.score + points,
    }))
    this.socket.emit("winner", this.state.opponent.id)

    //Update the database
    let id = this.state.id
    let opponent = this.state.opponent.id

    axios
      .post(SERVER_URL + "/win", { id, opponent, points })
      .then((res) => {
        console.log("Successfully added point to database")
      })
      .catch((err) => {
        this.setState({ error: err.message })
      })
  }

  // User has clicked rematch button on Modal
  rematch = () => {
    this.setState({ pressedOneMore: true })
    // If player is waiting, start the new game
    if (this.state.oneWaiting) {
      this.socket.emit("accept", this.state.opponent.id, (response) => {
        this.setState((prevState) => ({
          ...initState,
          ...response,
          score: this.state.score,
          opponent: {
            ...prevState.opponent,
            score: this.state.opponent.score,
          },
        }))
      })
      return
    }
    this.socket.emit("rematch offer", this.state.opponent.id)
    this.setState({ oneWaiting: true })
  }

  playCards = () => {
    const numCards = this.state.selected.length
    let beatsBoard = false
    let boardRank = 0

    if (numCards < 1) return

    // If there is a board, check our submission is the same number of cards
    if (this.state.board) {
      if (this.state.board.length !== numCards) {
        this.setState({ error: "That's not the right number of cards" })
        return
      }
    }
    // If there isn't a board, set beatsBoard to true
    else beatsBoard = true

    // When they submit 3 cards we only need to make sure all cards are the same
    if (numCards <= 3) {
      const legal = this.state.selected.every(
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

      if (legal && beatsBoard) {
        this.handleHandSubmit()
        return
      }
      this.setState({ error: "Hmm, that's not allowed!" })
      return
    }

    // Don't allow 4 card hands
    if (numCards === 4) {
      this.setState({ error: "You can't play four cards, silly" })
      return
    }

    // The hard one
    if (numCards === 5) {
      // Invalid = 0, Straight = 1, Flush = 2, Full house = 3, Quads = 4, Straight flush = 5, Royal flush = 6
      let handRank = this.handRanking(this.state.selected)

      if (!handRank) {
        this.setState({ error: "That's not a valid poker hand" })
        return
      }

      if (this.state.board) boardRank = this.handRanking(this.state.board)

      if (handRank > boardRank) this.handleHandSubmit()
      else if (handRank < boardRank) {
        this.setState({ error: "That hand does not beat the board" })
        return
      } else {
        /* Handle the instance where they are the strict same value */

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
          // Straight and flush evaluated together, just looking for highest value card
          case 1:
          case 2:
          case 5:
            if (handMaxCard < boardMaxCard) {
              this.setState({ error: "That hand does not beat the board" })
              return
            }
            this.handleHandSubmit()
            return
          // Full house and quads evaluated at the same time, just looking at the highest value card for the most occuring card
          case 3:
          case 4:
            const modeCard = this.modeCard(this.state.selected)
            const modeBoardCard = this.modeCard(this.state.board)
            if (modeCard.value < modeBoardCard.value) {
              this.setState({ error: "That hand does not beat the board" })
              return
            }
            this.handleHandSubmit()
            return
          default:
            this.setState({ error: "Something went wrong there" })
            break
        }
      }
    }
  }

  // Play the selected hand
  handleHandSubmit = () => {
    // Emit our hand to opponent, if emit unsuccessful, we must win by default
    this.socket.emit(
      "action",
      "play",
      this.state.selected,
      this.state.opponent.id,
      (response) => {
        if (response === "offline") {
          this.handleWin()
          return
        }
      }
    )

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
      }),
      () => {
        if (this.state.hand.length === 0) this.handleWin()
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
