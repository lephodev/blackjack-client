import { io } from 'socket.io-client';
import contants from './contants';

//https://blackjack-server-t3e66zpola-uc.a.run.app

const socket = io(contants.serverUrl, {
  transports: ['websocket'],
  rejectUnauthorized: false,
  reconnection: false,
});
socket.on('connect', () => {
  // console.log('connected');
});
socket.on('disconnect', () => {
  // console.log('Disconnected');
});

export { socket };
