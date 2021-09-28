module.exports = {
  HOME_URL: "/",
  LOGIN_URL: "/login",
  DASHBOARD_URL: "/dashboard",
  REGISTER_URL: "/register",
  GAME_URL: "/play",
  RULES_URL: "/rules",
  SERVER_URL:
    !process.env.NODE_ENV || process.env.NODE_ENV === "development"
      ? "http://192.168.0.50:4000"
      : "https://daidi-server.herokuapp.com",
  PROCESS: process.env,
}
