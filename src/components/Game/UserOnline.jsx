import { FaAngleRight } from 'react-icons/fa';
import { useRef } from 'react';
import { useEffect } from 'react';

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
      <div>
        <div id='users-online-label'>Users in Room</div>
        <div id='users-online-button'>
          <FaAngleRight />
        </div>
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
                <span className='users-list-balance'>{item.wallet}</span>
              </div>
            </div>
            <div className='users-list-img'>
              <img
                src={
                  item.avatar
                    ? item.avatar
                    : item.photoURI
                    ? item.photoURI
                    : 'https://cdn.pixabay.com/photo/2020/07/14/13/07/icon-5404125_1280.png'
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
