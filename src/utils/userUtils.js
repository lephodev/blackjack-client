import axios from "axios";
import { getCookie } from "../config/utils";

// This function is alternative of firebase.auth().onAuthStateChanged
const getAuthUserData = async () => {
  try {
    let userData = await axios({
      method: "get",
      url: "https://api.scrooge.casino/v1/auth/check-auth",
      headers: { authorization: `Bearer ${getCookie("token")}` },
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
