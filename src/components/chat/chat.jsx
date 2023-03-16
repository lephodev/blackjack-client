import React, { useState } from 'react';
import logo from '../../imgs/blackjack/game1.png';
import close from '../../imgs/blackjack/close.png';
import './chat.css';
import { socket } from '../../config/socket';
import Picker from 'emoji-picker-react'
import { FaSmile } from "react-icons/fa"

const Chat = ({ open, handleClick, userId, tableId, openEmoji, setOpenEmoji }) => {
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    if (e.target.value.length <= 60) setMessage(e.target.value);
    socket.emit('typingOnChat', { tableId, userId, typing: true });
  };

  const handleMessage = (e) => {
    e.preventDefault();
    if (message.length === 0) {
      return false;
    }

    if (!message?.trim() || !message) {
      setMessage('');
      return;
    }

    socket.emit('chatMessage', {
      userId,
      message,
      tableId,
    });
    setMessage('');
  };

  const handleFocusedOut = () => {
    socket.emit('typingOnChat', { tableId, userId, typing: false });
  }

  const handleOnEmojiClick = (emojiObj, e) => {
    if (message.length !== 60) {
      console.log(emojiObj.emoji, " ", emojiObj.emoji.length);
      setMessage(message + emojiObj.emoji);
    }

  }

  const handleOpenEmoji = () => {
    setOpenEmoji(!openEmoji);
    // console.log(openEmoji);
  }

  const handleCloseChat = () => {
    handleClick(!open);
    setOpenEmoji(false);
  }

  return (
    <div className={`chat-wrapper ${ open ? `expand` : `` }`}>
      {openEmoji ? <Picker emojiStyle={{ width: "100%" }} onEmojiClick={handleOnEmojiClick} /> : null}
      <div className='chat-section'>
        {open ? (
          <div className='chat-header'>
            <span
              className='close-icon'
              onClick={handleCloseChat}
              role='presentation'>
              <img src={close} alt='close' />
            </span>
          </div>
        ) : (
          ''
        )}
        <div className='chat-content-box'>
          <div className='chat-content'>
            <div className='chat-logo'>
              <img src={logo} alt='logo' />
            </div>
            <span className='msg-limit'>
              Remaining Character - {60 - message.length}
            </span>
            <div className='chat-search chat-input'>
              <form className='form-inline' onSubmit={handleMessage}>
                <input
                  className='form-control'
                  type='text'
                  placeholder='Type message'
                  onChange={handleChange}
                  value={message}
                  onBlur={handleFocusedOut}
                />
                <button type='button' onClick={handleOpenEmoji}>
                  <FaSmile />
                </button>
                <button type='submit'>
                  <i className='fa fa-location-arrow' />
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div >
  );
};

export default Chat;
