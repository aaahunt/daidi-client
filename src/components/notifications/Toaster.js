import React, { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { Slide, toast, ToastContainer } from "react-toastify"

import { clearToast } from "modules/toast/actions"
import { toastSelector } from "modules/toast/selectors"

import "react-toastify/dist/ReactToastify.css"

export default function Toaster() {
  const dispatch = useDispatch()
  const { message, type } = useSelector(toastSelector)

  const closeToast = () => {
    dispatch(clearToast())
  }

  useEffect(() => {
    if (message) {
      toast(message, {
        position: "bottom-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        pauseOnFocusLoss: true,
        transition: Slide,
        onClose: closeToast,
        type: type,
      })
      toast.onChange((toastItem) => {
        if (toastItem.status === "removed") {
          closeToast()
        }
      })
    }
  })
  return (
    <aside>
      <ToastContainer />
    </aside>
  )
}
