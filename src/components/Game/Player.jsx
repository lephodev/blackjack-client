import { useParticipant } from "@videosdk.live/react-sdk";
import { useEffect, useRef, useState } from "react";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { Dropdown } from "react-bootstrap";
import PlayerTimer from "./PlayerTimer";
import BubbleMessage from "./BubbleMessage";
import { socket } from "../../config/socket";
import numFormatter from "../../config/utils";

import ProfilePic from "../../imgs/blackjack/profile_user.jpg";

const Player = ({
  player,
  gameFinish,
  letTime,
  roomData,
  videoPlayer,
  participantId,
  userId,
  toggleMic,
  toggleWebcam,
  currentPlayer,
}) => {
  const [message, setMessage] = useState("");
  const [messageBy, setMessageBy] = useState();
  const webcamRef = useRef(null);
  const micRef = useRef(null);
  const onStreamEnabled = (stream) => {};
  const onStreamDisabled = (stream) => {};
  const { webcamStream, micStream, webcamOn, micOn } = useParticipant(
    participantId,
    {
      onStreamEnabled,
      onStreamDisabled,
    }
  );
  useEffect(() => {
    if (webcamRef.current) {
      if (webcamOn) {
        const mediaStream = new MediaStream();
        mediaStream.addTrack(webcamStream.track);

        webcamRef.current.srcObject = mediaStream;
        webcamRef.current
          .play()
          .catch((error) =>
            console.error("videoElem.current.play() failed", error)
          );
      } else {
        webcamRef.current.srcObject = null;
      }
    }
  }, [webcamStream, webcamOn]);

  useEffect(() => {
    if (micRef.current) {
      if (micOn) {
        const mediaStream = new MediaStream();
        mediaStream.addTrack(micStream.track);

        micRef.current.srcObject = mediaStream;
        micRef.current
          .play()
          .catch((error) =>
            console.error("audioElem.current.play() failed", error)
          );
      } else {
        micRef.current.srcObject = null;
      }
    }
  }, [micStream, micOn]);

  useEffect(() => {
    socket.on("newMessage", (data) => {
      setMessage(data.message);
      setMessageBy(data.userId);
      setTimeout(() => {
        setMessage("");
        setMessageBy("");
      }, 10000);
    });
  }, []);
  return (
    <div
      className={`blackjack-players player${
        videoPlayer ? videoPlayer?.position : player?.position
      } ${player?.turn ? "active-player" : ""}`}
      key={player?.id}
    >
      {player?.isSplitted ? (
        <div className="split-result">
          {player?.cards.map((splitHand, i) => (
            <div
              className={`player-cards-box split ${
                player.splitIndex === i ? "activeCard" : ""
              }`}
              key={`item-${i}`}
            >
              {splitHand?.map((card, l) => (
                <div
                  className="player-card split-card"
                  key={card.value.card + card.suit + l}
                >
                  <img
                    src={
                      require(`../../imgs/blackjack/cards/${
                        card.value.card + card.suit
                      }.svg`).default
                    }
                    alt=""
                  />
                </div>
              ))}
              <div className="player-sum">
                <span key={`item-${i}`} className="split-sum">
                  {typeof player.splitSum[i] === "number"
                    ? `(${player.splitSum[i]}),`
                    : `(${player.splitSum[i].join(", ")}),`}
                </span>
              </div>
              <div className="split-game-result">
                {player.isPlaying && gameFinish ? (
                  <div
                    className={`player-result split-result ${
                      player.splitSum[i] > 21
                        ? "busted"
                        : player.hands[
                            player.hands.length - player.splitSum.length + i
                          ]?.action === "blackjack-win"
                        ? "blackjack"
                        : player.hands[
                            player.hands.length - player.splitSum.length + i
                          ]?.action === "game-draw"
                        ? "draw"
                        : player.hands[
                            player.hands.length - player.splitSum.length + i
                          ]?.action === "game-win"
                        ? "win"
                        : "lose"
                    }`}
                  >
                    {player.splitSum[i] > 21
                      ? "Bust"
                      : player.hands[
                          player.hands.length - player.splitSum.length + i
                        ]?.action === "blackjack-win"
                      ? "Blackjack"
                      : player.hands[
                          player.hands.length - player.splitSum.length + i
                        ]?.action === "game-draw"
                      ? "Draw"
                      : player.hands[
                          player.hands.length - player.splitSum.length + i
                        ]?.action === "game-win"
                      ? "Win"
                      : "Lose"}
                  </div>
                ) : (
                  ""
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="player-cards-box">
          {player?.cards?.map((card, l) => (
            <div className="player-card" key={card.value.card + card.suit + l}>
              <img
                src={
                  require(`../../imgs/blackjack/cards/${
                    card.value.card + card.suit
                  }.svg`).default
                }
                alt=""
              />
            </div>
          ))}
        </div>
      )}
      {videoPlayer ? (
        <audio ref={micRef} muted={userId === videoPlayer.id} autoPlay />
      ) : (
        ""
      )}
      {/* player bet amount */}
      {player?.isPlaying ? (
        <div className="user-bet-amount">
          <span>{player.betAmount ? numFormatter(player.betAmount) : 0}</span>
        </div>
      ) : (
        ""
      )}
      {/* player bet amount */}
      <div className="blackjack-player-avatar">
        {currentPlayer?.id === player?.id &&
        letTime &&
        player?.turn &&
        player.action === "" ? (
          <TimerSeparator time={roomData?.timer} remainingTime={letTime} />
        ) : (
          ""
        )}

        {roomData.media === "video" && videoPlayer && webcamOn ? (
          <video ref={webcamRef} autoPlay muted playsInline webkitPlaysInline />
        ) : (
          <img src={ProfilePic} alt="off-camera" />
          // <video ref={webcamRef} autoPlay />
        )}
      </div>
      <div className="player-with-icons">
        {videoPlayer?.id === userId ? (
          <div className="cam-tool">
            <Dropdown>
              <Dropdown.Toggle variant="success" id="dropdown-basic">
                <i class="fa fa-ellipsis-v" aria-hidden="true"></i>
              </Dropdown.Toggle>

              <Dropdown.Menu>
                <span className="dropdown-item">
                  <i
                    onClick={() => {
                      toggleMic();
                    }}
                    className={`cursor ${
                      micOn
                        ? "fas fa-microphone-alt"
                        : "fas fa-microphone-alt-slash"
                    }`}
                  ></i>
                  {roomData?.media === "video" ? (
                    <i
                      onClick={() => toggleWebcam()}
                      className={`cursor ${
                        webcamOn ? "fas fa-video" : "fas fa-video-slash"
                      }`}
                    ></i>
                  ) : (
                    ""
                  )}
                </span>
              </Dropdown.Menu>
            </Dropdown>
          </div>
        ) : (
          ""
        )}

        <div className="blackjack-player-name">{player?.name}</div>
        {player?.id === messageBy ? <BubbleMessage message={message} /> : ""}
        {!player?.isSplitted && player?.sum !== 0 ? (
          <div className="player-sum">
            {typeof player?.sum === "number"
              ? player?.sum
              : player?.sum.join(", ")}
          </div>
        ) : (
          ""
        )}
      </div>
      {player?.isPlaying &&
      !player?.isSplitted &&
      (player?.isBusted || gameFinish || player?.blackjack) ? (
        <div
          className={`player-result ${
            player?.isBusted
              ? "busted"
              : player?.hands[player.hands.length - 1]?.action ===
                  "blackjack-win" || player.blackjack
              ? "blackjack"
              : player?.hands[player.hands.length - 1]?.action === "game-draw"
              ? "draw"
              : player?.hands[player.hands.length - 1]?.action === "game-win"
              ? "win"
              : "lose"
          }`}
        >
          {player?.isBusted
            ? "Bust"
            : player?.hands[player.hands.length - 1]?.action ===
                "blackjack-win" || player.blackjack
            ? "Blackjack"
            : player?.hands[player.hands.length - 1]?.action === "game-draw"
            ? "Draw"
            : player?.hands[player.hands.length - 1]?.action === "game-win"
            ? "Win"
            : "Lose"}
        </div>
      ) : (
        ""
      )}
    </div>
  );
};

export default Player;

const TimerSeparator = ({ time, remainingTime }) => {
  const [activeTime, setActiveTime] = useState(100);
  useEffect(() => {
    if (remainingTime && time) {
      let percent = (remainingTime / time) * 100;
      setActiveTime(parseInt(percent));
    }
  }, [remainingTime]);
  return (
    <div class="battery">
      <CircularProgressbar
        counterClockwise
        value={activeTime}
        strokeWidth={50}
        styles={buildStyles({
          strokeLinecap: "butt",
        })}
      />
    </div>
  );
};
