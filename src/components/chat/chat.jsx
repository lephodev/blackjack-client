import React, { useState } from "react";
import logo from "../../imgs/blackjack/logocoin.png";
import close from "../../imgs/blackjack/close.png";
import "./chat.css";
import { socket } from "../../config/socket";

const Chat = ({ open, handleClick, userId, tableId }) => {
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    if (e.target.value.length <= 60) setMessage(e.target.value);
  };

  const handleMessage = (e) => {
    e.preventDefault();
    if (message.length === 0) {
      return false;
    }
    socket.emit("chatMessage", {
      userId,
      message,
      tableId,
    });
    setMessage("");
  };

  return (
    <div className={`chat-wrapper ${open ? `expand` : ``}`}>
      <div className="chat-section">
        {open ? (
          <div className="chat-header">
            <span
              className="close-icon"
              onClick={() => handleClick(!open)}
              role="presentation"
            >
              <img src={close} alt="close" />
            </span>
          </div>
        ) : (
          ""
        )}
        <div className="chat-content-box">
          <div className="chat-content">
            <div className="chat-logo">
              <img src={logo} alt="logo" />
            </div>
            <span className="msg-limit">
              Remaining Character - {60 - message.length}
            </span>
            <div className="chat-search chat-input">
              <form className="form-inline" onSubmit={handleMessage}>
                <input
                  className="form-control"
                  type="text"
                  placeholder="Type message"
                  onChange={handleChange}
                  value={message}
                />

                <button type="submit">
                  <i className="fa fa-location-arrow" />
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;
