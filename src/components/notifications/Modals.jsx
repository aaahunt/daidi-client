import Modal from "react-bootstrap/Modal"
import Button from "react-bootstrap/Button"
import React from "react"

const Modals = (props) => {
  return (
    <>
      {/* Rematch Modal */}
      <Modal
        show={props.showRematch}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header>
          <Modal.Title id="contained-modal-title-vcenter">
            {props.winner && props.winner === props.playerNumber
              ? `You win! You gain ${props.winnersPoints} points.`
              : `You lose. Your opponent gains ${props.winnersPoints} points`}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {props.hand.length > 0 && props.winner === props.playerNumber && (
            <p>Your opponent resigned!</p>
          )}
          <p>Would you like to play again?</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={props.leaveGame}>
            No, I quit!
          </Button>
          <Button
            variant="primary"
            disabled={props.pressedOneMore}
            onClick={props.rematch}
          >
            Okay, one more
          </Button>
          {props.oneWaiting && (
            <div className="waiting">
              <p>1/2 Waiting...</p>
            </div>
          )}
        </Modal.Footer>
      </Modal>

      {/* Opponent left Modal */}
      <Modal
        show={props.showOppLeft}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header>
          <Modal.Title id="contained-modal-title-vcenter">
            Your opponent left, you win!
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Go back to the dashboard to find a new game.</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={props.leaveGame}>
            Back
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  )
}

export default Modals
