import user from "../../imgs/blackjack/profile_user.jpg";
import mafia from "../../imgs/blackjack/profile_user.jpg";
import casino from "../../imgs/blackjack/profile_user.jpg";
import baby from "../../imgs/blackjack/profile_user.jpg";
import terrorist from "../../imgs/blackjack/profile_user.jpg";
import detective from "../../imgs/blackjack/profile_user.jpg";
import workout from "../../imgs/blackjack/profile_user.jpg";
import manager from "../../imgs/blackjack/profile_user.jpg";
import { useContext, useEffect, useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import { socket } from "../../config/socket";
import GameContext from "../../Context";

const CreateGame = () => {
  const history = useHistory();
  const tableId = useParams();
  const { setRoomData, setUserId, userId } = useContext(GameContext);
  const [slides] = useState([
    user,
    mafia,
    casino,
    baby,
    terrorist,
    detective,
    workout,
    manager,
  ]);
  const [activeSlide, setActiveSlide] = useState(user);
  const [name, setName] = useState("");
  const [roomId, setRoomId] = useState("");

  const changeSlide = (oldSlide) => {
    let index = slides.findIndex((el) => el === activeSlide);
    if (index !== -1) {
      setActiveSlide(slides[(index + oldSlide) % slides.length]);
    }
  };

  const handleCreateGame = () => {
    if (name === "") return alert("Please enter name");
    socket.emit("createGame", {
      userId,
      name,
      avatar: activeSlide,
    });
  };

  const handleJoinGame = () => {
    if (name === "") return alert("Please enter name");
    socket.emit("joinGame", {
      userId,
      name,
      avatar: activeSlide,
      roomId,
    });
  };
  return (
    <div id="main-menu" className="">
      <div id="main-box">
        <h1 id="blackjack-title">Blackjack</h1>
        <div id="avatar-box">
          <button className="prev" onClick={() => changeSlide(1)}>
            <i className="fas fa-chevron-left"></i>
          </button>
          <span className="slideAvatars" data-value="user">
            <img src={activeSlide} alt="avatar" />
          </span>
          <button className="next" onClick={() => changeSlide(1)}>
            <i className="fas fa-chevron-right"></i>
          </button>
        </div>
        <div className="form-group">
          <input
            className="form-control"
            id="nickname"
            type="text"
            placeholder="Nickname"
            maxLength="12"
            defaultValue={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div className="form-group">
          <input
            className="form-control"
            id="nickname"
            type="text"
            placeholder="Room ID"
            maxLength="12"
            defaultValue={roomId}
            onChange={(e) => setRoomId(e.target.value)}
          />
        </div>

        <div className="join-btns">
          <button
            id="btnCreate"
            onClick={handleCreateGame}
            className={`play-btn ${roomId ? "hide-element" : ""}`}
          >
            <span>
              <i className="fas fa-users"></i>
            </span>
            Create Room
          </button>
          <button
            id="btnJoin"
            onClick={handleJoinGame}
            className={`play-btn ${roomId ? "" : "hide-element"}`}
          >
            <span>
              <i className="fas fa-users"></i>
            </span>
            Join Room
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateGame;
