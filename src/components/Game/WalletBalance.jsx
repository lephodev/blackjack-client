import numFormatter from "../../config/utils";
import { FaQuestionCircle } from "react-icons/fa";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";
import Button from "react-bootstrap/Button";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";

const WalletBalance = ({ wallet, betAmount, ticket }) => {
  const [gameMode, setGameMode] = useState("token");

  useEffect(() => {
    console.log("gameeeee mode ==>", Cookies.get('mode'));
    setGameMode(Cookies.get('mode'))
  }, []);

  const renderWallet = (props) => (
    <Tooltip id="button-tooltip" {...props}>
      {`This is your ${ gameMode === 'token' ? "token" : "gold coin" } balance, and can be used for betting.`}
    </Tooltip>
  );
  const renderTicket = (props) => (
    <Tooltip id="button-tooltip" {...props}>
      This is your ticket balance and can be redeemed for prizes.
    </Tooltip>
  );

  return (
    <div className="wallet-balance">
      <div className="wallet-box">
        <OverlayTrigger
          placement="bottom"
          fontSize="10px"
          delay={{ show: 250, hide: 300 }}
          overlay={renderWallet}
        >
          <Button variant="success">
            <span>
              {gameMode === "token" ? "Tokens" : "Gold Coins"}
              <FaQuestionCircle />
            </span>
            <h3>{numFormatter(wallet)}</h3>
          </Button>
        </OverlayTrigger>
      </div>
      {gameMode === "token" ? (<>
        <div className="wallet-box">
          <OverlayTrigger
            placement="bottom"
            delay={{ show: 250, hide: 300 }}
            overlay={renderTicket}
          >
            <Button variant="success">
              <span>
                Tickets <FaQuestionCircle />
              </span>
              <h3>{numFormatter(ticket)}</h3>
            </Button>
          </OverlayTrigger>
        </div></>)
        : null}
      {/* <div className="wallet-box">
        <span>Total Bet</span>
        <h3>{numFormatter(betAmount)}</h3>
      </div> */}
    </div>
  );
};

export default WalletBalance;
