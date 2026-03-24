import "dotenv/config";
import { app } from "./app.js";
import { createServer } from "http";
import { Server } from "socket.io";
import { setSocketServer } from "./lib/socket.js";

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

setSocketServer(io);

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
