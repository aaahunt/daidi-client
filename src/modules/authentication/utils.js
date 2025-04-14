export const setToken = (token) => {
  localStorage.setItem("token", token)
}

export const getToken = () => {
  return localStorage.getItem("token") || null
}

export const removeToken = () => {
  localStorage.removeItem("token")
}
