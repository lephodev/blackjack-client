import React from "react";
import { Modal } from "react-bootstrap"
import tourimg from "../../imgs/blackjack/tour-img.png"
const TourPopup = ({ isTourOpen, handleClose }) => {

    return (
        <Modal show={isTourOpen} onHide={handleClose} centered className="tour-popup">
            <Modal.Header closeButton>
                <Modal.Title>How to play</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div className="tour-content">

                    <div className="tour-image">
                        <img src={tourimg} alt="" />
                    </div>

                    <div className="tour-info">
                        <p>Please click on the chips to place your bet and click Bet Now button.</p>
                        <button className="tour-info-btn" type='button' onClick={() => { localStorage.setItem("DontShowAgain",true); handleClose() }}>Don't show me again</button>
                    </div>
                </div>
            </Modal.Body>
        </Modal>
    );
};

export default TourPopup;
