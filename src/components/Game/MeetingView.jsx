import { useMeeting } from "@videosdk.live/react-sdk";
import { useEffect } from "react";
import { socket } from "../../config/socket";
import Players from "./Players";

const MeetingView = ({
  roomData,
  letTime,
  gameFinish,
  videoPlayers,
  userId,
  players,
  currentPlayer,
}) => {
  const onSpeakerChanged = (activeSpeakerId) => {};
  function onParticipantJoined(participant) {}
  function onParticipantLeft(participant) {}

  function onMainParticipantChanged(participant) {}
  function onEntryRequested(participant) {
    if (roomData.hostId === userId) {
      participant.allow();
    } else participant.deny();
  }
  function onEntryResponded(participantId, name) {}

  function onMeetingJoined() {}
  function onMeetingLeft() {}
  const { join, leave, toggleMic, toggleWebcam, participants, end } =
    useMeeting({
      onParticipantJoined,
      onParticipantLeft,
      onSpeakerChanged,
      onMainParticipantChanged,
      onEntryRequested,
      onEntryResponded,
      onMeetingJoined,
      onMeetingLeft,
    });

  useEffect(() => {
    setTimeout(() => {
      if (participants) join();
    }, 1000);
    return leave();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    socket.on("roomFinished", () => {
      if (roomData.hostId === userId) {
        end();
      }
    });
    return leave();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <Players
      players={players}
      roomData={roomData}
      letTime={letTime}
      gameFinish={gameFinish}
      toggleMic={toggleMic}
      toggleWebcam={toggleWebcam}
      videoPlayers={videoPlayers}
      userId={userId}
      currentPlayer={currentPlayer}
    />
  );
};

export default MeetingView;
