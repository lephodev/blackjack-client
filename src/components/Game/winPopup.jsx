import React from "react";
import Lottie from "react-lottie";
import coinicon from "../../imgs/animation/win.json";

const WinPopup = ({ showPopup, amount, betAmount }) => {
  const coinanim = {
    loop: true,
    autoplay: true,
    animationData: coinicon,
  };
  return (

      <div
        className={`winning-animation winning-bg-animation winning-animation-win`}
      >
        <div className="winning-content">
          <div className="collect-slotcoin win-slottype-one">
            <Lottie options={coinanim} height={500} width={500} />
          </div>
        </div>
      </div>
  );
};
export default WinPopup;
