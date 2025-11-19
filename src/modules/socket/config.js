import config from "config"

import { loginSuccess } from "modules/authentication/actions"
import { joinRoom, leaveRoom, sendMessage, socketConnected, socketDisconnected } from "./actions"
import { setRooms } from "modules/app/actions"

const socketConfig = {
  url: config.URL.SERVER,
  authEvent: loginSuccess.type,
  listeners: [
    {
      message: "connect",
      action: () => socketConnected(),
    },
    {
      message: "disconnect",
      action: () => socketDisconnected(),
    },
    {
      message: "games",
      action: (games) => setRooms(games),
    },
  ],
  subscribers: [
    {
      action: joinRoom,
      event: "joinRoom",
    },
    {
      action: leaveRoom,
      event: "leaveRoom",
    },
    {
      action: sendMessage,
      event: "sendMessage",
    },
  ],
}

export default socketConfig
