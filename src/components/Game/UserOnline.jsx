import ProfilePic from "../../imgs/blackjack/profile_user.jpg";
const UserOnline = ({ userOnlinePanel, players }) => {
  return (
    <div id="users-online-box" onClick={userOnlinePanel}>
      <div>
        <div id="users-online-label">Users in Room</div>
        <div id="users-online-button">
          <i className="fas fa-chevron-right"></i>
        </div>
      </div>
      <ul id="users-online-container">
        {players?.map((item) => (
          <li className="users-list-box" key={item.id}>
            <div className="users-list-info">
              <div className="user-list-name">{item.name}</div>
              <div>
                Balance:{" "}
                <span className="users-list-balance">{item.wallet}</span>
              </div>
            </div>
            <div className="users-list-img">
              <img src={ProfilePic} alt="avatar" />
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UserOnline;
