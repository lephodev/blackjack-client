const ExitRoom = ({ setModalShow, handleExitRoom, handleClick }) => {
  return (
    <>
      <button id="leave-button" onClick={handleExitRoom}>
        <i className="fas fa-sign-out-alt"></i> Exit <span>Room</span>
      </button>
      <button id="buy-button" onClick={() => setModalShow(true)}>
        <i className="fa fa-database"></i> Buy <span>Coins</span>
      </button>
      <button id="chat-button" onClick={() => handleClick()}>
        <i className="fa fa-comments" aria-hidden="true"></i>
      </button>
    </>
  );
};

export default ExitRoom;
