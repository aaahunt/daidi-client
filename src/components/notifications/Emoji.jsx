import Toast from "react-bootstrap/Toast"

const Emoji = ({ children, show, clearMessage }) => {
  return (
    <Toast show={show} onClose={clearMessage} autohide delay={5000} id="emoji">
      <Toast.Body>{children}</Toast.Body>
    </Toast>
  )
}

export default Emoji
