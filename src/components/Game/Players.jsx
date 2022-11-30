import { useMeeting } from "@videosdk.live/react-sdk";
import Player from "./Player";

const Players = ({
  players,
  roomData,
  letTime,
  gameFinish,
  toggleMic,
  toggleWebcam,
  videoPlayers,
  userId,
  currentPlayer,
}) => {
  if (roomData?.media === "video" || roomData.media === "audio") {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const { participants } = useMeeting() ? useMeeting() : {};
    return (
      <div
        className={`blackjack-players-container ${
          videoPlayers?.length !== 0
            ? `count-${videoPlayers.length === 2 ? 3 : videoPlayers.length}`
            : `count-${players.length === 2 ? 3 : players.length}`
        } `}
      >
        {chunk([...participants?.values()], videoPlayers)?.map((l, i) => (
          <Player
            key={l.id}
            roomData={roomData}
            letTime={letTime}
            gameFinish={gameFinish}
            player={players[i]}
            videoPlayer={videoPlayers[i]}
            toggleWebcam={toggleWebcam}
            toggleMic={toggleMic}
            participantId={l.id}
            userId={userId}
            currentPlayer={currentPlayer}
          />
        ))}
      </div>
    );
  }
  return (
    <div
      className={`blackjack-players-container ${`count-${
        players.length === 2 ? 3 : players.length
      }`}`}
    >
      {players.map((player) => (
        <Player
          roomData={roomData}
          letTime={letTime}
          gameFinish={gameFinish}
          player={player}
          key={player.id}
          userId={userId}
          currentPlayer={currentPlayer}
        />
      ))}
    </div>
  );
};

export default Players;

const chunk = (arr, players) => {
  let newArr = [];
  if (arr.length === 0) {
    return players;
  }
  for (let i = 0; i < players.length; i++) {
    let player = arr.find((el) => el.displayName === players[i].id);
    if (player) newArr.push(player);
    else newArr.push(players[i]);
  }
  return newArr;
};
