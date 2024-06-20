import React from "react"
import { useLocation, useNavigate } from "react-router-dom"

const withLocation = (Component) => {
  return (props) => {
    const location = useLocation()
    const navigate = useNavigate()
    return <Component {...props} location={location} navigate={navigate} />
  }
}

export default withLocation
