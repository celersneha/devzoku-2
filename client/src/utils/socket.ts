// src/utils/socket.ts
import { io } from "socket.io-client";

const DEFAULT_LOCAL_SOCKET_URI = "http://localhost:8000";
const SOCKET_URI =
  process.env.NEXT_PUBLIC_SOCKET_URI || DEFAULT_LOCAL_SOCKET_URI;

// Vercel Serverless functions do not support long-lived Socket.IO connections.
// Keep sockets disabled in production unless explicitly enabled via env.
const SOCKET_ENABLED =
  process.env.NODE_ENV !== "production" ||
  process.env.NEXT_PUBLIC_ENABLE_SOCKET === "true";

export const socket = SOCKET_ENABLED
  ? io(SOCKET_URI, {
      path: "/socket/",
      withCredentials: true,
      transports: ["websocket", "polling"],
    })
  : null;

socket?.on("connect", () => {
  console.log("Connected to the server");
});
