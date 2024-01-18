import axios from "axios";
// import { getCookie } from "../config/utils";
import contants from '../config/contants'
import { validateToken } from "./cookieUtil";
// This function is alternative of firebase.auth().onAuthStateChanged
const getAuthUserData = async () => {
  const basicAuthToken = validateToken();
  try {
    let userData = await axios({
      method: "get",
      url: `${contants.landingServerUrl}/auth/check-auth`,
      headers: { 
        authorization: basicAuthToken,
        "Permissions-Policy": "geolocation=*",
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
