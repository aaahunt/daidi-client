import axios from "axios"
import config from "../config"

const server = axios.create({
  baseURL: config.URL.SERVER,
  withCredentials: true,
})

export default server
