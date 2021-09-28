import Toast from "react-bootstrap/Toast"
import ToastContainer from "react-bootstrap/ToastContainer"
import Button from "react-bootstrap/Button"

import Message from "./Message"

const Notifications = ({
  children,
  acceptChallenge,
  declineChallenge,
  challenge,
  message,
  clearMessage,
}) => {
  return (
    <ToastContainer className="p-2" position="top-end">
      <Toast show={challenge !== null} onClose={declineChallenge}>
        <Toast.Header closeButton={false}>{children}</Toast.Header>
        <Toast.Body>
          <Button variant="success" onClick={acceptChallenge}>
            Okay, let's go.
          </Button>
          <Button variant="danger" className="ms-1" onClick={declineChallenge}>
            Not right now.
          </Button>
        </Toast.Body>
      </Toast>
      {message && (
        <Message
          show={message !== null}
          header={message.header}
          clearMessage={clearMessage}
        >
          {message.body}
        </Message>
      )}
    </ToastContainer>
  )
}

export default Notifications
