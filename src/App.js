import { useState } from "react";
import { Route, HashRouter } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Game from "./components/Game/Game";
import GameContext from "./Context";
import "bootstrap/dist/css/bootstrap.min.css";
import "./css/dist/style.css";
import "./css/dist/blackjack.css";
import Home from "./components/Home/home";

const App = () => {
  const [roomData, setRoomData] = useState({});
  const [userId, setUserId] = useState("");

  return (
    <GameContext.Provider value={{ roomData, setRoomData, userId, setUserId }}>
      <HashRouter>
      <Route exact path="/game" component={Game} />
    
        <Route exact path="/">
          <Home />
        </Route>
      </HashRouter>
      <div className="abc">
        <Toaster
          position="top-center"
          reverseOrder={false}
          toastOptions={{
            className: "custom-toast",
          }}
        />
      </div>
    </GameContext.Provider>
  );
};

export default App;
