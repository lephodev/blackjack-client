import { FaAngleRight } from 'react-icons/fa';
import { useRef } from 'react';
import { useEffect } from 'react';
import users from "../../imgs/blackjack/user1.png"
import numFormatter from '../../config/utils';

const UserOnline = ({ userOnlinePanel, players }) => {
  const wrapperRef = useRef(null);

  const useOutsideAlerter = (ref) => {
    useEffect(() => {
      const handleClickOutside = (event) => {
        if (ref.current && !ref.current.contains(event.target)) {
          document.getElementById('users-online-box').style.left = '';
          document.querySelector('#users-online-button').style.transform = '';
        } else {
          document.getElementById('users-online-box').style.left = '0';
          document.querySelector('#users-online-button').style.transform =
            'rotate(180deg)';
        }
      };
      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }, [ref]);
  };
  useOutsideAlerter(wrapperRef);
  return (
    <div id='users-online-box' ref={wrapperRef}>
      <div className='userOnline-header'>
        <div id='users-online-label'>Users in Room</div>
        <div id='users-online-button' onClick={userOnlinePanel}>
          <FaAngleRight />
        </div>
        <p className='userOnline-tooltip'>All table Users Status</p>
      </div>
      <ul id='users-online-container'>
        {players?.map((item, i) => (
          <li className='users-list-box' key={item.id}>
            <div className='users-list-info'>
              <div className='user-list-name'>
                {`P-${i + 1}`} {item.name}
              </div>
              <div>
                Balance:{' '}
                <span className='users-list-balance'>{numFormatter(item.wallet)}</span>
              </div>
            </div>
            <div className='users-list-img'>
              <img
                src={
                  item.avatar
                    ? item.avatar
                    : item.photoURI
                      ? item.photoURI
                      : users
                }
                alt='avatar'
              />
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UserOnline;
