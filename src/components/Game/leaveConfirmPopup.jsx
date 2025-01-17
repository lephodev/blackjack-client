import React from "react";
// import { useState } from "react";
import { Button, Modal, Spinner } from "react-bootstrap";

const LeaveConfirmPopup = ({ setConfirmExit, confirmExit, handleExitRoom, isLoading, setLoading }) => {
  return (
    <Modal
      show={confirmExit}
      onHide={() => {
        setConfirmExit(false);
        setLoading(false);
      }}
      centered
      className="friends-popup leave-confirm"
    >
      <Modal.Body>
        <div className="block">
          <p>Are sure you want to leave the Table ?</p>
          <div className="sub-btn text-center">
            <Button
              className="grey-btn"
              onClick={() => {
                setConfirmExit(false);
                setLoading(false);
              }}
            >
              Cancel
            </Button>
            <Button
              className="exit-btn"
              onClick={() => {
                setLoading(true);
                handleExitRoom();
              }}
              disabled={isLoading}
            >
              {isLoading ? <Spinner animation="border" /> : "Exit Room"}
            </Button>
          </div>
        </div>
      </Modal.Body>
    </Modal>
  );
};
export default LeaveConfirmPopup;
