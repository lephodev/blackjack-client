import axios from 'axios';
import CONSTANTS from '../config/contants';
import { getCookie, validateToken } from './cookieUtil';

const getAuthorizationHeader = async() => {
  const token = await validateToken();
  return token;
}
export const userInstance = async () => {
  const token = await getAuthorizationHeader();
  return axios.create({
    baseURL: `${CONSTANTS.landingServerUrl}/users`,
    headers: { 
      Authorization: token,
      "Permissions-Policy": "geolocation=*",
    },
  });
}
  

export const authInstance = async () =>{
  const token = await getAuthorizationHeader();
  return axios.create({
    baseURL: `${CONSTANTS.landingServerUrl}/auth`,
    headers: { 
      Authorization: token,
      "Permissions-Policy": "geolocation=*",
    },
  });
}
  

export const blackjackInstance = async () => {
  const token = await getAuthorizationHeader();
  return axios.create({
    baseURL: `${CONSTANTS.serverUrl}`,
    headers: { 
      Authorization: token,
      "Permissions-Policy": "geolocation=*",
    },
    withCredentials: true,
    credentials: "include",
  });
}
  
  export const ticketTotokenInstance = () =>
  axios.create({
    baseURL: `${CONSTANTS.marketServer}/api`,
    headers: {
      Authorization: getCookie("token") ? `Bearer ${getCookie("token")}` : "",
      "Permissions-Policy": "geolocation=*",
    },
    withCredentials: true,
    credentials: "include",
  });
