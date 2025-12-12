import io from 'socket.io-client';
import api from '../api/axios';

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL; 

export const socket = io(SOCKET_URL, {
    autoConnect: false,
    transports: ['websocket'],
    withCredentials: true
});

socket.on("connect_error", async (err) => {
    if (err.message.includes("Authentication error") || err.message.includes("jwt expired")) {
        
        if (socket.refreshing) return; 
        socket.refreshing = true;

        console.log("Cookie de socket vencida. Intentando refresh...");

        try {
            await api.get('/auth/refresh');
            
            console.log("Cookie renovada. Reconectando socket...");
            socket.connect();

        } catch (refreshError) {
            console.error("Falló el refresh. Sesión expirada.", refreshError);
            // window.location.href = '/login';
        } finally {
            socket.refreshing = false;
        }
    }
});