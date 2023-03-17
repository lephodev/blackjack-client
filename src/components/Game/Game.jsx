import { useContext, useEffect, useState, useRef } from "react";
import { MeetingProvider, MeetingConsumer } from "@videosdk.live/react-sdk";
import { toast } from "react-hot-toast";
import GameContext from "../../Context";
import { socket } from "../../config/socket";
import loaderImg from "../../imgs/blackjack/loader1.webp";
import HowToPlay from "./HowToPlay";
import UserOnline from "./UserOnline";
import WalletBalance from "./WalletBalance";
import Dealer from "./Dealer";
import Players from "./Players";
import BetPanel from "./BetPanel";
import ActionPanel from "./ActionPanel";
import MeetingView from "./MeetingView";
import Chat from "../chat/chat";
// import NewBuyInPopup from '../stripe/newBuyinPopup';
// Uncomment it when uncomment buy in popup
// import BuyInPopup from '../stripe/buyInPopup';
import betAccepted from "../../sounds/bet-accepted.aac";
import betClosed from "../../sounds/bet-closed-female.aac";
import blackjackVoiceFemale from "../../sounds/blackjack-female.aac";
import burstSound from "../../sounds/burst-female.aac";
import dealerHasBlackjack from "../../sounds/dealer-has-blackjack-female.aac";
import dealOneCardSound from "../../sounds/dealing_card_fix.mp3";
import doubleDownSound from "../../sounds/double-down-female.aac";
import hitSound from "../../sounds/hit-female.aac";
import rebetSound from "../../sounds/rebet-female.aac";
import splitSound from "../../sounds/split-female.aac";
import standSound from "../../sounds/stand-female.aac";
import timerRunningOut from "../../sounds/timer_running_out.mp3";
import winSound from "../../sounds/win-sound.aac";
import youLoseSound from "../../sounds/you-loose-female.aac";
import youWin from "../../sounds/you-win-female.aac";
import surrenderSound from "../../sounds/surrender-female.aac";
import gameStartSound from "../../sounds/game started.mp3";
import yourTurnSound from "../../sounds/Its your turn.mp3";
import FloatingMenu from "./FloatingMenu";
import InviteFriend from "./InviteFriends";
import LeaveConfirmPopup from "./leaveConfirmPopup";
import PreTimer from "../pretimer/Pretimer";
import drawSound from "../../sounds/draw.mp3";
import noBalance from "../../sounds/noBalance.mp3";
import gameTimeSound from "../../sounds/gametime.mp3";
import TourPopup from "./tourpopup";
import WinPopup from "./winPopup";
import axios from "axios";
import { getCookie } from "../../utils/cookieUtil";
import userUtils from "../../utils/userUtils";
import CONSTANTS from "../../config/contants";
import { useMediaQuery } from "react-responsive";
import { blackjackInstance } from "../../utils/axios.config";
import EnterAmountPopup from "./enterAmountPopup";
import ChatHistory from "../chat/chatHistory";
// import rotateAnime from "../../imgs/animation/rotate.gif"

let userId;
let handleBetIntervel;
// const getQueryParams = () =>
//   Object.fromEntries(
//     window.location.hash
//       .substring(7, window.location.hash.length)
//       .split('&')
//       .map((el) => el.split('='))
//   );

const getQueryParams = () => {
  const url = new URLSearchParams(window.location.search);
  return {
    tableid: url.get("tableid") || "",
    gameCollection: url.get("gameCollection") || url.get("gamecollection"),
  };
};

