// import { useState } from "react";
import toast from 'react-hot-toast';
import { socket } from '../../config/socket';
import Slider from 'react-slick';
import numFormatter from '../../config/utils';
// import Form from "react-bootstrap/Form";
import InputRange from 'react-input-range';
import { useState } from 'react';
// import chipHoverFix from "../../sounds/chip_hover_fix.mp3";
// import ActionPanel from "./ActionPanel";

let handleBetTimeout;
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
  const [rangeBetValue, setRangeBetValue] = useState(10);

  const handleBet = (amount, isSliderBet = false) => {
    if (handleBetTimeout) {
      clearTimeout(handleBetTimeout);
    }

    const totalWalletBalance = player?.wallet + player?.betAmount;

    handleBetTimeout = setTimeout(() => {
      if (player?.wallet >= amount && amount && !isSliderBet) {
        socket.emit('bet', {
          userId: player.id,
          roomId: tableId,
          betAmount: amount,
        });
        // SLIDER BET WILL CALL FROM HERE
      } else if (totalWalletBalance > amount && isSliderBet) {
        socket.emit('makeSliderBet', {
          userId: player.id,
          roomId: tableId,
          betAmount: amount,
        });
      } else {
        toast.error('Not Enough Balance', { id: 'lowBalance' });
        setShowBuyInPopup(true);
      }
    }, 500);
  };

  const handleClearBet = () => {
    socket.emit('clearbet', {
      userId: player.id,
      roomId: tableId,
    });
    setLastBet(0);
    setRangeBetValue(10);
  };

  // const handleReBet = () => {
  //   handleBet(lastBet);
  //   handleBetConfirm(true);
  // };

  const playSound = () => {
    let c = document.getElementById('chip');
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
      }`}>
      <div className='bets-container'>
        <div className='bets-btn-slider'>
          <Slider {...settings}>
            <span className='chip-10' onClick={playSound}>
              <button
                className='betButtons update-balance-bet'
                id='chip10'
                value='10'
                onClick={() => handleBet(10)}>
                10
              </button>
            </span>
            <span className='chip-50' onClick={playSound}>
              <button
                className='betButtons update-balance-bet'
                id='chip50'
                value='50'
                onClick={() => handleBet(50)}>
                50
              </button>
            </span>
            <span className='chip-100' onClick={playSound}>
              <button
                className='betButtons update-balance-bet'
                id='chip100'
                value='100'
                onClick={() => handleBet(100)}>
                100
              </button>
            </span>
            <span className='chip-500' onClick={playSound}>
              <button
                className='betButtons update-balance-bet'
                id='chip500'
                value='500'
                onClick={() => handleBet(500)}>
                500
              </button>
            </span>
            <span className='chip-1k' onClick={playSound}>
              <button
                className='betButtons update-balance-bet'
                id='chip1k'
                value='1000'
                onClick={() => handleBet(1000)}>
                1K
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
      <div className='bet-btn-wrapper'>
        <div className='bet-amt-range'>
          <div className='bet-range-label'>
            <span>{0}</span>
            <span>{numFormatter(player?.wallet + player?.betAmount)}</span>
          </div>
          <InputRange
            maxValue={player?.wallet + player?.betAmount}
            minValue={0}
            value={rangeBetValue}
            onChange={(e) => setRangeBetValue(e)}
            onChangeComplete={(betAmt) => {
              handleBet(betAmt, true);
              console.log(betAmt);
              // setRangeBetValue(betAmt);
            }}
          />
        </div>
        <div className='bet-btn-box'>
          <button
            className='max-bet-btn'
            onClick={() => handleBet(player?.wallet)}>
            Max
          </button>
          {player?.betAmount ? (
            <button
              className='confirm-bet-btn'
              onClick={() => handleBetConfirm(true)}>
              Bet: {numFormatter(player?.betAmount)}
            </button>
          ) : lastBet === 0 ? (
            <button
              className='confirm-bet-btn'
              onClick={() => handleBetConfirm(true)}>
              Bet Now
            </button>
          ) : (
            <button
              className='confirm-bet-btn'
              onClick={() => handleBet(lastBet)}>
              ReBet: {numFormatter(lastBet)}
            </button>
          )}

          {player?.betAmount !== 0 ? (
            <button className='clear-bet-btn' onClick={handleClearBet}>
              Clear
            </button>
          ) : (
            <button className='clear-bet-btn' onClick={handleClearBet}>
              Clear
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default BetPanel;
