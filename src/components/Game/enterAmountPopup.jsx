import React from "react";
import { useState } from "react";
import { Button, Form, Modal, Spinner } from "react-bootstrap";

const EnterAmountPopup = ({
  handleSitin,
  showEnterAmountPopup,
  submitButtonText,
  setShow,
  isLobbyBtnShow,
  handleExitRoom
}) => {
  const [isLoading, setLoading] = useState(false);
  const [amount, setAmount] = useState("");
  const [error, setError] = useState("");

  const joinGame = async (e) => {
    e.preventDefault();
    if (parseInt(amount) >= 100) {
      setLoading(true);
      const msg = await handleSitin(amount);
      setLoading(false);
      if (msg) {
        setError(msg);
      }
    } else if (parseInt(amount) < 100) {
      setError("Minimum amount to enter is 100.");
    } else {
      setError("Please enter amount.");
    }
  };
  const handleAmountChange = (e) => {
    const val = e.target.value;
    setAmount(val);
  };

  const redirectToLobby = () => {
    setError("");
    if (submitButtonText.toLowerCase().startsWith("refill")) {
      if (isLobbyBtnShow) {
        handleExitRoom()
        return
      } setShow(false);
    } else {
      window.location.href = window.location.origin;
    }
  };

  return (
    <Modal
      show={showEnterAmountPopup}
      centered
      className="friends-popup leave-confirm sitinPopup"
    >
      <Modal.Body>
        <div className="block">
          <Form.Group className="sitinPopup-div" controlId="formBasicEmail">
            <Form.Label>
              Enter{" "}
              {submitButtonText.toLowerCase().startsWith("refill")
                ? "refill"
                : "sit in"}{" "}
              amount
            </Form.Label>
            <Form.Control
              type="number"
              onChange={handleAmountChange}
              placeholder="minimum amount: 100"
            />
            {error && <p className="errorMessage">{error}</p>}
          </Form.Group>
          <div className="sub-btn text-center">
            <Button className="grey-btn" onClick={redirectToLobby}>
              {submitButtonText.toLowerCase().startsWith("refill")
                ? isLobbyBtnShow ? "Lobby" : "Close"
                : "Lobby"}
            </Button>
            <Button
              className="exit-btn"
              type="submit"
              onClick={joinGame}
              disabled={isLoading}
            >
              {isLoading ? <Spinner animation="border" /> : submitButtonText}
            </Button>
          </div>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default EnterAmountPopup;
