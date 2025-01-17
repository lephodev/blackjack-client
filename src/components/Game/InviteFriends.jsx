import axios from 'axios';
import React, { useCallback, useEffect, useState } from 'react';
import { Button, Modal } from 'react-bootstrap';
import toast from 'react-hot-toast';
import Select from 'react-select';
import { socket } from '../../config/socket';
import contants from '../../config/contants';
import { validateToken } from '../../utils/cookieUtil';

const InviteFriend = ({
  userId,
  tableId,
  gameCollection,
  setShowInvite,
  showInvite,
  roomData,
  setRoomData,
}) => {
  const [invPlayers, setInvPlayers] = useState([]);
  const [friendList, setFriendList] = useState([]);

  useEffect(() => {
    socket.on('invitationSend', (data) => {
      setRoomData(data.room);
      toast.success('Invitation Send Successfully', { id: 'A' });
    });
    socket.on('noInvitationSend', () => {
      toast.success('Unable to send Invitation', { id: 'A' });
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchFriendList = useCallback(async () => {
    // const basicAuthToken = validateToken();

    try {
      const token = await validateToken()
      const res = await axios.get(
        contants.serverUrl + '/getUserForInvite/' + tableId, {
          headers: { Authorization: token, }
        }
      );

      // console.log(res.data.data);
      if (res.data.data) {
        setFriendList(res.data.data);
      }
    } catch (err) {
      // console.log('Error in fetch friend list =>', err.message);
    }
  }, [tableId]);

  useEffect(() => {
    if (tableId) {
      fetchFriendList();
    }
  }, [fetchFriendList, tableId]);

  const handleInvitationSend = () => {
    if (!invPlayers.length) {
      return;
    }
    setShowInvite(false);
    socket.emit('invPlayers', {
      invPlayers: invPlayers,
      tableId,
      gameType: gameCollection,
      userId: userId,
    });

    setTimeout(() => {
      fetchFriendList();
    }, 1000);

    setInvPlayers([]);
  };


  const customStyles = {
    option: (provided) => ({
      ...provided,
      background: "#1a1c25",
      color: "#ddd",
      fontWeight: "400",
      fontSize: "16px",
      padding: "10px 20px",
      lineHeight: "16px",
      cursor: "pointer",
      borderRadius: "4px",
      borderBottom: "1px solid #141414",
      ":hover": {
        background: "#000",
        borderRadius: "4px",
      },
    }),
    menu: (provided) => ({
      ...provided,
      background: "#1a1c25",
      borderRadius: "10px",
      padding: "10px 20px",
      textAlign: "left",
      border: "2px solid transparent",
    }),
    control: () => ({
      background: "#1a1c25",
      border: "2px solid #ffc700",
      borderRadius: "10px",
      color: "#fff",
      display: "flex",
      alignItem: "center",
      minHeight: "42px",
      margin: "2px 0",
      boxShadow: " 0 2px 10px #000000a5",
      cursor: "pointer",
      ":hover": {
        background: "#1a1c25",
        // border: "2px solid #306CFE",
      },
    }),
    singleValue: (provided) => ({
      ...provided,
      color: "#fff",
      fontWeight: "400",
      fontSize: "14px",
      lineHeight: "16px",
    }),
    indicatorSeparator: (provided) => ({
      ...provided,
      display: "none",
    }),
    placeholder: (provided) => ({
      ...provided,
      fontWeight: "400",
      fontSize: "14px",
      lineHeight: "19px",
      color: "#858585c7",
      textAlign: "left",
    }),
    input: (provided) => ({
      ...provided,
      // height: "38px",
      color: "fff",

    }),
    valueContainer: (provided) => ({
      ...provided,
      padding: "2px 20px",
    }),
    indicatorsContainer: (provided) => ({
      ...provided,
      paddingRight: "20px",
      color: '#858585c7',
    }),
    svg: (provided) => ({
      ...provided,
      fill: '#858585c7 !important',
      ":hover": {
        fill: '#858585c7 !important',
      },
    }),
    multiValue: (provided) => ({
      ...provided,
      fontWeight: '500',
      background: '#343a40',
    }),
  };


  return (
    <Modal
      show={showInvite}
      onHide={() => {
        setShowInvite(false);
      }}
      centered
      className='friends-popup leave-confirm invite-friend'>
      <Modal.Header closeButton></Modal.Header>
      <Modal.Body>
        <div className='block-view'>
          <h4>Select friend to invite</h4>
          <div className='invite-popup-box'>
            <Select
              isMulti
              name='friendList'
              options={friendList.map((el) => {
                return { value: el.id, label: el.username };
              })}
              className='basic-multi-select'
              classNamePrefix='select'
              styles={customStyles}
              value={invPlayers}
              onChange={(value) => setInvPlayers(value)}
            />
            <Button
              onClick={() => {
                handleInvitationSend();
              }}>
              Invite Friend
            </Button>
          </div>
        </div>
      </Modal.Body>
    </Modal>
  );
};
export default InviteFriend;
