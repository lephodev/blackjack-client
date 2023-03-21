import React, { useEffect, useRef, useState } from "react";
import { socket } from "../../config/socket";
// import logo from "../../assets/game/logo-poker.png";
import avtar from "../../imgs/blackjack/user.jpg";

const ChatHistory = ({ openChatHistory, handleOpenChatHistory, setOpenChatHistory, roomData, chatMessage, userId, scrollToBottom, scrollDownRef, openEmoji, setOpenEmoji,message }) => {

    // const [typing, setTyping] = useState(false);
    const [typingPlayername, setTypingPlayername] = useState([]);

    const wrapperRef = useRef(null);

    const useOutsideAlerter = (ref) => {
        useEffect(() => {
            const handleClickOutside = (event) => {
                if (ref.current && !ref.current.contains(event.target)) {
                    setOpenChatHistory(false)
                }
            };
            document.addEventListener("mousedown", handleClickOutside);
            return () => {
                document.removeEventListener("mousedown", handleClickOutside);
            };
        }, [ref]);
    };

    useOutsideAlerter(wrapperRef);

    useEffect(() => {
        if (openChatHistory) {
            scrollToBottom();
        }
    },[openChatHistory,scrollToBottom]);

    // const [playerIds,setPlayersIds] = useState([])

    useEffect(() => {
        socket.on("updateTypingState", (data) => {
            const {typingUser} = data;
                const arr = [];
                for(let key in typingUser){
                    if(key!== userId && typingUser[key]["typing"]){
                        console.log('oooo')
                        arr.push(typingUser[key]["userName"])
                    }
                }
                setTypingPlayername(arr)
            
        });
    },[userId])

    const finalString = typingPlayername?.length===2 ?typingPlayername.join(' and '):typingPlayername?.length>2 ? `${typingPlayername[0]} and ${typingPlayername?.length-1} others` : typingPlayername?.toString()

    return (
        <div
            className={`chatHistory-Container ${ !openChatHistory ? "" : "expand" }`}
            ref={wrapperRef}
        >
            <div className="chatHistory-header">
                {/* <img className="Chatgame-logo " src={logo} alt="" /> */}
                <div className="Chatgame-title"> Chat History <span>{typingPlayername?.length>0 ? `${ finalString } Typing...` : ""}</span></div>
                <div className="Gameplayer-count">
                    <div className="greendot" /> <h4>Players</h4>
                    <h3>{roomData?.length}</h3>
                </div>
                <div className="hamburger" onClick={handleOpenChatHistory}>
                    <div className="line"></div>
                    <div className="line"></div>
                </div>
            </div>
            <div className="chatHistory-comments">
                {chatMessage?.map(chat => {
                    return (
                        <div className={chat.userId === userId ? "playerComment-box playerSelfMssg" : "playerComment-box"}>
                            <img src={chat.profile ? chat.profile : avtar} alt="profile_image" />
                            <div className="playerName">{chat.firstName}</div>
                            <p>{chat.message}</p>
                        </div>
                    )
                })
                }

                {/* <div className="playerComment-box playerSelfMssg">
                    <img src={avtar} alt="" />
                    <div className="playerName">Admin</div>
                    <p>
                        hi this chat history
                        dklfjklgjdfklgjdfjgdfjgkljdflgjkldfjgldfjgljdfklgjkldfj mssg hi
                        this chat history
                        dklfjklgjdfklgjdfjgdfjgkljdflgjkldfjgldfjgljdfklgjkldfj mssg
                        content .... hi this chat history
                        dklfjklgjdfklgjdfjgdfjgkljdflgjkldfjgldfjgljdfklgjkldfj mssg
                        content .... content ....
                    </p>
                </div> */}
                <div style={{ float: "left", clear: "both" }}
                    ref={scrollDownRef}>
                </div>
            </div>
        </div>
    );
};

export default ChatHistory;
