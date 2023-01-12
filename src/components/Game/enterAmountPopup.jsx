import React from "react";
import { useState } from "react";
import { Button, Form, Modal, Spinner } from "react-bootstrap";

const EnterAmountPopup = ({ handleSitin, showEnterAmountPopup, }) => {
  const [isLoading, setLoading] = useState(false);
  const [amount, setAmount] = useState('');

  const joinGame = () => {
    if(amount){
      setLoading(true);
      handleSitin(amount);
    }
  }

  const handleAmountChange = (e) => {
    const val = e.target.value;
    setAmount(val);
  }

  const redirectToLobby = () => {
    window.location.href = window.location.origin;
  }

  return (
    <Modal
      show={showEnterAmountPopup}
      centered
      className="friends-popup leave-confirm sitinPopup"
    >
      <Modal.Body>
        <div className="block">
          <Form.Group className="sitinPopup-div" controlId="formBasicEmail">
            <Form.Label>Enter sit in amount</Form.Label>
            <Form.Control type="number" placeholder="minimum amount: 100" />
          </Form.Group>

          <div className="sub-btn text-center">
            <Button
              className="exit-btn"
              onClick={joinGame}
              disabled={isLoading}
              onChange={handleAmountChange}
            >
              {isLoading ? <Spinner animation="border" /> : "Join"}
            </Button>
            <Button
              className="grey-btn"
              onClick={redirectToLobby}
            >
            Lobby
            </Button>
          </div>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default EnterAmountPopup;
