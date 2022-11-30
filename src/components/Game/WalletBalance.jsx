import numFormatter from "../../config/utils";

const WalletBalance = ({ wallet, betAmount }) => {
  return (
    <div className="wallet-balance">
      <div className="wallet-box">
        <span>Wallet</span>
        <h3>{numFormatter(wallet)}</h3>
      </div>
      <div className="wallet-box">
        <span>Total Bet</span>
        <h3>{numFormatter(betAmount)}</h3>
      </div>
    </div>
  );
};

export default WalletBalance;
