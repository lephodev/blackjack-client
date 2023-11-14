import { useState, useEffect } from "react";
import { Route, BrowserRouter as Router, Switch } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Game from "./components/Game/Game";
import GameContext from "./Context";
import "bootstrap/dist/css/bootstrap.min.css";
import "./css/dist/style.css";
import "./css/dist/blackjack.css";
import Home from "./components/Home/home";
import Error404 from "./components/ErrorPage/Error404";
import axios from "axios";
import { authInstance } from "./utils/axios.config";
import scroogeHat from "./imgs/blackjack/Loader.webp";

// import { getCookie } from "./config/utils";
// import contants from './config/contants'
// import axios from 'axios';
const App = () => {
  const [roomData, setRoomData] = useState({});
  const [userId, setUserId] = useState("");
  const [userInAnyGame, setUserInAnyGame] = useState();
  const [isVPNEnable, setIsVPNEnable] = useState(false);
  const [stateBlock, setStateBlock] = useState(false);
  //   const checkUserInGame=async()=>{
  //     let userData = await axios({
  //       method: "get",
  //       url: `${contants.landingServerUrl}/users/checkUserInGame`,
  //       headers: { authorization: `Bearer ${getCookie("token")}` },
  //     });

  //     console.log({dekk:userData?.data})
  //     if(userData?.data){
  //       setUserInAnyGame(userData.data)
  //     }
  //   }
  // useEffect(()=>{
  //   checkUserInGame()
  // },[])

  const checkVPN = async () => {
    try {
      const res = await fetch("https://geolocation-db.com/json/").then(
        (response) => response.json()
      );
      const CurrentIp = res?.IPv4;
      // const apiUrl = `http://api.vpnblocker.net/v2/json/${CurrentIp}`;
      const serverUrl = `/validate_VPN?ip=${CurrentIp}&timezone=${null}`;
      const checkVPNRes = await authInstance().get(serverUrl);
      setIsVPNEnable(checkVPNRes?.data?.vpnStatus);

      console.log("checkVPNRes", checkVPNRes);
    } catch (error) {
      console.log("err", error);
    }
  };

  useEffect(() => {
    (async () => {
      const res = await axios.get("https://geolocation-db.com/json/");
      const CurrentIp = res?.data?.IPv4;
      // eslint-disable-next-line no-console
      // console.log("CurrentIpAddress", CurrentIp);

      const res1 = await axios.get(`https://ipapi.co/${CurrentIp}/city`);
      // eslint-disable-next-line no-console
      // console.log("city", res1?.data);
      const CurrentCity = res1?.data;
      // eslint-disable-next-line no-constant-condition
      if (
        CurrentCity.toString() === "Washington" ||
        CurrentCity.toString() === "Quebec" ||
        CurrentCity.toString() === "Mumbai" ||
        CurrentCity.toString() === "Idaho"
      ) {
        setStateBlock(true);
        // navigates("/CountryBlockblock");
      }
      await checkVPN();
    })();
  }, []);
  return (
    <>
      {stateBlock || isVPNEnable ? (
        <div className='ip-block-content'>
          <div className='container'>
            <div className='ip-block-grid'>
              <img
                src={scroogeHat}
                alt='Scrooge Hat'
                width={96}
                height={96}
                loading='lazy'
              />
              <p className='ip-block'>
                {isVPNEnable
                  ? "VPN detected please turn off the VPN and access again, Thank you!."
                  : "We are sorry to inform you, but this application is restricted from access in your location"}
              </p>
            </div>
          </div>
        </div>
      ) : (
        <GameContext.Provider
          value={{
            roomData,
            setRoomData,
            userId,
            setUserId,
            userInAnyGame,
            setUserInAnyGame,
          }}>
          <Router>
            <Switch>
              <Route exact path='/'>
                <Home />
              </Route>
              <Route exact path='/game' component={Game} />
              <Route exact path='*' component={Error404} />
            </Switch>
          </Router>
          <div className='abc'>
            <Toaster
              position='top-center'
              reverseOrder={false}
              toastOptions={{
                className: "custom-toast",
              }}
            />
          </div>
        </GameContext.Provider>
      )}
    </>
  );
};

export default App;
