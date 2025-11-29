import { jwtDecode } from "jwt-decode"

export const storeTokenLocally = (token) => {
  localStorage.setItem("token", token)
}

export const getLocalToken = () => {
  return localStorage.getItem("token") || null
}

export const unsetLocalToken = () => {
  localStorage.removeItem("token")
}

export const validateLocalToken = () => {
  const token = getLocalToken()
  if (!token) return null

  return jwtDecode(token)
}
