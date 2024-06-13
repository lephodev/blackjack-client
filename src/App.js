/* eslint-disable react-hooks/exhaustive-deps */
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
import userUtils from "./utils/userUtils";
// import CONSTANTS from "../src/config/contants";

// import { getCookie } from "./config/utils";
// import contants from './config/contants'
// import axios from 'axios';
const App = () => {
  const [roomData, setRoomData] = useState({});
  const [userId, setUserId] = useState("");
  const [userInAnyGame, setUserInAnyGame] = useState();
  const [isVPNEnable, setIsVPNEnable] = useState(false);
  const [stateBlock, setStateBlock] = useState(false);
  const [user, setUser] = useState();
  const [inactiveTime, setInactiveTime] = useState(0);
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
          city.toString() === "Idaho" ||
          country.toString() === "Brazil" ||
          region.toString() === "Quebec" ||
          region.toString() === "Idaho" ||
          region.toString() === "Michigan" ||
          region.toString() === "Washington"
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
      const userData = await userUtils.getAuthUserData();
      console.log("userData ===>", userData);
      setUser(userData?.data?.user);
      await getGeoLocationDetails();
      await checkVPN();
    })();
  }, []);

  const handleLogout = async () => {
    try {
      if (user?.id) {
        const tokenData = localStorage.getItem("refreshToken") || "";
        console.log("handle logout executed ==>");
        await (
          await authInstance()
        ).post(
          "/logout",
          { refreshToken: tokenData },
          { withCredentials: true, credentials: "include" }
        );
      }
      setUser();
      // window.location.href = `${CONSTANTS.landingClient}`;
    } catch (error) {
      console.log("error in Handlelogout", error);
    }
  };

  useEffect(() => {
    const resetTimer = () => {
      setInactiveTime(0);
    };
    const handleMouseMove = () => {
      resetTimer();
      console.log("executed ===>", user);
      if (user) {
        console.log("user============>", user);
        localStorage.setItem("lastActive", `${new Date()}`);
      }
    };
    const interval = setInterval(async () => {
      setInactiveTime((prevInactiveTime) => prevInactiveTime + 1);
      console.log("inactiveTime", inactiveTime);
      if (inactiveTime >= 30) {
        // Do something when the user has been inactive for 30 minutes
        console.log("User has been inactive for 30 minutes");
        await handleLogout();
        // You can perform additional actions or show a modal, etc.
        // Reset the timer after handling the inactivity
        resetTimer();
      }
    }, 60000); // 1 minute interval

    // Add event listeners to the component's DOM element
    const componentElement = document.getElementById("table-main-wrap");

    if (componentElement) {
      componentElement.addEventListener("mousemove", handleMouseMove);
    }
    return () => {
      // Clean up event listeners and intervals
      if (componentElement) {
        componentElement.removeEventListener("mousemove", handleMouseMove);
      }
      clearInterval(interval);
    };
  }, [inactiveTime, user]);

  // logout when user is inactive for a long time
  useEffect(() => {
    if (
      user &&
      localStorage.getItem("lastActive") &&
      localStorage.getItem("isAdmin") !== "admin"
    ) {
      const logout = async () => {
        localStorage.removeItem("lastActive");
        await handleLogout();
      };

      let lastActive = localStorage.getItem("lastActive");

      if (!lastActive && user) logout();

      lastActive = new Date(lastActive).getTime();
      const crrTm = new Date().getTime();

      console.log("lastactive", lastActive, crrTm);

      const elapsedTime = crrTm - lastActive;

      const thirtyMinutesInMillis = 30 * 60 * 1000;
      console.log(lastActive, crrTm, elapsedTime, thirtyMinutesInMillis, user);
      if (elapsedTime > thirtyMinutesInMillis) {
        logout(); // Perform logout if elapsed time exceeds 30 minutes
      }
    }
  }, [user]);

  return (
    <div id="table-main-wrap">
      {stateBlock || isVPNEnable ? (
        <div className="ip-block-content">
          <div className="container">
            <div className="ip-block-grid">
              {isVPNEnable ? (
                <img
                  src={vpnbanner}
                  alt="Scrooge VPN"
                  loading="lazy"
                  className="img-fluid maintance-img"
                />
              ) : (
                <img
                  src={notaccess}
                  alt="Scrooge Access"
                  loading="lazy"
                  className="img-fluid maintance-img"
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
          }}
        >
          <Router>
            <Switch>
              <Route exact path="/">
                <Home />
              </Route>
              <Route exact path="/game" component={Game} />
              <Route exact path="*" component={Error404} />
            </Switch>
          </Router>
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
      )}
    </div>
  );
};

export default App;
