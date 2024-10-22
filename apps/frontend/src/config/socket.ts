import { reactive } from "vue";
import { io } from "socket.io-client";

const URL: string = import.meta.env.VITE_SERVER_URL

const state = reactive({
  connected: false,
});

const socket = io(URL);
console.log('SOCKET SERVER URL', URL)

socket.on("connect", () => {
  state.connected = true;
  console.log('socket connected', socket.id)
});

socket.on("disconnect", () => {
  state.connected = false;
  console.log('socket disconnected', socket.id)
});

export {
    state,
    socket
}