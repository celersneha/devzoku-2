import { app } from "./app";
import { createServer } from "http";
import { Server } from "socket.io";

const PORT = process.env.PORT || 8000;

const httpServer = createServer(app);
const io = new Server(httpServer, {
  path: "/socket/",
  cors: {
    origin: process.env.CORS_ORIGIN?.split(",") || [],
    credentials: true,
    methods: ["GET", "POST"],
  },
});

// Socket.io connection
io.on("connection", (socket) => {
  socket.on("join", (userId: string) => {
    socket.join(userId);
  });
});

if (!process.env.VERCEL) {
  httpServer.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}

export { io, httpServer };
export default app;
