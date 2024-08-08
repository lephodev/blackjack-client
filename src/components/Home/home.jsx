import React, { useContext, useState } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";
import { Form } from "react-bootstrap";
import { useHistory } from "react-router-dom";
// import tickets from "../../imgs/blackjack/ticket.png";
import {
  FaQuestionCircle,
  FaHome,
  // FaArrowsAltH,
  FaPlusCircle,
} from "react-icons/fa";
import "./home.css";
import { useEffect } from "react";
import userUtils from "../../utils/user";
import loaderImg from "../../imgs/animation/loader1.webp";
import casino from "../../imgs/blackjack/blackjackPlaceholder.png";
import logo from "../../imgs/blackjack/logo.png";
import newlogo from "../../imgs/blackjack/new-logo.webp";
import users from "../../imgs/blackjack/user1.png";
import { blackjackInstance } from "../../utils/axios.config";
import CONSTANTS from "../../config/contants";
// import ticket from "../../imgs/blackjack/ticket.png";
import coin from "../../imgs/blackjack/goldCoin.png";
import gold from "../../imgs/blackjack/sweep.png";
import axios from "axios";
import toast from "react-hot-toast";
import Select from "react-select";
import { useMemo } from "react";
// import numFormatter from "../../config/utils";
// import { Spinner } from "react-bootstrap";
import { domain, landingClient, marketPlaceUrl } from "../../config/keys";
import cookie from "js-cookie";

import GameContext from "../../Context";
import AlreadyInGame from "../Game/AlreadyInGame";
import { getCookie, validateToken } from "../../utils/cookieUtil";
import contants from "../../config/contants";
import ReminderModal from "./reminderModal";
// import TicketTotoken from "./ticketToToken";
// import { getCookie } from "../../utils/cookieUtil";

