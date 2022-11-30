import { ProgressBar } from "react-bootstrap";

const PreTimer = ({ timer }) => {
  return (
    <div>
      <h3>{timer}</h3>
      <ProgressBar striped variant="danger" now={timer * 20} />
    </div>
  );
};

export default PreTimer;
