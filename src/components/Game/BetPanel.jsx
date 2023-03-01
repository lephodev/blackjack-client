// import { useState } from "react";
import toast from "react-hot-toast";
import { socket } from "../../config/socket";
import Slider from "react-slick";
import numFormatter from "../../config/utils";
// import Form from "react-bootstrap/Form";
import InputRange from "react-input-range";
import { useState } from "react";
import { useEffect } from "react";
// import chipHoverFix from "../../sounds/chip_hover_fix.mp3";
// import ActionPanel from "./ActionPanel";

let handleBetTimeout;
const maxBetAmount = 100;

const BetPanel = ({
  handleBetConfirm,
  tableId,
  player,
  volume,
  roomData,
  setShowBuyInPopup,
  lastBet,
  setLastBet,
}) => {
  const [rangeBetValue, setRangeBetValue] = useState(0);
  const [totalBetAmount, setTotalBetAmount] = useState(player?.betAmount);

  const handleBet = (amount, isSliderBet = false) => {
    if (isSliderBet) {
      socket.emit("makeSliderBet", {
        userId: player.id,
        roomId: tableId,
        betAmount: amount,
      });
      setRangeBetValue(amount);
    } else {
      if (handleBetTimeout) {
        clearTimeout(handleBetTimeout);
      }
      handleBetTimeout = setTimeout(() => {
        let totalBetAmt = totalBetAmount ? totalBetAmount : 0 + amount;
        console.log(player);
        console.log("totalBetAmount", totalBetAmount, amount, totalBetAmt);
        if (totalBetAmt > maxBetAmount) {
          console.log("max bet executed");
          toast.error(`Max bet amount is ${maxBetAmount}`, {
            id: "maxBetAmount",
          });
          setTotalBetAmount(maxBetAmount);
          socket.emit("makeSliderBet", {
            userId: player.id,
            roomId: tableId,
            betAmount: maxBetAmount,
          });
          setRangeBetValue(maxBetAmount);
        } else if (totalBetAmt > player.wallet) {
          console.log("wallet exceed executed");
          toast.error(`betting amount is exceeding wallet balance`, {
            id: "maxBetAmount",
          });
          setTotalBetAmount(player.wallet);
          socket.emit("makeSliderBet", {
            userId: player.id,
            roomId: tableId,
            betAmount: player.wallet,
          });
          setRangeBetValue(player.wallet);
        } else {
          console.log("betting executed");
          setRangeBetValue(totalBetAmt);
          socket.emit("bet", {
            userId: player.id,
            roomId: tableId,
            betAmount: amount,
            maxBetAmount,
          });
          setTotalBetAmount(totalBetAmt);
        }
      }, 500);
    }
  };

  // const handleBet = (amount, isSliderBet = false) => {
  //   if (handleBetTimeout) {
  //     if (!isSliderBet) {
  //       socket.emit("makeSliderBet", {
  //         userId: player.id,
  //         roomId: tableId,
  //         betAmount: 0,
  //       });
  //     }
  //     clearTimeout(handleBetTimeout);
  //   }
  //   handleBetTimeout = setTimeout(() => {
  //     const totalWalletBalance = player?.wallet + player?.betAmount;
  //     // If bet is made by the slider so total bet amount will be the slider amount
  //     const toatBetAmount = isSliderBet ? amount : player?.betAmount + amount;
  //     console.log("handle bet executes", isSliderBet, amount, toatBetAmount, maxBetAmount, player?.betAmount);

  //     // If user already make max bet and trying to increase bet
  //     if (player?.betAmount === maxBetAmount || toatBetAmount > maxBetAmount) {
  //       console.log("first if executed");
  //       toast.error(`Max bet amount is ${ maxBetAmount }`, {
  //         id: "maxBetAmount",
  //       });
  //       setRangeBetValue(maxBetAmount);
  //       if (isSliderBet) {
  //         socket.emit("makeSliderBet", {
  //           userId: player.id,
  //           roomId: tableId,
  //           betAmount: amount,
  //         });
  //       } else {
  //         socket.emit("makeSliderBet", {
  //           userId: player.id,
  //           roomId: tableId,
  //           betAmount: maxBetAmount,
  //         });
  //       }
  //       return;
  //     } else if (
  //       player?.betAmount < maxBetAmount &&
  //       toatBetAmount > maxBetAmount
  //     ) {
  //       const maxBetUserCanMake = maxBetAmount - player?.betAmount;
  //       amount = maxBetUserCanMake > amount ? amount : maxBetUserCanMake;
  //     }

  //     if (player?.wallet >= amount && amount && !isSliderBet) {
  //       console.log("bet part executed");
  //       toast.error(`Max bet amount is ${ maxBetAmount }`, {
  //         id: "maxBetAmount",
  //       });
  //       if (totalBetAmount + amount > maxBetAmount) {
  //         socket.emit("bet", {
  //           userId: player.id,
  //           roomId: tableId,
  //           betAmount: maxBetAmount,
  //         });
  //       } else {
  //         socket.emit("bet", {
  //           userId: player.id,
  //           roomId: tableId,
  //           betAmount: amount,
  //         });
  //       }

  //       // SLIDER BET WILL CALL FROM HERE
  //     } else if (totalWalletBalance >= amount && isSliderBet) {
  //       socket.emit("makeSliderBet", {
  //         userId: player.id,
  //         roomId: tableId,
  //         betAmount: amount,
  //       });
  //     } else {
  //       toast.error(`Not Enough Balance`, {
  //         id: "lowBalance",
  //       });
  //       setShowBuyInPopup(true);
  //     }
  //   }, 500);

  // };

  useEffect(() => {
    if (player?.betAmount) {
      setTotalBetAmount(player?.betAmount || 0);
      setRangeBetValue(player?.betAmount || 0);
    }
  }, [player?.betAmount]);

  const handleClearBet = () => {
    setTotalBetAmount(0);
    socket.emit("clearbet", {
      userId: player.id,
      roomId: tableId,
    });
    setLastBet(0);
    setRangeBetValue(0);
  };

  // const handleReBet = () => {
  //   handleBet(lastBet);
  //   handleBetConfirm(true);
  // };

  const playSound = () => {
    let c = document.getElementById("chip");
    if (c) {
      c.play();
    }
  };
  const settings = {
    dots: false,
    autoplay: false,
    draggable: true,
    centerMode: false,
    infinite: false,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
  };

  return (
    <div
      className={`bets-wrapper ${
        !player?.isPlaying ? `` : `hide-panel show-popup`
      }`}
    >
      <div className="bets-container">
        {/* <span className="bet-amt-placeholder">
          Bet: {numFormatter(player?.betAmount)}
        </span> */}
        <div className="bet-amt-range">
          <div className="bet-range-label">
            <span>{0}</span>
            <span>
              {maxBetAmount > player?.wallet + player?.betAmount
                ? numFormatter(player?.wallet + player?.betAmount)
                : numFormatter(maxBetAmount)}
            </span>
          </div>
          <InputRange
            maxValue={
              maxBetAmount > player?.wallet + player?.betAmount
                ? player?.wallet + player?.betAmount
                : maxBetAmount
            }
            minValue={0}
            value={rangeBetValue}
            onChange={(e) => setRangeBetValue(e)}
            onChangeComplete={(betAmt) => {
              handleBet(betAmt, true);
            }}
          />
        </div>
        <div className="bets-btn-slider">
          <Slider {...settings}>
            <span className="chip-10" onClick={playSound}>
              <button
                className="betButtons update-balance-bet"
                id="chip10"
                value="10"
                onClick={() => handleBet(10)}
              >
                10
              </button>
            </span>
            <span className="chip-50" onClick={playSound}>
              <button
                className="betButtons update-balance-bet"
                id="chip50"
                value="25"
                onClick={() => handleBet(25)}
              >
                25
              </button>
            </span>
            <span className="chip-100" onClick={playSound}>
              <button
                className="betButtons update-balance-bet"
                id="chip100"
                value="50"
                onClick={() => handleBet(50)}
              >
                50
              </button>
            </span>
            <span className="chip-500" onClick={playSound}>
              <button
                className="betButtons update-balance-bet"
                id="chip500"
                value="75"
                onClick={() => handleBet(75)}
              >
                75
              </button>
            </span>
            <span className="chip-1k" onClick={playSound}>
              <button
                className="betButtons update-balance-bet"
                id="chip1k"
                value="100"
                onClick={() => handleBet(100)}
              >
                100
              </button>
            </span>
          </Slider>
        </div>
        {/* <span onClick={playSound}>
          <button
            className="betButtons update-balance-bet"
            id="chip5k"
            value="5000"
            onClick={() => handleBet(5000)}
          >
            5K
          </button>
        </span> */}
        {/* <span onClick={playSound}>
          <button
            className="betButtons update-balance-bet"
            id="chip10k"
            value="10000"
            onClick={() => handleBet(10000)}
          >
            10K
          </button>
        </span> */}
        {/* <span onClick={playSound}>
          <button
            className="betButtons update-balance-bet"
            id="chip50k"
            value="50000"
            onClick={() => handleBet(50000)}
          >
            50K
          </button>
        </span> */}
        {/* <span onClick={playSound}>
          <button
            className="betButtons update-balance-bet"
            id="chip100k"
            value="100000"
            onClick={() => handleBet(100000)}
          >
            100K
          </button>
        </span> */}

        {/* <span onClick={playSound}>
          <div className="custom-input">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (amt > 0 && amt <= player.wallet) handleBet(amt);
                else
                  toast.error("Please enter valid amount", {
                    id: "validAmount",
                  });
              }}
            >
              <input
                type="number"
                placeholder="Add"
                onChange={(e) => setAmt(Number(e.target.value))}
              />
            </form>
          </div>
          <audio id="chip" muted={!volume || roomData?.video}>
            <source src={chipHoverFix}></source>
          </audio>
        </span> */}
      </div>
      <div className="bet-btn-wrapper">
        {/* <div className="bet-amt-range">
          <div className="bet-range-label">
            <span>{0}</span>
            <span>
              {maxBetAmount > player?.wallet + player?.betAmount
                ? numFormatter(player?.wallet + player?.betAmount)
                : numFormatter(maxBetAmount)}
            </span>
          </div>
          <InputRange
            maxValue={player?.wallet + player?.betAmount}
            minValue={0}
            value={rangeBetValue}
            onChange={(e) => setRangeBetValue(e)}
            onChangeComplete={(betAmt) => {
              handleBet(betAmt, true);
              // console.log(betAmt);
              // setRangeBetValue(betAmt);
            }}
          />
        </div> */}
        <div className="bet-btn-box">
          <button className="max-bet-btn" onClick={() => handleBet(100, true)}>
            Max
          </button>
          {player?.betAmount ? (
            <button
              className="confirm-bet-btn"
              onClick={() => handleBetConfirm(true)}
            >
              Bet Now
            </button>
          ) : lastBet === 0 ? (
            <button
              className="confirm-bet-btn"
              onClick={() => handleBetConfirm(true)}
            >
              Bet Now
            </button>
          ) : (
            <button
              className="confirm-bet-btn"
              onClick={() => handleBet(lastBet)}
            >
              ReBet: {numFormatter(lastBet)}
            </button>
          )}

          {player?.betAmount !== 0 ? (
            <button className="clear-bet-btn" onClick={handleClearBet}>
              Clear
            </button>
          ) : (
            <button className="clear-bet-btn" onClick={handleClearBet}>
              Clear
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default BetPanel;