const Home = () => {
  // inital state
  const gameInit = {
    gameName: "",
    public: false,
    sitInAmount: "",
    invitedUsers: [],
  };
  const { userInAnyGame, setUserInAnyGame } = useContext(GameContext);

  // States
  const [loader, setLoader] = useState(true);
  const [userData, setUserData] = useState({});
  const [gameState, setGameState] = useState({ ...gameInit });
  const [show, setShow] = useState(false);
  const [mode, setMode] = useState("");
  console.log("mode", mode);
  const [errors, setErrors] = useState({});
  const [pokerRooms, setPokerRooms] = useState([]);
  const history = useHistory();
  const [allUsers, setAllUsers] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [showSpinner, setShowSpinner] = useState(false);
  // const [ticketToToken, setTicketToToekn] = useState(false);
  const [reminderShow, setReminderShow] = useState(false);

  // console.log({ userData });

  // utils function
  const handleShow = () => {
    setShow(!show);
    setGameState({ ...gameInit });
    setShowSpinner(false);
    setErrors({});
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "public" || name === "autohand") {
      setGameState({ ...gameState, [name]: e.target.checked });
    } else if (name === "gameName") {
      if (value.length <= 20) {
        setGameState({ ...gameState, [name]: value });
        setErrors({
          ...errors,
          gameName: "",
        });
      } else {
        setErrors({
          ...errors,
          gameName: "Maximum 20 character is allowed for game name.",
        });
      }
    } else if (name === "sitInAmount") {
      if (parseFloat(value) <= 0) {
        setErrors({ ...errors, sitInAmount: "Minimum amount to bet is 10" });
      } else if (
        parseFloat(value) >
        parseFloat(
          mode === "token" ? userData?.wallet || 0 : userData?.goldCoin
        )
      ) {
        setErrors({
          ...errors,
          sitInAmount: `You don't have   enough balance in your  ${mode} wallet.`,
        });
      } else {
        setErrors({ ...errors, sitInAmount: "" });
        setGameState({ ...gameState, sitInAmount: parseInt(value) });
      }
    } else {
      setGameState({ ...gameState, [name]: value });
    }
  };
  const handleChnageInviteUsers = (selectedOptions) => {
    setGameState({ ...gameState, invitedUsers: [...selectedOptions] });
  };

  const validateCreateTable = () => {
    let checkIfExist =
      game_name?.length > 0 &&
      game_name?.find(
        (el) => el.toLowerCase() === gameState?.gameName.trim().toLowerCase()
      );

    let valid = true;
    let err = {};
    if (gameState.gameName === "") {
      err.gameName = "Game name is required.";
      valid = false;
    }
    if (gameState.gameName.trim() === "") {
      err.gameName = "Game name is required.";
      valid = false;
    }
    if (!gameState.sitInAmount) {
      err.sitInAmount = "Enter sit in amount.";
      valid = false;
    }

    if (parseFloat(gameState.sitInAmount) < 5) {
      err.sitInAmount = "Minimum amount to bet is 5.";
      valid = false;
    }
    if (!gameState.public && !gameState.invitedUsers.length) {
      err.invitedPlayer = "Please invite some player if table is private.";
      valid = false;
    }

    if (checkIfExist) {
      err.gameName = "Game name is already exist.";
      valid = false;
    }
    return { valid, err };
  };

  const createTable = async (e) => {
    e.preventDefault();
    setErrors({});
    setShowSpinner(true);
    const tableValidation = validateCreateTable();
    if (!tableValidation.valid) {
      setErrors({ ...tableValidation.err });
      setShowSpinner(false);
      return;
    }
    try {
      const resp = await (
        await blackjackInstance()
      ).post("/createTable", {
        ...gameState,
        gameName: gameState.gameName.trim(),
        gameMode: mode,
      });
      setGameState({ ...gameInit });
      history.push({
        pathname: "/game",
        search: "?gameCollection=Blackjack_Tables&tableid=" + resp.data.roomId,
      });
      setShowSpinner(false);
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        toast.error(error.response.data.message, { id: "create-table-error" });
      }
      setShowSpinner(false);
    }
  };

  // UseEffects
  useEffect(() => {
    (async () => {
      const data = await userUtils.getAuthUserData();
      if (!data.success) {
        return (window.location.href = `${CONSTANTS.landingClient}`);
      }
      setLoader(false);
      setUserData({ ...data.data.user });
      const response = await (
        await blackjackInstance()
      ).get(`/getAllUsers`, {
        params: { userId: data?.data?.user?.id },
      });
      setAllUsers(response.data.allUsers);
    })();
  }, []);

  const checkRunningGame = async () => {
    try {
      const response = await (await blackjackInstance()).get("/getRunningGame");
      setPokerRooms(response.data.rooms);
    } catch (error) {
      console.log("error", error);
    }
  };

  useEffect(() => {
    const checkUserInGame = async () => {
      const basicAuthToken = await validateToken();
      let userData = await axios({
        method: "get",
        url: `${ contants.landingServerUrl }/users/checkUserInGame`,
        headers: {
          Authorization: basicAuthToken,
        },
        withCredentials: true,
        credentials: "include",
      });

      console.log({ dekk: userData?.data });
      if (userData?.data) {
        setUserInAnyGame(userData.data);
      }
    };
    checkRunningGame();
    checkUserInGame();
  }, [setUserInAnyGame, mode]);

  const options = useMemo(
    () =>
      allUsers.map((el) => {
        return { value: el.id, label: el.username };
      }),
    [allUsers]
  );
  useEffect(() => {
    const interval = setInterval(() => {
      setReminderShow(false);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const renderWallet = (props) => (
    <Tooltip id="button-tooltip" {...props}>
      This is your token balance, and can be used for betting.
    </Tooltip>
  );
  // const renderTicket = (props) => (
  //   <Tooltip id="button-tooltip" {...props}>
  //     This is your ticket balance and can be redeemed for prizes.
  //   </Tooltip>
  // );
  const renderGold = (props) => (
    <Tooltip id="button-tooltip" {...props}>
      This gold coins is for fun play.
    </Tooltip>
  );

  const filterRoom = pokerRooms.filter(
    (el) =>
      el.gameName.toLowerCase().includes(searchText.toLowerCase()) &&
      el?.gameMode === mode
  );
  const game_name = filterRoom.map((e) => {
    return e.gameName;
  });

  // console.log("filterRoom", filterRoom);
  const handleModeChange = async (e) => {
    try {
      const {
        target: { checked },
      } = e;
      // setMode(checked);
      let gameMode = checked ? "token" : "goldCoin";
      cookie.set("mode", gameMode, {
        domain: domain,
        path: "/",
        httpOnly: false,
      });
      setMode(getCookie("mode"));
    } catch (error) {
      console.log("error", error);
    }
  };

  useEffect(() => {
    const getMode = getCookie("mode");
    if (getMode) {
      setMode(getMode);
    } else {
      cookie.set("mode", "goldCoin", {
        domain: domain,
        path: "/",
        httpOnly: false,
      });
      setMode("goldCoin");
    }
  }, []);

  // const handleTicketTotoken = () => {
  //   setTicketToToekn(!ticketToToken);
  // };

  return (
    <div className="poker-home">
      {userInAnyGame?.inGame && (
        <AlreadyInGame
          userInAnyGame={userInAnyGame}
          setUserInAnyGame={setUserInAnyGame}
          checkRunningGame={checkRunningGame}
        />
      )}
      <ReminderModal
        reminderShow={reminderShow}
        setReminderShow={setReminderShow}
      />
      {loader && (
        <div className="poker-loader">
          <img src={loaderImg} alt="loader" />{" "}
        </div>
      )}
      <CreateTable
        handleChange={handleChange}
        show={show}
        handleShow={handleShow}
        values={gameState}
        createTable={createTable}
        errors={errors}
        options={options}
        handleChnageInviteUsers={handleChnageInviteUsers}
        userWallet={
          mode === "token" ? userData?.wallet || 0 : userData?.goldCoin || 0
        }
        showSpinner={showSpinner}
      />

      <div className="user-header">
        <div className="container">
          <div className="user-header-grid">
            <div className="casino-logo">
              <a href={landingClient}>
                {userData ? (
                  <img
                    src={newlogo}
                    alt="logo"
                    width={110}
                    height={110}
                    loading="lazy"
                    className="new-logo"
                  />
                ) : (
                  <img src={logo} alt="logo" />
                )}
              </a>
            </div>
            <div className="headerMode-container">
              <div className={`slotLobby-mode ${mode}`}>
                <Form>
                  <input
                    type="checkbox"
                    id="switch"
                    defaultChecked={mode === "token"}
                    checked={mode === "token"}
                    className="form-check-input"
                    onChange={handleModeChange}
                  />
                  <label for="switch">Toggle</label>
                  <span>
                    {mode === "token"
                      ? `ST: ${userData?.wallet?.toFixed(2)}`
                      : `GC: ${userData?.goldCoin?.toFixed(2)}`}
                  </span>
                  <Button className="purchase-btn">
                    <a href={`${marketPlaceUrl}/crypto-to-gc`} rel="noreferrer">
                      <FaPlusCircle />
                    </a>
                  </Button>
                </Form>
              </div>
              {mode === "token" ? <p>ST 100:1 USD </p> : null}
              {/* <div className="tickets-token">
                <Button
                  className="btn btn-primary"
                  disabled={userData?.ticket < 10}
                  onClick={handleTicketTotoken}
                >
                  <img src={tickets} alt="" /> <span>Ticket</span>{" "}
                  <FaArrowsAltH /> <img src={gold} alt="" />{" "}
                  <span>Token</span>
                </Button>
                <TicketTotoken
                  user={userData}
                  show={ticketToToken}
                  handleClose={handleTicketTotoken}
                  setUser={setUserData}
                />
              </div> */}
            </div>
            <div className="create-game-box">
              <a href={`${landingClient}/profile`}>
                <div className="create-game-box-avtar">
                  <img
                    src={
                      userData?.profile || users //"https://i.pinimg.com/736x/06/d0/00/06d00052a36c6788ba5f9eeacb2c37c3.jpg"
                    }
                    alt=""
                  />
                  <h5>{userData?.username}</h5>
                </div>
              </a>
              <div className="user-info-box">
                <p className="user-info-box-wallet">
                  <img src={gold} alt="" className="ticket-icon" />
                  <span>{userData?.wallet?.toFixed(2) || 0}</span>
                  <OverlayTrigger
                    placement="bottom"
                    fontSize="10px"
                    delay={{ show: 250, hide: 300 }}
                    overlay={renderWallet}
                  >
                    <Button variant="success">
                      <FaQuestionCircle />
                    </Button>
                  </OverlayTrigger>
                </p>

                {/* <p className="user-info-box-ticket">
                  <img src={ticket} alt="" className="ticket-icon" />
                  <span>{numFormatter(userData?.ticket || 0)}</span>
                  <OverlayTrigger
                    placement="bottom"
                    delay={{ show: 250, hide: 300 }}
                    overlay={renderTicket}
                  >
                    <Button variant="success">
                      <FaQuestionCircle />
                    </Button>
                  </OverlayTrigger>
                </p> */}
                <p className="user-info-box-ticket">
                  <img src={coin} alt="" className="ticket-icon" />
                  <span>{userData?.goldCoin?.toFixed(2) || 0}</span>
                  <OverlayTrigger
                    placement="bottom"
                    delay={{ show: 250, hide: 300 }}
                    overlay={renderGold}
                  >
                    <Button variant="success">
                      <FaQuestionCircle />
                    </Button>
                  </OverlayTrigger>
                </p>
              </div>
              {/* {console.log("modeeee",mode)} */}
              {/* <div className="slotLobby-mode">
                <p>Mode:</p>
                <div className="mode-labels">
                  <h6>GC</h6>
                  <Form className='formMode'>
                    <Form.Check type="switch" id="custom-switch" checked={mode === "token" ? true : false} onChange={handleModeChange} />
                  </Form>
                  <h6>Token</h6>
                </div>
              </div> */}
              {/* <button
                type="button"
                className="create-game-boxBtn"
                onClick={handleShow}
              >
                Create Game
              </button> */}
            </div>
          </div>
        </div>
      </div>
      <div className="home-poker-card">
        <div className="container">
          <div className="poker-table-header">
            <div className="backtoHome">
              <a href={landingClient}>
                <FaHome />
                Home
              </a>
            </div>
            <div className="poker-tableSearch-box">
              <div className="poker-tableSearch">
                <input
                  id="mySearchInput"
                  className="form-control"
                  value={searchText}
                  placeholder="Search tables . . . ."
                  onChange={(e) => setSearchText(e.target.value)}
                  autoComplete="off"
                />
              </div>
            </div>
          </div>
          <div className="poker-table-content">
            {filterRoom.length > 0 ? (
              <>
                <div className="lobby-home-title">
                  <h3>Blackjack Open Tables</h3>
                </div>
                <div className="home-poker-card-grid">
                  {filterRoom.map((el) => (
                    <>
                      {el.public && <GameTable data={el} />}
                      {!el.public &&
                        el?.invPlayers?.find(
                          (pl) => pl?.toString() === userData?.id?.toString()
                        ) && <GameTable data={el} />}
                      {!el.public &&
                        el?.hostId?.toString === userData?.id?.toString() && (
                          <GameTable data={el} />
                        )}
                    </>
                  ))}
                </div>
              </>
            ) : (
              <div className="d-flex flex-column justify-content-center align-items-center create-game-box">
                <div className="no-room-available">
                  <h4>No Room Available</h4>
                  <button type="button" onClick={handleShow}>
                    Create Game
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const customStyles = {
  option: (provided) => ({
    ...provided,
    background: "#1a1c25",
    color: "#ddd",
    fontWeight: "400",
    fontSize: "16px",
    padding: "10px 20px",
    lineHeight: "16px",
    cursor: "pointer",
    borderRadius: "4px",
    borderBottom: "1px solid #141414",
    ":hover": {
      background: "#1a1c25",
      borderRadius: "4px",
    },
  }),
  menu: (provided) => ({
    ...provided,
    background: "#1a1c25",
    borderRadius: "10px",
    padding: "10px 20px",
    border: "2px solid transparent",
  }),
  control: () => ({
    background: "#1a1c25",
    border: "2px solid #ffc700",
    borderRadius: "10px",
    color: "#fff",
    display: "flex",
    alignItem: "center",
    minHeight: "42px",
    margin: "2px 0",
    boxShadow: " 0 2px 10px #000000a5",
    cursor: "pointer",
    ":hover": {
      background: "#1a1c25",
      // border: "2px solid #306CFE",
    },
  }),
  singleValue: (provided) => ({
    ...provided,
    color: "#fff",
    fontWeight: "400",
    fontSize: "14px",
    lineHeight: "16px",
  }),
  indicatorSeparator: (provided) => ({
    ...provided,
    display: "none",
  }),
  placeholder: (provided) => ({
    ...provided,
    fontWeight: "400",
    fontSize: "14px",
    lineHeight: "19px",
    color: "#858585c7",
  }),
  input: (provided) => ({
    ...provided,
    // height: "38px",
    color: "fff",
  }),
  valueContainer: (provided) => ({
    ...provided,
    padding: "2px 20px",
  }),
  indicatorsContainer: (provided) => ({
    ...provided,
    paddingRight: "20px",
    color: "#858585c7",
  }),
  svg: (provided) => ({
    ...provided,
    fill: "#858585c7 !important",
    ":hover": {
      fill: "#858585c7 !important",
    },
  }),
  multiValue: (provided) => ({
    ...provided,
    fontWeight: "500",
    background: "#343a40",
  }),
};

const CreateTable = ({
  show,
  handleShow,
  handleChange,
  values,
  createTable,
  errors,
  options,
  handleChnageInviteUsers,
  userWallet,
  showSpinner,
}) => {
  console.log("userWallet", userWallet);
  return (
    <Modal show={show} onHide={handleShow} centered className="casino-popup">
      <Modal.Header closeButton>
        {/* <Modal.Title className="text-dark">Create Table</Modal.Title> */}
      </Modal.Header>
      <Modal.Body>
        <Form.Group className="form-group" controlId="formPlaintextPassword">
          <Form.Label>Enter game name</Form.Label>
          <Form.Control
            name="gameName"
            type="text"
            placeholder="Ex : John's game"
            onChange={handleChange}
            value={values.gameName}
          />

          {!!errors?.gameName && (
            <p className="text-danger">{errors?.gameName}</p>
          )}
        </Form.Group>
        <Form.Group className="form-group" controlId="formPlaintextPassword">
          <Form.Label>Enter sit in amount</Form.Label>
          <Form.Control
            name="sitInAmount"
            type="number"
            placeholder="Ex : 100"
            onChange={handleChange}
            value={values.sitInAmount}
            max={userWallet}
          />
          {!!errors?.sitInAmount && (
            <p className="text-danger">{errors?.sitInAmount}</p>
          )}
        </Form.Group>
        <div className="searchSelectDropdown">
          <Form.Label>Invite Users</Form.Label>
          <Select
            isMulti
            onChange={handleChnageInviteUsers}
            options={options}
            styles={customStyles}
          />
          {!!errors?.invitedPlayer && (
            <p className="text-danger">{errors?.invitedPlayer}</p>
          )}
        </div>
        <div className="createGameCheckHand">
          <Form.Check
            inline
            label="Public Game"
            name="public"
            type="checkbox"
            id={"public"}
            onChange={handleChange}
            checked={values.public}
          />
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleShow}>
          Close
        </Button>
        <Button variant="primary" type="submit" onClick={createTable}>
          {/* {showSpinner ? <Spinner animation="border" /> : "Create Table"} */}
          Create Table
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

const GameTable = ({ data }) => {
  const history = useHistory();
  const redirectToTable = () => {
    history.push({
      pathname: "/game",
      search: "?gamecollection=Blackjack_Tables&tableid=" + data?._id,
    });
  };

  return (
    <div className="home-poker-content">
      <div className="home-poker-cover">
        <img alt="" src={casino} />
      </div>
      <div className="home-poker-info">
        <h4>{data.gameName}</h4>

        <AvatarGroup imgArr={data.players} />
        <button onClick={redirectToTable} type="submit">
          Join Game
        </button>
      </div>
    </div>
  );
};

const AvatarGroup = ({ imgArr }) => {
  return (
    <div className="poker-avatar-box">
      <div className="avatars">
        {Array.isArray(imgArr) &&
          imgArr.map((el, i) => (
            <span className="avatar" key={i}>
              <img
                src={
                  el?.avatar ? el?.avatar : el?.photoURI ? el?.photoURI : users
                }
                width="30"
                height="30"
                alt=""
              />
            </span>
          ))}
      </div>
      <p>{imgArr?.length || 0} players</p>
    </div>
  );
};

export default Home;

// const LobbyIcon = () => {
//   return (
//     <svg
//       width='32'
//       height='32'
//       viewBox='0 0 32 32'
//       fill='none'
//       xmlns='http://www.w3.org/2000/svg'>
//       <g clipPath='url(#clip0_980_30849)'>
//         <path
//           d='M29.6002 13.5329L17.3332 1.15993C17.0112 0.83093 16.5622 0.62793 16.0662 0.62793C15.5702 0.62793 15.1212 0.83193 14.8002 1.15993L2.40015 13.5199C1.27407 14.6734 0.500664 16.1243 0.170833 17.7022C-0.158998 19.2801 -0.0315425 20.9194 0.538217 22.4273C1.10798 23.9353 2.09636 25.2492 3.3872 26.2148C4.67804 27.1803 6.21768 27.7573 7.82515 27.8779L7.85316 27.8799H8.46615C9.72939 27.8802 10.9769 27.5994 12.1182 27.0579L12.0662 27.0799C11.2237 28.0565 10.2345 28.8962 9.13415 29.5689L9.08015 29.5999C8.90787 29.709 8.7754 29.8708 8.70244 30.0612C8.62948 30.2516 8.61992 30.4605 8.6752 30.6568C8.73048 30.853 8.84763 31.0262 9.00923 31.1506C9.17084 31.2749 9.36827 31.3438 9.57215 31.3469H22.4262C22.6299 31.3442 22.8273 31.2758 22.9891 31.1519C23.1508 31.0281 23.2684 30.8554 23.3242 30.6594C23.38 30.4635 23.3711 30.2547 23.2989 30.0642C23.2266 29.8737 23.0949 29.7116 22.9232 29.6019L22.9192 29.5999C21.8287 28.9289 20.8484 28.0934 20.0132 27.1229L19.9992 27.1069C21.125 27.6363 22.3541 27.9095 23.5982 27.9069H24.2122C28.5982 27.5569 32.0242 23.9109 32.0242 19.4659C32.027 17.246 31.155 15.1144 29.5972 13.5329L29.5982 13.5339L29.6002 13.5329ZM15.5472 19.0529L14.6672 22.7999H5.66715L6.44016 19.1599L6.69315 19.0269C10.0662 17.3339 12.0002 16.2399 12.0002 15.7469C11.754 15.6452 11.4882 15.5997 11.2222 15.6139H11.2262C10.5147 15.6201 9.82439 15.8562 9.25815 16.2869L9.26615 16.2809L8.70615 16.6809L7.01315 13.5479L7.41316 13.2279C8.58862 12.3415 10.0261 11.8725 11.4982 11.8949H11.4942C14.2942 11.8949 16.2542 13.4019 16.2542 15.5619C16.2277 16.2874 16.0115 16.9932 15.6271 17.6089C15.2426 18.2246 14.7033 18.7287 14.0632 19.0709L14.0412 19.0819L15.5472 19.0529ZM22.8802 22.7999H18.7332L19.8132 17.8799L18.7062 18.7869L16.7192 16.1199L21.7862 11.9999H25.2532L22.8802 22.7999Z'
//           fill='white'
//         />
//       </g>
//       <defs>
//         <clipPath id='clip0_980_30849'>
//           <rect width='32' height='32' fill='white' />
//         </clipPath>
//       </defs>
//     </svg>
//   );
// };
