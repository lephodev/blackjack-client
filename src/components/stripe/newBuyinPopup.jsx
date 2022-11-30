import React from "react";
import { Button, Modal } from "react-bootstrap";

const NewBuyInPopup = ({
  setBuyinPopup,
  buyinPopup,
  setNewBuyInPopUp,
  leaveTable,
}) => {
  return (
    <Modal show={buyinPopup} centered className="friends-popup leave-confirm">
      <Modal.Body>
        <div className="block">
          <p>
            Your wallet balance is 0 <br /> Please add coin to play.
          </p>
          <div className="sub-btn text-center">
            <Button
              onClick={() => {
                setBuyinPopup(true);
                setNewBuyInPopUp(false);
              }}
            >
              Buy In
            </Button>
            <Button
              onClick={() => {
                leaveTable();
              }}
            >
              Leave Table
            </Button>
          </div>
        </div>
      </Modal.Body>
    </Modal>
  );
};
export default NewBuyInPopup;
