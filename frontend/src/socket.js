import { io } from "socket.io-client";
import { backend_url } from "./server";

const socket = io(backend_url, {
  transports: ["websocket", "polling"],
  autoConnect: true,
});

export default socket;
