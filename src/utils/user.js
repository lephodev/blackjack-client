import { blackjackInstance } from './axios.config';

// This function is alternative of firebase.auth().onAuthStateChanged
const getAuthUserData = async () => {
  try {
    const userData = await blackjackInstance().get('/check-auth');
    return { success: true, data: userData.data };
  } catch (error) {
    return { success: false };
  }
};

const userUtils = {
  getAuthUserData,
};

export default userUtils;
