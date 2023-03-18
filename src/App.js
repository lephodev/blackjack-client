import { useState } from 'react';
import { Route, BrowserRouter as Router } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Game from './components/Game/Game';
import GameContext from './Context';
import 'bootstrap/dist/css/bootstrap.min.css';
import './css/dist/style.css';
import './css/dist/blackjack.css';
import Home from './components/Home/home';
// import { getCookie } from "./config/utils";
// import contants from './config/contants'
// import axios from 'axios';
const App = () => {
  const [roomData, setRoomData] = useState({});
  const [userId, setUserId] = useState('');
  const [userInAnyGame,setUserInAnyGame]=useState()
//   const checkUserInGame=async()=>{
//     let userData = await axios({
//       method: "get",
//       url: `${contants.landingServerUrl}/users/checkUserInGame`,
//       headers: { authorization: `Bearer ${getCookie("token")}` },
//     });

//     console.log({dekk:userData?.data})
//     if(userData?.data){
//       setUserInAnyGame(userData.data)
//     }
//   }
// useEffect(()=>{
//   checkUserInGame()
// },[])
  return (
    <GameContext.Provider value={{ roomData, setRoomData, userId, setUserId,userInAnyGame,setUserInAnyGame }}>
      <Router>
        <Route exact path='/'>
          <Home />
        </Route>
        <Route exact path='/game' component={Game} />
      </Router>
      <div className='abc'>
        <Toaster
          position='top-center'
          reverseOrder={false}
          toastOptions={{
            className: 'custom-toast',
          }}
        />
      </div>
    </GameContext.Provider>
  );
};

export default App;
