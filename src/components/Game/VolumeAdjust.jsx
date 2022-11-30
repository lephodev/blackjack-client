const VolumeAdjust = ({ setVolume, volume }) => {
  return (
    <div id="volume-button" onClick={() => setVolume(!volume)}>
      <i className={`fas ${volume ? "fa-volume-up" : "fa-volume-mute"}`}></i>
    </div>
  );
};

export default VolumeAdjust;
