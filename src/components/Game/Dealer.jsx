import dealerPic from "../../imgs/blackjack/dealer-lady1.png";
import back from "../../imgs/blackjack/cards/Black-Card.png";

const Dealer = ({ dealer, players }) => {
  return (
    <div
      className={`dealer ${`deal-${
        players.length === 2 ? 3 : players.length
      }`}`}
    >
      <div className="dealer-avatar">
        <img src={dealerPic} alt="" />
      </div>
      {dealer?.cards.length ? (
        <div className="dealer-cards-box">
          {dealer?.cards.map((card, i) => (
            <div className="dealer-card show" key={card.value.card + card.suit}>
              <img
                src={
                  require(`../../imgs/blackjack/cards/${
                    card.value.card + card.suit
                  }.svg`).default
                }
                alt=""
              />
            </div>
          ))}
          {dealer?.cards?.length === 1 ? (
            <div className="dealer-card hide">
              <img src={back} alt="" />
            </div>
          ) : (
            ""
          )}
          {dealer?.sum !== 0 ? (
            <div className="dealer-sum">
              <span>
                {typeof dealer?.sum === "number"
                  ? dealer?.sum
                  : dealer?.sum?.join(", ")}
              </span>
            </div>
          ) : (
            ""
          )}
        </div>
      ) : (
        ""
      )}
    </div>
  );
};

export default Dealer;
