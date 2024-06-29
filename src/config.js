var config = {}

config.PROCESS = process.env

// URLs
config.URL = {
  HOME: "/",
  LOGIN: "/login",
  DASHBOARD: "/dashboard",
  REGISTER: "/register",
  ROOM: "/room",
  RULES: "/rules",
  SERVER:
    !process.env.NODE_ENV || process.env.NODE_ENV === "development"
      ? "http://localhost:4000"
      : "https://server.dai-di.com",
}

// Game Variables
config.GAME = {
  TOP_MULTIPLIER: 3,
  MIDDLE_MULTIPLIER: 2,
  BOTTOM_MULTIPLIER: 1,
  WAIT_AFTER_LOSE: 2000,
}

// Initial App State
config.APP_INIT_STATE = {
  username: null,
  user_id: null,
  opponent: null,
  error: null,
  challenge: null,
  message: null,
}

// Initial Game State
config.GAME_INIT_STATE = {
  opponent: null,
  score: 0,
  selected: [],
  sortOrder: "rank",
  board: null,
  history: [],
  winner: null,
  error: null,
  emoji: null,

  // For modals
  showRematch: false,
  showOppLeft: false,
  oneWaiting: false,
  pressedOneMore: false,
}

// Messages
config.MESSAGE = {
  DECLINE: {
    header: "Declined",
    body: "Your opponent declined your challenge.",
  },
  PASS: "Hmm, okay... I pass",
  ERROR: {
    SERVER: "A server error has occured. Please try again later.",
    USER_SHORT: "Username too short",
    USER_INVALID: "Invalid username",
    PASSWORD: "Password is too weak",
    TAKEN: "That username is taken. Try another.",
    NUM_CARDS: "That's not the right number of cards",
    NOT_ALLOWED: "Hmm, that's not allowed!",
    FOUR_CARDS: "You can't play four cards, silly",
    INVALID_HAND: "That's not a valid poker hand",
    NOT_BEAT_BOARD: "That hand does not beat the board",
  },
  SUCCESS: {
    REGISTER: "You have successfully registered!",
    LOGOUT: "You have successfully logged out.",
  },
  CHALLENGE: {
    INCOMING: " has challenged you. What do you say?",
  },
  GAMES: {
    NONE: "You haven't played any games yet.",
    NONE_IN_PROGRESS: "No Game in progress",
  },
  PLAYERS: {
    NONE: "There are currently no online users. Try to refresh?",
    ONLY_YOU: "You're the only person online! You can't play with yourself.",
  },
  ROOMS: {
    NONE: "There are currently no active rooms.",
  },
  CONFIRM: {
    QUIT: "Are you sure you want to quit",
    RESIGN: "Are you sure you want to resign",
  },
  CREATOR: "Created by Ashley Hunt",
}

config.PASSWORD_STRENGTH = {
  MIN_STRENGTH: 2,
  BOUNDARIES: [
    {
      id: 0,
      value: "Too weak",
      minDiversity: 0,
      minLength: 0,
    },
    {
      id: 1,
      value: "Weak",
      minDiversity: 2,
      minLength: 6,
    },
    {
      id: 2,
      value: "Medium",
      minDiversity: 3,
      minLength: 7,
    },
    {
      id: 3,
      value: "Strong",
      minDiversity: 4,
      minLength: 8,
    },
  ],
}

module.exports = config
