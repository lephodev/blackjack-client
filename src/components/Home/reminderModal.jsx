/* eslint-disable react/prop-types */
import React from "react";
import { Button, Modal } from "react-bootstrap";
import "./reminder.css";
import { landingClient } from "../../config/keys";

function ReminderModal({ reminderShow, setReminderShow }) {
  const handleSettingRedirection = () => {
    setReminderShow(false);
    window.location.href = `${landingClient}/deactivateAccount`;
  };
  return (
    <Modal
      className="reminder-time"
      centered
      size="lg"
      show={reminderShow}
      backdrop="static"
    >
      <Modal.Body>
        <div className="reminder-setting-grid">
          <div className="reminder-setting-title">
            <h5>
              You have been active for <br /> 15 minutes
            </h5>
          </div>
        </div>
      </Modal.Body>
      <div className="reminder-btn-grid">
        <Button className="yellow-Btn" onClick={() => setReminderShow(false)}>
          I’m aware, continue playing!
        </Button>
        <Button className="dark-Btn" onClick={() => handleSettingRedirection()}>
          Take a break
        </Button>
      </div>
    </Modal>
  );
}
export default ReminderModal;
