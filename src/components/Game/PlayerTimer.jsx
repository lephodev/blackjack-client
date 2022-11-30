import { useEffect, useState } from "react";

const PlayerTimer = ({ letTime, time }) => {
  const [activeTime, setActiveTime] = useState(100);
  useEffect(() => {
    if (letTime && time) {
      let percent = (letTime / time) * 100;
      setActiveTime(parseInt(percent));
    }
  }, [time, letTime, activeTime]);
  return (
    <div className="battery">
      <div className={`bar ${activeTime > 1 ? "active" : ""}`}></div>
      <div className={`bar ${activeTime > 6 ? "active" : ""}`}></div>
      <div className={`bar ${activeTime > 11 ? "active" : ""}`}></div>
      <div className={`bar ${activeTime > 16 ? "active" : ""}`}></div>
      <div className={`bar ${activeTime > 21 ? "active" : ""}`}></div>
      <div className={`bar ${activeTime > 26 ? "active" : ""}`}></div>
      <div className={`bar ${activeTime > 31 ? "active" : ""}`}></div>
      <div className={`bar ${activeTime > 36 ? "active" : ""}`}></div>
      <div className={`bar ${activeTime > 41 ? "active" : ""}`}></div>
      <div className={`bar ${activeTime > 46 ? "active" : ""}`}></div>
      <div className={`bar ${activeTime > 51 ? "active" : ""}`}></div>
      <div className={`bar ${activeTime > 56 ? "active" : ""}`}></div>
      <div className={`bar ${activeTime > 61 ? "active" : ""}`}></div>
      <div className={`bar ${activeTime > 66 ? "active" : ""}`}></div>
      <div className={`bar ${activeTime > 71 ? "active" : ""}`}></div>
      <div className={`bar ${activeTime > 76 ? "active" : ""}`}></div>
      <div className={`bar ${activeTime > 81 ? "active" : ""}`}></div>
      <div className={`bar ${activeTime > 86 ? "active" : ""}`}></div>
      <div className={`bar ${activeTime > 91 ? "active" : ""}`}></div>
      <div className={`bar ${activeTime > 96 ? "active" : ""}`}></div>
    </div>
  );
};

export default PlayerTimer;
