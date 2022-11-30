import { createContext } from "react";

const GameContext = createContext({
  roomData: {},
  setRoomData: (data) => {},
  userId: "",
  setUserId: () => {},
});

export default GameContext;
