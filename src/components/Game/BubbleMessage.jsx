const BubbleMessage = ({ message }) => {
  return (
    <div className="bubble-msg">
      <div className="triangle-isosceles left">{message}</div>
    </div>
  );
};

export default BubbleMessage;
