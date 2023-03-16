import axios from "axios";
import React from "react";
import { Button, Modal } from "react-bootstrap";

const AlreadyInGame = ({ userInAnyGame,setUserInAnyGame }) => {
    
    const joinGame=async()=>{
        window.location.href=userInAnyGame.reJoinUrl
    }
    const leaveGame=async()=>{
        try{
           await axios({
                method: "get",
                url: `${userInAnyGame?.leaveTable}`,
              });
              setUserInAnyGame({...userInAnyGame,inGame:false})
        }catch(err){
            console.log("Error in leave API call")
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
