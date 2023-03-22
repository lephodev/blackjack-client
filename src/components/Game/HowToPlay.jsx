import { useRef } from "react";
import { useEffect } from "react";
import { Table } from "react-bootstrap";
import cardhistory from "../../imgs/blackjack/card-history-white.png";

const HowToPlay = ({
  handleHowtoPlay,
  players,
  gameCardStats,
  howtoplay,
  setHowtoplay,
}) => {
  const wrapperRef = useRef(null);

  const useOutsideAlerter = (ref) => {
    useEffect(() => {
      const handleClickOutside = (event) => {
        if (ref.current && !ref.current.contains(event.target)) {
          setHowtoplay(howtoplay);
        }
      };
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }, [ref]);
  };
  useOutsideAlerter(wrapperRef);

  return (
    <div id={!howtoplay ? "info-rules" : "info-rules-expand"} ref={wrapperRef}>
      <div id="how-to-play" onClick={() => handleHowtoPlay()}>
        <span>Cards History</span>
        <img src={cardhistory} alt="" />
      </div>
      <div id="info-rules-overflow">
        <Table>
          <thead>
            <tr>
              {[1, 2, 3, 4, 5, 6, 7].map((player, i) => (
                <th key={player}>{`P-${ i + 1 }`}</th>
              ))}
              <th>D</th>
            </tr>
          </thead>
          <tbody>
            {gameCardStats?.map((gameCardStat, i) => (
              <tr key={`item-${ i }`}>
                {gameCardStat.players.map((pl, j) => (
                  <td key={`item-${ j }`}>
                    <div
                      className={`card-box${ Array.isArray(pl.cards[0]) ? 1 : ""
                        }`}
                    >
                      {pl.cards.map((card, l) =>
                        Array.isArray(card) ? (
                          <div className="card-box" key={`item-${ l }`}>
                            {card.map((el, k) => (
                              <div
                                className="card"
                                key={el.value.card + el.suit + k}
                              >
                                <img
                                  src={`/cards/${ el.value.card + el.suit }.svg`}
                                  alt="card-img"
                                />
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div
                            className="card"
                            key={`item-${ card.value.card }-${ card.suit }-${ l }`}
                          >
                            <img
                              src={`/cards/${ card.value.card + card.suit }.svg`}
                              alt="card-img"
                            />
                          </div>
                        )
                      )}
                    </div>
                  </td>
                ))}
                <td>
                  <div className="card-box">
                    {gameCardStat?.dealerCards?.map((card, l) => (
                      <div
                        className="card"
                        key={`item-${ card?.value?.card }-${ card?.suit }-${ l }`}
                      >
                        <img
                          src={`/cards/${ card?.value?.card + card?.suit }.svg`}
                          alt="card-img"
                        />
                      </div>
                    ))}
                  </div>
                </td>
              </tr>
            ))}
            <br />
            <br />
            <div className="cardHistory-closeBtn">
              <button className="yellowBtn" onClick={() => handleHowtoPlay()}>
                Close
              </button>
            </div>
          </tbody>

        </Table>
      </div>
    </div>
  );
};

export default HowToPlay;
