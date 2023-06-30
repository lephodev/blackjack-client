import axios from 'axios';
import CONSTANTS from '../config/contants';
import { getCookie } from './cookieUtil';

const getAuthorizationHeader = () => {
  return `Bearer ${getCookie('token')}`;
}
export const userInstance = () =>
  axios.create({
    baseURL: `${CONSTANTS.landingServerUrl}/users`,
    headers: { 
      Authorization: getAuthorizationHeader(),
      "Permissions-Policy": "geolocation=*",
    },

  });

export const authInstance = () =>
  axios.create({
    baseURL: `${CONSTANTS.landingServerUrl}/auth`,
    headers: { 
      Authorization: getAuthorizationHeader(),
      "Permissions-Policy": "geolocation=*",
    },
  });

export const blackjackInstance = () =>
  axios.create({
    baseURL: `${CONSTANTS.serverUrl}`,
    headers: { 
      Authorization: getAuthorizationHeader(),
      "Permissions-Policy": "geolocation=*",
    },
    withCredentials:true,
    credentials:"include",

  });
  export const ticketTotokenInstance = () =>
  axios.create({
    baseURL: `${CONSTANTS.marketServer}/api`,
    headers: {
      Authorization: getCookie('token') ? `Bearer ${getCookie('token')}` : '',
      "Permissions-Policy": "geolocation=*",
    },
    withCredentials:true,
    credentials:"include",
  });