// let timeout;
const Game = () => {
  const [tableId, setTableId] = useState("");
  const [winUser, setWinUser] = useState(false);
  const [gameCollection, setGameCollection] = useState("");
  const { roomData, setRoomData } = useContext(GameContext);
  const [howtoplay, setHowtoplay] = useState(false);
  const [usersOnline, setUsersOnline] = useState(false);
  const [volume, setVolume] = useState(true);
  const [actionopen, setActionOpen] = useState(true);
  const [players, setPlayers] = useState([]);
  const [letTime, setLeftTime] = useState();
  const [preTimer, setPreTimer] = useState();
  const [gameFinish, setGameFinish] = useState(false);
  const [loader, setLoader] = useState(false);
  const [allowType, setAllowType] = useState("");
  const [isWatcher, setIsWatcher] = useState(false);
  const [videoPlayers, setVideoPlayers] = useState([]);
  // Uncomment it when uncomment buy in popup
  const [, /*showBuyInPopup */ setShowBuyInPopup] = useState(false);
  const [, /*newBuyInPopUp */ setNewBuyInPopUp] = useState(false);
  const [open, setOpen] = useState(false);
  // Uncomment it when uncomment buy in popup
  const [, /* newJoinlowBalance */ setNewJoinLowBalance] = useState(false);
  const [isYourturnPlay, setItsYourTurnPlay] = useState(false);
  const [confirmExit, setConfirmExit] = useState(false);
  const [showInvite, setShowInvite] = useState(false);
  const [currentPlayer, setCurrentPlayer] = useState({});
  const [isTourOpen, setIsTourOPen] = useState(false);
  const [lastBet, setLastBet] = useState(0);
  // Wait till previous action completed
  const [actionCompleted, setActionCompleted] = useState(true);
  const [showEnterAmountPopup, setShowEnterAmountPopup] = useState(false);
  const [userData, setUserData] = useState(null);
  // const [retryIfUserNotJoin, setRetryIfUserNotJoin] = useState(false);
  const [refillSitInAmount, setRefillSitInAmount] = useState(false);
  // const [rotation, setRotation] = useState(false);
  const [chatMessage, setChatMessage] = useState([]);
  const [unReadMessages, setUnReadMessages] = useState(0);
  const [openEmoji, setOpenEmoji] = useState(false);
  const [betRaised, setBetRaised] = useState(false);
  const [isGameStarted, setIsGameStarted] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);


  const [openChatHistory, setOpenChatHistory] = useState(false);
  const [isLobbyBtnShow,setIsLobbyBtnShow] = useState(false)

  const handleOpenChatHistory = () => {
    socket.emit("updateChatIsRead", { tableId, userId });
    setUnReadMessages(0);
    setOpenChatHistory(!openChatHistory);
    setOpenEmoji(false);
  };

  const isDesktop = useMediaQuery({
    query: "(max-width: 1400px) and (min-width: 1024px)",
  });
  const isTablet = useMediaQuery({
    query: "(max-width: 1025px) and (min-width: 766px)",
  });
  const isTabletLandscape = useMediaQuery({
    query:
      "(max-width: 1024px) and (min-height: 580px) and (orientation: landscape)",
  });
  const isBigMobile = useMediaQuery({
    query: "(max-width: 767px) and (min-width: 580px)",
  });
  const isMobile = useMediaQuery({
    query: "(max-width: 579px) and (min-width: 450px)",
  });
  const isMiniMobile = useMediaQuery({ query: "(max-width: 450px)" });
  const isPhoneSE = useMediaQuery({
    query: "(max-width: 385px) and (max-height: 750px)",
  });
  const isMinlandscape = useMediaQuery({
    query: "(max-width: 685px) and (max-height:380px)",
  });
  const isLandscape = useMediaQuery({
    query: "(max-height: 480px) and (orientation: landscape)",
  });
  // const isPortrait = useMediaQuery({ query: "(max-width: 768px) and (orientation: portrait)" })

  const handleClose = () => setIsTourOPen(false);
  // Uncomment it when uncomment buy in popup
  const [, /* exchangeRate */ setExchangeRate] = useState({
    rate: 1,
    currency: "USD",
  });

  const getDoc = async (coll, u) => {
    //u = user.uid
    const res = await axios.get("https://get-doc-t3e66zpola-uc.a.run.app/", {
      params: {
        coll,
        usid: u,
      },
    });

    return {
      ...res.data.doc,
      inGame: res.data.inGame,
      exchangeRate: {
        rate: res.data.exchangeRate,
        currency: res.data.currency,
      },
    };
  };

  const handleClick = () => {
    setOpen(!open);
    setOpenEmoji(false);
  };
  const handleSitin = (sitInAmount) => {
    let urlParams = getQueryParams();
    let table = urlParams["tableid"];
    let type = urlParams["gameCollection"] || urlParams["gamecollection"];

    if (!tableId) {
      setTableId(table);
    }

    if (!userData) {
      return (window.location.href = window.location.origin);
    }

    if (parseFloat(sitInAmount) > userData.wallet) {
      toast.error("You don't have enough balance.", {
        id: "notEnoughSitIn",
      });
      // setTimeout(() => {
      //   window.location.href = window.location.origin;
      // }, 1000);
      return;
    } else if (parseFloat(sitInAmount) < 0) {
      toast.error("Amount is not valid.", {
        id: "notEnoughSitIn",
      });
      setTimeout(() => {
        window.location.href = window.location.origin;
      }, 1000);
      return;
    } else if (/\d/.test(sitInAmount)) {
      socket.emit("checkTable", {
        tableId: table,
        userId: userId,
        gameType: type,
        sitInAmount: parseFloat(sitInAmount),
      });
      setShowEnterAmountPopup(false);
      // setRetryIfUserNotJoin(true);

      setLoader(true);
    } else {
      toast.error("Not valid amount.", {
        id: "notEnoughSitIn",
      });
      setTimeout(() => {
        window.location.href = window.location.origin;
      }, 1000);
      return;
    }
  };

  const handleReffill = async (amount) => {
    try {
      await blackjackInstance().post("/refillWallet", { tableId, amount });
      setRefillSitInAmount(false);
      setIsLobbyBtnShow(false)
      return "success";
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        return error.response.data.msg || "Some error occured";
      }
      return "Failed to refill";
    }
  };

  const handleSitInAmount = async (amount) => {
    if (refillSitInAmount) {
      return handleReffill(amount);
    } else {
      handleSitin(amount);
    }
  };

  useEffect(() => {
    let urlParams = getQueryParams();
    // console.log({ urlParams, tId: urlParams["tableid"] });
    setTableId(urlParams["tableid"] || urlParams["tableId"]);
    setGameCollection(
      urlParams["gamecollection"] || urlParams["gameCollection"]
    );
    setTimeout(() => {
      if (
        !localStorage.getItem("isGuide") &&
        !localStorage.getItem("DontShowAgain")
      ) {
        localStorage.setItem("isGuide", true);
        setIsTourOPen(true);
      }
    }, 3000);
  }, []);

  // console.log({ tableId });

  const useOutsideAlerter = (ref) => {
    useEffect(() => {
      const handleClickOutside = (event) => {
        if (ref.current && !ref.current.contains(event.target)) {
          setShowBuyInPopup(false);
        }
      };
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }, [ref]);
  };

  const wrapperRef = useRef(null);
  useOutsideAlerter(wrapperRef);

  useEffect(() => {
    const tryReconnect = () => {
      setTimeout(() => {
        // console.log("reconnect");
        socket.io.open((err) => {
          if (err) {
            // console.log("reconnect err => ", err);
            tryReconnect();
          } else {
            // re join
            let urlParams = getQueryParams();
            // console.log({ urlParams });
            let table = urlParams["tableid"] || urlParams["tableId"];
            let type =
              urlParams["gameCollection"] || urlParams["gamecollection"];
            // console.log('condition4',{ table, userId });
            socket.emit("checkTable", {
              userId,
              tableId: table,
              gameType: type,
            });
            setLoader(true);
          }
        });
      }, 2000);
    };
    socket.io.on("close", tryReconnect);
  }, []);

  useEffect(() => {
    const isLoggedIn = async () => {
      let urlParams = getQueryParams();
      // console.log({ urlParams });
      // let user;
      if (!localStorage.getItem("token") && !getCookie("token")) {
        return (window.location.href = `${ CONSTANTS.landingClient }`);
      }

      const checkAuth = await userUtils.getAuthUserData();
      if (!checkAuth.success) {
        return (window.location.href = `${ CONSTANTS.landingClient }`);
      }

      // console.log({urlParams:window.location.search})
      let table = urlParams["tableid"];
      let type = urlParams["gameCollection"] || urlParams["gamecollection"];

      localStorage.setItem("userId", checkAuth?.data.user?.id);
      userId = checkAuth?.data.user?.id;
      setUserData(checkAuth.data.user);
      try {
        // Join user if he is already or new user in game
        if (table) {
          //Let user join in game
        // setRetryIfUserNotJoin(true);
        }
        socket.emit("checkTable", {
          tableId: table,
          userId: userId,
          gameType: type,
          sitInAmount: 0,
        });

        setLoader(true);
      } catch (error) {
        // console.log(error);
        // Call the api still if there is any miss happening
        socket.emit("checkTable", {
          tableId: table,
          userId: userId,
          gameType: type,
          sitInAmount: 0,
        });

        setLoader(true);
      }
    };
    isLoggedIn();
  }, []);

  // useEffect(() => {
  //   if (retryIfUserNotJoin) {
  //     timeout = setTimeout(() => {
  //       window.location.reload();
  //     }, 7000);
  //   } else {
  //     if (timeout) {
  //       clearTimeout(timeout);
  //     }
  //   }

  //   return () => {
  //     if (timeout) {
  //       clearTimeout(timeout);
  //     }
  //   };
  // }, [retryIfUserNotJoin]);

  useEffect(() => {
    socket.on("userId", async (data) => {
      userId = data;
      const users = await getDoc("users", userId);
      setExchangeRate(users.exchangeRate);
    });
    socket.on("gameCreated", (data) => {
      return (window.location.href = `${ window.location.origin }/game?tableid=${ data.tableId }&gameCollection=Blackjack_Tables`);
      // setRoomData(data.game);
      // updatePlayers(data.game);
      // setLoader(false);
    });

    socket.on("notjoined", () => {
      setShowEnterAmountPopup(true);
    })

    socket.on("newPlayer", (data) => {
      // console.log({ data });
      setRoomData(data);
      updatePlayers(data);
      setLoader(false);
      // setRetryIfUserNotJoin(false);
    });

    socket.on("newUser", (data) => {
      setAllowType(data.allow);
      setLoader(false);
    });

    socket.on("updateRoom", (data) => {
        if(!data.players.find(el => el.id === userId)){
          setShowEnterAmountPopup(true);
        }else{
          setShowEnterAmountPopup(false);
        }

      setRoomData(data);
      updatePlayers(data);
      setLoader(false);
      // setRetryIfUserNotJoin(false);
      setChatMessage(data.chats);
      setCurrentPlayer(data.players.find((el) => el.turn && el.action === ""));
      let me = data.players.find((el) => el.id === userId);
      let islobby = false
      if (!(Number(me?.betAmount)>=10 || Number(me?.wallet)>=10 )) {
        setRefillSitInAmount(true);
          islobby = true
      }
      setIsLobbyBtnShow(islobby)

    });

    socket.on("preTimer", (data) => {
      setPreTimer(data.remainingTime);
    });

    socket.on("resetGame", (data) => {
      setGameFinish(false);
      setRoomData(data);
      updatePlayers(data);
      playSound("reset");
      setWinUser(false);
      setActionOpen(true);
      let me = data.players.find((el) => el.id === userId);
      let islobby = false
      if (!(Number(me?.betAmount)>=10 || Number(me?.wallet)>=10 )) {
        setRefillSitInAmount(true);
          islobby = true
      }
      setIsLobbyBtnShow(islobby)
    });

    socket.on("timeCompleted", (data) => {
      setGameFinish(false);
      setRoomData(data);
      updatePlayers(data);
      playSound("gameTimeSound");
    });

    socket.on("play", (data) => {
      setCurrentPlayer(data.players.find((el) => el.turn && el.action === ""));
      setLeftTime(null);
      setRoomData(data);
      updatePlayers(data);
      if (
        data.players.find((el) => el.turn)?.id === userId &&
        !isYourturnPlay
      ) {
        setItsYourTurnPlay(true);
        playSound("yourturn");
      }
    });

    socket.on("playerReady", (data) => {
      toast.success(
        `${ data.name } is ready`,
        { id: data.name },
        { id: data.name }
      );
      setIsGameStarted(data.room?.gamestart);
      setIsPlaying(data.room?.players?.find((el) => el.id === userId)?.isPlaying);
      setRoomData(data.room);
      updatePlayers(data.room);
      const crrPlyr = data?.room?.players?.find(el => (el.id === userId));
      console.log("crrPlyr ==>", crrPlyr);
      const betAmt = crrPlyr?.betAmount > crrPlyr.wallet ? crrPlyr.wallet : crrPlyr?.betAmount
      setLastBet(betAmt);
      if (data.userId === userId) {
        playSound("bet-confirm");
      }
      setBetRaised(false);
    });

    socket.on("winner", (data) => {
      setGameFinish(true);
      setRoomData(data);
      updatePlayers(data);
      if (data.dealer.sum === 21 && data.dealer.cards.length === 2) {
        playSound("dealer-blackjack");
      }
      if (data.winnerPlayer.find((el) => el.id === userId)) {
        playSound("finish");
        setTimeout(playSound("you-win"), 100);
        setWinUser(true);
      } else if (data.drawPlayers.find((player) => player.id === userId)) {
        playSound("draw");
      } else if (data.players.find((el) => el.id === userId)?.isPlaying) {
        setTimeout(playSound("you-lose"), 100);
      }
    });

    socket.on("newWatcherJoin", (data) => {
      if (userId === data.watcherId) setIsWatcher(true);
      setRoomData(data.roomData);
      updatePlayers(data.roomData);
    });
    // ----------------- toast sockets only message shows -------------//
    socket.on("notAuthorized", () => {
      setLoader(false);
      toast.error(`Not authorized please login`, { id: "logout" });
      return (window.location.href = `${ CONSTANTS.landingClient }`);
    });

    socket.on("gameStarted", () => {
      playSound("gameStart");
    });

    socket.on("lowBalance", () => {
      setLoader(false);
      toast.error(`Low balance`, { id: "lowBalance" });
      setNewJoinLowBalance(true);
      setNewBuyInPopUp(true);
      setRefillSitInAmount(true);
    });

    socket.on("timeout", (data) => {
      toast.error(`Timeout ${ data.name } is auto stand`, { id: "timeout" });
    });

    socket.on("slotFull", () => {
      setLoader(false);
      toast.error(`No empty Space, Slot full.`, { id: "slotFull" });

      setTimeout(() => {
        socket.emit("exitRoom", {
          tableId,
          userId,
        });
      }, 3000);
    });

    socket.on("gameFinished", () => {
      localStorage.removeItem("isGuide");
      toast.error(`Game is finished`, { id: "finished" });
      return (window.location.href = window.location.origin);
    });

    socket.on("noTable", () => {
      setLoader(false);
      localStorage.removeItem("isGuide");
      toast.error(`Game is already finished`, { id: "finished" });
      return (window.location.href = window.location.origin);
    });

    socket.on("noAdmin", (data) => {
      setLoader(false);
      localStorage.removeItem("isGuide");
      toast.error(data, { id: "noAdmin" });
    });

    socket.on("exitSuccess", () => {
      localStorage.removeItem("isGuide");
      return (window.location.href = window.location.origin);
    });

    socket.on("actionError", (data) => {
      setLoader(false);
      if (data.msg === "Not enough balance") {
        playSound("noBalance");
      }
      toast.error(data.msg, { id: "error" });
    });

    socket.on("notEnoughBalanceSitIn", (data) => {
      setLoader(false);
      toast.error(data.msg, { id: "error" });
      setTimeout(() => {
        window.location.href = window.location.origin;
      }, 1000);
    });

    socket.on("redirectToClient", () => {
      window.location.href = window.location.origin;
    });

    socket.on("gameAlreadyStarted", () => {
      toast.error("Game already started, please wait", {
        id: "already Started",
      });
    });

    socket.on("welcome", () => {
      playSound("welcome");
      setAllowType(false);
      setConfirmExit(false);
      setCurrentPlayer({});
      setGameFinish(false);
      setPreTimer();
    });

    socket.on("action", (data) => {
      // playSound(data.type);
      const { type } = data;
      if (type !== "hit" && type !== "doubleDown") {
        // setTimeout(() => {
        setActionCompleted(true);
        // }, 1000);
      } else {
        // setTimeout(() => {
        setActionCompleted(true);
        // }, 1500);
      }

      if (data.type === "burst") playSound(data.type); //setTimeout(, 200);
      if (data.type === "hit" || "doubleDown" || "split") {
        // setTimeout(, 200);
        playSound("dealnewcard");
      }
      stopSound("timerRunningOut");
    });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [setRoomData, userId]);

  useEffect(() => {
    setIsGameStarted(roomData?.gamestart);
    setIsPlaying(players.find((el) => el.id === userId)?.isPlaying);
  }, [roomData, players]);

  useEffect(() => {
    socket.on("gameTimer", (data) => {
      if (currentPlayer?.id === data.id) setLeftTime(data.leftTime);
      if (data.leftTime === 5) {
        playSound("timerRunningOut");
      } else if (data.leftTime === 0) {
        stopSound("timerRunningOut");
      }
    });
  }, [currentPlayer]);

  const updatePlayers = async (roomData) => {
    let availablePosition = [];
    if (roomData) {
      switch (roomData?.players?.length) {
        case 1: {
          availablePosition = [4];
          break;
        }
        case 2: {
          availablePosition = [4, 5];
          break;
        }
        case 3: {
          availablePosition = [4, 5, 3];
          break;
        }
        case 4: {
          availablePosition = [4, 5, 2, 3];
          break;
        }
        case 5: {
          availablePosition = [4, 5, 6, 2, 3];
          break;
        }
        case 6: {
          availablePosition = [4, 5, 6, 1, 2, 3];
          break;
        }
        case 7: {
          availablePosition = [4, 5, 6, 7, 1, 2, 3];
          break;
        }
        default: {
          break;
        }
      }
      let players = [];
      let whole = [];
      const index = roomData?.players?.findIndex((ele) => ele.id === userId);
      // console.log("ddd", index);
      if (typeof index !== "undefined" && index !== -1) {
        const split1 = roomData?.players?.slice(0, index);
        const split2 = roomData?.players?.slice(
          index,
          roomData?.players?.length
        );
        // console.log("spl =>", split1, split2);
        whole = whole.concat(split2).concat(split1);
      }
      // console.log("whole =>", whole, roomData.players);
      whole?.forEach((item, i) => {
        players.push({ ...item, position: availablePosition[i] });
      });

      setPlayers(players);
      if (players.length !== videoPlayers.length) {
        setVideoPlayers(players);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  };

  // const handleBetConfirm = (e) => {
  //   if (handleBetIntervel) {
  //     clearInterval(handleBetIntervel);
  //   }
  //   handleBetIntervel = setTimeout(() => {
  //     const userWallet = players.find((el) => el.id === userId)?.wallet;
  //     const userBet = players.find((el) => el.id === userId)?.betAmount;
  //     console.log("userBet", players);
  //     setLastBet(userBet);
  //     // console.log("handleBetConfirm-----", { userWallet, userBet });
  //     if (!userBet && !userWallet) {
  //       toast.error("You don't have enough balance in your wallet.", {
  //         id: "confirm-bet",
  //       });
  //       setRefillSitInAmount(true);
  //       return;
  //     } else if (!userBet) {
  //       toast.error("Please enter bet amount", { id: "confirm-bet" });
  //       return;
  //     }
  //     // else if (!userWallet) {
  //     //   toast.error("You don't have enough balance in your wallet.");
  //     //   return;
  //     // }
  //     socket.emit("confirmBet", {
  //       tableId,
  //       userId,
  //     });
  //   }, 1000);
  // };
  // const handleBetConfirm = (e) => {
  //   console.log("handle confrim bet executed");
  //   if (handleBetIntervel) {
  //     clearInterval(handleBetIntervel);
  //   }
  //   handleBetIntervel = setTimeout(() => {
  //     const userWallet = players.find((el) => el.id === userId)?.wallet;
  //     const userBet = players.find((el) => el.id === userId)?.betAmount;
  //     setLastBet(userBet);
  //     // console.log("handleBetConfirm-----", { userWallet, userBet });
  //     if (!userBet && !userWallet) {
  //       toast.error("You don't have enough balance in your wallet.", {
  //         id: "confirm-bet",
  //       });
  //       setRefillSitInAmount(true);
  //       return;
  //     } else if (!userBet) {
  //       toast.error("Please enter bet amount", { id: "confirm-bet" });
  //       return;
  //     }
  //     // else if (!userWallet) {
  //     //   toast.error("You don't have enough balance in your wallet.");
  //     //   return;
  //     // }
  //     console.log("confirm-bet executed successfully 2");
  //     socket.emit("confirmBet", {
  //       tableId,
  //       userId,
  //     });
  //   }, 200);
  // };

  const playSound = (value) => {
    // setTimeout(() => {
    let aud = document.getElementsByClassName(`audio-${ value }`)[0];
    if (aud) {
      aud.play();
    }
    // }, 1000);
  };

  const stopSound = (value) => {
    let aud = document.getElementsByClassName(`audio-${ value }`)[0];
    if (aud) {
      aud.pause();
      aud.currentTime = 0;
    }
  };

  const handleActionOpen = (e) => {
    setActionOpen(e);
  };

  const handleHowtoPlay = () => {
    setHowtoplay(!howtoplay);
  };

  const userOnlinePanel = () => {
    let userOnline = document.getElementById("users-online-box");
    let btn = document.querySelector("#users-online-button");
    if (!usersOnline) {
      userOnline.style.left = "0";
      btn.style.transform = "rotate(180deg)";
    } else {
      userOnline.style.left = "";
      btn.style.transform = "";
    }
    setUsersOnline(!usersOnline);
  };

  const joinAsWatcher = () => {
    socket.emit("joinAsWatcher", {
      tableId,
      userId,
    });
    setAllowType("");
  };

  const joinAsPlayer = () => {
    socket.emit("joinAsPlayer", {
      tableId,
      userId,
    });
    setAllowType("");
  };

  const handleExitRoom = () => {
    if (players.find((el) => el.id === userId)?.isPlaying) {
      return toast.error("Can't leave room in running round", { id: "Leave" });
    }
    socket.emit("exitRoom", {
      tableId,
      userId,
    });
  };

  // Dynamic screen scaling

  const initialScale = window.innerWidth / 19.2;
  const initialTop = (100 - initialScale) / 2;

  const [scaleValue, setScaleValue] = useState(initialScale);
  const [topValue, setTopValue] = useState(initialTop);

  useEffect(() => {
    setScaleValue(initialScale);
    setTopValue(initialTop);
  }, [initialScale, initialTop]);

  const handleResize = (e) => {
    const currentScreenSize = e.target.innerWidth;
    setScaleValue(currentScreenSize / 19.2);
    setTopValue((100 - currentScreenSize / 19.2) / 2);
  };

  useEffect(() => {
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);
  // useEffect(() => {
  //   if (isPortrait) {
  //     setRotation(true);
  //     setTimeout(() => {
  //       setRotation(false);
  //     }, 3000)
  //   }
  // }, [isPortrait]);

  useEffect(() => {
    socket.on("updateChat", async (data) => {
      const { chat } = data;
      setChatMessage(chat);
      if (openChatHistory) {
        setUnReadMessages(0);
        socket.emit("updateChatIsRead", { tableId, userId });
      } else {
        let unReadMsgsCnt = 0;
        chat.forEach((msg) => {
          if (msg.userId !== userId && msg.seenBy.indexOf(userId) < 0)
            unReadMsgsCnt++;
        });
        setUnReadMessages(unReadMsgsCnt);
      }
    });
  });

  const scrollDownRef = useRef(null);

  const scrollToBottom = () => {
    scrollDownRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // const LastBetAmt = () =>{
  //   setLastBet(players.find((el) => el.id === userId)?.betAmount);
  // }

  return (
    <div className={`blackjack-game ${ loader ? "loaderactive" : "" }`}>
      {loader && (
        <div className="blackjack-loader">
          <img src={loaderImg} alt="loader-Scrooge Casino" />
        </div>
      )}
      {(showEnterAmountPopup || refillSitInAmount) && (
        <EnterAmountPopup
          handleSitin={handleSitInAmount}
          showEnterAmountPopup={showEnterAmountPopup || refillSitInAmount}
          submitButtonText={refillSitInAmount ? "Refill Tokens" : "Join"}
          setShow={
            refillSitInAmount ? setRefillSitInAmount : setShowEnterAmountPopup
          }
          isLobbyBtnShow={isLobbyBtnShow}
          handleExitRoom={handleExitRoom}
        />
      )}
      <div className="containerFor-chatHistory">
        <div className="chatHistory-icon" onClick={handleOpenChatHistory}>
          <button className="UsersCommentsBtns">Chat History</button>
          {unReadMessages !== 0 ? <p>{unReadMessages}</p> : ""}
        </div>

        <ChatHistory
          setOpenChatHistory={setOpenChatHistory}
          openChatHistory={openChatHistory}
          handleOpenChatHistory={handleOpenChatHistory}
          chatMessage={chatMessage}
          userId={userId}
          roomData={roomData?.players}
          scrollToBottom={scrollToBottom}
          scrollDownRef={scrollDownRef}
          openEmoji={openEmoji}
          setOpenEmoji={setOpenEmoji}
        />
      </div>

      <TourPopup isTourOpen={isTourOpen} handleClose={handleClose} />
      <HowToPlay
        handleHowtoPlay={handleHowtoPlay}
        players={players}
        gameCardStats={roomData?.gameCardStats}
        howtoplay={howtoplay}
        setHowtoplay={setHowtoplay}
      />
      <div className="blackjack-game-room">
        <FloatingMenu
          setModalShow={setRefillSitInAmount}
          handleClick={handleClick}
          volume={volume}
          setVolume={setVolume}
          setShowInvite={setShowInvite}
          setConfirmExit={setConfirmExit}
        />

        <UserOnline userOnlinePanel={userOnlinePanel} players={players} />
        {/* {console.log("useriddddd", players)} */}

        <WalletBalance
          wallet={players.find((el) => el.id === userId)?.wallet}
          betAmount={players.find((el) => el.id === userId)?.betAmount}
          ticket={players.find((el) => el.id === userId)?.ticket}
        />
        {/* <div className={rotation ? 'rotateToLandscape' : 'rotateToLandscape-hide'} >
          <img src={rotateAnime} alt="" />
        </div> */}
        <div className="players-wrapper">
          <div
            className="player-wrapper-content"
            style={{
              position: "absolute",
              top: "-2%",
              left: "50%",
              width: "1927px",
              height: "100%",
              transform: isTabletLandscape
                ? `translate(-50%, -${ topValue * 0.3 }%) scale(${ (scaleValue * 1) / 100
                })`
                : isDesktop
                  ? `translate(-50%, -${ topValue * 0.7 }%) scale(${ (scaleValue * 1) / 100
                  })`
                  : isMinlandscape
                    ? `translate(-50%, -${ topValue * 0.7 }%) scale(${ (scaleValue * 0.9) / 100
                    })`
                    : isLandscape
                      ? `translate(-50%, -${ topValue * 1 }%) scale(${ (scaleValue * 0.9) / 100
                      })`
                      : isPhoneSE
                        ? `translate(-50%, -${ topValue * 0.2 }%) scale(${ (scaleValue * 2) / 100
                        })`
                        : isTablet
                          ? `translate(-50%, -${ topValue * 0.3 }%) scale(${ (scaleValue * 1.1) / 100
                          })`
                          : isBigMobile
                            ? `translate(-50%, -${ topValue * 0.3 }%) scale(${ (scaleValue * 1.1) / 100
                            })`
                            : isMobile
                              ? `translate(-50%, -${ topValue * 0.3 }%) scale(${ (scaleValue * 1.1) / 100
                              })`
                              : isMiniMobile
                                ? `translate(-50%, -${ topValue * 0.2 }%) scale(${ (scaleValue * 2.3) / 100
                                })`
                                : `translate(-50%, -${ topValue }%) scale(${ scaleValue / 100 })`,
            }}
          >
            <div className="blackjack-table">
              {allowType === "allowBoth" ? (
                <div className="allow-both">
                  <span>Join as -</span>
                  <button onClick={joinAsPlayer}> Player</button>
                  <button onClick={joinAsWatcher}> Watcher</button>
                </div>
              ) : allowType === "onlywatcher" ? (
                <div className="only-watcher">
                  <span>Join as -</span>
                  <button onClick={joinAsWatcher}> Watcher</button>
                </div>
              ) : allowType === "onlyUser" ? (
                <div className="only-watcher">
                  <span>Join as -</span>
                  <button onClick={joinAsPlayer}> Player</button>
                </div>
              ) : (
                ""
              )}
              {isWatcher ? <div className="watcher">Watcher</div> : ""}

              {roomData?.preTimer && preTimer ? (
                <div className="waitTxtBoxContainer">
                  <div className="wait-txt">
                    <p>Game starts in</p>
                    <PreTimer timer={preTimer} />
                  </div>
                </div>
              ) : roomData?.winnerPlayer?.length ? (
                <div className="waitTxtBoxContainer">
                  <div className="wait-txt">
                    <p>New round start in 5 sec</p>
                  </div>
                </div>
              ) : (
                ""
              )}
              <Dealer dealer={roomData?.dealer} players={players} />
              {userId &&
                (roomData?.media === "video" || roomData.media === "audio") ? (
                <MeetingProvider
                  config={{
                    meetingId: roomData.meetingId,
                    micEnabled:
                      roomData.media === "video" || roomData.media === "audio",
                    webcamEnabled: roomData.media === "video",
                    name: userId,
                  }}
                  token={
                    roomData.hostId === userId
                      ? roomData.meetingToken
                      : roomData.players.find((ele) => ele.id === userId)
                        ?.meetingToken
                  }
                >
                  <MeetingConsumer {...{}}>
                    {() => (
                      <MeetingView
                        roomData={roomData}
                        letTime={letTime}
                        gameFinish={gameFinish}
                        videoPlayers={videoPlayers}
                        players={players}
                        userId={userId}
                        currentPlayer={currentPlayer}
                      />
                    )}
                  </MeetingConsumer>
                </MeetingProvider>
              ) : (
                <Players
                  players={players}
                  roomData={roomData}
                  letTime={letTime}
                  gameFinish={gameFinish}
                  userId={userId}
                  currentPlayer={currentPlayer}
                />
              )}
            </div>
          </div>
          {!isGameStarted &&
            !isPlaying && (
              <BetPanel
                data-tut="bet-panel"
                // handleBetConfirm={handleBetConfirm}
                player={players.find((el) => el.id === userId)}
                tableId={tableId}
                volume={volume}
                roomData={roomData}
                setShowBuyInPopup={setRefillSitInAmount}
                players={players}
                userId={userId}
                actionopen={actionopen}
                handleActionOpen={handleActionOpen}
                lastBet={lastBet}
                setLastBet={setLastBet}
                betRaised={betRaised}
                setBetRaised={setBetRaised}
              />
            )}
          {(roomData?.gamestart || !roomData?.preTimer) && (
            <>
              {players.find((el) => el.id === userId) &&
                players.find((el) => el.id === userId)?.turn &&
                players.find((el) => el.id === userId)?.action === "" ? (
                <ActionPanel
                  wallet={players.find((el) => el.id === userId)?.wallet}
                  actionopen={actionopen}
                  handleActionOpen={handleActionOpen}
                  tableId={tableId}
                  player={players.find((el) => el.id === userId)}
                  handleBetIntervel={handleBetIntervel}
                  actionCompleted={actionCompleted}
                  setActionCompleted={setActionCompleted}
                />
              ) : (
                <></>
              )}
            </>
          )}
        </div>
      </div>
      <Chat
        handleClick={handleClick}
        open={open}
        userId={userId}
        tableId={tableId}
        openEmoji={openEmoji}
        setOpenEmoji={setOpenEmoji}
      />
      {/* <NewBuyInPopup
        setBuyinPopup={setShowBuyInPopup}
        buyinPopup={newBuyInPopUp}
        setNewBuyInPopUp={setNewBuyInPopUp}
        leaveTable={handleExitRoom}
      /> */}
      {/* // Uncomment it when uncomment buy in popup */}
      {/* <BuyInPopup
        setModalShow={setShowBuyInPopup}
        modalShow={showBuyInPopup}
        userId={userId}
        tableId={tableId}
        gameType={gameCollection}
        setNewJoinLowBalance={setNewJoinLowBalance}
        newJoinlowBalance={newJoinlowBalance}
        setNewBuyInPopUp={setNewBuyInPopUp}
        exchangeRate={exchangeRate}
      /> */}
      <InviteFriend
        setShowInvite={setShowInvite}
        gameCollection={gameCollection}
        userId={userId}
        tableId={tableId}
        showInvite={showInvite}
        roomData={roomData}
        setRoomData={setRoomData}
      />
      <LeaveConfirmPopup
        setConfirmExit={setConfirmExit}
        confirmExit={confirmExit}
        handleExitRoom={handleExitRoom}
      />
      {/* audio track  */}
      <div>
        <audio className="audio-bet-confirm" muted={!volume || roomData.video}>
          <source src={betAccepted}></source>
        </audio>
        <audio className="audio-reset" muted={!volume || roomData.video}>
          <source src={rebetSound}></source>
        </audio>
        <audio className="audio-finish" muted={!volume || roomData.video}>
          <source src={winSound}></source>
        </audio>
        <audio className="audio-you-win" muted={!volume || roomData.video}>
          <source src={youWin}></source>
        </audio>
        <audio className="audio-you-lose" muted={!volume || roomData.video}>
          <source src={youLoseSound}></source>
        </audio>
        <audio
          className="audio-dealer-blackjack"
          muted={!volume || roomData.video}
        >
          <source src={dealerHasBlackjack}></source>
        </audio>
        <audio className="audio-bet-closed" muted={!volume || roomData.video}>
          <source src={betClosed}></source>
        </audio>
        <audio className="audio-burst" muted={!volume || roomData.video}>
          <source src={burstSound}></source>
        </audio>
        <audio className="audio-stand" muted={!volume || roomData.video}>
          <source src={standSound}></source>
        </audio>
        <audio className="audio-hit" muted={!volume || roomData.video}>
          <source src={hitSound}></source>
        </audio>
        <audio className="audio-split" muted={!volume || roomData.video}>
          <source src={splitSound}></source>
        </audio>
        <audio className="audio-doubleDown" muted={!volume || roomData.video}>
          <source src={doubleDownSound}></source>
        </audio>
        <audio className="audio-dealnewcard" muted={!volume || roomData.video}>
          <source src={dealOneCardSound}></source>
        </audio>
        <audio
          className="audio-timerRunningOut"
          muted={!volume || roomData.video}
        >
          <source src={timerRunningOut}></source>
        </audio>
        <audio
          className="audio-player-blackjack"
          muted={!volume || roomData.video}
        >
          <source src={blackjackVoiceFemale}></source>
        </audio>
        <audio className="audio-surrender" muted={!volume || roomData.video}>
          <source src={surrenderSound}></source>
        </audio>
        <audio className="audio-yourturn" muted={!volume || roomData.video}>
          <source src={yourTurnSound}></source>
        </audio>
        <audio className="audio-gameStart" muted={!volume || roomData.video}>
          <source src={gameStartSound}></source>
        </audio>
        <audio className="audio-draw" muted={!volume || roomData.video}>
          <source src={drawSound}></source>
        </audio>
        <audio className="audio-noBalance" muted={!volume || roomData.video}>
          <source src={noBalance}></source>
        </audio>
        <audio
          className="audio-gameTimeSound"
          muted={!volume || roomData.video}
        >
          <source src={gameTimeSound}></source>
        </audio>
      </div>
      {/* <Tour
        onRequestClose={() => setIsTourOPen(false)}
        steps={tourConfig}
        isOpen={isTourOpen}
        maskClassName="mask"
        className="helper"
        rounded={5}
        accentColor="#5cb7b7"
      /> */}
      {winUser ? <WinPopup /> : ""}
    </div>
  );
};

export default Game;
