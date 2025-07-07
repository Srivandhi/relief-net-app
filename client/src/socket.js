
import { io } from 'socket.io-client';

const URL = 'https://relief-net-api.onrender.com';

export const socket = io(URL, {
    autoConnect: false 
});