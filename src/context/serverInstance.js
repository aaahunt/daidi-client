import axios from "axios"
import config from "../config"

const server = axios.create({
  baseURL: config.URL.SERVER,
  withCredentials: true,
})

server.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem("access_token")
    if (accessToken) config.headers.Authorization = `Bearer ${accessToken}`
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)


export default server
