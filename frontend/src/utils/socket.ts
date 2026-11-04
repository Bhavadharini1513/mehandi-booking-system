import { io, Socket } from "socket.io-client";

/*
  One Socket.IO connection per chat screen.
  In development Vite proxies /socket.io to the backend (see vite.config.js),
  in Docker nginx does the same, so we simply connect to the page's own origin.
*/
export const connectSocket = (token: string): Socket =>
  io(import.meta.env.VITE_SOCKET_URL || undefined, {
    auth: { token },
    transports: ["websocket", "polling"],
  });
