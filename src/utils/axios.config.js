import axios from 'axios';
import CONSTANTS from '../config/contants';
import { getCookie } from './cookieUtil';

const getAuthorizationHeader = () => {
  return `Bearer ${getCookie('token')}`;
}
export const userInstance = () =>
  axios.create({
    baseURL: `${CONSTANTS.landingServerUrl}/users`,
    headers: { Authorization: getAuthorizationHeader() },
  });

export const authInstance = () =>
  axios.create({
    baseURL: `${CONSTANTS.landingServerUrl}/auth`,
    headers: { Authorization: getAuthorizationHeader() },
  });

export const blackjackInstance = () =>
  axios.create({
    baseURL: `${CONSTANTS.serverUrl}`,
    headers: { Authorization: getAuthorizationHeader() },
  });
