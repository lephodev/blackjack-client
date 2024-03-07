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
import { authInstance } from "./utils/axios.config";
import vpnbanner from "./imgs/blackjack/vpn-banner.webp";
import notaccess from "./imgs/blackjack/not-access.webp";

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

  const getGeoLocationDetails = async () => {
    try {
      // const apiUrl = `http://api.vpnblocker.net/v2/json/${CurrentIp}`;
      const serverUrl = `/auth/getgeolocationDetails`;
      const response = await (await authInstance()).get(serverUrl);
      console.log("response", response);
      const ipAddressObject = {
        [Object.keys(response.data)[1]]:
          response.data[Object.keys(response.data)[1]],
      };
      const ipAddressss = Object.keys(ipAddressObject).find(
        (key) => key !== "status"
      );
      if (ipAddressss) {
        const { country, region, city } = ipAddressObject[ipAddressss];
        if (
          country.toString() !== "United States" &&
          country.toString() !== "Canada" &&
          country.toString() !== "India"
        ) {
          setStateBlock(true);
        }
        if (
          city.toString() === "Quebec" ||
          // city.toString() === "Idaho" ||
          country.toString() === "Brazil" ||
          region.toString() === "Quebec" 
          // region.toString() === "Idaho" ||
          // region.toString() === "Michigan" ||
          // region.toString() === "Washington"
        ) {
          setStateBlock(true);
        }
      }
    } catch (error) {
      console.log("err", error);
    }
  };

  const checkVPN = async () => {
    try {
      if (localStorage.getItem("adminType") === "admin") return;
      const serverUrl = `/validate_VPN`;
      const checkVPNRes = await (await authInstance()).get(serverUrl);
      setIsVPNEnable(checkVPNRes?.data?.vpnStatus);
    } catch (error) {
      console.log("err", error);
    }
  };

  useEffect(() => {
    (async () => {
      await getGeoLocationDetails();
      await checkVPN();
    })();
  }, []);
  return (
    <>
      {stateBlock || isVPNEnable ? (
        <div className='ip-block-content'>
          <div className='container'>
            <div className='ip-block-grid'>
              {isVPNEnable ? (
                <img
                  src={vpnbanner}
                  alt='Scrooge VPN'
                  loading='lazy'
                  className='img-fluid maintance-img'
                />
              ) : (
                <img
                  src={notaccess}
                  alt='Scrooge Access'
                  loading='lazy'
                  className='img-fluid maintance-img'
                />
              )}
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
