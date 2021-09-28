import Toast from "react-bootstrap/Toast"

const Message = ({ children, header, show, clearMessage }) => {
  return (
    <Toast show={show} onClose={clearMessage} autohide delay={5000}>
      <Toast.Header>{header}</Toast.Header>
      <Toast.Body>{children}</Toast.Body>
    </Toast>
  )
}

export default Message
