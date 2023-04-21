import { ProgressBar } from "react-bootstrap";

const PreTimer = ({ timer }) => {
  return (
    <div>
      <h3>{timer}</h3>
      <ProgressBar striped variant="danger" now={timer * 30.5} />
    </div>
  );
};

export default PreTimer;
