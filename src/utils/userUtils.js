import axios from "axios";
import contants from "../config/contants";
import { validateToken } from "./cookieUtil";
// This function is alternative of firebase.auth().onAuthStateChanged
const getAuthUserData = async () => {
  try {
    const basicAuthToken = validateToken();

    let userData = await axios({
      method: "get",
      url: `${contants.landingServerUrl}/auth/check-auth`,
      headers: {
        Authorization: basicAuthToken,
      },
      withCredentials: true,
      credentials: "include",
    });

    return { success: true, data: userData.data };
  } catch (error) {
    // console.log(error);
    return { success: false };
  }
};

const userUtils = {
  getAuthUserData,
};

export default userUtils;
