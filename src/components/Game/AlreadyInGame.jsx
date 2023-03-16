import axios from "axios";
import React from "react";
import { Button, Modal } from "react-bootstrap";

const AlreadyInGame = ({ userInAnyGame }) => {
    
    const joinGame=async()=>{
        window.location.href=userInAnyGame.reJoinUrl
    }
    const leaveGame=async()=>{
        const leave=  await axios({
            method: "get",
            url: `${userInAnyGame?.leaveTable}`,
          });
       if(leave?.data?.success){
        userInAnyGame.inGame=false
       }
    }
    console.log("userInAnyGame-->",userInAnyGame)
  return (
    <Modal
      show={userInAnyGame?.inGame}
      centered
      className="friends-popup leave-confirm"
    >
      <Modal.Body>
        <div className="block">
          <p>You are already in game!</p>
          <div className="sub-btn text-center">
            <Button
              className="exit-btn"
              onClick={() => joinGame()}
            >
                Re-Join
            </Button>
            <Button
              className="grey-btn"
              onClick={() => leaveGame()}
            >
              Leave
            </Button>
          </div>
        </div>
      </Modal.Body>
    </Modal>
  );
};
export default AlreadyInGame;
